import { expect, test } from "@playwright/test";

test("renders the home experience", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "모든 것을 끌어당기는 밤의 주파수" }),
  ).toBeVisible();
  await expect(page.getByLabel("당신의 소원")).toBeVisible();
  await expect(page.getByRole("button", { name: "내 주파수 열기" })).toBeVisible();
});
