import type { AudioRecipe } from "@/entities/frequency/model/frequency";
import type { PatternSectionDef, PlaybackInput } from "@/entities/frequency/lib/pattern-core";
import {
  blend,
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
  oscillatorType: OscillatorType;
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

function getTargetShape(input: PlaybackInput) {
  const arousal = input.musicControlProfile.targetVad.arousal;
  const brightness = input.musicControlProfile.spectralBrightness;
  const pulseMode = input.musicControlProfile.rhythmicPulse;

  switch (input.regulationTarget) {
    case "soothe":
      return {
        dronePitchScale: 0.78,
        filterScale: brightness === "dim" ? 0.72 : 0.82,
        harmonicMultiplier: 0.78,
        harmonicPresence: 0.48,
        harmonicOscillator: "sine" as const,
        motionScale: 0.38,
        panSpread: 0.52,
        pulseGainBoost: pulseMode === "none" ? 0.1 : 0.32,
        pulseOscillator: "sine" as const,
        rootOscillator: "sine" as const,
      };
    case "focus":
      return {
        dronePitchScale: 1.02,
        filterScale: 1.08,
        harmonicMultiplier: 1.14,
        harmonicPresence: 0.92,
        harmonicOscillator: "triangle" as const,
        motionScale: 0.82,
        panSpread: 0.86,
        pulseGainBoost: pulseMode === "steady" ? 1.08 : 0.84,
        pulseOscillator: "triangle" as const,
        rootOscillator: "triangle" as const,
      };
    case "uplift":
      return {
        dronePitchScale: 1.34 + arousal * 0.12,
        filterScale: 1.28,
        harmonicMultiplier: 1.62,
        harmonicPresence: 1.34,
        harmonicOscillator: "sawtooth" as const,
        motionScale: 1.38,
        panSpread: 1.42,
        pulseGainBoost: pulseMode === "steady" ? 1.88 : 1.42,
        pulseOscillator: "square" as const,
        rootOscillator: "triangle" as const,
      };
    case "stabilize":
    default:
      return {
        dronePitchScale: 0.94,
        filterScale: 0.94,
        harmonicMultiplier: 0.96,
        harmonicPresence: 0.82,
        harmonicOscillator: "sine" as const,
        motionScale: 0.66,
        panSpread: 0.72,
        pulseGainBoost: pulseMode === "none" ? 0.4 : 0.72,
        pulseOscillator: "sine" as const,
        rootOscillator: "sine" as const,
      };
  }
}

function getProfileShape(input: PlaybackInput) {
  const targetShape = getTargetShape(input);

  switch (input.audioRecipe.texture) {
    case "bright":
      return {
        droneMultiplier: fixed(1.18 * targetShape.dronePitchScale),
        filterScale: fixed(1.14 * targetShape.filterScale),
        harmonicMultiplier: fixed(1.28 * targetShape.harmonicMultiplier),
        harmonicPresence: fixed(1.08 * targetShape.harmonicPresence),
        harmonicOscillator: targetShape.harmonicOscillator,
        motionScale: fixed(1.16 * targetShape.motionScale),
        panSpread: fixed(1.22 * targetShape.panSpread),
        pulseGainBoost: fixed(1.34 * targetShape.pulseGainBoost),
        pulseOscillator: targetShape.pulseOscillator,
        rootOscillator: targetShape.rootOscillator,
      };
    case "balanced":
      return {
        droneMultiplier: fixed(1.02 * targetShape.dronePitchScale),
        filterScale: fixed(1 * targetShape.filterScale),
        harmonicMultiplier: fixed(1.06 * targetShape.harmonicMultiplier),
        harmonicPresence: fixed(1 * targetShape.harmonicPresence),
        harmonicOscillator: targetShape.harmonicOscillator,
        motionScale: fixed(1 * targetShape.motionScale),
        panSpread: fixed(1 * targetShape.panSpread),
        pulseGainBoost: fixed(1 * targetShape.pulseGainBoost),
        pulseOscillator: targetShape.pulseOscillator,
        rootOscillator: targetShape.rootOscillator,
      };
    case "hazy":
      return {
        droneMultiplier: fixed(0.84 * targetShape.dronePitchScale),
        filterScale: fixed(0.72 * targetShape.filterScale),
        harmonicMultiplier: fixed(0.88 * targetShape.harmonicMultiplier),
        harmonicPresence: fixed(0.82 * targetShape.harmonicPresence),
        harmonicOscillator: "sine" as const,
        motionScale: fixed(0.82 * targetShape.motionScale),
        panSpread: fixed(0.78 * targetShape.panSpread),
        pulseGainBoost: fixed(0.72 * targetShape.pulseGainBoost),
        pulseOscillator: "sine" as const,
        rootOscillator: "sine" as const,
      };
    case "soft":
    default:
      return {
        droneMultiplier: fixed(0.9 * targetShape.dronePitchScale),
        filterScale: fixed(0.84 * targetShape.filterScale),
        harmonicMultiplier: fixed(0.92 * targetShape.harmonicMultiplier),
        harmonicPresence: fixed(0.84 * targetShape.harmonicPresence),
        harmonicOscillator:
          input.regulationTarget === "uplift" ? targetShape.harmonicOscillator : ("sine" as const),
        motionScale: fixed(0.86 * targetShape.motionScale),
        panSpread: fixed(0.84 * targetShape.panSpread),
        pulseGainBoost: fixed(0.82 * targetShape.pulseGainBoost),
        pulseOscillator: targetShape.pulseOscillator,
        rootOscillator: targetShape.rootOscillator,
      };
  }
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
  input: PlaybackInput,
  layer: AudioRecipe["droneLayers"][number],
  index: number,
): VoicePlan {
  const recipe = input.audioRecipe;
  const profileShape = getProfileShape(input);
  const basePan = [-0.22, 0, 0.22][index] ?? 0;
  const stereoOffsetHz = fixed(recipe.binauralOffsetHz * (index === 1 ? 1 : 0.55));
  const baseFilter = fixed(
    (recipe.texture === "bright" ? 5200 : recipe.texture === "hazy" ? 2200 : 3600) *
      profileShape.filterScale,
  );
  const modulationRateHz = fixed(
    (0.04 + recipe.stereoDriftHz * (0.24 + index * 0.08)) * profileShape.motionScale,
  );

  return {
    id: `drone-${index + 1}`,
    role: "drone",
    oscillatorType: profileShape.rootOscillator,
    frequencyHz: fixed(layer.freq * profileShape.droneMultiplier),
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
        depth: Math.abs(basePan) * profileShape.panSpread * (0.04 + recipe.motionDepth * 0.08),
        rateHz: modulationRateHz * 0.5,
      }),
    ),
    modulationRateHz: fixed(modulationRateHz * 1.4),
    modulationDepth: fixed(
      layer.gain * (0.035 + recipe.motionDepth * 0.42) * profileShape.motionScale,
    ),
  };
}

