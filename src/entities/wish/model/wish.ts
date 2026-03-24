import { z } from "zod";

export const wishInputSchema = z.object({
  wish: z
    .string()
    .trim()
    .min(6, "조금 더 구체적으로 소원을 적어주세요.")
    .max(180, "소원은 180자 이하로 적어주세요."),
});

export type WishInput = z.infer<typeof wishInputSchema>;

export type WishReview =
  | { kind: "accepted"; normalizedWish: string }
  | { kind: "blocked"; message: string }
  | { kind: "needs-clarity"; message: string };

const blockedPatterns = [
  /죽고\s*싶/i,
  /자해/i,
  /해치고\s*싶/i,
  /복수/i,
  /불법/i,
  /사기/i,
  /약물/i,
  /폭탄/i,
];

const vaguePatterns = [/좋아지고\s*싶/i, /잘\s*되고\s*싶/i, /행복해지고\s*싶/i];

export function reviewWish(input: string): WishReview {
  const normalizedWish = input.trim().replace(/\s+/g, " ");

  if (!normalizedWish) {
    return { kind: "needs-clarity", message: "원하는 변화를 한 문장으로 적어주세요." };
  }

  if (blockedPatterns.some((pattern) => pattern.test(normalizedWish))) {
    return {
      kind: "blocked",
      message:
        "안전을 해칠 수 있는 요청은 주파수로 만들 수 없어요. 대신 회복이나 안정을 위한 소원으로 다시 적어주세요.",
    };
  }

  if (normalizedWish.length < 10 || vaguePatterns.some((pattern) => pattern.test(normalizedWish))) {
    return {
      kind: "needs-clarity",
      message: "조금 더 구체적인 장면이나 감정을 넣어주면 더 잘 맞는 주파수를 만들 수 있어요.",
    };
  }

  return { kind: "accepted", normalizedWish };
}
