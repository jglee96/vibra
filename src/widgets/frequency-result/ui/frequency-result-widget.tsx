"use client";

import type { FrequencyResult } from "@/entities/frequency";
import { useFrequencyPlayback } from "@/features/frequency-playback";
import { cn } from "@/shared/lib/cn";
import {
  badge,
  errorPanel,
  glassCard,
  lineBorder,
  overlayPanel,
  primaryButton,
  secondaryButton,
  softPanel,
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
  const audio = useFrequencyPlayback(result);
  const statusLabel =
    audio.status === "playing"
      ? "재생 중"
      : audio.status === "error"
        ? "재생 불가"
        : audio.status === "ready"
          ? "준비됨"
          : "대기 중";

  return (
    <section className={`${glassCard} grid gap-5 p-5 sm:p-6 lg:p-7`} aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-3">
          <p className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
            Resonance result
          </p>
          <div>
            <h2 className={`m-0 text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.05] font-semibold tracking-[-0.04em] ${textPrimary}`}>
              {result.title}
            </h2>
            <p className={`mt-3 mb-0 max-w-[44rem] text-sm leading-7 sm:text-[15px] ${textSecondary}`}>
              {result.subtitle}
            </p>
          </div>
        </div>
        <span className={badge}>{getRegulationTargetLabel(result.regulationTarget)}</span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {result.analysis.intentKeywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-100"
          >
            {keyword}
          </span>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div className={`${overlayPanel} grid gap-3 p-4`}>
          <h3 className={`m-0 text-base font-semibold ${textPrimary}`}>해석된 중심</h3>
          <p className={`m-0 text-sm leading-7 ${textSecondary}`}>
            {result.description}
          </p>
          <p className={`m-0 text-sm leading-7 ${textSecondary}`}>
            {result.analysis.moodKeywords.join(", ")}의 감정을 중심으로 장면을 정리했고,{" "}
            {result.analysis.imagery.join(", ")} 이미지를 사용해 오디오의 질감을 잡았습니다.
          </p>
        </div>
        <div className={`${softPanel} grid gap-3 p-4`}>
          <h3 className={`m-0 text-base font-semibold ${textPrimary}`}>추천 청취 상황</h3>
          <p className={`m-0 text-sm leading-7 ${textSecondary}`}>
            {result.listeningGuide}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="공명 메타 정보">
        <div className={`${overlayPanel} p-4`}>
          <strong className={`block text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
            톤
          </strong>
          <span className={`mt-2 block text-sm leading-6 ${textPrimary}`}>
            {getToneLabel(result.analysis.tone)}
          </span>
        </div>
        <div className={`${overlayPanel} p-4`}>
          <strong className={`block text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
            에너지
          </strong>
          <span className={`mt-2 block text-sm leading-6 ${textPrimary}`}>
            {getEnergyLabel(result.analysis.energy)}
          </span>
        </div>
        <div className={`${overlayPanel} p-4`}>
          <strong className={`block text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
            오디오 공식
          </strong>
          <span className={`mt-2 block text-sm leading-6 ${textPrimary}`}>
            {getRecipeSummary(result.audioRecipe)}
          </span>
        </div>
        <div className={`${overlayPanel} p-4`}>
          <strong className={`block text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
            목표 상태
          </strong>
          <span className={`mt-2 block text-sm leading-6 ${textPrimary}`}>
            {getRegulationTargetLabel(result.regulationTarget)}
          </span>
        </div>
      </div>

      <div className={`${softPanel} grid gap-3 p-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className={`m-0 text-base font-semibold ${textPrimary}`}>엔진 근거</h3>
          <span className={badge}>evidence trace</span>
        </div>
        <div className={cn("grid gap-3 border-t pt-3", lineBorder)}>
          {result.evidenceTrace.map((trace) => (
            <div key={`${trace.source}-${trace.note}`} className="grid gap-1">
              <p className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
                {trace.source}
              </p>
              <p className={`m-0 text-sm leading-6 ${textSecondary}`}>{trace.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.96))] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.92))] dark:shadow-[0_28px_80px_rgba(2,6,23,0.42)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
              Audio
            </p>
            <h3 className={`mt-2 mb-0 text-lg font-semibold ${textPrimary}`}>
              당신의 주파수
            </h3>
            <p className={`mt-3 mb-0 text-sm leading-7 ${textSecondary}`}>
              {audio.isPlaying
                ? "지금 브라우저 안에서 바로 재생 중이에요. 너무 크지 않은 볼륨으로 편안하게 들어보세요."
                : "생성 대기 없이 바로 재생할 수 있어요. 처음에는 낮은 볼륨으로 시작해보세요."}
            </p>
          </div>
          <span className={badge}>{statusLabel}</span>
        </div>
        <p className="sr-only" aria-live="polite">
          {audio.isPlaying
            ? "브라우저에서 오디오를 재생하고 있어요."
            : "재생 버튼을 누르면 바로 오디오를 들을 수 있어요."}
        </p>
        {audio.error ? <p className={errorPanel}>{audio.error}</p> : null}
        <div className="flex flex-wrap items-stretch justify-between gap-3 sm:items-center">
          <span className={`text-sm leading-6 ${textSecondary}`}>
            {audio.isPlaying
              ? "정지 버튼으로 언제든 멈출 수 있어요."
              : "결과를 받은 뒤 별도 렌더링 대기 없이 바로 재생할 수 있어요."}
          </span>
          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <button
              className={cn(primaryButton, "w-full sm:w-auto")}
              type="button"
              disabled={audio.status === "idle"}
              onClick={() => void audio.play()}
            >
              재생
            </button>
            <button
              className={cn(secondaryButton, "w-full sm:w-auto")}
              type="button"
              disabled={!audio.isPlaying}
              onClick={audio.stop}
            >
              정지
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
