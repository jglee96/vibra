import { buildWebAudioPlaybackPlan } from "@/entities/frequency/lib/build-web-audio-playback-plan";
import type { AudioRecipe, FrequencyResult } from "@/entities/frequency/model/frequency";

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

function buildResult(
  overrides: Partial<Pick<FrequencyResult, "regulationTarget" | "musicControlProfile">> & {
    audioRecipe?: Partial<AudioRecipe>;
  } = {},
): Pick<FrequencyResult, "audioRecipe" | "musicControlProfile" | "regulationTarget"> {
  return {
    audioRecipe: {
      ...baseRecipe,
      ...overrides.audioRecipe,
    },
    musicControlProfile: overrides.musicControlProfile ?? {
      modeColor: "neutral",
      rhythmicPulse: "gentle",
      spaciousness: "open",
      spectralBrightness: "balanced",
      targetVad: { arousal: 0.44, valence: 0.5 },
      tempoDensity: "steady",
    },
    regulationTarget: overrides.regulationTarget ?? "stabilize",
  };
}

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
    const plan = buildWebAudioPlaybackPlan(
      buildResult({
        audioRecipe: {
          pulseHz: undefined,
          texture: "soft",
        },
        regulationTarget: "soothe",
      }),
    );

    expect(plan.voices.every((voice) => voice.role !== "pulse")).toBe(true);
    expect(plan.effectBus.lowpassHz.points[1]?.value ?? 0).toBeLessThan(3000);
  });

  it("separates sleepy and lively recipes into distinct pitch and motion characters", () => {
    const sleepy = buildWebAudioPlaybackPlan(
      buildResult({
        audioRecipe: {
          texture: "soft",
          pulseHz: undefined,
          baseHz: 118,
          harmonicBlend: 0.14,
          motionDepth: 0.12,
        },
        musicControlProfile: {
          modeColor: "minor",
          rhythmicPulse: "none",
          spaciousness: "wide",
          spectralBrightness: "dim",
          targetVad: { arousal: 0.22, valence: 0.58 },
          tempoDensity: "still",
        },
        regulationTarget: "soothe",
      }),
    );
    const lively = buildWebAudioPlaybackPlan(
      buildResult({
        audioRecipe: {
          texture: "bright",
          pulseHz: 0.34,
          baseHz: 182,
          harmonicBlend: 0.56,
          motionDepth: 0.52,
        },
        musicControlProfile: {
          modeColor: "major",
          rhythmicPulse: "steady",
          spaciousness: "open",
          spectralBrightness: "bright",
          targetVad: { arousal: 0.72, valence: 0.74 },
          tempoDensity: "flowing",
        },
        regulationTarget: "uplift",
      }),
    );

    expect(sleepy.voices.some((voice) => voice.role === "pulse")).toBe(false);
    expect(lively.voices.some((voice) => voice.role === "pulse")).toBe(true);
    expect(sleepy.voices[0]?.oscillatorType).toBe("sine");
    expect(lively.voices[0]?.oscillatorType).toBe("triangle");
    expect((lively.voices[0]?.frequencyHz ?? 0)).toBeGreaterThan(sleepy.voices[0]?.frequencyHz ?? 0);
    expect(lively.effectBus.lowpassHz.points[1]?.value ?? 0).toBeGreaterThan(
      sleepy.effectBus.lowpassHz.points[1]?.value ?? 0,
    );
    expect(
      lively.voices.filter((voice) => voice.role === "harmonic")[0]?.gain.points[3]?.value ?? 0,
    ).toBeGreaterThan(
      sleepy.voices.filter((voice) => voice.role === "harmonic")[0]?.gain.points[3]?.value ?? 0,
    );
  });
});
