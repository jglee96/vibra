"use client";

import { useState } from "react";

import { SubmitWishForm, useSubmitWish } from "@/features/submit-wish";
import { lineBorder, textMuted, textPrimary, textSecondary } from "@/shared/ui/tailwind";
import { FrequencyResultWidget } from "@/widgets/frequency-result";
import { generationSteps } from "@/widgets/wish-generator/model/generation-steps";

export function WishGeneratorWidget() {
  const [wish, setWish] = useState("");
  const { error, isPending, result, submitWish } = useSubmitWish();

  return (
    <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.72fr)] lg:pt-14">
      <div className="grid gap-12">
        <section>
          <div className="max-w-[42rem]">
            <p
              className={`m-0 text-[0.72rem] font-semibold uppercase tracking-[0.28em] ${textMuted}`}
            >
              Input
            </p>
            <div>
              <h2
                className={`mt-4 mb-0 font-serif text-[clamp(2rem,5vw,3.6rem)] leading-[0.98] tracking-[-0.045em] ${textPrimary}`}
              >
                오늘 밤 먼저 당겨올 현실
              </h2>
            </div>
            <p className={`mt-5 mb-0 max-w-[34rem] text-base leading-8 ${textSecondary}`}>
              이미 이루어진 장면처럼 적어보세요. Vibra는 설명보다 빠르게, 당신의 내일에 어울리는
              공기를 먼저 켭니다.
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
              className={`mt-6 grid gap-4 border-t pt-5 ${lineBorder}`}
              aria-live="polite"
              aria-label="생성 진행 상태"
            >
              {generationSteps.map((step, index) => (
                <div key={step} className={`flex items-center gap-4 ${textSecondary}`}>
                  <span
                    className="size-2.5 rounded-full bg-[rgba(247,244,238,0.22)] data-[active=true]:bg-[#c9d8ff] data-[active=true]:shadow-[0_0_18px_rgba(166,188,255,0.44)] data-[active=true]:animate-pulse"
                    data-active={index === 0 ? "true" : "false"}
                  />
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          ) : null}
        </section>
        {result ? <FrequencyResultWidget result={result} /> : null}
      </div>
      <aside className={`border-t pt-6 lg:pt-0 lg:pl-10 lg:border-t-0 lg:border-l ${lineBorder}`}>
        <p className={`m-0 text-[0.72rem] font-semibold uppercase tracking-[0.28em] ${textMuted}`}>
          Aura
        </p>
        <h2 className={`mt-4 mb-0 max-w-[12ch] text-2xl leading-tight ${textPrimary}`}>
          설명보다 먼저 몸이 믿는 쪽으로
        </h2>
        <div className={`mt-8 border-t ${lineBorder}`} role="list" aria-label="작동 방식">
          <div className={`border-b py-5 ${lineBorder}`} role="listitem">
            <strong
              className={`block text-sm font-semibold uppercase tracking-[0.22em] ${textMuted}`}
            >
              attraction
            </strong>
            <span className={`mt-2 block text-base leading-8 ${textSecondary}`}>
              원하는 사람이 먼저 편안함을 느끼는 공기를 만듭니다.
            </span>
          </div>
          <div className={`border-b py-5 ${lineBorder}`} role="listitem">
            <strong
              className={`block text-sm font-semibold uppercase tracking-[0.22em] ${textMuted}`}
            >
              flow
            </strong>
            <span className={`mt-2 block text-base leading-8 ${textSecondary}`}>
              돈과 기회가 머무는 템포를 조용하게 몸에 익힙니다.
            </span>
          </div>
          <div className="py-5" role="listitem">
            <strong
              className={`block text-sm font-semibold uppercase tracking-[0.22em] ${textMuted}`}
            >
              presence
            </strong>
            <span className={`mt-2 block text-base leading-8 ${textSecondary}`}>
              말하지 않아도 시선이 머무는 존재감을 밤새 깔아둡니다.
            </span>
          </div>
        </div>
        <div className={`mt-8 border-t pt-5 ${lineBorder}`}>
          <p className={`m-0 text-sm leading-7 ${textMuted}`}>
            입력한 문장과 결과는 저장하지 않습니다. 이 밤 안에서만 열리고, 이 밤 안에서만
            사라집니다.
          </p>
        </div>
      </aside>
    </div>
  );
}
