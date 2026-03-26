import type {
  AiWishAnalysis,
  Analysis,
  AudioHints,
  EvidenceTrace,
  MusicControlProfile,
  RegulationTarget,
  WishEmotionProfile,
} from "@/entities/frequency/model/frequency";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, Number(value.toFixed(3))));
}

function uniqueStrings(values: string[], fallback: string[]) {
  const normalized = values.map((value) => value.trim()).filter(Boolean);
  const deduped = Array.from(new Set(normalized));

  return deduped.length >= 2 ? deduped.slice(0, 4) : fallback;
}

function inferLanguage(wish: string) {
  if (/[가-힣]/.test(wish) && /[A-Za-z]/.test(wish)) {
    return "mixed";
  }

  if (/[가-힣]/.test(wish)) {
    return "ko";
  }

  if (/[A-Za-z]/.test(wish)) {
    return "en";
  }

  return "unknown";
}

function createFallbackProfile(wish: string): WishEmotionProfile {
  const normalizedWish = wish.trim();
  const lowerWish = normalizedWish.toLowerCase();
  const includesLove = /연애|매력|인기|호감|love|romance|relationship|attract|charisma/i.test(wish);
  const includesFocus = /집중|합격|공부|성과|focus|study|exam|work|flow|performance/i.test(wish);
  const includesAnxiety = /불안|초조|긴장|걱정|stress|anxious|anxiety|nervous/i.test(wish);
  const includesLowMood = /우울|가라앉|무기력|슬픔|depress|sad|empty|drained/i.test(lowerWish);

  if (includesFocus) {
    return {
      emotionLabels: includesAnxiety ? ["긴장감", "의지", "선명함"] : ["집중감", "의지", "차분함"],
      vad: {
        valence: includesAnxiety ? 0.44 : 0.58,
        arousal: includesAnxiety ? 0.68 : 0.54,
      },
      dominance: includesAnxiety ? 0.46 : 0.66,
      intent: ["집중", "흐름", "지속력"],
      imagery: ["새벽 공기", "정돈된 책상", "고른 호흡"],
      ambiguity: 0.18,
      confidence: 0.72,
      language: inferLanguage(wish),
    };
  }

  if (includesAnxiety) {
    return {
      emotionLabels: ["불안", "경계심", "안정 욕구"],
      vad: {
        valence: 0.28,
        arousal: 0.82,
      },
      dominance: 0.3,
      intent: ["안정", "호흡", "회복"],
      imagery: ["잔잔한 물결", "느린 숨", "희미한 새벽빛"],
      ambiguity: 0.24,
      confidence: 0.74,
      language: inferLanguage(wish),
    };
  }

  if (includesLowMood) {
    return {
      emotionLabels: ["무거움", "회복 욕구", "잔잔한 희망"],
      vad: {
        valence: 0.24,
        arousal: 0.26,
      },
      dominance: 0.22,
      intent: ["정리", "회복", "균형"],
      imagery: ["고요한 방", "희미한 파문", "따뜻한 숨"],
      ambiguity: 0.34,
      confidence: 0.66,
      language: inferLanguage(wish),
    };
  }

  if (includesLove) {
    return {
      emotionLabels: ["은은함", "기대감", "자신감"],
      vad: {
        valence: 0.68,
        arousal: 0.48,
      },
      dominance: 0.58,
      intent: ["매력", "존재감", "부드러운 연결"],
      imagery: ["달빛", "안개", "잔광"],
      ambiguity: 0.16,
      confidence: 0.7,
      language: inferLanguage(wish),
    };
  }

  return {
    emotionLabels: ["고요함", "안정감", "정리 욕구"],
    vad: {
      valence: 0.48,
      arousal: 0.34,
    },
    dominance: 0.56,
    intent: ["균형", "호흡", "정돈"],
    imagery: ["새벽 공기", "잔잔한 물결", "고른 숨"],
    ambiguity: 0.22,
    confidence: 0.62,
    language: inferLanguage(wish),
  };
}

