import { test, expect } from "@playwright/test";

// ToDoリストのCRUD E2Eテスト

test("ToDoCRUD", async ({ page }) => {
  // まずは新規ユーザーでサインアップ＆ログイン
  const uniqueEmail = `cruduser+${Date.now()}@example.com`;
  const password = "password123";
  await page.goto("http://frontend:3000/signup");
  await page.fill('input[name="email"]', uniqueEmail);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirm"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/todo/);

  // ToDo新規作成
  await page.fill('input[name="new-todo"]', "Playwrightで追加");
  await page.click('button[type="submit"]');
  await expect(page.getByText("Playwrightで追加")).toBeVisible();

  // ToDo編集（例: 編集ボタンがある場合）
  // await page.click('button[aria-label="edit-Playwrightで追加"]');
  // await page.fill('input[name="edit-todo"]', "Playwrightで編集");
  // await page.click('button[type="submit"]');
  // await expect(page.getByText("Playwrightで編集")).toBeVisible();

  // ToDo削除（例: 削除ボタンがある場合）
  // await page.click('button[aria-label="delete-Playwrightで追加"]');
  // await expect(page.getByText("Playwrightで追加")).not.toBeVisible();

  // 必要に応じて完了/未完了切り替えも追加
});
