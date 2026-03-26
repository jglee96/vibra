import type {
  AudioRecipe,
  MusicControlProfile,
  RegulationTarget,
} from "@/entities/frequency/model/frequency";

export type PatternSectionId = "intro" | "body" | "release";

export type PatternSectionDef = {
  id: PatternSectionId;
  startSec: number;
  endSec: number;
};

export type CycleContext = {
  durationSec: number;
  recipe: AudioRecipe;
  musicControlProfile: MusicControlProfile;
  regulationTarget: RegulationTarget;
  sections: PatternSectionDef[];
};

export type PlaybackInput = {
  audioRecipe: AudioRecipe;
  musicControlProfile: MusicControlProfile;
  regulationTarget: RegulationTarget;
};

export type CurvePoint = {
  timeSec: number;
  value: number;
};

export type ConstantPattern = {
  kind: "constant";
  value: number;
};

export type RampPattern = {
  kind: "ramp";
  from: number;
  to: number;
};

export type SequencePattern = {
  kind: "sequence";
  points: CurvePoint[];
};

export type LfoPattern = {
  kind: "lfo";
  rateHz: number;
  depth: number;
  bias: number;
};

export type BlendPattern = {
  kind: "blend";
  base: CurvePattern;
  layers: CurvePattern[];
};

export type SectionMapPattern = {
  kind: "sectionMap";
  sections: Record<PatternSectionId, CurvePattern>;
};

export type CurvePattern =
  | ConstantPattern
  | RampPattern
  | SequencePattern
  | LfoPattern
  | BlendPattern
  | SectionMapPattern;

export type PatternValue<T> = {
  resolveCurve: (context: CycleContext) => T;
};

function fixed(value: number) {
  return Number(value.toFixed(3));
}

export function createContext(input: PlaybackInput, sections: PatternSectionDef[]): CycleContext {
  return {
    durationSec: input.audioRecipe.durationSec,
    musicControlProfile: input.musicControlProfile,
    recipe: input.audioRecipe,
    regulationTarget: input.regulationTarget,
    sections,
  };
}

export function constant(value: number): ConstantPattern {
  return { kind: "constant", value };
}

export function ramp(from: number, to: number): RampPattern {
  return { kind: "ramp", from, to };
}

export function at(timeSec: number, value: number): CurvePoint {
  return { timeSec, value };
}

export function sequence(points: CurvePoint[]): SequencePattern {
  return { kind: "sequence", points };
}

export function lfo({
  rateHz,
  depth,
  bias = 0,
}: {
  rateHz: number;
  depth: number;
  bias?: number;
}): LfoPattern {
  return {
    kind: "lfo",
    bias,
    depth,
    rateHz,
  };
}

export function blend(base: CurvePattern, ...layers: CurvePattern[]): BlendPattern {
  return {
    kind: "blend",
    base,
    layers,
  };
}

export function sectionMap(sections: Record<PatternSectionId, CurvePattern>): SectionMapPattern {
  return {
    kind: "sectionMap",
    sections,
  };
}

function addCurvePoints(target: Map<number, number>, points: CurvePoint[]) {
  for (const point of points) {
    const key = fixed(point.timeSec);
    target.set(key, fixed((target.get(key) ?? 0) + point.value));
  }
}

export function resolveCurvePattern(pattern: CurvePattern, context: CycleContext): CurvePoint[] {
  switch (pattern.kind) {
    case "constant":
      return [
        { timeSec: 0, value: fixed(pattern.value) },
        { timeSec: context.durationSec, value: fixed(pattern.value) },
      ];
    case "ramp":
      return [
        { timeSec: 0, value: fixed(pattern.from) },
        { timeSec: context.durationSec, value: fixed(pattern.to) },
      ];
    case "sequence":
      return pattern.points.map((point) => ({
        timeSec: fixed(point.timeSec),
        value: fixed(point.value),
      }));
    case "lfo": {
      const stepSec = Math.min(12, Math.max(6, context.durationSec / 12));
      const points: CurvePoint[] = [];

      for (let timeSec = 0; timeSec <= context.durationSec; timeSec += stepSec) {
        points.push({
          timeSec: fixed(Math.min(timeSec, context.durationSec)),
          value: fixed(
            pattern.bias + Math.sin(2 * Math.PI * pattern.rateHz * timeSec) * pattern.depth,
          ),
        });
      }

      if (points.at(-1)?.timeSec !== context.durationSec) {
        points.push({
          timeSec: context.durationSec,
          value: fixed(
            pattern.bias +
              Math.sin(2 * Math.PI * pattern.rateHz * context.durationSec) * pattern.depth,
          ),
        });
      }

      return points;
    }
    case "blend": {
      const merged = new Map<number, number>();

      addCurvePoints(merged, resolveCurvePattern(pattern.base, context));
      for (const layer of pattern.layers) {
        addCurvePoints(merged, resolveCurvePattern(layer, context));
      }

      return Array.from(merged.entries())
        .sort((left, right) => left[0] - right[0])
        .map(([timeSec, value]) => ({ timeSec, value: fixed(value) }));
    }
    case "sectionMap":
      return context.sections.flatMap((section) => {
        const sectionPattern = pattern.sections[section.id];
        const sectionPoints = resolveCurvePattern(sectionPattern, {
          ...context,
          durationSec: fixed(section.endSec - section.startSec),
        });

        return sectionPoints.map((point) => ({
          timeSec: fixed(section.startSec + point.timeSec),
          value: fixed(point.value),
        }));
      });
  }
}

export function resolvePatternValue(pattern: CurvePattern, context: CycleContext): PatternValue<CurvePoint[]> {
  return {
    resolveCurve() {
      return resolveCurvePattern(pattern, context);
    },
  };
}
