import type {
  AudioRecipe,
  FrequencyResult,
  MusicControlProfile,
} from "@/entities/frequency/model/frequency";
import { buildSectionTemplate } from "@/entities/frequency/lib/pattern-builders";
import {
  resolvePlaybackProgram,
  type ResolvedPlaybackPlan,
} from "@/entities/frequency/lib/resolve-playback-program";
import { createContext, type PlaybackInput } from "@/entities/frequency/lib/pattern-core";
import { texturePrograms, type EffectPatternSpec, type WebAudioPatternProgram } from "@/entities/frequency/lib/texture-programs";

export type { AutomationCurve, PlaybackSection, VoicePlan } from "@/entities/frequency/lib/pattern-builders";
export type { ResolvedPlaybackPlan as WebAudioPlaybackPlan } from "@/entities/frequency/lib/resolve-playback-program";
export type { ResolvedVoicePlan } from "@/entities/frequency/lib/resolve-playback-program";
export type { EffectPatternSpec, WebAudioPatternProgram } from "@/entities/frequency/lib/texture-programs";
export type { PlaybackInput as FrequencyPlaybackInput } from "@/entities/frequency/lib/pattern-core";

const defaultMusicControlProfile: MusicControlProfile = {
  modeColor: "neutral",
  rhythmicPulse: "gentle",
  spaciousness: "open",
  spectralBrightness: "balanced",
  targetVad: {
    arousal: 0.42,
    valence: 0.5,
  },
  tempoDensity: "steady",
};

function toPlaybackInput(
  source:
    | AudioRecipe
    | PlaybackInput
    | Pick<FrequencyResult, "audioRecipe" | "musicControlProfile" | "regulationTarget">,
): PlaybackInput {
  if ("audioRecipe" in source) {
    return {
      audioRecipe: source.audioRecipe,
      musicControlProfile: source.musicControlProfile,
      regulationTarget: source.regulationTarget,
    };
  }

  return {
    audioRecipe: source,
    musicControlProfile: defaultMusicControlProfile,
    regulationTarget: "stabilize",
  };
}

export function buildWebAudioPatternProgram(
  source:
    | AudioRecipe
    | PlaybackInput
    | Pick<FrequencyResult, "audioRecipe" | "musicControlProfile" | "regulationTarget">,
): WebAudioPatternProgram {
  const input = toPlaybackInput(source);
  const sections = buildSectionTemplate(input.audioRecipe.durationSec);
  const context = createContext(input, sections);

  return texturePrograms[input.audioRecipe.texture](input.audioRecipe, context);
}

export function buildWebAudioPlaybackPlan(
  source:
    | AudioRecipe
    | PlaybackInput
    | Pick<FrequencyResult, "audioRecipe" | "musicControlProfile" | "regulationTarget">,
): ResolvedPlaybackPlan {
  const input = toPlaybackInput(source);
  const sectionDefs = buildSectionTemplate(input.audioRecipe.durationSec);
  const program = buildWebAudioPatternProgram(input);

  return resolvePlaybackProgram({
    program,
    input,
    sectionDefs,
  });
}