export function buildFallbackWishAnalysis(wish: string): AiWishAnalysis {
  const wishEmotionProfile = createFallbackProfile(wish);
  const description =
    wishEmotionProfile.vad.arousal > 0.65
      ? "감정의 긴장을 먼저 낮추고 안정감을 회복하는 방향으로 소원을 정리했어요."
      : wishEmotionProfile.intent.includes("집중")
        ? "산만함을 줄이고 또렷한 흐름을 만드는 방향으로 감정을 구조화했어요."
        : "소원의 중심이 흐트러지지 않도록 차분한 감정 축으로 정리했어요.";

  return {
    wishEmotionProfile,
    description,
  };
}

function normalizeWishEmotionProfile(
  profile: WishEmotionProfile,
  wish: string,
): WishEmotionProfile {
  const fallbackProfile = createFallbackProfile(wish);
  const emotionLabels = uniqueStrings(profile.emotionLabels, fallbackProfile.emotionLabels);
  const intent = uniqueStrings(profile.intent, fallbackProfile.intent);
  const imagery = uniqueStrings(profile.imagery, fallbackProfile.imagery);

  return {
    emotionLabels,
    vad: {
      valence: clamp01(profile.vad.valence),
      arousal: clamp01(profile.vad.arousal),
    },
    dominance: clamp01(profile.dominance),
    intent,
    imagery,
    ambiguity: clamp01(profile.ambiguity),
    confidence: clamp01(profile.confidence),
    language: profile.language.trim() || inferLanguage(wish),
  };
}

function selectRegulationTarget(profile: WishEmotionProfile, wish: string): RegulationTarget {
  const normalizedWish = wish.toLowerCase();
  const joinedSignals = `${normalizedWish} ${profile.intent.join(" ")} ${profile.emotionLabels.join(" ")}`;
  const seeksFocus = /집중|공부|합격|작업|성과|focus|study|exam|work|flow|performance/.test(
    joinedSignals,
  );
  const lowValence = profile.vad.valence < 0.42;
  const highArousal = profile.vad.arousal > 0.65;
  const lowArousal = profile.vad.arousal < 0.33;
  const lowDominance = profile.dominance < 0.4;

  if (seeksFocus) {
    return "focus";
  }

  if (highArousal && lowValence) {
    return profile.ambiguity > 0.45 ? "stabilize" : "soothe";
  }

  if (lowValence && lowArousal && lowDominance) {
    return "stabilize";
  }

  if (lowValence) {
    return "uplift";
  }

  return profile.vad.arousal > 0.56 ? "stabilize" : "soothe";
}

function blendTowardTarget(current: number, target: number, weight: number) {
  return clamp01(current * (1 - weight) + target * weight);
}

function buildMusicControlProfile(
  profile: WishEmotionProfile,
  regulationTarget: RegulationTarget,
): MusicControlProfile {
  const anchors: Record<RegulationTarget, { valence: number; arousal: number }> = {
    soothe: { valence: 0.58, arousal: 0.28 },
    stabilize: { valence: 0.5, arousal: 0.38 },
    focus: { valence: 0.62, arousal: 0.54 },
    uplift: { valence: 0.72, arousal: 0.46 },
  };

  const anchor = anchors[regulationTarget];
  const targetVad = {
    valence: blendTowardTarget(profile.vad.valence, anchor.valence, 0.55),
    arousal: blendTowardTarget(profile.vad.arousal, anchor.arousal, 0.62),
  };

  const tempoDensity =
    regulationTarget === "focus" ? "flowing" : targetVad.arousal < 0.34 ? "still" : "steady";
  const modeColor =
    regulationTarget === "uplift"
      ? "major"
      : regulationTarget === "focus"
        ? "open"
        : profile.vad.valence < 0.3
          ? "neutral"
          : "minor";
  const spectralBrightness =
    regulationTarget === "uplift"
      ? "bright"
      : regulationTarget === "focus"
        ? "balanced"
        : targetVad.valence < 0.45
          ? "dim"
          : "balanced";
  const rhythmicPulse =
    regulationTarget === "focus"
      ? "steady"
      : regulationTarget === "stabilize" || regulationTarget === "uplift"
        ? "gentle"
        : "none";
  const spaciousness =
    regulationTarget === "soothe" ? "wide" : regulationTarget === "focus" ? "close" : "open";

  return {
    targetVad,
    tempoDensity,
    modeColor,
    spectralBrightness,
    rhythmicPulse,
    spaciousness,
  };
}

