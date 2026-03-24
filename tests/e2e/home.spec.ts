import { expect, test } from "@playwright/test";

test("renders the home experience", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "소원을 차분한 주파수로 정리하는 공간" }),
  ).toBeVisible();
  await expect(page.getByLabel("당신의 소원")).toBeVisible();
  await expect(page.getByRole("button", { name: "나만의 주파수 만들기" })).toBeVisible();
});
