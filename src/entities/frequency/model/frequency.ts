import { z } from "zod";

export const analysisSchema = z.object({
  moodKeywords: z.array(z.string().min(1)).min(2).max(4),
  intentKeywords: z.array(z.string().min(1)).min(2).max(4),
  tone: z.enum(["calm", "uplifting", "grounding", "mystic"]),
  energy: z.enum(["low", "medium"]),
  imagery: z.array(z.string().min(1)).min(2).max(4),
});

export const audioHintSchema = z.object({
  baseHz: z.number(),
  binauralOffsetHz: z.number(),
  pulseHz: z.number().optional(),
  reverbMix: z.number(),
  droneWeights: z.array(z.number()).length(3),
});

export const aiWishAnalysisSchema = z.object({
  analysis: analysisSchema,
  description: z.string().min(20).max(180),
  listeningGuide: z.string().min(20).max(180),
  audioHints: audioHintSchema,
});

export const droneLayerSchema = z.object({
  wave: z.literal("sine"),
  freq: z.number(),
  gain: z.number(),
});

export const audioRecipeSchema = z.object({
  durationSec: z.literal(180),
  baseHz: z.number(),
  binauralOffsetHz: z.number(),
  droneLayers: z.array(droneLayerSchema).length(3),
  pulseHz: z.number().optional(),
  reverbMix: z.number(),
  fadeInSec: z.number(),
  fadeOutSec: z.number(),
});

export const frequencyResultSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  analysis: analysisSchema,
  listeningGuide: z.string(),
  audioRecipe: audioRecipeSchema,
  ffmpegArgs: z.array(z.string()),
});

export type Analysis = z.infer<typeof analysisSchema>;
export type AiWishAnalysis = z.infer<typeof aiWishAnalysisSchema>;
export type AudioRecipe = z.infer<typeof audioRecipeSchema>;
export type FrequencyResult = z.infer<typeof frequencyResultSchema>;
