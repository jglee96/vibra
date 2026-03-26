import React from "react";
import { act, render, screen } from "@testing-library/react";

import { useFrequencyPlayback } from "@/features/frequency-playback/model/use-frequency-playback";
import type { FrequencyResult } from "@/entities/frequency";

class FakeAudioParam {
  value = 0;

  cancelScheduledValues() {}

  linearRampToValueAtTime(value: number) {
    this.value = value;
  }

  setValueAtTime(value: number) {
    this.value = value;
  }
}

class FakeAudioNode {
  connect() {}

  disconnect() {}
}

class FakeGainNode extends FakeAudioNode {
  gain = new FakeAudioParam();
}

class FakeFilterNode extends FakeAudioNode {
  frequency = new FakeAudioParam();
  type = "lowpass";
}

class FakeCompressorNode extends FakeAudioNode {
  attack = new FakeAudioParam();
  knee = new FakeAudioParam();
  ratio = new FakeAudioParam();
  release = new FakeAudioParam();
  threshold = new FakeAudioParam();
}

class FakePannerNode extends FakeAudioNode {
  pan = new FakeAudioParam();
}

class FakeDelayNode extends FakeAudioNode {
  delayTime = new FakeAudioParam();
}

class FakeOscillatorNode extends FakeAudioNode {
  frequency = new FakeAudioParam();
  type = "sine";

  start() {}

  stop() {}
}

class FakeAudioContext {
  currentTime = 0;
  destination = new FakeAudioNode();
  state = "running";

  createBiquadFilter() {
    return new FakeFilterNode();
  }

  createDelay() {
    return new FakeDelayNode();
  }

  createDynamicsCompressor() {
    return new FakeCompressorNode();
  }

  createGain() {
    return new FakeGainNode();
  }

  createOscillator() {
    return new FakeOscillatorNode();
  }

  createStereoPanner() {
    return new FakePannerNode();
  }

  resume() {
    return Promise.resolve();
  }
}

const result: FrequencyResult = {
  title: "집중을 위한 주파수",
  subtitle: "선명한 흐름의 결",
  analysis: {
    moodKeywords: ["고요함", "집중감"],
    intentKeywords: ["집중", "흐름"],
    tone: "grounding",
    energy: "medium",
    imagery: ["새벽", "책상"],
  },
  description: "집중 흐름을 위한 감정을 정리했어요.",
  listeningGuide: "작업 전에 작은 볼륨으로 들어보세요.",
  wishEmotionProfile: {
    emotionLabels: ["고요함", "집중감"],
    vad: { valence: 0.6, arousal: 0.48 },
    dominance: 0.58,
    intent: ["집중", "흐름"],
    imagery: ["새벽", "책상"],
    ambiguity: 0.14,
    confidence: 0.82,
    language: "ko",
  },
  regulationTarget: "focus",
  musicControlProfile: {
    targetVad: { valence: 0.62, arousal: 0.54 },
    tempoDensity: "flowing",
    modeColor: "open",
    spectralBrightness: "balanced",
    rhythmicPulse: "steady",
    spaciousness: "close",
  },
  evidenceTrace: [
    {
      source: "llm_rationale",
      note: "집중 흐름을 위한 감정을 정리했어요.",
      confidence: 0.82,
    },
    {
      source: "regulation_rule",
      note: "현재 valence 0.60, arousal 0.48, dominance 0.58을 기준으로 focus 방향을 선택했어요.",
      confidence: 0.79,
    },
  ],
  audioRecipe: {
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
  },
};

function TestHarness({ frequencyResult }: { frequencyResult: FrequencyResult | null }) {
  const playback = useFrequencyPlayback(frequencyResult);

  return (
    <div>
      <span>{playback.status}</span>
      <button onClick={() => void playback.play()}>play</button>
      <button onClick={playback.stop}>stop</button>
    </div>
  );
}

describe("useFrequencyPlayback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: FakeAudioContext,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("transitions between ready, playing, and ready after stop", async () => {
    render(<TestHarness frequencyResult={result} />);

    expect(screen.getByText("ready")).toBeInTheDocument();

    await act(async () => {
      screen.getByRole("button", { name: "play" }).click();
    });

    expect(screen.getByText("playing")).toBeInTheDocument();

    await act(async () => {
      screen.getByRole("button", { name: "stop" }).click();
    });

    expect(screen.getByText("ready")).toBeInTheDocument();
  });
});
