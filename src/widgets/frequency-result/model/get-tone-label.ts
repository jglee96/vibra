import type { Analysis, AudioRecipe } from "@/entities/frequency";

const toneLabelMap: Record<Analysis["tone"], string> = {
  calm: "고요한 정렬",
  grounding: "단단한 중심",
  mystic: "신비로운 잔광",
  uplifting: "부드러운 상승",
};

export function getToneLabel(tone: Analysis["tone"]) {
  return toneLabelMap[tone];
}

export function getEnergyLabel(energy: Analysis["energy"]) {
  return energy === "medium" ? "중간 결" : "낮은 결";
}

export function getRecipeSummary(recipe: AudioRecipe) {
  return `${recipe.durationSec / 60}분 · ${recipe.baseHz.toFixed(0)}Hz 중심`;
}
