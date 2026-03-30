import { normalizeAudioRecipe } from "@/entities/frequency/lib/normalize-audio-recipe";

describe("normalizeAudioRecipe", () => {
  it("clamps model hints into safe audio ranges", () => {
    const recipe = normalizeAudioRecipe({
      baseHz: 400,
      binauralOffsetHz: 20,
      pulseHz: 1.5,
      reverbMix: 0.5,
      droneWeights: [0.5, 0.02, 0.3],
      harmonicBlend: 1.4,
      motionDepth: 0.9,
      stereoDriftHz: 0.4,
      texture: "hazy",
    });

    expect(recipe.baseHz).toBe(248);
    expect(recipe.binauralOffsetHz).toBe(8);
    expect(recipe.pulseHz).toBe(0.92);
    expect(recipe.reverbMix).toBe(0.28);
    expect(recipe.harmonicBlend).toBe(0.72);
    expect(recipe.motionDepth).toBe(0.72);
    expect(recipe.stereoDriftHz).toBe(0.24);
    expect(recipe.texture).toBe("hazy");
    expect(recipe.droneLayers).toHaveLength(3);
  });
});
