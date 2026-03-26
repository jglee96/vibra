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
    description: "매력과 안정감을 부드럽게 유지하는 방향으로 감정을 구조화했어요.",
    listeningGuide: "잠들기 전 조용한 공간에서 낮은 볼륨으로 들어보세요.",
    wishEmotionProfile: {
      emotionLabels: ["고요함", "자신감", "여운"],
      vad: {
        valence: 0.64,
        arousal: 0.36,
      },
      dominance: 0.57,
      intent: ["매력", "존재감", "부드러운 자신감"],
      imagery: ["달빛", "안개", "잔광"],
      ambiguity: 0.12,
      confidence: 0.82,
      language: "ko",
    },
    regulationTarget: "soothe",
    musicControlProfile: {
      targetVad: {
        valence: 0.61,
        arousal: 0.31,
      },
      tempoDensity: "still",
      modeColor: "minor",
      spectralBrightness: "balanced",
      rhythmicPulse: "none",
      spaciousness: "wide",
    },
    evidenceTrace: [
      {
        source: "llm_rationale",
        note: "매력과 안정감을 부드럽게 유지하는 방향으로 감정을 구조화했어요.",
        confidence: 0.82,
      },
      {
        source: "regulation_rule",
        note: "현재 valence 0.64, arousal 0.36, dominance 0.57를 기준으로 soothe 방향을 선택했어요.",
        confidence: 0.78,
      },
    ],
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
      harmonicBlend: 0.34,
      motionDepth: 0.2,
      stereoDriftHz: 0.12,
      texture: "hazy",
      fadeInSec: 8,
      fadeOutSec: 12,
    },
  })),
}));

vi.mock("@/features/frequency-playback", () => ({
  useFrequencyPlayback: vi.fn(() => ({
    error: null,
    isPlaying: false,
    play: vi.fn(),
    status: "ready",
    stop: vi.fn(),
  })),
}));

describe("WishGeneratorWidget", () => {
  it("submits a wish and renders the resonance result", async () => {
    render(<WishGeneratorWidget />);

    fireEvent.change(screen.getByLabelText("당신의 바람"), {
      target: {
        value: "대화할수록 편안하고 매력적인 존재감이 느껴졌으면 좋겠어",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "내 주파수 열기" }));

    await waitFor(() => {
      expect(screen.getByText("부드러운 존재감을 위한 주파수")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "재생" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "정지" })).toBeDisabled();
  });
});
