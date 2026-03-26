import { buildSectionTemplate } from "@/entities/frequency/lib/pattern-builders";
import { resolvePlaybackProgram } from "@/entities/frequency/lib/resolve-playback-program";
import { texturePrograms } from "@/entities/frequency/lib/texture-programs";
import { createContext, type PlaybackInput } from "@/entities/frequency/lib/pattern-core";
import type { AudioRecipe } from "@/entities/frequency/model/frequency";

const recipe: AudioRecipe = {
  durationSec: 180,
  baseHz: 128,
  binauralOffsetHz: 4.2,
  droneLayers: [
    { wave: "sine", freq: 64, gain: 0.1 },
    { wave: "sine", freq: 128, gain: 0.16 },
    { wave: "sine", freq: 191.7, gain: 0.08 },
  ],
  pulseHz: 0.18,
  reverbMix: 0.2,
  harmonicBlend: 0.34,
  motionDepth: 0.28,
  stereoDriftHz: 0.11,
  texture: "hazy",
  fadeInSec: 8,
  fadeOutSec: 12,
};

describe("resolvePlaybackProgram", () => {
  it("resolves pattern programs into automation curves for the engine", () => {
    const sectionDefs = buildSectionTemplate(recipe.durationSec);
    const input: PlaybackInput = {
      audioRecipe: recipe,
      musicControlProfile: {
        modeColor: "minor",
        rhythmicPulse: "gentle",
        spaciousness: "wide",
        spectralBrightness: "dim",
        targetVad: { arousal: 0.28, valence: 0.56 },
        tempoDensity: "still",
      },
      regulationTarget: "soothe" as const,
    };
    const context = createContext(input, sectionDefs);
    const plan = resolvePlaybackProgram({
      program: texturePrograms.hazy(recipe, context),
      input,
      sectionDefs,
    });

    expect(plan.sections).toHaveLength(3);
    expect(plan.voices.some((voice) => voice.role === "pulse")).toBe(true);
    expect(plan.voices[0]?.gain.points.length).toBeGreaterThanOrEqual(6);
    expect(plan.voices[0]?.pan.points[0]?.value).not.toBe(plan.voices[0]?.pan.points.at(-1)?.value);
    expect(plan.effectBus.masterGain.points[0]?.value).not.toBe(
      plan.effectBus.masterGain.points.at(-1)?.value,
    );
  });
});
