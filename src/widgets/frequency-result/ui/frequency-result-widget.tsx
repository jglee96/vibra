"use client";

import type { FrequencyResult } from "@/entities/frequency";
import { useRenderedFrequencyAudio } from "@/features/render-frequency-audio";
import {
  lineBorder,
  primaryButton,
  secondaryButton,
  textMuted,
  textPrimary,
  textSecondary,
} from "@/shared/ui/tailwind";
import {
  getEnergyLabel,
  getRecipeSummary,
  getRegulationTargetLabel,
  getToneLabel,
} from "@/widgets/frequency-result/model/get-tone-label";

type FrequencyResultWidgetProps = {
  result: FrequencyResult;
};

export function FrequencyResultWidget({ result }: Readonly<FrequencyResultWidgetProps>) {
  const audio = useRenderedFrequencyAudio(result);

  return (
    <section className={`grid gap-8 border-t pt-10 ${lineBorder}`} aria-live="polite">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.72fr)] lg:items-end">
        <div>
          <p
            className={`m-0 text-[0.72rem] font-semibold uppercase tracking-[0.28em] ${textMuted}`}
          >
            Resonance
          </p>
          <h2
            className={`mt-4 mb-0 font-serif text-[clamp(2rem,4.6vw,4rem)] leading-[0.98] tracking-[-0.045em] ${textPrimary}`}
          >
            {result.title}
          </h2>
          <p className={`mt-4 mb-0 max-w-[38rem] text-base leading-8 ${textSecondary}`}>
            {result.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {result.analysis.intentKeywords.map((keyword) => (
            <span
              key={keyword}
              className={`rounded-full border px-4 py-2 text-sm ${lineBorder} ${textSecondary} bg-[rgba(255,255,255,0.04)]`}
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className={`m-0 text-lg ${textPrimary}`}>깊게 스며드는 분위기</h3>
          <p className={`mt-4 mb-0 text-base leading-8 ${textSecondary}`}>
            {result.description} {result.analysis.moodKeywords.join(", ")}의 결 위에{" "}
            {result.analysis.imagery.join(", ")} 장면을 얹어 오래 머무는 파장으로 정리했습니다.
          </p>
        </div>
        <div>
          <h3 className={`m-0 text-lg ${textPrimary}`}>이 밤에 가장 잘 맞는 순간</h3>
          <p className={`mt-4 mb-0 text-base leading-8 ${textSecondary}`}>
            {result.listeningGuide}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className={`m-0 text-lg ${textPrimary}`}>붙기 시작하는 감각</h3>
          <p className={`mt-4 mb-0 text-base leading-8 ${textSecondary}`}>
            {result.wishEmotionProfile.emotionLabels.join(", ")} 흐름 위에{" "}
            {result.wishEmotionProfile.intent.join(", ")} 무드를 얹었습니다. 설명보다 먼저 마음의
            속도와 표정이 바뀌는 쪽에 가깝습니다.
          </p>
        </div>
        <div>
          <h3 className={`m-0 text-lg ${textPrimary}`}>남기고 싶은 여운</h3>
          <p className={`mt-4 mb-0 text-base leading-8 ${textSecondary}`}>
            {result.evidenceTrace.map((trace) => trace.note).join(" ")}
          </p>
        </div>
      </div>

      <div
        className={`grid gap-4 border-y py-6 sm:grid-cols-2 xl:grid-cols-4 ${lineBorder}`}
        aria-label="공명 메타 정보"
      >
        <div>
          <strong className={`block text-[0.72rem] uppercase tracking-[0.22em] ${textMuted}`}>
            조율
          </strong>
          <span className={`mt-2 block text-base leading-7 ${textPrimary}`}>
            {getRegulationTargetLabel(result.regulationTarget)}
          </span>
        </div>
        <div>
          <strong className={`block text-[0.72rem] uppercase tracking-[0.22em] ${textMuted}`}>
            톤
          </strong>
          <span className={`mt-2 block text-base leading-7 ${textPrimary}`}>
            {getToneLabel(result.analysis.tone)}
          </span>
        </div>
        <div>
          <strong className={`block text-[0.72rem] uppercase tracking-[0.22em] ${textMuted}`}>
            에너지
          </strong>
          <span className={`mt-2 block text-base leading-7 ${textPrimary}`}>
            {getEnergyLabel(result.analysis.energy)}
          </span>
        </div>
        <div>
          <strong className={`block text-[0.72rem] uppercase tracking-[0.22em] ${textMuted}`}>
            파장 공식
          </strong>
          <span className={`mt-2 block text-base leading-7 ${textPrimary}`}>
            {getRecipeSummary(result.audioRecipe)}
          </span>
        </div>
      </div>

      <div
        className={`rounded-[2rem] border p-6 sm:p-8 ${lineBorder} bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]`}
      >
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className={`m-0 text-[0.72rem] uppercase tracking-[0.28em] ${textMuted}`}>
              Playback
            </p>
            <h3 className={`mt-3 mb-0 text-[clamp(1.35rem,3vw,2.2rem)] ${textPrimary}`}>
              지금 이 파장을 틀어두세요
            </h3>
            <p className={`mt-4 mb-0 max-w-[34rem] text-base leading-8 ${textSecondary}`}>
              {audio.isRendering
                ? "브라우저 안에서 당신만의 소리를 열고 있어요. 곧 바로 이 밤의 공기가 바뀌기 시작합니다."
                : "처음엔 낮은 볼륨으로 재생해두세요. 조용한 순간일수록 파장은 더 깊게 붙습니다."}
            </p>
          </div>
          <span
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold ${lineBorder} ${textSecondary} bg-[rgba(255,255,255,0.04)]`}
          >
            {audio.url ? "재생 준비 완료" : "오디오 생성 중"}
          </span>
        </div>
        <p className="sr-only" aria-live="polite">
          {audio.isRendering
            ? "브라우저에서 mp3를 만들고 있어요. 잠시만 기다리면 바로 재생할 수 있어요."
            : "조용한 공간에서 낮은 볼륨으로 먼저 들어보세요."}
        </p>
        {audio.error ? (
          <p className="mt-6 rounded-[1.25rem] border border-[rgba(255,169,181,0.28)] bg-[rgba(120,24,42,0.34)] px-4 py-3 leading-6 text-[#ffd8df]">
            {audio.error}
          </p>
        ) : null}
        {audio.url ? <audio className="mt-6 w-full" controls src={audio.url} /> : null}
        <div
          className={`mt-6 flex flex-wrap items-stretch justify-between gap-4 border-t pt-5 sm:items-center ${lineBorder}`}
        >
          <span className={`text-sm leading-7 ${textSecondary}`}>
            {audio.url ? "생성이 완료되었어요." : "첫 생성에는 약간 더 시간이 걸릴 수 있어요."}
          </span>
          {audio.url && audio.fileName ? (
            <a
              className={`${secondaryButton} w-full sm:w-auto`}
              download={audio.fileName}
              href={audio.url}
            >
              MP3 다운로드
            </a>
          ) : (
            <button className={`${primaryButton} w-full sm:w-auto`} type="button" disabled>
              MP3 준비 중...
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
