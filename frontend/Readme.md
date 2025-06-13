# temp めも

環境構築はもう一回ちゃんとやりたい　飛ばしすぎた

Next.js + Storybook + TypeScript +jest+Material UI+Playwright
この技術で web ページ作るときに最初どうやって環境構築すればいいですか？
3/3
3/3
Copilot said: Next.js + Storybook + TypeScript + Jest
Next.js + Storybook + TypeScript + Jest + Material UI + Playwright で Web ページを作る開発環境を構築する手順を、ざっくりと順番に説明します。

1. Next.js + TypeScript プロジェクトの作成
   bash
   npx create-next-app@latest my-app -e with-typescript
   cd my-app
2. Material UI の導入
   bash
   npm install @mui/material @emotion/react @emotion/styled

# 必要に応じてアイコン

npm install @mui/icons-material 3. Storybook の導入
bash
npx storybook@latest init
Storybook のセットアップ時に TypeScript/Next.js を自動検出してくれます。 4. Jest の導入
Next.js 公式推奨のセットアップ方法:

bash
npm install --save-dev jest @types/jest ts-jest babel-jest
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
jest.config.js または jest.config.ts を作成して、TypeScript 対応設定を追加します。 5. Playwright の導入
bash
npm install --save-dev playwright @playwright/test
npx playwright install 6. 必要な設定ファイルの調整
.storybook/main.ts の framework を @storybook/nextjs にする
jest.config.js の testEnvironment を jsdom に設定
Storybook や Playwright のビルド・テスト用のスクリプトを package.json に追加 7. サンプルコンポーネントと各種テストの作成
components/ ディレクトリに簡単な MUI コンポーネントを作成
_.stories.tsx を作り Storybook で表示
_.test.tsx を作り Jest でユニットテスト
Playwright で E2E テストを書く
まとめ
Next.js + TypeScript でプロジェクト作成
Material UI 導入
Storybook 初期化
Jest セットアップ
Playwright セットアップ
各種設定ファイルを調整
サンプルコード＆テストを書く

## 構成

```
src/
└── todo/
    ├── api.js        // fetchTodos, addTodo, deleteTodo など API 通信
    ├── logic.js      // filterTodos, validateTodo, sortTodos などロジック
    └── rendering.js  // TodoList, TodoItem, AddTodoForm など UI
```

json-server を用いたダミー api サーバによる開発、テスト
