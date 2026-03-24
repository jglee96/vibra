import { normalizeAudioRecipe } from "@/entities/frequency/lib/normalize-audio-recipe";

describe("normalizeAudioRecipe", () => {
  it("clamps model hints into safe audio ranges", () => {
    const recipe = normalizeAudioRecipe({
      baseHz: 400,
      binauralOffsetHz: 20,
      pulseHz: 1.5,
      reverbMix: 0.5,
      droneWeights: [0.5, 0.02, 0.3],
    });

    expect(recipe.baseHz).toBe(196);
    expect(recipe.binauralOffsetHz).toBe(8);
    expect(recipe.pulseHz).toBe(0.6);
    expect(recipe.reverbMix).toBe(0.28);
    expect(recipe.droneLayers).toHaveLength(3);
  });
});
