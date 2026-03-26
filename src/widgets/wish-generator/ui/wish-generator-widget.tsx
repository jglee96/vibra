"use client";

import { useState } from "react";

import { SubmitWishForm, useSubmitWish } from "@/features/submit-wish";
import { cn } from "@/shared/lib/cn";
import {
  badge,
  glassCard,
  lineBorder,
  overlayPanel,
  softPanel,
  textPrimary,
  textSecondary,
  textTertiary,
} from "@/shared/ui/tailwind";
import { FrequencyResultWidget } from "@/widgets/frequency-result";
import { generationSteps } from "@/widgets/wish-generator/model/generation-steps";

export function WishGeneratorWidget() {
  const [wish, setWish] = useState("");
  const { error, isPending, result, submitWish } = useSubmitWish();

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(310px,0.75fr)]">
      <div className="grid gap-5">
        <section className={`${glassCard} p-5 sm:p-6 lg:p-7`}>
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="grid gap-2">
                <p className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
                  Compose
                </p>
                <h2 className={`m-0 text-[clamp(1.45rem,2vw,1.9rem)] leading-[1.15] font-semibold tracking-[-0.03em] ${textPrimary}`}>
                  당신의 바람을 또렷한 한 문장으로 남겨주세요
                </h2>
              </div>
              <span className={badge}>입력 후 바로 생성</span>
            </div>
            <p className={`m-0 max-w-[46rem] text-sm leading-6 sm:text-[15px] sm:leading-7 ${textSecondary}`}>
              감정의 방향과 장면이 함께 드러나면 결과가 더 안정적으로 정리됩니다.
              지금 필요한 변화, 원하는 분위기, 몸의 감각을 한 흐름으로 적어보세요.
            </p>
          </div>
          <div className={cn("mt-6 border-t pt-6", lineBorder)}>
            <SubmitWishForm
              error={error}
              isPending={isPending}
              onChange={setWish}
              onSubmit={submitWish}
              value={wish}
            />
          </div>
          {isPending ? (
            <div
              className={`${overlayPanel} mt-5 grid gap-3 p-4`}
              aria-live="polite"
              aria-label="생성 진행 상태"
            >
              <div className="flex items-center justify-between gap-3">
                <p className={`m-0 text-sm font-semibold ${textPrimary}`}>
                  현재 해석 중인 단계
                </p>
                <span className={badge}>잠시만 기다려주세요</span>
              </div>
              {generationSteps.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center gap-3 text-sm ${textSecondary}`}
                  data-active={index === 0 ? "true" : "false"}
                >
                  <span
                    className="size-2.5 rounded-full bg-slate-300 data-[active=true]:bg-sky-500 data-[active=true]:shadow-[0_0_0_6px_rgba(14,165,233,0.12)] dark:bg-slate-700 dark:data-[active=true]:bg-sky-300"
                    data-active={index === 0 ? "true" : "false"}
                  />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          ) : null}
        </section>
        {result ? <FrequencyResultWidget result={result} /> : null}
      </div>
      <aside className={`${glassCard} order-3 grid gap-4 p-5 lg:order-none lg:sticky lg:top-8`}>
        <div className="grid gap-2">
          <p className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
            Guide
          </p>
          <h2 className={`m-0 text-[1.35rem] leading-[1.2] font-semibold tracking-[-0.02em] ${textPrimary}`}>
            어떻게 정리되나요?
          </h2>
          <p className={`m-0 text-sm leading-6 ${textSecondary}`}>
            입력한 문장을 바탕으로 감정 해석, 오디오 설계, 브라우저 생성까지 같은 흐름으로 이어집니다.
          </p>
        </div>
        <div className="grid gap-3">
          <div className={`${overlayPanel} p-4`}>
            <p className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
              1. 감정 해석
            </p>
            <p className={`mt-2 mb-0 text-sm leading-6 ${textPrimary}`}>
              문장의 분위기와 방향성을 읽어 핵심 키워드와 청취 맥락을 정리합니다.
            </p>
          </div>
          <div className={`${overlayPanel} p-4`}>
            <p className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
              2. 공명 설계
            </p>
            <p className={`mt-2 mb-0 text-sm leading-6 ${textPrimary}`}>
              안전한 범위 안에서 주파수 중심, 리듬 밀도, 잔향의 깊이를 맞춥니다.
            </p>
          </div>
          <div className={`${overlayPanel} p-4`}>
            <p className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
              3. 로컬 생성
            </p>
            <p className={`mt-2 mb-0 text-sm leading-6 ${textPrimary}`}>
              결과 오디오는 브라우저에서 직접 만들어 바로 재생하거나 저장할 수 있습니다.
            </p>
          </div>
        </div>
        <div className={`${softPanel} grid gap-3 p-4`}>
          <div>
            <strong className={`block text-sm ${textPrimary}`}>프라이버시</strong>
            <p className={`mt-2 mb-0 text-sm leading-6 ${textSecondary}`}>
              입력한 문장과 결과는 저장하지 않으며 현재 세션 안에서만 머뭅니다.
            </p>
          </div>
          <div>
            <strong className={`block text-sm ${textPrimary}`}>청취 안내</strong>
            <p className={`mt-2 mb-0 text-sm leading-6 ${textSecondary}`}>
              처음에는 낮은 볼륨으로 시작하고, 조용한 공간에서 반복 청취하는 것을 권장합니다.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
