import type { Analysis } from "@/entities/frequency/model/frequency";
import { withObjectParticle } from "@/entities/wish/lib/korean-particle";

export function buildFrequencyTitle(wish: string) {
  const normalized = wish.trim().replace(/[.!?]/g, "");
  const compactWish = normalized.length > 24 ? `${normalized.slice(0, 24)}...` : normalized;

  return `${withObjectParticle(compactWish)} 위한 주파수`;
}

export function buildFrequencySubtitle(analysis: Analysis) {
  return `${analysis.moodKeywords.join(" · ")}의 결을 머금은 3분 오디오 의식`;
}
