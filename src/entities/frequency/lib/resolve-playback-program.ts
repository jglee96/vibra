import {
  buildDroneVoiceSpec,
  buildPlaybackSections,
  buildPulseVoiceSpec,
  buildHarmonicVoiceSpec,
  resolveAutomationCurve,
  type AutomationCurve,
  type PlaybackSection,
} from "@/entities/frequency/lib/pattern-builders";
import {
  createContext,
  type PatternSectionDef,
  type PlaybackInput,
} from "@/entities/frequency/lib/pattern-core";
import type { WebAudioPatternProgram } from "@/entities/frequency/lib/texture-programs";

export type ResolvedVoicePlan = {
  id: string;
  role: "drone" | "harmonic" | "pulse";
  oscillatorType: OscillatorType;
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
  input,
  sectionDefs,
}: {
  program: WebAudioPatternProgram;
  input: PlaybackInput;
  sectionDefs: PatternSectionDef[];
}): ResolvedPlaybackPlan {
  const context = createContext(input, sectionDefs);
  const recipe = input.audioRecipe;
  const droneVoices = recipe.droneLayers.flatMap((layer, index) => [
    buildDroneVoiceSpec(input, layer, index),
    buildHarmonicVoiceSpec(input, layer, index),
  ]);
  const pulseVoice = buildPulseVoiceSpec(input);
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
