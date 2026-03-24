import type { AudioRecipe } from "@/entities/frequency/model/frequency";

const SAMPLE_RATE = 44_100;
const OUTPUT_FILE = "vibra-output.mp3";

function fixed(value: number) {
  return Number(value.toFixed(3));
}

function buildChannelExpression(recipe: AudioRecipe, channelOffset: number) {
  const layers = recipe.droneLayers.map((layer, index) => {
    const frequency = fixed(layer.freq + channelOffset * (index === 1 ? 1 : 0.5));

    return `${fixed(layer.gain)}*sin(2*PI*${frequency}*t)`;
  });

  if (recipe.pulseHz) {
    const pulseCarrier = fixed(recipe.baseHz + channelOffset);
    layers.push(
      `${fixed(0.03)}*sin(2*PI*${pulseCarrier}*t)*((sin(2*PI*${fixed(recipe.pulseHz)}*t)+1)/2)`,
    );
  }

  return layers.join("+");
}

export function buildFfmpegArgs(recipe: AudioRecipe) {
  const leftExpression = buildChannelExpression(recipe, 0);
  const rightExpression = buildChannelExpression(recipe, recipe.binauralOffsetHz);
  const decay = fixed(0.18 + recipe.reverbMix * 0.45);
  const delay = Math.round(42 + recipe.reverbMix * 120);
  const fadeOutStart = Math.max(recipe.durationSec - recipe.fadeOutSec, 0);

  return [
    "-f",
    "lavfi",
    "-i",
    `aevalsrc=${leftExpression}|${rightExpression}:s=${SAMPLE_RATE}:d=${recipe.durationSec}`,
    "-filter:a",
    `aecho=0.8:0.55:${delay}:${decay},volume=1.35,afade=t=in:st=0:d=${recipe.fadeInSec},afade=t=out:st=${fadeOutStart}:d=${recipe.fadeOutSec}`,
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
