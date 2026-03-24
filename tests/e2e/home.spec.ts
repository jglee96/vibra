import { expect, test } from "@playwright/test";

test("renders the home experience", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "소원을 주파수로 바꾸는 밤의 의식" }),
  ).toBeVisible();
  await expect(page.getByLabel("당신의 소원")).toBeVisible();
});
