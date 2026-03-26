import {
  blend,
  constant,
  createContext,
  lfo,
  ramp,
  resolveCurvePattern,
  sectionMap,
  sequence,
} from "@/entities/frequency/lib/pattern-core";
import type { AudioRecipe } from "@/entities/frequency/model/frequency";

const recipe: AudioRecipe = {
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

const context = createContext(recipe, [
  { id: "intro", startSec: 0, endSec: 40 },
  { id: "body", startSec: 40, endSec: 130 },
  { id: "release", startSec: 130, endSec: 180 },
]);

describe("pattern-core", () => {
  it("resolves constant, ramp, sequence, lfo, and blend patterns", () => {
    expect(resolveCurvePattern(constant(2), context)).toEqual([
      { timeSec: 0, value: 2 },
      { timeSec: 180, value: 2 },
    ]);
    expect(resolveCurvePattern(ramp(1, 3), context)).toEqual([
      { timeSec: 0, value: 1 },
      { timeSec: 180, value: 3 },
    ]);
    expect(
      resolveCurvePattern(sequence([{ timeSec: 0, value: 1 }, { timeSec: 10, value: 3 }]), context),
    ).toEqual([
      { timeSec: 0, value: 1 },
      { timeSec: 10, value: 3 },
    ]);
    expect(resolveCurvePattern(lfo({ rateHz: 0.05, depth: 0.4, bias: 1 }), context).length).toBeGreaterThan(4);
    expect(
      resolveCurvePattern(blend(constant(1), sequence([{ timeSec: 0, value: 0.2 }])), context)[0]?.value,
    ).toBe(1.2);
  });

  it("resolves sectionMap by stitching section-local curves into timeline coordinates", () => {
    const points = resolveCurvePattern(
      sectionMap({
        intro: ramp(0, 1),
        body: ramp(1, 2),
        release: ramp(2, 0),
      }),
      context,
    );

    expect(points[0]).toEqual({ timeSec: 0, value: 0 });
    expect(points[1]).toEqual({ timeSec: 40, value: 1 });
    expect(points[2]).toEqual({ timeSec: 40, value: 1 });
    expect(points.at(-1)).toEqual({ timeSec: 180, value: 0 });
  });
});
