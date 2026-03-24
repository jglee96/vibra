import OpenAI from "openai";

import { aiWishAnalysisSchema } from "@/entities/frequency";
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

function fallbackAnalysis(wish: string): AiWishAnalysis {
  const includesLove = /연애|매력|인기|호감/.test(wish);
  const includesFocus = /집중|합격|공부|성과/.test(wish);
  const tone = includesLove ? "mystic" : includesFocus ? "grounding" : "calm";

  return {
    analysis: {
      moodKeywords: includesLove ? ["은은함", "자신감", "여운"] : ["고요함", "안정감", "호흡"],
      intentKeywords: includesLove
        ? ["매력", "시선", "부드러운 존재감"]
        : ["집중", "또렷함", "차분한 지속력"],
      tone,
      energy: "low",
      imagery: includesLove
        ? ["달빛", "잔광", "부드러운 울림"]
        : ["새벽 공기", "잔잔한 물결", "깊은 호흡"],
    },
    description: includesLove
      ? "소원을 둘러싼 매력과 여운을 천천히 끌어올리는 방향으로 감정을 해석했어요."
      : "소원의 중심을 흐트러뜨리지 않도록 차분하고 안정적인 결로 감정을 정리했어요.",
    listeningGuide: includesFocus
      ? "공부나 작업을 시작하기 전, 호흡을 천천히 맞추며 들으면 더 자연스럽게 몰입할 수 있어요."
      : "잠들기 전이나 하루의 리듬을 정리하고 싶을 때, 조용한 공간에서 낮은 볼륨으로 들어보세요.",
    audioHints: {
      baseHz: includesLove ? 142 : includesFocus ? 128 : 118,
      binauralOffsetHz: includesLove ? 4.2 : 3.2,
      pulseHz: includesFocus ? 0.22 : 0.12,
      reverbMix: includesLove ? 0.22 : 0.16,
      droneWeights: includesLove ? [0.09, 0.17, 0.08] : [0.11, 0.15, 0.07],
    },
  };
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
            "당신은 한국어 소원을 신비롭고 안정적인 명상 오디오 설계 데이터로 바꾸는 디렉터입니다. 출력은 반드시 JSON 하나만 반환하세요.",
        },
        {
          role: "user",
          content: `다음 소원을 분석해서 JSON으로 반환하세요.\n\n소원: ${wish}\n\n반드시 아래 구조를 지키세요:\n{\n  "analysis": {\n    "moodKeywords": ["문자열", "문자열", "문자열"],\n    "intentKeywords": ["문자열", "문자열", "문자열"],\n    "tone": "calm | uplifting | grounding | mystic",\n    "energy": "low | medium",\n    "imagery": ["문자열", "문자열", "문자열"]\n  },\n  "description": "분석 의도를 설명하는 1문장",\n  "listeningGuide": "추천 청취 상황을 설명하는 1문장",\n  "audioHints": {\n    "baseHz": 108~196 사이 숫자,\n    "binauralOffsetHz": 1.5~8 사이 숫자,\n    "pulseHz": 0.08~0.6 사이 숫자 또는 생략,\n    "reverbMix": 0.08~0.28 사이 숫자,\n    "droneWeights": [0.04~0.22, 0.04~0.22, 0.04~0.22]\n  }\n}\n\n분위기는 신비롭고 안정적이어야 하며, 과장된 의학적 표현이나 위험한 표현은 피하세요.`,
        },
      ],
    });

    const rawContent = response.choices[0]?.message?.content ?? "";
    const parsed = parseJsonSafely<AiWishAnalysis>(rawContent);

    if (!parsed) {
      return fallbackAnalysis(wish);
    }

    return aiWishAnalysisSchema.parse(parsed);
  } catch {
    return fallbackAnalysis(wish);
  }
}
