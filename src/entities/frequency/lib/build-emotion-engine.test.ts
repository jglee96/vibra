import {
  buildEmotionEngine,
  buildFallbackWishAnalysis,
} from "@/entities/frequency/lib/build-emotion-engine";

describe("buildEmotionEngine", () => {
  it("maps anxious wishes to a soothing or stabilizing target instead of a stimulating one", () => {
    const wish = "I feel anxious and tense, and I want to calm down before I sleep.";
    const fallback = buildFallbackWishAnalysis(wish);
    const result = buildEmotionEngine(fallback, wish);

    expect(["soothe", "stabilize"]).toContain(result.regulationTarget);
    expect(result.musicControlProfile.targetVad.arousal).toBeLessThan(
      fallback.wishEmotionProfile.vad.arousal,
    );
  });

  it("keeps focus-oriented wishes in a medium-arousal focus profile", () => {
    const wish = "집중해서 공부 흐름을 오래 유지하고 싶어";
    const fallback = buildFallbackWishAnalysis(wish);
    const result = buildEmotionEngine(fallback, wish);

    expect(result.regulationTarget).toBe("focus");
    expect(result.analysis.tone).toBe("grounding");
    expect(result.analysis.energy).toBe("medium");
    expect(result.musicControlProfile.rhythmicPulse).toBe("steady");
  });

  it("redirects low-energy negative wishes toward stabilization instead of deeper discharge", () => {
    const wish = "우울해서 더 가라앉고 싶어";
    const fallback = buildFallbackWishAnalysis(wish);
    const result = buildEmotionEngine(fallback, wish);

    expect(result.regulationTarget).toBe("stabilize");
    expect(result.musicControlProfile.targetVad.valence).toBeGreaterThan(
      fallback.wishEmotionProfile.vad.valence,
    );
  });
});
