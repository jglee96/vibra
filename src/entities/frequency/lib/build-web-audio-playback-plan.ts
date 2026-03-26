import type { AudioRecipe } from "@/entities/frequency/model/frequency";

export type PlaybackSection = {
  id: "intro" | "body" | "release";
  startSec: number;
  endSec: number;
  gainScale: number;
  brightness: number;
  panSpread: number;
  pulseDepth: number;
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
  gain: AutomationCurve;
  filterHz: AutomationCurve;
  pan: AutomationCurve;
  modulationRateHz?: number;
  modulationDepth?: number;
  pulseHz?: number;
  pulseDepth?: AutomationCurve;
};

export type EffectBusPlan = {
  masterGain: number;
  highpassHz: number;
  lowpassHz: number;
  delayTimeSec: number;
  delayFeedback: number;
  delayMix: number;
  compressor: {
    attack: number;
    knee: number;
    ratio: number;
    release: number;
    threshold: number;
  };
};

export type WebAudioPlaybackPlan = {
  durationSec: number;
  sections: PlaybackSection[];
  voices: VoicePlan[];
  effectBus: EffectBusPlan;
};

function fixed(value: number) {
  return Number(value.toFixed(3));
}

function buildSections(durationSec: number): PlaybackSection[] {
  const introEnd = fixed(durationSec * 0.22);
  const bodyEnd = fixed(durationSec * 0.74);

  return [
    {
      id: "intro",
      startSec: 0,
      endSec: introEnd,
      gainScale: 0.82,
      brightness: -0.18,
      panSpread: 0.8,
      pulseDepth: 0.42,
    },
    {
      id: "body",
      startSec: introEnd,
      endSec: bodyEnd,
      gainScale: 1,
      brightness: 0.14,
      panSpread: 1,
      pulseDepth: 1,
    },
    {
      id: "release",
      startSec: bodyEnd,
      endSec: durationSec,
      gainScale: 0.74,
      brightness: -0.28,
      panSpread: 0.6,
      pulseDepth: 0.28,
    },
  ];
}

function buildCurve(
  sections: PlaybackSection[],
  buildValue: (section: PlaybackSection, index: number) => number,
): AutomationCurve {
  const points = sections.flatMap((section, index) => {
    const value = fixed(buildValue(section, index));

    return [
      { timeSec: section.startSec, value },
      { timeSec: section.endSec, value },
    ];
  });

  return {
    interpolation: "linear",
    points,
  };
}

function getTextureBus(texture: AudioRecipe["texture"]): EffectBusPlan {
  switch (texture) {
    case "bright":
      return {
        masterGain: 0.8,
        highpassHz: 90,
        lowpassHz: 6200,
        delayTimeSec: 0.18,
        delayFeedback: 0.26,
        delayMix: 0.16,
        compressor: {
          attack: 0.012,
          knee: 12,
          ratio: 2.4,
          release: 0.18,
          threshold: -20,
        },
      };
    case "hazy":
      return {
        masterGain: 0.88,
        highpassHz: 40,
        lowpassHz: 2400,
        delayTimeSec: 0.24,
        delayFeedback: 0.34,
        delayMix: 0.2,
        compressor: {
          attack: 0.018,
          knee: 18,
          ratio: 2,
          release: 0.24,
          threshold: -21,
        },
      };
    case "balanced":
      return {
        masterGain: 0.84,
        highpassHz: 60,
        lowpassHz: 5200,
        delayTimeSec: 0.16,
        delayFeedback: 0.22,
        delayMix: 0.14,
        compressor: {
          attack: 0.018,
          knee: 12,
          ratio: 2.6,
          release: 0.16,
          threshold: -21,
        },
      };
    case "soft":
    default:
      return {
        masterGain: 0.86,
        highpassHz: 48,
        lowpassHz: 3400,
        delayTimeSec: 0.19,
        delayFeedback: 0.24,
        delayMix: 0.12,
        compressor: {
          attack: 0.018,
          knee: 10,
          ratio: 2.2,
          release: 0.2,
          threshold: -22,
        },
      };
  }
}

export function buildWebAudioPlaybackPlan(recipe: AudioRecipe): WebAudioPlaybackPlan {
  const sections = buildSections(recipe.durationSec);
  const basePan = [-0.22, 0, 0.22];
  const baseFilter = recipe.texture === "bright" ? 5200 : recipe.texture === "hazy" ? 2200 : 3600;
  const voices: VoicePlan[] = [];

  recipe.droneLayers.forEach((layer, index) => {
    const panCenter = basePan[index] ?? 0;
    const stereoOffsetHz = fixed(recipe.binauralOffsetHz * (index === 1 ? 1 : 0.55));
    const modulationRateHz = fixed(0.05 + recipe.stereoDriftHz * (0.28 + index * 0.08));

    voices.push({
      id: `drone-${index + 1}`,
      role: "drone",
      frequencyHz: fixed(layer.freq),
      stereoOffsetHz,
      gain: buildCurve(sections, (section) => layer.gain * section.gainScale),
      filterHz: buildCurve(
        sections,
        (section) => baseFilter * (1 + section.brightness * 0.35 + recipe.motionDepth * 0.08),
      ),
      pan: buildCurve(sections, (section) => panCenter * section.panSpread),
      modulationRateHz,
      modulationDepth: fixed(layer.gain * recipe.motionDepth * 0.22),
    });

    voices.push({
      id: `harmonic-${index + 1}`,
      role: "harmonic",
      frequencyHz: fixed(layer.freq * (index === 1 ? 1.5 : 2)),
      stereoOffsetHz: fixed(stereoOffsetHz * 1.1),
      gain: buildCurve(
        sections,
        (section) =>
          layer.gain *
          recipe.harmonicBlend *
          (index === 2 ? 0.28 : 0.2) *
          (section.id === "body" ? 1 : section.id === "intro" ? 0.48 : 0.32),
      ),
      filterHz: buildCurve(
        sections,
        (section) => baseFilter * (1.12 + section.brightness * 0.42),
      ),
      pan: buildCurve(sections, (section) => panCenter * section.panSpread * 1.15),
      modulationRateHz: fixed(modulationRateHz * 1.2),
      modulationDepth: fixed(layer.gain * recipe.harmonicBlend * 0.06),
    });
  });

  if (recipe.pulseHz) {
    voices.push({
      id: "pulse",
      role: "pulse",
      frequencyHz: recipe.baseHz,
      stereoOffsetHz: fixed(recipe.binauralOffsetHz),
      gain: buildCurve(sections, () => 0.03),
      filterHz: buildCurve(sections, (section) => 1400 * (1 + section.brightness * 0.2)),
      pan: buildCurve(sections, () => 0),
      pulseHz: recipe.pulseHz,
      pulseDepth: buildCurve(
        sections,
        (section) => (0.46 + recipe.motionDepth * 0.2) * section.pulseDepth,
      ),
    });
  }

  return {
    durationSec: recipe.durationSec,
    sections,
    voices,
    effectBus: getTextureBus(recipe.texture),
  };
}