function buildAnalysis(
  profile: WishEmotionProfile,
  musicControlProfile: MusicControlProfile,
  regulationTarget: RegulationTarget,
): Analysis {
  const tone =
    regulationTarget === "focus"
      ? "grounding"
      : regulationTarget === "uplift"
        ? "uplifting"
        : profile.imagery.some((item) => /달빛|안개|잔광|moon|mist|glow/i.test(item))
          ? "mystic"
          : "calm";
  const energy = musicControlProfile.rhythmicPulse === "steady" ? "medium" : "low";

  return {
    moodKeywords: profile.emotionLabels.slice(0, 3),
    intentKeywords: profile.intent.slice(0, 3),
    tone,
    energy,
    imagery: profile.imagery.slice(0, 3),
  };
}

function buildListeningGuide(regulationTarget: RegulationTarget) {
  switch (regulationTarget) {
    case "focus":
      return "작업이나 공부를 시작하기 5분 전, 호흡을 일정하게 맞추며 낮은 볼륨으로 들어보세요.";
    case "uplift":
      return "기분이 내려앉을 때 바로 강하게 끌어올리기보다, 밝은 쪽으로 천천히 이동한다는 느낌으로 들어보세요.";
    case "stabilize":
      return "감정이 무겁거나 흔들릴 때, 조용한 공간에서 자세를 고르게 정리한 뒤 천천히 들어보세요.";
    case "soothe":
      return "긴장이 올라올 때 바로 반응하기보다, 숨을 길게 내쉬면서 차분하게 들어보세요.";
  }
}

function buildAudioHints(musicControlProfile: MusicControlProfile): AudioHints {
  const { targetVad } = musicControlProfile;

  const baseHz = Number(
    (
      112 +
      targetVad.valence * 42 +
      targetVad.arousal * 18 +
      (musicControlProfile.modeColor === "major"
        ? 6
        : musicControlProfile.modeColor === "minor"
          ? -2
          : 2)
    ).toFixed(3),
  );
  const binauralOffsetHz = Number(
    (
      2.2 +
      targetVad.arousal * 2.4 +
      (musicControlProfile.rhythmicPulse === "steady"
        ? 0.8
        : musicControlProfile.rhythmicPulse === "gentle"
          ? 0.35
          : 0)
    ).toFixed(3),
  );
  const pulseHz =
    musicControlProfile.rhythmicPulse === "none"
      ? undefined
      : Number(
          (
            (musicControlProfile.rhythmicPulse === "steady" ? 0.2 : 0.12) +
            targetVad.arousal * 0.18
          ).toFixed(3),
        );
  const reverbMix = Number(
    (musicControlProfile.spaciousness === "wide"
      ? 0.24
      : musicControlProfile.spaciousness === "open"
        ? 0.19
        : 0.12
    ).toFixed(3),
  );

  const baseWeights: Record<MusicControlProfile["modeColor"], [number, number, number]> = {
    major: [0.07, 0.15, 0.1],
    minor: [0.11, 0.16, 0.06],
    neutral: [0.09, 0.16, 0.08],
    open: [0.08, 0.16, 0.09],
  };

  const brightnessDelta =
    musicControlProfile.spectralBrightness === "bright"
      ? [0, 0, 0.02]
      : musicControlProfile.spectralBrightness === "dim"
        ? [0.02, 0, -0.01]
        : [0, 0, 0];
  const droneWeights = baseWeights[musicControlProfile.modeColor].map((weight, index) =>
    Number((weight + brightnessDelta[index]).toFixed(3)),
  ) as [number, number, number];
  const harmonicBlend = Number(
    (
      (musicControlProfile.modeColor === "open"
        ? 0.42
        : musicControlProfile.modeColor === "major"
          ? 0.38
          : musicControlProfile.modeColor === "minor"
            ? 0.22
            : 0.28) +
      (musicControlProfile.spectralBrightness === "bright" ? 0.12 : 0) -
      (musicControlProfile.spectralBrightness === "dim" ? 0.06 : 0)
    ).toFixed(3),
  );
  const motionDepth = Number(
    (
      (musicControlProfile.tempoDensity === "flowing"
        ? 0.44
        : musicControlProfile.tempoDensity === "steady"
          ? 0.3
          : 0.18) +
      (musicControlProfile.rhythmicPulse === "steady"
        ? 0.14
        : musicControlProfile.rhythmicPulse === "gentle"
          ? 0.08
          : 0)
    ).toFixed(3),
  );
  const stereoDriftHz = Number(
    (
      (musicControlProfile.spaciousness === "wide"
        ? 0.16
        : musicControlProfile.spaciousness === "open"
          ? 0.11
          : 0.07) +
      targetVad.arousal * 0.04
    ).toFixed(3),
  );
  const texture =
    musicControlProfile.spaciousness === "wide" &&
    musicControlProfile.spectralBrightness === "dim"
      ? "hazy"
      : musicControlProfile.spectralBrightness === "bright"
        ? "bright"
        : musicControlProfile.rhythmicPulse === "steady"
          ? "balanced"
          : "soft";

  return {
    baseHz,
    binauralOffsetHz,
    pulseHz,
    reverbMix,
    droneWeights,
    harmonicBlend,
    motionDepth,
    stereoDriftHz,
    texture,
  };
}

