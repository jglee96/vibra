import { createContext } from "@/entities/frequency/lib/pattern-core";
import { texturePrograms } from "@/entities/frequency/lib/texture-programs";
import { buildSectionTemplate } from "@/entities/frequency/lib/pattern-builders";
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
  texture: "balanced",
  fadeInSec: 8,
  fadeOutSec: 12,
};

describe("texturePrograms", () => {
  it("returns distinct effect programs per texture", () => {
    const context = createContext(recipe, buildSectionTemplate(recipe.durationSec));
    const softProgram = texturePrograms.soft({ ...recipe, texture: "soft" }, context);
    const brightProgram = texturePrograms.bright({ ...recipe, texture: "bright" }, context);

    expect(softProgram.effectBus.compressor.threshold).toBeLessThan(brightProgram.effectBus.compressor.threshold);
    expect(softProgram.effectBus.delayFeedback).not.toBe(brightProgram.effectBus.delayFeedback);
    expect(softProgram.effectBus.lowpassHz.kind).toBe("sectionMap");
  });
});
