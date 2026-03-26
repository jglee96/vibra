import type { AudioRecipe } from "@/entities/frequency/model/frequency";
import type { CycleContext } from "@/entities/frequency/lib/pattern-core";
import { constant, ramp, sectionMap, type CurvePattern } from "@/entities/frequency/lib/pattern-core";

export type EffectPatternSpec = {
  compressor: {
    attack: number;
    knee: number;
    ratio: number;
    release: number;
    threshold: number;
  };
  delayFeedback: number;
  delayMix: CurvePattern;
  delayTimeSec: CurvePattern;
  highpassHz: CurvePattern;
  lowpassHz: CurvePattern;
  masterGain: CurvePattern;
};

export type WebAudioPatternProgram = {
  effectBus: EffectPatternSpec;
};

function createSectionPattern(intro: CurvePattern, body: CurvePattern, release: CurvePattern) {
  return sectionMap({
    body,
    intro,
    release,
  });
}

function withCharacter(context: CycleContext) {
  const brightnessLift =
    context.musicControlProfile.spectralBrightness === "bright"
      ? 1.18
      : context.musicControlProfile.spectralBrightness === "dim"
        ? 0.82
        : 1;
  const spaciousnessLift =
    context.musicControlProfile.spaciousness === "wide"
      ? 1.16
      : context.musicControlProfile.spaciousness === "close"
        ? 0.9
        : 1;

  switch (context.regulationTarget) {
    case "soothe":
      return {
        brightnessScale: 0.72 * brightnessLift,
        delayMixScale: 0.84 * spaciousnessLift,
        delayTimeScale: 1.08 * spaciousnessLift,
        highpassScale: 0.8,
        masterGainScale: 0.92,
      };
    case "focus":
      return {
        brightnessScale: 1.08 * brightnessLift,
        delayMixScale: 0.84 * spaciousnessLift,
        delayTimeScale: 0.9,
        highpassScale: 1.18,
        masterGainScale: 1,
      };
    case "uplift":
      return {
        brightnessScale: 1.32 * brightnessLift,
        delayMixScale: 0.92 * spaciousnessLift,
        delayTimeScale: 0.82,
        highpassScale: 1.32,
        masterGainScale: 1.04,
      };
    case "stabilize":
    default:
      return {
        brightnessScale: 0.94 * brightnessLift,
        delayMixScale: 1 * spaciousnessLift,
        delayTimeScale: 1,
        highpassScale: 0.94,
        masterGainScale: 0.96,
      };
  }
}

export const texturePrograms: Record<
  AudioRecipe["texture"],
  (_recipe: AudioRecipe, _context: CycleContext) => WebAudioPatternProgram
