"use client";

import type { FrequencyResult } from "@/entities/frequency";
import { useRenderedFrequencyAudio } from "@/features/render-frequency-audio";
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
    <section className="moon-card moon-result" aria-live="polite">
      <div className="moon-result-eyebrow">당신의 공명 결과</div>
      <div className="moon-result-header">
        <div>
          <h2 className="moon-result-title">{result.title}</h2>
          <p className="moon-subtitle">{result.subtitle}</p>
        </div>
        <div className="moon-chip-list">
          {result.analysis.intentKeywords.map((keyword) => (
            <span key={keyword} className="moon-chip">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="moon-section-grid">
        <div className="moon-panel">
          <h3 className="moon-section-title">분석된 결</h3>
          <p>
            {result.analysis.moodKeywords.join(", ")}의 감정을 중심으로 장면을 정리했고,{" "}
            {result.analysis.imagery.join(", ")} 이미지를 사용해 오디오의 질감을 잡았습니다.
          </p>
        </div>
        <div className="moon-panel">
          <h3 className="moon-section-title">감정 엔진 해석</h3>
          <p>{result.description}</p>
        </div>
      </div>

      <div className="moon-section-grid">
        <div className="moon-panel">
          <h3 className="moon-section-title">정서 프로필</h3>
          <p>
            {result.wishEmotionProfile.emotionLabels.join(", ")} 축으로 읽었고, valence{" "}
            {result.wishEmotionProfile.vad.valence.toFixed(2)}, arousal{" "}
            {result.wishEmotionProfile.vad.arousal.toFixed(2)}, dominance{" "}
            {result.wishEmotionProfile.dominance.toFixed(2)}로 정규화했어요.
          </p>
          <p className="moon-quiet">
            language {result.wishEmotionProfile.language} · ambiguity{" "}
            {result.wishEmotionProfile.ambiguity.toFixed(2)} · confidence{" "}
            {result.wishEmotionProfile.confidence.toFixed(2)}
          </p>
        </div>
        <div className="moon-panel">
          <h3 className="moon-section-title">추천 청취 상황</h3>
          <p>{result.listeningGuide}</p>
        </div>
      </div>

      <div className="moon-meta-grid" aria-label="공명 메타 정보">
        <div className="moon-meta-card">
          <strong>조절 방향</strong>
          <span>{getRegulationTargetLabel(result.regulationTarget)}</span>
        </div>
        <div className="moon-meta-card">
          <strong>톤</strong>
          <span>{getToneLabel(result.analysis.tone)}</span>
        </div>
        <div className="moon-meta-card">
          <strong>에너지</strong>
          <span>{getEnergyLabel(result.analysis.energy)}</span>
        </div>
        <div className="moon-meta-card">
          <strong>오디오 공식</strong>
          <span>{getRecipeSummary(result.audioRecipe)}</span>
        </div>
      </div>

      <div className="moon-panel">
        <h3 className="moon-section-title">엔진 근거</h3>
        <p>{result.evidenceTrace.map((trace) => trace.note).join(" ")}</p>
      </div>

      <div className="moon-audio-panel">
        <div className="moon-audio-header">
          <div>
            <h3 className="moon-section-title">당신의 주파수</h3>
            <p className="moon-quiet">
              {audio.isRendering
                ? "브라우저에서 mp3를 만들고 있어요. 잠시만 기다리면 바로 재생할 수 있어요."
                : "조용한 공간에서 낮은 볼륨으로 먼저 들어보세요."}
            </p>
          </div>
          <span className="moon-audio-badge">
            {audio.url ? "재생 준비 완료" : "오디오 생성 중"}
          </span>
        </div>
        <p className="moon-sr-only" aria-live="polite">
          {audio.isRendering
            ? "브라우저에서 mp3를 만들고 있어요. 잠시만 기다리면 바로 재생할 수 있어요."
            : "조용한 공간에서 낮은 볼륨으로 먼저 들어보세요."}
        </p>
        {audio.error ? <p className="moon-error">{audio.error}</p> : null}
        {audio.url ? <audio className="moon-audio" controls src={audio.url} /> : null}
        <div className="moon-footer-row">
          <span className="moon-quiet">
            {audio.url ? "생성이 완료되었어요." : "첫 생성에는 약간 더 시간이 걸릴 수 있어요."}
          </span>
          {audio.url && audio.fileName ? (
            <a className="moon-link-button" download={audio.fileName} href={audio.url}>
              MP3 다운로드
            </a>
          ) : (
            <button className="moon-button" type="button" disabled>
              MP3 준비 중...
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
