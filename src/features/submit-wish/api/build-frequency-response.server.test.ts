import { buildFrequencyResponse } from "@/features/submit-wish/api/build-frequency-response.server";

vi.mock("@/features/submit-wish/api/analyze-wish.server", () => ({
  analyzeWishWithOpenAI: vi.fn(async () => ({
    wishEmotionProfile: {
      emotionLabels: ["고요함", "여운", "안정감"],
      vad: {
        valence: 0.62,
        arousal: 0.38,
      },
      dominance: 0.58,
      intent: ["매력", "존재감", "부드러운 자신감"],
      imagery: ["달빛", "안개", "파문"],
      ambiguity: 0.14,
      confidence: 0.82,
      language: "ko",
    },
    description: "매력과 안정감을 함께 느끼도록 감정을 해석했어요.",
  })),
}));

describe("buildFrequencyResponse", () => {
  it("builds a frequency payload from a valid wish", async () => {
    const result = await buildFrequencyResponse(
      "대화할수록 신뢰와 매력이 깊어지는 분위기를 갖고 싶어",
    );

    expect(result.title).toContain("주파수");
    expect(result.analysis.intentKeywords).toContain("매력");
    expect(result.regulationTarget).toBe("soothe");
    expect(result.wishEmotionProfile.language).toBe("ko");
    expect(result.audioRecipe.durationSec).toBe(180);
    expect(result.ffmpegArgs.at(-1)).toBe("vibra-output.mp3");
  });

  it("rejects unsafe wishes before calling the model", async () => {
    await expect(buildFrequencyResponse("자해하고 싶어")).rejects.toMatchObject({
      code: "UNSAFE_WISH",
      status: 422,
    });
  });
});
