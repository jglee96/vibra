import type { AudioRecipe } from "@/entities/frequency/model/frequency";
import type { PatternSectionDef } from "@/entities/frequency/lib/pattern-core";
import {
  blend,
  constant,
  lfo,
  ramp,
  resolveCurvePattern,
  sectionMap,
  sequence,
  type CurvePattern,
  type CycleContext,
} from "@/entities/frequency/lib/pattern-core";

export type PlaybackSection = {
  id: "intro" | "body" | "release";
  startSec: number;
  endSec: number;
};

export type AutomationCurve = {
  interpolation: "linear";
  points: Array<{
    timeSec: number;
    value: number;
  }>;
};

export type VoicePlan = {
  id: string;
  role: "drone" | "harmonic" | "pulse";
  frequencyHz: number;
  stereoOffsetHz: number;
  gain: CurvePattern;
  filterHz: CurvePattern;
  pan: CurvePattern;
  modulationRateHz?: number;
  modulationDepth?: number;
  pulseHz?: number;
  pulseDepth?: CurvePattern;
};

function fixed(value: number) {
  return Number(value.toFixed(3));
}

export function buildSectionTemplate(durationSec: number): PatternSectionDef[] {
  const introEnd = fixed(durationSec * 0.22);
  const bodyEnd = fixed(durationSec * 0.74);

  return [
    { id: "intro", startSec: 0, endSec: introEnd },
    { id: "body", startSec: introEnd, endSec: bodyEnd },
    { id: "release", startSec: bodyEnd, endSec: durationSec },
  ];
}

export function buildPlaybackSections(sectionDefs: PatternSectionDef[]): PlaybackSection[] {
  return sectionDefs.map((section) => ({
    endSec: section.endSec,
    id: section.id,
    startSec: section.startSec,
  }));
}

function createSectionPattern(
  intro: CurvePattern,
  body: CurvePattern,
  release: CurvePattern,
) {
  return sectionMap({
    body,
    intro,
    release,
  });
}

export function buildDroneVoiceSpec(
  recipe: AudioRecipe,
  layer: AudioRecipe["droneLayers"][number],
  index: number,
): VoicePlan {
  const basePan = [-0.22, 0, 0.22][index] ?? 0;
  const stereoOffsetHz = fixed(recipe.binauralOffsetHz * (index === 1 ? 1 : 0.55));
  const baseFilter = recipe.texture === "bright" ? 5200 : recipe.texture === "hazy" ? 2200 : 3600;
  const modulationRateHz = fixed(0.05 + recipe.stereoDriftHz * (0.28 + index * 0.08));

  return {
    id: `drone-${index + 1}`,
    role: "drone",
    frequencyHz: fixed(layer.freq),
    stereoOffsetHz,
    gain: createSectionPattern(
      ramp(layer.gain * 0.62, layer.gain * 0.9),
      ramp(layer.gain * 0.92, layer.gain * 1.12),
      ramp(layer.gain * 0.86, layer.gain * 0.54),
    ),
    filterHz: createSectionPattern(
      ramp(baseFilter * 0.8, baseFilter * 0.96),
      ramp(baseFilter * 1.02, baseFilter * 1.18),
      ramp(baseFilter * 0.98, baseFilter * 0.72),
    ),
    pan: blend(
      createSectionPattern(
        ramp(basePan * 0.5, basePan * 0.95),
        ramp(basePan * 0.96, basePan * 1.24),
        ramp(basePan * 0.92, basePan * 0.28),
      ),
      lfo({
        bias: 0,
        depth: Math.abs(basePan) * (0.04 + recipe.motionDepth * 0.08),
        rateHz: modulationRateHz * 0.5,
      }),
    ),
    modulationRateHz: fixed(modulationRateHz * 1.4),
    modulationDepth: fixed(layer.gain * (0.05 + recipe.motionDepth * 0.42)),
  };
}

export function buildHarmonicVoiceSpec(
  recipe: AudioRecipe,
  layer: AudioRecipe["droneLayers"][number],
  index: number,
): VoicePlan {
  const basePan = [-0.22, 0, 0.22][index] ?? 0;
  const stereoOffsetHz = fixed(recipe.binauralOffsetHz * (index === 1 ? 1.1 : 0.62));
  const baseFilter = recipe.texture === "bright" ? 5800 : recipe.texture === "hazy" ? 2500 : 4000;
  const modulationRateHz = fixed(0.07 + recipe.stereoDriftHz * (0.42 + index * 0.12));
  const harmonicBase = layer.gain * recipe.harmonicBlend * (index === 2 ? 0.36 : 0.28);

  return {
    id: `harmonic-${index + 1}`,
    role: "harmonic",
    frequencyHz: fixed(layer.freq * (index === 1 ? 1.5 : 2)),
    stereoOffsetHz,
    gain: createSectionPattern(
      ramp(harmonicBase * 0.18, harmonicBase * 0.54),
      ramp(harmonicBase * 0.86, harmonicBase * 1.24),
      ramp(harmonicBase * 0.44, harmonicBase * 0.12),
    ),
    filterHz: createSectionPattern(
      ramp(baseFilter * 0.9, baseFilter * 1.02),
      ramp(baseFilter * 1.06, baseFilter * 1.28),
      ramp(baseFilter * 1.02, baseFilter * 0.76),
    ),
    pan: blend(
      createSectionPattern(
        ramp(basePan * 0.58, basePan * 1.06),
        ramp(basePan * 1.02, basePan * 1.36),
        ramp(basePan * 1, basePan * 0.32),
      ),
      lfo({
        depth: Math.abs(basePan) * (0.08 + recipe.harmonicBlend * 0.12),
        rateHz: modulationRateHz * 0.6,
      }),
    ),
    modulationRateHz: fixed(modulationRateHz * 1.9),
    modulationDepth: fixed(layer.gain * (0.03 + recipe.harmonicBlend * 0.18)),
  };
}

export function buildPulseVoiceSpec(recipe: AudioRecipe): VoicePlan | null {
  if (!recipe.pulseHz) {
    return null;
  }

  return {
    id: "pulse",
    role: "pulse",
    frequencyHz: recipe.baseHz,
    stereoOffsetHz: fixed(recipe.binauralOffsetHz),
    gain: createSectionPattern(
      ramp(0.022, 0.03),
      ramp(0.036, 0.048),
      ramp(0.032, 0.016),
    ),
    filterHz: createSectionPattern(ramp(900, 1200), ramp(1200, 1600), ramp(1280, 760)),
    pan: sequence([
      { timeSec: 0, value: 0 },
      { timeSec: recipe.durationSec * 0.22, value: 0.12 },
      { timeSec: recipe.durationSec * 0.52, value: -0.16 },
      { timeSec: recipe.durationSec * 0.74, value: 0.08 },
      { timeSec: recipe.durationSec, value: -0.02 },
    ]),
    pulseHz: recipe.pulseHz,
    pulseDepth: createSectionPattern(
      ramp(0.08 + recipe.motionDepth * 0.08, 0.2 + recipe.motionDepth * 0.16),
      ramp(0.32 + recipe.motionDepth * 0.2, 0.54 + recipe.motionDepth * 0.24),
      ramp(0.18 + recipe.motionDepth * 0.14, 0.04),
    ),
  };
}

export function resolveAutomationCurve(pattern: CurvePattern, context: CycleContext): AutomationCurve {
  return {
    interpolation: "linear",
    points: resolveCurvePattern(pattern, context),
  };
}
