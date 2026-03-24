import { POST } from "@/app/api/frequency/route";

vi.mock("@/features/submit-wish", () => ({
  buildFrequencyResponse: vi.fn(async (wish: string) => ({
    title: `${wish}을 위한 주파수`,
    subtitle: "고요함의 결을 머금은 3분 오디오 의식",
    analysis: {
      moodKeywords: ["고요함", "안정감"],
      intentKeywords: ["집중", "흐름"],
      tone: "calm",
      energy: "low",
      imagery: ["새벽", "물결"],
    },
    listeningGuide: "작업 전에 작은 볼륨으로 들어보세요.",
    audioRecipe: {
      durationSec: 180,
      baseHz: 128,
      binauralOffsetHz: 3.5,
      droneLayers: [
        { wave: "sine", freq: 64, gain: 0.1 },
        { wave: "sine", freq: 128, gain: 0.15 },
        { wave: "sine", freq: 191.7, gain: 0.08 },
      ],
      reverbMix: 0.16,
      fadeInSec: 8,
      fadeOutSec: 12,
    },
    ffmpegArgs: ["-f", "lavfi", "-i", "test", "vibra-output.mp3"],
  })),
}));

describe("POST /api/frequency", () => {
  it("returns a frequency result for valid input", async () => {
    const response = await POST(
      new Request("http://localhost/api/frequency", {
        method: "POST",
        body: JSON.stringify({ wish: "집중이 깊어지는 작업 흐름을 만들고 싶어" }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      title: expect.stringContaining("주파수"),
    });
  });

  it("returns 400 for malformed request bodies", async () => {
    const response = await POST(
      new Request("http://localhost/api/frequency", {
        method: "POST",
        body: JSON.stringify({ wish: 123 }),
      }),
    );

    expect(response.status).toBe(400);
  });
});
