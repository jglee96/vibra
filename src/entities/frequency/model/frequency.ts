import { z } from "zod";

const unitIntervalSchema = z.number().min(0).max(1);

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
  harmonicBlend: unitIntervalSchema,
  motionDepth: unitIntervalSchema,
  stereoDriftHz: z.number(),
  texture: z.enum(["soft", "balanced", "bright", "hazy"]),
});

export const vadSchema = z.object({
  valence: unitIntervalSchema,
  arousal: unitIntervalSchema,
});

export const wishEmotionProfileSchema = z.object({
  emotionLabels: z.array(z.string().min(1)).min(2).max(4),
  vad: vadSchema,
  dominance: unitIntervalSchema,
  intent: z.array(z.string().min(1)).min(2).max(4),
  imagery: z.array(z.string().min(1)).min(2).max(4),
  ambiguity: unitIntervalSchema,
  confidence: unitIntervalSchema,
  language: z.string().min(2).max(24),
});

export const regulationTargetSchema = z.enum(["soothe", "stabilize", "focus", "uplift"]);

export const musicControlProfileSchema = z.object({
  targetVad: vadSchema,
  tempoDensity: z.enum(["still", "steady", "flowing"]),
  modeColor: z.enum(["minor", "neutral", "open", "major"]),
  spectralBrightness: z.enum(["dim", "balanced", "bright"]),
  rhythmicPulse: z.enum(["none", "gentle", "steady"]),
  spaciousness: z.enum(["close", "open", "wide"]),
});

export const evidenceTraceSchema = z.object({
  source: z.enum(["lexical", "classifier", "llm_rationale", "regulation_rule"]),
  note: z.string().min(12).max(220),
  confidence: unitIntervalSchema,
});

export const aiWishAnalysisSchema = z.object({
  wishEmotionProfile: wishEmotionProfileSchema,
  description: z.string().min(20).max(180),
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
  harmonicBlend: unitIntervalSchema,
  motionDepth: unitIntervalSchema,
  stereoDriftHz: z.number(),
  texture: z.enum(["soft", "balanced", "bright", "hazy"]),
  fadeInSec: z.number(),
  fadeOutSec: z.number(),
});

export const frequencyResultSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  analysis: analysisSchema,
  description: z.string().min(20).max(180),
  listeningGuide: z.string(),
  wishEmotionProfile: wishEmotionProfileSchema,
  regulationTarget: regulationTargetSchema,
  musicControlProfile: musicControlProfileSchema,
  evidenceTrace: z.array(evidenceTraceSchema).min(2).max(8),
  audioRecipe: audioRecipeSchema,
  ffmpegArgs: z.array(z.string()),
});

export type Analysis = z.infer<typeof analysisSchema>;
export type AudioHints = z.infer<typeof audioHintSchema>;
export type AiWishAnalysis = z.infer<typeof aiWishAnalysisSchema>;
export type AudioRecipe = z.infer<typeof audioRecipeSchema>;
export type FrequencyResult = z.infer<typeof frequencyResultSchema>;
export type WishEmotionProfile = z.infer<typeof wishEmotionProfileSchema>;
export type RegulationTarget = z.infer<typeof regulationTargetSchema>;
export type MusicControlProfile = z.infer<typeof musicControlProfileSchema>;
export type EvidenceTrace = z.infer<typeof evidenceTraceSchema>;
export type Vad = z.infer<typeof vadSchema>;