export function buildHarmonicVoiceSpec(
  input: PlaybackInput,
  layer: AudioRecipe["droneLayers"][number],
  index: number,
): VoicePlan {
  const recipe = input.audioRecipe;
  const profileShape = getProfileShape(input);
  const basePan = [-0.22, 0, 0.22][index] ?? 0;
  const stereoOffsetHz = fixed(recipe.binauralOffsetHz * (index === 1 ? 1.1 : 0.62));
  const baseFilter = fixed(
    (recipe.texture === "bright" ? 5800 : recipe.texture === "hazy" ? 2500 : 4000) *
      profileShape.filterScale,
  );
  const modulationRateHz = fixed(
    (0.06 + recipe.stereoDriftHz * (0.34 + index * 0.12)) * profileShape.motionScale,
  );
  const harmonicBase =
    layer.gain *
    recipe.harmonicBlend *
    profileShape.harmonicPresence *
    (index === 2 ? 0.36 : 0.28);

  return {
    id: `harmonic-${index + 1}`,
    role: "harmonic",
    oscillatorType: profileShape.harmonicOscillator,
    frequencyHz: fixed(layer.freq * (index === 1 ? 1.5 : 2) * profileShape.harmonicMultiplier),
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
        depth:
          Math.abs(basePan) *
          profileShape.panSpread *
          (0.08 + recipe.harmonicBlend * 0.12),
        rateHz: modulationRateHz * 0.6,
      }),
    ),
    modulationRateHz: fixed(modulationRateHz * 1.9),
    modulationDepth: fixed(
      layer.gain * (0.02 + recipe.harmonicBlend * 0.2) * profileShape.motionScale,
    ),
  };
}

export function buildPulseVoiceSpec(input: PlaybackInput): VoicePlan | null {
  const recipe = input.audioRecipe;
  if (!recipe.pulseHz) {
    return null;
  }

  const profileShape = getProfileShape(input);
  const pulseRateBoost =
    input.musicControlProfile.rhythmicPulse === "steady"
      ? 1.18
      : input.musicControlProfile.rhythmicPulse === "gentle"
        ? 0.94
        : 0.72;

  return {
    id: "pulse",
    role: "pulse",
    oscillatorType: profileShape.pulseOscillator,
    frequencyHz: fixed(recipe.baseHz * profileShape.droneMultiplier * 1.08),
    stereoOffsetHz: fixed(recipe.binauralOffsetHz),
    gain: createSectionPattern(
      ramp(0.022 * profileShape.pulseGainBoost, 0.03 * profileShape.pulseGainBoost),
      ramp(0.036 * profileShape.pulseGainBoost, 0.048 * profileShape.pulseGainBoost),
      ramp(0.032 * profileShape.pulseGainBoost, 0.016 * profileShape.pulseGainBoost),
    ),
    filterHz: createSectionPattern(ramp(900, 1200), ramp(1200, 1600), ramp(1280, 760)),
    pan: sequence([
      { timeSec: 0, value: 0 },
      { timeSec: recipe.durationSec * 0.22, value: 0.12 },
      { timeSec: recipe.durationSec * 0.52, value: -0.16 },
      { timeSec: recipe.durationSec * 0.74, value: 0.08 },
      { timeSec: recipe.durationSec, value: -0.02 },
    ]),
    pulseHz: fixed(recipe.pulseHz * pulseRateBoost),
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
