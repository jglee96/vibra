import { reviewWish, wishInputSchema } from "@/entities/wish/model/wish";

describe("wish review", () => {
  it("accepts specific wishes", () => {
    expect(reviewWish("대화할수록 신뢰와 매력이 깊어지는 분위기를 갖고 싶어")).toEqual({
      kind: "accepted",
      normalizedWish: "대화할수록 신뢰와 매력이 깊어지는 분위기를 갖고 싶어",
    });
  });

  it("flags unsafe wishes", () => {
    const result = reviewWish("누군가를 해치고 싶어");

    expect(result.kind).toBe("blocked");
  });

  it("asks for more clarity when wish is too vague", () => {
    const result = reviewWish("행복해지고 싶어");

    expect(result.kind).toBe("needs-clarity");
  });

  it("validates payload length", () => {
    expect(() => wishInputSchema.parse({ wish: "짧다" })).toThrow();
  });
});
