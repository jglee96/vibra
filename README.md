# Vibra

소원을 입력하면 감정 엔진이 정서 프로필을 해석하고, 이를 차분한 주파수 오디오로 변환하는 Next.js 앱입니다.

## 핵심 흐름

1. 사용자가 소원을 입력합니다.
2. [`reviewWish`](/Users/zakklee/dev/vibra/src/entities/wish/model/wish.ts)에서 위험 요청과 모호한 입력을 먼저 걸러냅니다.
3. [`analyzeWishWithOpenAI`](/Users/zakklee/dev/vibra/src/features/submit-wish/api/analyze-wish.server.ts)에서 소원을 `WishEmotionProfile` 입력으로 정규화합니다.
4. [`buildEmotionEngine`](/Users/zakklee/dev/vibra/src/entities/frequency/lib/build-emotion-engine.ts)에서 아래 순서로 감정 엔진을 실행합니다.
   - 다중 감정 라벨 추출
   - VAD(valence, arousal)와 dominance 정규화
   - `RegulationTarget` 선택
   - `MusicControlProfile` 생성
   - 오디오 힌트 생성
5. [`normalizeAudioRecipe`](/Users/zakklee/dev/vibra/src/entities/frequency/lib/normalize-audio-recipe.ts)에서 안전한 범위로 오디오 레시피를 보정합니다.
6. 브라우저에서 WebAudio로 즉시 재생 가능한 오디오 그래프를 구성합니다.

## 감정 엔진 모델

현재 엔진은 `텍스트 -> 바로 주파수`로 점프하지 않습니다. 중간에 다음 구조를 명시적으로 둡니다.

- `WishEmotionProfile`
  - `emotionLabels[]`
  - `vad`
  - `dominance`
  - `intent`
  - `imagery`
  - `ambiguity`
  - `confidence`
  - `language`
- `RegulationTarget`
  - `soothe | stabilize | focus | uplift`
- `MusicControlProfile`
  - `targetVad`
  - `tempoDensity`
  - `modeColor`
  - `spectralBrightness`
  - `rhythmicPulse`
  - `spaciousness`
- `EvidenceTrace`
  - `lexical`
  - `llm_rationale`
  - `regulation_rule`

이 구조는 다음 목적을 가집니다.

- 복합 감정을 단일 톤으로 붕괴시키지 않기
- 언어가 달라도 공통 감정 공간으로 정규화하기
- 자극적이거나 방출형 방향보다 `점진적 안정화`를 우선하기
- 오디오 파라미터를 해석 가능한 제어값으로 유지하기

## 실행 방법

### 요구사항

- Node.js `>= 20.11.1`
- `pnpm`
- OpenAI API 키

### 설치

```bash
pnpm i
```

### 환경 변수

`.env.local` 또는 `.env`에 아래 값을 넣습니다.

```bash
OPENAI_API_KEY=your_openai_api_key
```

기본 예시는 [`/.env.example`](/Users/zakklee/dev/vibra/.env.example)에 있습니다.

### 개발 서버

```bash
pnpm dev
```

기본 API 엔드포인트는 [`/api/frequency`](/Users/zakklee/dev/vibra/src/app/api/frequency/route.ts)입니다.

## 주요 스크립트

```bash
pnpm dev
pnpm build
pnpm start
pnpm test
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test:e2e
```

## 핵심 파일

- [`src/features/submit-wish/api/build-frequency-response.server.ts`](/Users/zakklee/dev/vibra/src/features/submit-wish/api/build-frequency-response.server.ts)
  - 전체 서버 파이프라인 진입점
- [`src/features/submit-wish/api/analyze-wish.server.ts`](/Users/zakklee/dev/vibra/src/features/submit-wish/api/analyze-wish.server.ts)
  - OpenAI 호출 및 감정 프로파일 정규화
- [`src/entities/frequency/lib/build-emotion-engine.ts`](/Users/zakklee/dev/vibra/src/entities/frequency/lib/build-emotion-engine.ts)
  - 감정 엔진 규칙과 음악 제어 프로파일 생성
- [`src/entities/frequency/model/frequency.ts`](/Users/zakklee/dev/vibra/src/entities/frequency/model/frequency.ts)
  - 엔진 및 결과 스키마 정의
- [`src/widgets/frequency-result/ui/frequency-result-widget.tsx`](/Users/zakklee/dev/vibra/src/widgets/frequency-result/ui/frequency-result-widget.tsx)
  - 분석 결과, VAD, regulation target, evidence trace 렌더링

## 테스트 포인트

현재 테스트는 아래 시나리오를 커버합니다.

- 불안/긴장 입력이 `soothe` 또는 `stabilize`로 내려가는지
- 집중형 입력이 `focus`와 중간 각성으로 유지되는지
- 저활성 부정 정서가 더 침잠하지 않고 `stabilize`로 유도되는지
- 서버 응답이 새 감정 엔진 구조를 포함하는지
- 위젯이 새 결과 구조를 렌더링하는지

관련 테스트는 [`src/entities/frequency/lib/build-emotion-engine.test.ts`](/Users/zakklee/dev/vibra/src/entities/frequency/lib/build-emotion-engine.test.ts)와 [`src/features/submit-wish/api/build-frequency-response.server.test.ts`](/Users/zakklee/dev/vibra/src/features/submit-wish/api/build-frequency-response.server.test.ts)를 보면 됩니다.

## 안전 가드레일

- 위험 요청은 감정 엔진 이전 단계에서 차단합니다.
- 의료적 효과는 주장하지 않습니다.
- 완화 로직은 감정과 완전히 반대되는 강한 자극보다, 감정 일치 후 점진적 안정화를 우선합니다.
- 오디오 파라미터는 항상 안전 범위로 clamp 됩니다.
