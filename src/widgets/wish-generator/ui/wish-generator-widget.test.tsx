import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { WishGeneratorWidget } from "@/widgets/wish-generator/ui/wish-generator-widget";

vi.mock("@/features/submit-wish/api/request-frequency", () => ({
  requestFrequency: vi.fn(async () => ({
    title: "부드러운 존재감을 위한 주파수",
    subtitle: "고요함 · 자신감 · 여운의 결을 머금은 3분 오디오 의식",
    analysis: {
      moodKeywords: ["고요함", "자신감", "여운"],
      intentKeywords: ["매력", "존재감", "부드러운 자신감"],
      tone: "mystic",
      energy: "low",
      imagery: ["달빛", "안개", "잔광"],
    },
    listeningGuide: "잠들기 전 조용한 공간에서 낮은 볼륨으로 들어보세요.",
    audioRecipe: {
      durationSec: 180,
      baseHz: 142,
      binauralOffsetHz: 4.2,
      droneLayers: [
        { wave: "sine", freq: 71, gain: 0.09 },
        { wave: "sine", freq: 142, gain: 0.17 },
        { wave: "sine", freq: 212.7, gain: 0.08 },
      ],
      pulseHz: 0.12,
      reverbMix: 0.22,
      fadeInSec: 8,
      fadeOutSec: 12,
    },
    ffmpegArgs: ["-f", "lavfi", "-i", "test", "vibra-output.mp3"],
  })),
}));

vi.mock("@/features/render-frequency-audio", () => ({
  useRenderedFrequencyAudio: vi.fn(() => ({
    error: null,
    fileName: "vibra.mp3",
    isRendering: false,
    url: "blob:audio",
  })),
}));

describe("WishGeneratorWidget", () => {
  it("submits a wish and renders the result card", async () => {
    render(<WishGeneratorWidget />);

    fireEvent.change(screen.getByLabelText("당신의 소원"), {
      target: {
        value: "대화할수록 편안하고 매력적인 존재감이 느껴졌으면 좋겠어",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "나만의 주파수 만들기" }));

    await waitFor(() => {
      expect(screen.getByText("부드러운 존재감을 위한 주파수")).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: "MP3 다운로드" })).toHaveAttribute(
      "href",
      "blob:audio",
    );
  });
});
