import { test, expect } from "@playwright/test";

// ToDoリストのCRUD E2Eテスト

test("ToDoCRUD", async ({ page }) => {
  // まずは新規ユーザーでサインアップ＆ログイン
  const uniqueEmail = `cruduser+${Date.now()}@example.com`;
  const password = "password123";
  await page.goto(`${process.env.FORTEST_BASE_PASS}/signup`);
  await page.fill('input[name="email"]', uniqueEmail);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirm"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/todo/);

  // ToDo新規作成
  const todoTitle = `テストタスク${new Date().toISOString()}`;
  const todoDescription = "E2Eテスト用説明";
  const todoDueDate = "2099-12-31";
  await page.fill('input[name="title"]', todoTitle);
  await page.fill('input[name="description"]', todoDescription);
  await page.selectOption('select[name="priority"]', "high");
  await page.fill('input[name="due_date"]', todoDueDate);
  await page.click('button[type="submit"]');
  // 追加後、リストに表示されることを確認（data-testidで取得）
  const todoItem = page.getByTestId("todo-item");
  await expect(todoItem.getByLabel("タイトル")).toHaveValue(todoTitle);
  await expect(todoItem).toBeVisible();

  // ToDo編集（タイトルを変更）
  const newTitle = todoTitle + "_編集済み";
  await todoItem.getByLabel("タイトル").fill(newTitle);
  // 編集は自動保存想定。
  await expect(todoItem.getByLabel("タイトル")).toHaveValue(newTitle);
  await expect(page.getByTestId("todo-item").getByLabel("タイトル")).toHaveValue(newTitle);

  // ToDo完了/未完了切り替え
  const completedCheckbox = await todoItem.locator('[data-testid="todo-completed-checkbox"]').first(); //MUIのチェックボックスコンポーネント
  const checkbox_inner = await todoItem.locator('[data-testid="todo-completed-checkbox"] input[type="checkbox"]'); //中身のチェックボックス本体
  await completedCheckbox.scrollIntoViewIfNeeded();
  await completedCheckbox.click();
  await expect(checkbox_inner).toBeChecked({ timeout: 3000 });

  // ToDo削除
  await todoItem.getByRole("button", { name: "削除" }).dblclick();
  // 削除後、リストから消えることを確認
  await expect(page.getByTestId("todo-item").filter({ hasText: newTitle })).not.toBeVisible();
});
