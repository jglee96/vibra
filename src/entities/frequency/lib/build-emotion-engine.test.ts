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

  it("separates sleep and vitality wishes into clearly different audio ranges", () => {
    const sleepWish = "오늘은 깊게 숙면하고 푹 자고 싶어";
    const energyWish = "내일은 활기차고 에너지 넘치게 하루를 시작하고 싶어";

    const sleepResult = buildEmotionEngine(buildFallbackWishAnalysis(sleepWish), sleepWish);
    const energyResult = buildEmotionEngine(buildFallbackWishAnalysis(energyWish), energyWish);

    expect(sleepResult.regulationTarget).toBe("soothe");
    expect(energyResult.regulationTarget).toBe("uplift");
    expect(sleepResult.audioHints.baseHz).toBeLessThan(energyResult.audioHints.baseHz);
    expect(sleepResult.audioHints.pulseHz).toBeUndefined();
    expect(energyResult.audioHints.pulseHz ?? 0).toBeGreaterThan(0.55);
    expect(sleepResult.audioHints.texture).not.toBe(energyResult.audioHints.texture);
  });
});
