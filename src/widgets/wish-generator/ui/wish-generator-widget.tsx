"use client";

import { useState } from "react";

import { SubmitWishForm, useSubmitWish } from "@/features/submit-wish";
import { FrequencyResultWidget } from "@/widgets/frequency-result";
import { generationSteps } from "@/widgets/wish-generator/model/generation-steps";

export function WishGeneratorWidget() {
  const [wish, setWish] = useState("");
  const { error, isPending, result, submitWish } = useSubmitWish();

  return (
    <div className="moon-layout">
      <div className="moon-main-column">
        <section className="moon-card moon-card--form">
          <div className="moon-card-heading">
            <div>
              <p className="moon-section-kicker">입력</p>
              <h2 className="moon-card-title">당신의 바람을 또렷하게 남겨주세요</h2>
            </div>
            <p className="moon-card-copy">
              구체적인 장면과 감정을 함께 적을수록 더 안정적인 공명 패턴을 만들 수 있어요.
            </p>
          </div>
          <SubmitWishForm
            error={error}
            isPending={isPending}
            onChange={setWish}
            onSubmit={submitWish}
            value={wish}
          />
          {isPending ? (
            <div className="moon-process" aria-live="polite" aria-label="생성 진행 상태">
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
        <p className="moon-section-kicker">안내</p>
        <h2 className="moon-aside-title">어떻게 정리되나요?</h2>
        <div className="moon-grouped-list" role="list" aria-label="작동 방식">
          <div className="moon-grouped-item" role="listitem">
            <strong>감정 해석</strong>
            <span>소원의 분위기와 방향성을 읽어 핵심 키워드로 정리합니다.</span>
          </div>
          <div className="moon-grouped-item" role="listitem">
            <strong>공명 설계</strong>
            <span>안전한 파라미터 안에서 주파수 조합과 리듬 패턴을 맞춥니다.</span>
          </div>
          <div className="moon-grouped-item" role="listitem">
            <strong>로컬 생성</strong>
            <span>브라우저에서 직접 3분 오디오를 만들고 바로 재생하거나 저장합니다.</span>
          </div>
        </div>
        <div className="moon-aside-note">
          <strong>프라이버시</strong>
          <p>입력한 문장과 결과는 저장하지 않으며, 현재 세션 안에서만 머뭅니다.</p>
        </div>
      </aside>
    </div>
  );
}
