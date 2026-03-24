import OpenAI from "openai";

import { aiWishAnalysisSchema, buildFallbackWishAnalysis } from "@/entities/frequency";
import type { AiWishAnalysis } from "@/entities/frequency";
import { getServerEnv } from "@/shared/config/env";
import { parseJsonSafely } from "@/shared/lib/json";

const model = "gpt-4.1-mini";

let client: OpenAI | null = null;

function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: getServerEnv().OPENAI_API_KEY,
    });
  }

  return client;
}

export async function analyzeWishWithOpenAI(wish: string) {
  try {
    const response = await getClient().chat.completions.create({
      model,
      temperature: 0.8,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content:
            "당신은 소원 문장을 언어와 무관한 감정 엔진 입력으로 정규화하는 분석가입니다. 입력 언어는 무엇이든 될 수 있지만 emotionLabels, intent, imagery는 항상 한국어 canonical tag로 반환하세요. 출력은 반드시 JSON 하나만 반환하세요.",
        },
        {
          role: "user",
          content: `다음 소원을 분석해서 JSON으로 반환하세요.\n\n소원: ${wish}\n\n반드시 아래 구조를 지키세요:\n{\n  "wishEmotionProfile": {\n    "emotionLabels": ["문자열", "문자열", "문자열"],\n    "vad": {\n      "valence": 0~1 숫자,\n      "arousal": 0~1 숫자\n    },\n    "dominance": 0~1 숫자,\n    "intent": ["문자열", "문자열", "문자열"],\n    "imagery": ["문자열", "문자열", "문자열"],\n    "ambiguity": 0~1 숫자,\n    "confidence": 0~1 숫자,\n    "language": "ko | en | ja | mixed | 기타 짧은 코드"\n  },\n  "description": "감정 해석 의도를 설명하는 한국어 1문장"\n}\n\n규칙:\n- emotionLabels, intent, imagery는 입력 언어와 상관없이 항상 한국어 canonical tag로 반환하세요.\n- emotionLabels는 단일 감정이 아니라 복합 감정을 반영하세요.\n- 의료 효과를 주장하지 말고, 위험하거나 자극적인 방향은 피하세요.\n- 모호한 소원은 ambiguity를 높이고 confidence를 낮추세요.`,
        },
      ],
    });

    const rawContent = response.choices[0]?.message?.content ?? "";
    const parsed = parseJsonSafely<AiWishAnalysis>(rawContent);

    if (!parsed) {
      return buildFallbackWishAnalysis(wish);
    }

    return aiWishAnalysisSchema.parse(parsed);
  } catch {
    return buildFallbackWishAnalysis(wish);
  }
}