function buildEvidenceTrace(
  wish: string,
  profile: WishEmotionProfile,
  description: string,
  regulationTarget: RegulationTarget,
): EvidenceTrace[] {
  const lexicalHits = [
    /집중|공부|합격|작업|성과|focus|study|exam|work|flow|performance/i.test(wish)
      ? "집중/성과"
      : null,
    /불안|초조|긴장|걱정|stress|anxious|anxiety|nervous/i.test(wish) ? "긴장/불안" : null,
    /우울|가라앉|무기력|슬픔|depress|sad|empty|drained/i.test(wish) ? "저활성 부정 정서" : null,
    /연애|매력|인기|호감|love|romance|relationship|attract|charisma/i.test(wish)
      ? "관계/매력"
      : null,
  ].filter((value): value is string => value !== null);

  const traces: EvidenceTrace[] = [];

  if (lexicalHits.length > 0) {
    traces.push({
      source: "lexical",
      note: `텍스트에서 ${lexicalHits.join(", ")} 단서를 감지해 초기 감정 후보를 보정했어요.`,
      confidence: clamp01(0.58 + lexicalHits.length * 0.08),
    });
  }

  traces.push({
    source: "llm_rationale",
    note: description,
    confidence: clamp01(profile.confidence),
  });
  traces.push({
    source: "regulation_rule",
    note: `현재 valence ${profile.vad.valence.toFixed(2)}, arousal ${profile.vad.arousal.toFixed(2)}, dominance ${profile.dominance.toFixed(2)}를 기준으로 ${regulationTarget} 방향을 선택했어요.`,
    confidence: clamp01(0.68 + (1 - profile.ambiguity) * 0.16),
  });

  return traces;
}

export function buildEmotionEngine(aiWishAnalysis: AiWishAnalysis, wish: string) {
  const wishEmotionProfile = normalizeWishEmotionProfile(aiWishAnalysis.wishEmotionProfile, wish);
  const regulationTarget = selectRegulationTarget(wishEmotionProfile, wish);
  const musicControlProfile = buildMusicControlProfile(wishEmotionProfile, regulationTarget);
  const analysis = buildAnalysis(wishEmotionProfile, musicControlProfile, regulationTarget);
  const listeningGuide = buildListeningGuide(regulationTarget);
  const evidenceTrace = buildEvidenceTrace(
    wish,
    wishEmotionProfile,
    aiWishAnalysis.description,
    regulationTarget,
  );
  const audioHints = buildAudioHints(musicControlProfile);

  return {
    analysis,
    description: aiWishAnalysis.description,
    listeningGuide,
    wishEmotionProfile,
    regulationTarget,
    musicControlProfile,
    evidenceTrace,
    audioHints,
  };
}
