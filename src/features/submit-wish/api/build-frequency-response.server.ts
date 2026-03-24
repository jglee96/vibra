import {
  buildFfmpegArgs,
  buildFrequencySubtitle,
  buildFrequencyTitle,
  normalizeAudioRecipe,
} from "@/entities/frequency";
import { reviewWish } from "@/entities/wish";
import { AppError } from "@/shared/lib/errors";

import { analyzeWishWithOpenAI } from "@/features/submit-wish/api/analyze-wish.server";

export async function buildFrequencyResponse(wish: string) {
  const wishReview = reviewWish(wish);

  if (wishReview.kind === "blocked") {
    throw new AppError(wishReview.message, 422, "UNSAFE_WISH");
  }

  if (wishReview.kind === "needs-clarity") {
    throw new AppError(wishReview.message, 422, "WISH_NEEDS_CLARITY");
  }

  const aiAnalysis = await analyzeWishWithOpenAI(wishReview.normalizedWish);
  const audioRecipe = normalizeAudioRecipe(aiAnalysis.audioHints);

  return {
    title: buildFrequencyTitle(wishReview.normalizedWish),
    subtitle: buildFrequencySubtitle(aiAnalysis.analysis),
    analysis: aiAnalysis.analysis,
    listeningGuide: aiAnalysis.listeningGuide,
    audioRecipe,
    ffmpegArgs: buildFfmpegArgs(audioRecipe),
  };
}
