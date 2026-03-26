import type { AudioRecipe } from "@/entities/frequency/model/frequency";
import { buildSectionTemplate } from "@/entities/frequency/lib/pattern-builders";
import {
  resolvePlaybackProgram,
  type ResolvedPlaybackPlan,
  type ResolvedVoicePlan,
} from "@/entities/frequency/lib/resolve-playback-program";
import { createContext } from "@/entities/frequency/lib/pattern-core";
import { texturePrograms, type EffectPatternSpec, type WebAudioPatternProgram } from "@/entities/frequency/lib/texture-programs";

export type { AutomationCurve, PlaybackSection, VoicePlan } from "@/entities/frequency/lib/pattern-builders";
export type { ResolvedPlaybackPlan as WebAudioPlaybackPlan } from "@/entities/frequency/lib/resolve-playback-program";
export type { ResolvedVoicePlan } from "@/entities/frequency/lib/resolve-playback-program";
export type { EffectPatternSpec, WebAudioPatternProgram } from "@/entities/frequency/lib/texture-programs";

export function buildWebAudioPatternProgram(recipe: AudioRecipe): WebAudioPatternProgram {
  const sections = buildSectionTemplate(recipe.durationSec);
  const context = createContext(recipe, sections);

  return texturePrograms[recipe.texture](recipe, context);
}

export function buildWebAudioPlaybackPlan(recipe: AudioRecipe): ResolvedPlaybackPlan {
  const sectionDefs = buildSectionTemplate(recipe.durationSec);
  const program = buildWebAudioPatternProgram(recipe);

  return resolvePlaybackProgram({
    program,
    recipe,
    sectionDefs,
  });
}
