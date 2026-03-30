import type { AudioHints, AudioRecipe } from "@/entities/frequency/model/frequency";
import { clamp } from "@/shared/lib/clamp";

function rounded(value: number) {
  return Number(value.toFixed(3));
}

export function normalizeAudioRecipe(input: AudioHints): AudioRecipe {
  const baseHz = rounded(clamp(input.baseHz, 84, 248));
  const binauralOffsetHz = rounded(clamp(input.binauralOffsetHz, 1.5, 8));
  const pulseHz =
    input.pulseHz === undefined ? undefined : rounded(clamp(input.pulseHz, 0.08, 0.92));
  const reverbMix = rounded(clamp(input.reverbMix, 0.08, 0.28));
  const weights = input.droneWeights.map((weight) => clamp(weight, 0.04, 0.22));
  const harmonicBlend = rounded(clamp(input.harmonicBlend, 0.08, 0.72));
  const motionDepth = rounded(clamp(input.motionDepth, 0.08, 0.72));
  const stereoDriftHz = rounded(clamp(input.stereoDriftHz, 0.04, 0.24));

  return {
    durationSec: 180,
    baseHz,
    binauralOffsetHz,
    droneLayers: [
      { wave: "sine", freq: rounded(baseHz / 2), gain: rounded(weights[0]) },
      { wave: "sine", freq: rounded(baseHz), gain: rounded(weights[1]) },
      { wave: "sine", freq: rounded(baseHz * 1.498), gain: rounded(weights[2]) },
    ],
    pulseHz,
    reverbMix,
    harmonicBlend,
    motionDepth,
    stereoDriftHz,
    texture: input.texture,
    fadeInSec: 8,
    fadeOutSec: 12,
  };
}
