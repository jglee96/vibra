import { buildWebAudioPlaybackPlan } from "@/entities/frequency/lib/build-web-audio-playback-plan";
import type { AudioRecipe } from "@/entities/frequency/model/frequency";

const baseRecipe: AudioRecipe = {
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
  texture: "bright",
  fadeInSec: 8,
  fadeOutSec: 12,
};

describe("buildWebAudioPlaybackPlan", () => {
  it("creates section, voice, and effect-bus plans for playback", () => {
    const plan = buildWebAudioPlaybackPlan(baseRecipe);

    expect(plan.sections.map((section) => section.id)).toEqual(["intro", "body", "release"]);
    expect(plan.voices.filter((voice) => voice.role === "drone")).toHaveLength(3);
    expect(plan.voices.filter((voice) => voice.role === "harmonic")).toHaveLength(3);
    expect(plan.voices.some((voice) => voice.role === "pulse")).toBe(true);
    expect(plan.effectBus.delayTimeSec.points[0]?.value).toBeGreaterThan(0);
    expect(plan.voices[0]?.gain.points[0]?.value).toBeLessThan(plan.voices[0]?.gain.points[1]?.value ?? 0);
    expect(plan.voices[0]?.pan.points[0]?.value).not.toBe(plan.voices[0]?.pan.points[1]?.value);
    expect(plan.voices[3]?.gain.points[2]?.value).not.toBe(plan.voices[3]?.gain.points[3]?.value);
  });

  it("omits pulse voice when pulseHz is undefined", () => {
    const plan = buildWebAudioPlaybackPlan({
      ...baseRecipe,
      pulseHz: undefined,
      texture: "soft",
    });

    expect(plan.voices.every((voice) => voice.role !== "pulse")).toBe(true);
    expect(plan.effectBus.lowpassHz.points.some((point) => point.value === 3400)).toBe(true);
  });
});
