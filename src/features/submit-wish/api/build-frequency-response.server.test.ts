import { buildFrequencyResponse } from "@/features/submit-wish/api/build-frequency-response.server";

vi.mock("@/features/submit-wish/api/analyze-wish.server", () => ({
  analyzeWishWithOpenAI: vi.fn(async () => ({
    analysis: {
      moodKeywords: ["고요함", "여운", "안정감"],
      intentKeywords: ["매력", "존재감", "부드러운 자신감"],
      tone: "mystic",
      energy: "low",
      imagery: ["달빛", "안개", "파문"],
    },
    description: "매력과 안정감을 함께 느끼도록 감정을 해석했어요.",
    listeningGuide: "밤의 리듬을 정리하고 싶을 때 조용한 공간에서 들어보세요.",
    audioHints: {
      baseHz: 144,
      binauralOffsetHz: 4,
      pulseHz: 0.14,
      reverbMix: 0.18,
      droneWeights: [0.09, 0.17, 0.08],
    },
  })),
}));

describe("buildFrequencyResponse", () => {
  it("builds a frequency payload from a valid wish", async () => {
    const result = await buildFrequencyResponse(
      "대화할수록 신뢰와 매력이 깊어지는 분위기를 갖고 싶어",
    );

    expect(result.title).toContain("주파수");
    expect(result.analysis.intentKeywords).toContain("매력");
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
