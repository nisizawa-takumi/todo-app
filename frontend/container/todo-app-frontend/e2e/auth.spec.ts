import { test, expect } from "@playwright/test";

// サインアップ・ログイン・認可のE2Eテスト

test("signup→login→ToDoPage", async ({ page, context }) => {
  const uniqueEmail = `testuser+${Date.now()}@example.com`;
  const password = "password123";
  page.on("console", (msg) => {
    // すべてのconsole出力をターミナルに表示
    console.log(`[browser][${msg.type()}] ${msg.text()}`);
  });
  // サインアップ
  await page.goto(`${process.env.FORTEST_BASE_PASS}/signup`);
  console.log(uniqueEmail);
  console.log(process.env.FORTEST_BASE_PASS);
  await page.fill('input[name="email"]', uniqueEmail);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirm"]', password);
  await page.click('button[type="submit"]');
  try {
    await expect(page).toHaveURL(/\/todo/, { timeout: 10000 });
  } catch (e) {
    await page.screenshot({ path: "test-results/signup-error.png" });
    throw e;
  }

  // クッキー削除（ログアウト相当）
  await context.clearCookies();

  // ログイン
  await page.goto(`${process.env.FORTEST_BASE_PASS}/login`);
  await page.fill('input[name="email"]', uniqueEmail);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/todo/);
});

test("Redirects to login or signup when accessing /todo while not logged in", async ({ page }) => {
  await page.goto(`${process.env.FORTEST_BASE_PASS}/todo`);
  await expect(page).toHaveURL(/login|signup/);
});
