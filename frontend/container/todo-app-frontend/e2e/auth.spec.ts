import { test, expect } from "@playwright/test";

// サインアップ・ログイン・認可のE2Eテスト

test("signup→login→ToDoPage", async ({ page }) => {
  const uniqueEmail = `testuser+${Date.now()}@example.com`;
  const password = "password123";
  page.on("console", (msg) => {
    // すべてのconsole出力をターミナルに表示
    console.log(`[browser][${msg.type()}] ${msg.text()}`);
  });
  // サインアップ
  await page.goto("http://frontend:3000/signup");
  console.log(uniqueEmail);
  console.log(process.env.NEXT_PUBLIC_API_BASE);
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

  // ログアウト（必要なら実装に合わせて）
  // await page.click('button[aria-label="logout"]');

  // ログイン
  await page.goto("http://frontend:3000/login");
  await page.fill('input[name="email"]', uniqueEmail);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/todo/);
});

test("Redirects to login or signup when accessing /todo while not logged in", async ({ page }) => {
  await page.goto("http://frontend:3000/todo");
  await expect(page).toHaveURL(/login|signup/);
});
