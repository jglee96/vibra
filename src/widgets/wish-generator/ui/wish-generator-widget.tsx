"use client";

import { useState } from "react";

import { SubmitWishForm, useSubmitWish } from "@/features/submit-wish";
import {
  glassCard,
  overlayPanel,
  softPanel,
  subtleBorder,
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
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.78fr)]">
      <div className="grid gap-4">
        <section className={`${glassCard} p-5 sm:p-6`}>
          <div className="mb-[1.2rem] grid gap-[0.55rem]">
            <div>
              <p
                className={`m-0 text-[0.78rem] font-semibold tracking-[0.04em] ${textTertiary}`}
              >
                입력
              </p>
              <h2
                className={`mt-[0.3rem] mb-0 text-[clamp(1.3rem,2vw,1.55rem)] leading-[1.2] font-semibold tracking-[-0.02em] ${textPrimary}`}
              >
                당신의 바람을 또렷하게 남겨주세요
              </h2>
            </div>
            <p className={`m-0 leading-[1.65] ${textSecondary}`}>
              구체적인 장면과 감정을 함께 적을수록 더 안정적인 공명 패턴을 만들
              수 있어요.
            </p>
          </div>
          <div className={`mt-8 border-t pt-8 ${lineBorder}`}>
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
              className={`${overlayPanel} mt-[1.1rem] grid gap-3 p-4`}
              aria-live="polite"
              aria-label="생성 진행 상태"
            >
              {generationSteps.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center gap-[0.8rem] ${textSecondary}`}
                  data-active={index === 0 ? "true" : "false"}
                >
                  <span
                    className="size-[0.85rem] rounded-full bg-[rgba(93,121,201,0.32)] shadow-[0_0_0_0_rgba(93,121,201,0.32)] data-[active=true]:bg-[#5d79c9] data-[active=true]:animate-pulse dark:bg-[rgba(157,189,255,0.32)] dark:data-[active=true]:bg-[#9dbdff]"
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
      <aside className={`${glassCard} order-3 p-5 lg:order-none`}>
        <p
          className={`m-0 text-[0.78rem] font-semibold tracking-[0.04em] ${textTertiary}`}
        >
          안내
        </p>
        <h2
          className={`mt-[0.3rem] mb-0 text-[clamp(1.3rem,2vw,1.55rem)] leading-[1.2] font-semibold tracking-[-0.02em] ${textPrimary}`}
        >
          어떻게 정리되나요?
        </h2>
        <div
          className={`${overlayPanel} mt-4 overflow-hidden`}
          role="list"
          aria-label="작동 방식"
        >
          <div className="grid gap-[0.35rem] px-4 py-[1.05rem]" role="listitem">
            <strong className={`text-[0.95rem] ${textPrimary}`}>
              감정 해석
            </strong>
            <span className={`leading-[1.65] ${textSecondary}`}>
              소원의 분위기와 방향성을 읽어 핵심 키워드로 정리합니다.
            </span>
          </div>
          <div
            className={`grid gap-[0.35rem] border-t px-4 py-[1.05rem] ${subtleBorder} ${textSecondary}`}
            role="listitem"
          >
            <strong className={textPrimary}>공명 설계</strong>
            <span className="leading-[1.65]">
              안전한 파라미터 안에서 주파수 조합과 리듬 패턴을 맞춥니다.
            </span>
          </div>
          <div
            className={`grid gap-[0.35rem] border-t px-4 py-[1.05rem] ${subtleBorder} ${textSecondary}`}
            role="listitem"
          >
            <strong className={textPrimary}>로컬 생성</strong>
            <span className="leading-[1.65]">
              브라우저에서 직접 3분 오디오를 만들고 바로 재생하거나 저장합니다.
            </span>
          </div>
        </div>
        <div className={`${softPanel} mt-4 p-4`}>
          <strong className={`block text-[0.95rem] ${textPrimary}`}>
            프라이버시
          </strong>
          <p className={`mt-[0.45rem] mb-0 leading-[1.65] ${textSecondary}`}>
            입력한 문장과 결과는 저장하지 않으며, 현재 세션 안에서만 머뭅니다.
          </p>
        </div>
      </aside>
    </div>
  );
}
