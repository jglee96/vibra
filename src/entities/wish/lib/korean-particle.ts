const finalConsonantExclusion = 8;

export function withObjectParticle(word: string) {
  const trimmed = word.trim();

  if (!trimmed) {
    return word;
  }

  const lastChar = trimmed.charCodeAt(trimmed.length - 1);
  const hangulStart = 0xac00;
  const hangulEnd = 0xd7a3;

  if (lastChar < hangulStart || lastChar > hangulEnd) {
    return `${trimmed}을`;
  }

  const hasFinalConsonant = (lastChar - hangulStart) % 28 !== 0;
  const usesRieul = (lastChar - hangulStart) % 28 === finalConsonantExclusion;

  return `${trimmed}${hasFinalConsonant && !usesRieul ? "을" : "를"}`;
}
