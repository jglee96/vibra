"use client";

import { useState } from "react";

import { SubmitWishForm, useSubmitWish } from "@/features/submit-wish";
import { FrequencyResultWidget } from "@/widgets/frequency-result";
import { generationSteps } from "@/widgets/wish-generator/model/generation-steps";

export function WishGeneratorWidget() {
  const [wish, setWish] = useState("");
  const { error, isPending, result, submitWish } = useSubmitWish();

  return (
    <div className="moon-grid">
      <div>
        <section className="moon-card moon-card--form">
          <SubmitWishForm
            error={error}
            isPending={isPending}
            onChange={setWish}
            onSubmit={submitWish}
            value={wish}
          />
          {isPending ? (
            <div className="moon-process" aria-live="polite">
              {generationSteps.map((step, index) => (
                <div
                  key={step}
                  className="moon-process-step"
                  data-active={index === 0 ? "true" : "false"}
                >
                  <span className="moon-process-dot" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          ) : null}
        </section>
        {result ? <FrequencyResultWidget result={result} /> : null}
      </div>
      <aside className="moon-card moon-card--aside">
        <h2 className="moon-aside-title">의식의 작동 방식</h2>
        <ol className="moon-list">
          <li>소원 속 감정, 방향성, 분위기를 OpenAI가 구조화된 키워드로 해석합니다.</li>
          <li>
            해석된 결을 바탕으로 브라우저에서 만들 수 있는 주파수 공식을 안전한 파라미터로
            조립합니다.
          </li>
          <li>당신의 기기에서 직접 3분 오디오를 생성하고, 미리듣기와 MP3 다운로드를 제공합니다.</li>
        </ol>
        <p className="moon-meta">기록은 남기지 않으며, 결과는 이 세션 안에서만 머뭅니다.</p>
      </aside>
    </div>
  );
}
