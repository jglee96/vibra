import type { AudioRecipe } from "@/entities/frequency/model/frequency";
import {
  buildDroneVoiceSpec,
  buildPlaybackSections,
  buildPulseVoiceSpec,
  buildHarmonicVoiceSpec,
  resolveAutomationCurve,
  type AutomationCurve,
  type PlaybackSection,
} from "@/entities/frequency/lib/pattern-builders";
import { createContext, type PatternSectionDef } from "@/entities/frequency/lib/pattern-core";
import type { WebAudioPatternProgram } from "@/entities/frequency/lib/texture-programs";

export type ResolvedVoicePlan = {
  id: string;
  role: "drone" | "harmonic" | "pulse";
  frequencyHz: number;
  stereoOffsetHz: number;
  gain: AutomationCurve;
  filterHz: AutomationCurve;
  pan: AutomationCurve;
  modulationRateHz?: number;
  modulationDepth?: number;
  pulseHz?: number;
  pulseDepth?: AutomationCurve;
};

export type ResolvedPlaybackPlan = {
  durationSec: number;
  effectBus: {
    compressor: WebAudioPatternProgram["effectBus"]["compressor"];
    delayFeedback: number;
    delayMix: AutomationCurve;
    delayTimeSec: AutomationCurve;
    highpassHz: AutomationCurve;
    lowpassHz: AutomationCurve;
    masterGain: AutomationCurve;
  };
  sections: PlaybackSection[];
  voices: ResolvedVoicePlan[];
};

export function resolvePlaybackProgram({
  program,
  recipe,
  sectionDefs,
}: {
  program: WebAudioPatternProgram;
  recipe: AudioRecipe;
  sectionDefs: PatternSectionDef[];
}): ResolvedPlaybackPlan {
  const context = createContext(recipe, sectionDefs);
  const droneVoices = recipe.droneLayers.flatMap((layer, index) => [
    buildDroneVoiceSpec(recipe, layer, index),
    buildHarmonicVoiceSpec(recipe, layer, index),
  ]);
  const pulseVoice = buildPulseVoiceSpec(recipe);
  const voiceSpecs = pulseVoice ? [...droneVoices, pulseVoice] : droneVoices;

  return {
    durationSec: recipe.durationSec,
    effectBus: {
      compressor: program.effectBus.compressor,
      delayFeedback: program.effectBus.delayFeedback,
      delayMix: resolveAutomationCurve(program.effectBus.delayMix, context),
      delayTimeSec: resolveAutomationCurve(program.effectBus.delayTimeSec, context),
      highpassHz: resolveAutomationCurve(program.effectBus.highpassHz, context),
      lowpassHz: resolveAutomationCurve(program.effectBus.lowpassHz, context),
      masterGain: resolveAutomationCurve(program.effectBus.masterGain, context),
    },
    sections: buildPlaybackSections(sectionDefs),
    voices: voiceSpecs.map((voice) => ({
      ...voice,
      filterHz: resolveAutomationCurve(voice.filterHz, context),
      gain: resolveAutomationCurve(voice.gain, context),
      pan: resolveAutomationCurve(voice.pan, context),
      pulseDepth: voice.pulseDepth ? resolveAutomationCurve(voice.pulseDepth, context) : undefined,
    })),
  };
}
