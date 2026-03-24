"use client";

import type { FrequencyResult } from "@/entities/frequency";
import { useRenderedFrequencyAudio } from "@/features/render-frequency-audio";
import {
  errorPanel,
  glassCard,
  overlayPanel,
  primaryButton,
  secondaryButton,
  subtleBorder,
  textPrimary,
  textSecondary,
  textTertiary,
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

export function FrequencyResultWidget({
  result,
}: Readonly<FrequencyResultWidgetProps>) {
  const audio = useRenderedFrequencyAudio(result);

  return (
    <section
      className={`${glassCard} grid gap-4 p-5 sm:p-[1.3rem]`}
      aria-live="polite"
    >
      <div
        className={`m-0 text-[0.78rem] font-semibold uppercase tracking-[0.04em] ${textTertiary}`}
      >
        당신의 공명 결과
      </div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            className={`m-0 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08] font-semibold tracking-[-0.03em] ${textPrimary}`}
          >
            {result.title}
          </h2>
          <p className={`mt-[0.45rem] mb-0 leading-[1.7] ${textSecondary}`}>
            {result.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-[0.55rem]">
          {result.analysis.intentKeywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-[rgba(110,128,160,0.18)] bg-[rgba(93,121,201,0.14)] px-[0.8rem] py-[0.45rem] text-[0.9rem] font-medium text-[#4763b6] dark:border-[rgba(176,202,255,0.16)] dark:bg-[rgba(157,189,255,0.12)] dark:text-[#d7e6ff]"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={`${overlayPanel} p-4`}>
          <h3
            className={`m-0 text-base font-semibold tracking-[0.01em] ${textPrimary}`}
          >
            분석된 결
          </h3>
          <p className={`mt-3 mb-0 leading-[1.75] ${textSecondary}`}>
            {result.analysis.moodKeywords.join(", ")}의 감정을 중심으로 장면을
            정리했고, {result.analysis.imagery.join(", ")} 이미지를 사용해
            오디오의 질감을 잡았습니다.
          </p>
        </div>
        <div className={`${overlayPanel} p-4`}>
          <h3
            className={`m-0 text-base font-semibold tracking-[0.01em] ${textPrimary}`}
          >
            추천 청취 상황
          </h3>
          <p className={`mt-3 mb-0 leading-[1.75] ${textSecondary}`}>
            {result.listeningGuide}
          </p>
        </div>
      </div>

      <div className="moon-meta-grid" aria-label="공명 메타 정보">
        <div className="moon-meta-card">
          <strong>톤</strong>
          <span>{getToneLabel(result.analysis.tone)}</span>
        </div>
        <div className={`${overlayPanel} rounded-[18px] p-[0.95rem]`}>
          <strong
            className={`mb-[0.2rem] block text-[0.8rem] uppercase tracking-[0.08em] ${textTertiary}`}
          >
            에너지
          </strong>
          <span className={`leading-6 ${textPrimary}`}>
            {getEnergyLabel(result.analysis.energy)}
          </span>
        </div>
        <div className={`${overlayPanel} rounded-[18px] p-[0.95rem]`}>
          <strong
            className={`mb-[0.2rem] block text-[0.8rem] uppercase tracking-[0.08em] ${textTertiary}`}
          >
            오디오 공식
          </strong>
          <span className={`leading-6 ${textPrimary}`}>
            {getRecipeSummary(result.audioRecipe)}
          </span>
        </div>
      </div>

      <div className="moon-panel">
        <h3 className="moon-section-title">엔진 근거</h3>
        <p>{result.evidenceTrace.map((trace) => trace.note).join(" ")}</p>
      </div>

      <div className="grid gap-4 rounded-[24px] border border-[rgba(110,128,160,0.18)] bg-[radial-gradient(circle_at_top,rgba(93,121,201,0.14),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.74))] p-[1.1rem] shadow-[0_24px_60px_rgba(134,148,176,0.16)] dark:border-[rgba(176,202,255,0.16)] dark:bg-[radial-gradient(circle_at_top,rgba(157,189,255,0.12),transparent_58%),linear-gradient(180deg,rgba(13,22,38,0.9),rgba(13,22,38,0.74))] dark:shadow-[0_28px_70px_rgba(1,7,20,0.34)]">
        <div className="flex flex-wrap items-start justify-between gap-[0.8rem]">
          <div>
            <h3
              className={`m-0 text-base font-semibold tracking-[0.01em] ${textPrimary}`}
            >
              당신의 주파수
            </h3>
            <p className={`mt-3 mb-0 leading-[1.65] ${textSecondary}`}>
              {audio.isRendering
                ? "브라우저 안에서 당신만의 소리를 열고 있어요. 곧 바로 이 밤의 공기가 바뀌기 시작합니다."
                : "처음엔 낮은 볼륨으로 재생해두세요. 조용한 순간일수록 파장은 더 깊게 붙습니다."}
            </p>
          </div>
          <span
            className={`inline-flex min-h-8 items-center rounded-full border px-[0.7rem] py-[0.35rem] text-[0.85rem] font-semibold ${subtleBorder} ${textSecondary} bg-[rgba(255,255,255,0.58)] dark:bg-[rgba(255,255,255,0.04)]`}
          >
            {audio.url ? "재생 준비 완료" : "오디오 생성 중"}
          </span>
        </div>
        <p className="sr-only" aria-live="polite">
          {audio.isRendering
            ? "브라우저에서 mp3를 만들고 있어요. 잠시만 기다리면 바로 재생할 수 있어요."
            : "조용한 공간에서 낮은 볼륨으로 먼저 들어보세요."}
        </p>
        {audio.error ? <p className={errorPanel}>{audio.error}</p> : null}
        {audio.url ? (
          <audio className="w-full" controls src={audio.url} />
        ) : null}
        <div className="flex flex-wrap items-stretch justify-between gap-[0.9rem] sm:items-center">
          <span className={`leading-[1.65] ${textSecondary}`}>
            {audio.url
              ? "생성이 완료되었어요."
              : "첫 생성에는 약간 더 시간이 걸릴 수 있어요."}
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
            <button
              className={`${primaryButton} w-full sm:w-auto`}
              type="button"
              disabled
            >
              MP3 준비 중...
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