> = {
  bright: (_recipe, context) => {
    const character = withCharacter(context);

    return {
    effectBus: {
      compressor: {
        attack: 0.012,
        knee: 12,
        ratio: 2.4,
        release: 0.18,
        threshold: -20,
      },
      delayFeedback: 0.26,
      delayMix: createSectionPattern(
        ramp(0.08 * character.delayMixScale, 0.12 * character.delayMixScale),
        ramp(0.16 * character.delayMixScale, 0.2 * character.delayMixScale),
        ramp(0.16 * character.delayMixScale, 0.08 * character.delayMixScale),
      ),
      delayTimeSec: createSectionPattern(
        ramp(0.12 * character.delayTimeScale, 0.16 * character.delayTimeScale),
        ramp(0.18 * character.delayTimeScale, 0.2 * character.delayTimeScale),
        ramp(0.19 * character.delayTimeScale, 0.13 * character.delayTimeScale),
      ),
      highpassHz: constant(90 * character.highpassScale),
      lowpassHz: createSectionPattern(
        ramp(4600 * character.brightnessScale, 5600 * character.brightnessScale),
        ramp(5900 * character.brightnessScale, 6800 * character.brightnessScale),
        ramp(5600 * character.brightnessScale, 4200 * character.brightnessScale),
      ),
      masterGain: createSectionPattern(
        ramp(0.72 * character.masterGainScale, 0.78 * character.masterGainScale),
        ramp(0.8 * character.masterGainScale, 0.84 * character.masterGainScale),
        ramp(0.78 * character.masterGainScale, 0.66 * character.masterGainScale),
      ),
    },
  };
  },
  hazy: (_recipe, context) => {
    const character = withCharacter(context);

    return {
    effectBus: {
      compressor: {
        attack: 0.018,
        knee: 18,
        ratio: 2,
        release: 0.24,
        threshold: -21,
      },
      delayFeedback: 0.34,
      delayMix: createSectionPattern(
        ramp(0.12 * character.delayMixScale, 0.18 * character.delayMixScale),
        ramp(0.2 * character.delayMixScale, 0.24 * character.delayMixScale),
        ramp(0.22 * character.delayMixScale, 0.1 * character.delayMixScale),
      ),
      delayTimeSec: createSectionPattern(
        ramp(0.2 * character.delayTimeScale, 0.24 * character.delayTimeScale),
        ramp(0.24 * character.delayTimeScale, 0.28 * character.delayTimeScale),
        ramp(0.26 * character.delayTimeScale, 0.18 * character.delayTimeScale),
      ),
      highpassHz: constant(40 * character.highpassScale),
      lowpassHz: createSectionPattern(
        ramp(1700 * character.brightnessScale, 2200 * character.brightnessScale),
        ramp(2200 * character.brightnessScale, 2700 * character.brightnessScale),
        ramp(2400 * character.brightnessScale, 1600 * character.brightnessScale),
      ),
      masterGain: createSectionPattern(
        ramp(0.84 * character.masterGainScale, 0.9 * character.masterGainScale),
        ramp(0.88 * character.masterGainScale, 0.92 * character.masterGainScale),
        ramp(0.9 * character.masterGainScale, 0.72 * character.masterGainScale),
      ),
    },
  };
  },
  balanced: (_recipe, context) => {
    const character = withCharacter(context);

    return {
    effectBus: {
      compressor: {
        attack: 0.018,
        knee: 12,
        ratio: 2.6,
        release: 0.16,
        threshold: -21,
      },
      delayFeedback: 0.22,
      delayMix: createSectionPattern(
        ramp(0.08 * character.delayMixScale, 0.12 * character.delayMixScale),
        ramp(0.14 * character.delayMixScale, 0.18 * character.delayMixScale),
        ramp(0.14 * character.delayMixScale, 0.08 * character.delayMixScale),
      ),
      delayTimeSec: createSectionPattern(
        ramp(0.12 * character.delayTimeScale, 0.15 * character.delayTimeScale),
        ramp(0.16 * character.delayTimeScale, 0.18 * character.delayTimeScale),
        ramp(0.18 * character.delayTimeScale, 0.12 * character.delayTimeScale),
      ),
      highpassHz: constant(60 * character.highpassScale),
      lowpassHz: createSectionPattern(
        ramp(4200 * character.brightnessScale, 5000 * character.brightnessScale),
        ramp(5200 * character.brightnessScale, 5800 * character.brightnessScale),
        ramp(5200 * character.brightnessScale, 3600 * character.brightnessScale),
      ),
      masterGain: createSectionPattern(
        ramp(0.78 * character.masterGainScale, 0.82 * character.masterGainScale),
        ramp(0.84 * character.masterGainScale, 0.88 * character.masterGainScale),
        ramp(0.84 * character.masterGainScale, 0.68 * character.masterGainScale),
      ),
    },
  };
  },
  soft: (_recipe, context) => {
    const character = withCharacter(context);

    return {
    effectBus: {
      compressor: {
        attack: 0.018,
        knee: 10,
        ratio: 2.2,
        release: 0.2,
        threshold: -22,
      },
      delayFeedback: 0.24,
      delayMix: createSectionPattern(
        ramp(0.06 * character.delayMixScale, 0.1 * character.delayMixScale),
        ramp(0.12 * character.delayMixScale, 0.16 * character.delayMixScale),
        ramp(0.14 * character.delayMixScale, 0.06 * character.delayMixScale),
      ),
      delayTimeSec: createSectionPattern(
        ramp(0.16 * character.delayTimeScale, 0.19 * character.delayTimeScale),
        ramp(0.19 * character.delayTimeScale, 0.22 * character.delayTimeScale),
        ramp(0.2 * character.delayTimeScale, 0.14 * character.delayTimeScale),
      ),
      highpassHz: constant(48 * character.highpassScale),
      lowpassHz: createSectionPattern(
        ramp(2600 * character.brightnessScale, 3200 * character.brightnessScale),
        ramp(3400 * character.brightnessScale, 3800 * character.brightnessScale),
        ramp(3200 * character.brightnessScale, 2400 * character.brightnessScale),
      ),
      masterGain: createSectionPattern(
        ramp(0.8 * character.masterGainScale, 0.84 * character.masterGainScale),
        ramp(0.86 * character.masterGainScale, 0.9 * character.masterGainScale),
        ramp(0.88 * character.masterGainScale, 0.7 * character.masterGainScale),
      ),
    },
  };
  },
};
