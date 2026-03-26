import type { AudioRecipe } from "@/entities/frequency/model/frequency";

const SAMPLE_RATE = 44_100;
const OUTPUT_FILE = "vibra-output.mp3";

function fixed(value: number) {
  return Number(value.toFixed(3));
}

function buildChannelExpression(recipe: AudioRecipe, channelOffset: number) {
  const layers = recipe.droneLayers.map((layer, index) => {
    const frequency = fixed(layer.freq + channelOffset * (index === 1 ? 1 : 0.5));
    const driftRate = fixed(recipe.stereoDriftHz * (1 + index * 0.28));
    const driftPhase = fixed(channelOffset * 0.35 + index * 0.7);
    const harmonicFrequency = fixed(frequency * (index === 1 ? 1.5 : 2));
    const motionLayer =
      recipe.motionDepth > 0
        ? `+${fixed(layer.gain * recipe.motionDepth * 0.2)}*sin(2*PI*${frequency}*t)*sin(2*PI*${driftRate}*t+${driftPhase})`
        : "";
    const harmonicLayer =
      recipe.harmonicBlend > 0
        ? `+${fixed(layer.gain * recipe.harmonicBlend * (index === 2 ? 0.3 : 0.22))}*sin(2*PI*${harmonicFrequency}*t)`
        : "";

    return `${fixed(layer.gain)}*sin(2*PI*${frequency}*t)${motionLayer}${harmonicLayer}`;
  });

  if (recipe.pulseHz) {
    const pulseCarrier = fixed(recipe.baseHz + channelOffset);
    layers.push(
      `${fixed(0.03)}*sin(2*PI*${pulseCarrier}*t)*((sin(2*PI*${fixed(recipe.pulseHz)}*t)+1)/2)`,
    );
  }

  return layers.join("+");
}

function buildTextureFilters(recipe: AudioRecipe, delay: number, decay: number) {
  switch (recipe.texture) {
    case "bright":
      return [
        "highpass=f=90",
        "equalizer=f=2800:t=q:w=1.1:g=2.8",
        "equalizer=f=6400:t=q:w=0.8:g=2.2",
        `chorus=0.45:0.72:${fixed(24 + recipe.motionDepth * 26)}:0.22:0.3:${fixed(
          1.2 + recipe.stereoDriftHz * 8,
        )}`,
        `aecho=0.82:0.38:${Math.max(delay - 18, 28)}:${fixed(decay * 0.72)}`,
        "acompressor=threshold=-20dB:ratio=2.4:attack=12:release=180",
      ];
    case "hazy":
      return [
        "highpass=f=40",
        "lowpass=f=2200",
        "equalizer=f=720:t=q:w=1.3:g=-2.2",
        `chorus=0.55:0.88:${fixed(40 + recipe.motionDepth * 36)}:0.28:0.22:${fixed(
          0.6 + recipe.stereoDriftHz * 5,
        )}`,
        `aecho=0.84:0.58:${delay + 24}:${fixed(Math.min(decay * 1.18, 0.88))}`,
      ];
    case "balanced":
      return [
        "highpass=f=60",
        "lowpass=f=5400",
        "equalizer=f=1800:t=q:w=1.2:g=1.4",
        `aecho=0.8:0.45:${delay}:${fixed(decay * 0.9)}`,
        "acompressor=threshold=-21dB:ratio=2.8:attack=18:release=160",
      ];
    case "soft":
    default:
      return [
        "highpass=f=48",
        "lowpass=f=3400",
        "equalizer=f=2600:t=q:w=1.1:g=-1.4",
        `aecho=0.82:0.52:${delay + 10}:${fixed(Math.min(decay * 1.08, 0.84))}`,
      ];
  }
}

export function buildFfmpegArgs(recipe: AudioRecipe) {
  const leftExpression = buildChannelExpression(recipe, 0);
  const rightExpression = buildChannelExpression(recipe, recipe.binauralOffsetHz);
  const decay = fixed(0.18 + recipe.reverbMix * 0.45);
  const delay = Math.round(42 + recipe.reverbMix * 120);
  const fadeOutStart = Math.max(recipe.durationSec - recipe.fadeOutSec, 0);
  const filterChain = [
    ...buildTextureFilters(recipe, delay, decay),
    `volume=${fixed(1.12 + recipe.harmonicBlend * 0.25)}`,
    `afade=t=in:st=0:d=${recipe.fadeInSec}`,
    `afade=t=out:st=${fadeOutStart}:d=${recipe.fadeOutSec}`,
  ].join(",");

  return [
    "-f",
    "lavfi",
    "-i",
    `aevalsrc=${leftExpression}|${rightExpression}:s=${SAMPLE_RATE}:d=${recipe.durationSec}`,
    "-filter:a",
    filterChain,
    "-c:a",
    "libmp3lame",
    "-b:a",
    "192k",
    OUTPUT_FILE,
  ];
}

export function getOutputFileName() {
  return OUTPUT_FILE;
}
