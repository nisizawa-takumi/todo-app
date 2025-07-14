import { defineConfig, devices } from "@playwright/test";

/**
 * 環境変数をファイルから読み込む例。
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Playwrightのテスト設定については以下を参照。
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e", // テストファイルを格納するディレクトリ
  outputDir: "test-results/", // 出力先をtest-results/直下に指定
  /* テストファイル内のテストを並列で実行 */
  fullyParallel: true,
  /* test.only をソースコードに残したままCIでビルドを失敗させる */
  forbidOnly: !!process.env.CI,
  /* CI環境のみリトライ回数を設定 */
  retries: process.env.CI ? 2 : 0,
  /* CI環境では並列ワーカー数を1に制限 */
  workers: process.env.CI ? 1 : undefined,
  /* レポーターの設定。詳細は https://playwright.dev/docs/test-reporters */
  reporter: [["html", { open: "never" }]],
  /* 以下は全プロジェクト共通の設定。詳細は https://playwright.dev/docs/api/class-testoptions */
  use: {
    /* `await page.goto('/')` などで使うベースURL */
    // baseURL: 'http://localhost:3000',

    /* テスト失敗時のリトライ時にトレースを収集。詳細は https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure", // 失敗時にトレースを必ず保存
  },

  /* 主要ブラウザごとのプロジェクト設定 */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* モバイル画面サイズでのテスト例 */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* ブランドブラウザでのテスト例 */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* テスト開始前にローカル開発サーバーを起動する場合の例 */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
