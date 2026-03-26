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

export const texturePrograms: Record<
  AudioRecipe["texture"],
  (_recipe: AudioRecipe, _context: CycleContext) => WebAudioPatternProgram
> = {
  bright: () => ({
    effectBus: {
      compressor: {
        attack: 0.012,
        knee: 12,
        ratio: 2.4,
        release: 0.18,
        threshold: -20,
      },
      delayFeedback: 0.26,
      delayMix: createSectionPattern(ramp(0.08, 0.12), ramp(0.16, 0.2), ramp(0.16, 0.08)),
      delayTimeSec: createSectionPattern(ramp(0.12, 0.16), ramp(0.18, 0.2), ramp(0.19, 0.13)),
      highpassHz: constant(90),
      lowpassHz: createSectionPattern(ramp(4600, 5600), ramp(5900, 6800), ramp(5600, 4200)),
      masterGain: createSectionPattern(ramp(0.72, 0.78), ramp(0.8, 0.84), ramp(0.78, 0.66)),
    },
  }),
  hazy: () => ({
    effectBus: {
      compressor: {
        attack: 0.018,
        knee: 18,
        ratio: 2,
        release: 0.24,
        threshold: -21,
      },
      delayFeedback: 0.34,
      delayMix: createSectionPattern(ramp(0.12, 0.18), ramp(0.2, 0.24), ramp(0.22, 0.1)),
      delayTimeSec: createSectionPattern(ramp(0.2, 0.24), ramp(0.24, 0.28), ramp(0.26, 0.18)),
      highpassHz: constant(40),
      lowpassHz: createSectionPattern(ramp(1700, 2200), ramp(2200, 2700), ramp(2400, 1600)),
      masterGain: createSectionPattern(ramp(0.84, 0.9), ramp(0.88, 0.92), ramp(0.9, 0.72)),
    },
  }),
  balanced: () => ({
    effectBus: {
      compressor: {
        attack: 0.018,
        knee: 12,
        ratio: 2.6,
        release: 0.16,
        threshold: -21,
      },
      delayFeedback: 0.22,
      delayMix: createSectionPattern(ramp(0.08, 0.12), ramp(0.14, 0.18), ramp(0.14, 0.08)),
      delayTimeSec: createSectionPattern(ramp(0.12, 0.15), ramp(0.16, 0.18), ramp(0.18, 0.12)),
      highpassHz: constant(60),
      lowpassHz: createSectionPattern(ramp(4200, 5000), ramp(5200, 5800), ramp(5200, 3600)),
      masterGain: createSectionPattern(ramp(0.78, 0.82), ramp(0.84, 0.88), ramp(0.84, 0.68)),
    },
  }),
  soft: () => ({
    effectBus: {
      compressor: {
        attack: 0.018,
        knee: 10,
        ratio: 2.2,
        release: 0.2,
        threshold: -22,
      },
      delayFeedback: 0.24,
      delayMix: createSectionPattern(ramp(0.06, 0.1), ramp(0.12, 0.16), ramp(0.14, 0.06)),
      delayTimeSec: createSectionPattern(ramp(0.16, 0.19), ramp(0.19, 0.22), ramp(0.2, 0.14)),
      highpassHz: constant(48),
      lowpassHz: createSectionPattern(ramp(2600, 3200), ramp(3400, 3800), ramp(3200, 2400)),
      masterGain: createSectionPattern(ramp(0.8, 0.84), ramp(0.86, 0.9), ramp(0.88, 0.7)),
    },
  }),
};
