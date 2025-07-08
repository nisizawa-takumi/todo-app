import { test, expect } from "@playwright/test";

// トップページが正しく表示されるかの基本テスト
// 必要に応じてURLやテキストは調整してください

test("topPage", async ({ page }) => {
  await page.goto(`${process.env.FORTEST_BASE_PASS}/`);
  await expect(page).toHaveTitle(/ToDo-app/);
  await expect(page.getByRole("heading", { name: /ToDo/i })).toBeVisible();
});
