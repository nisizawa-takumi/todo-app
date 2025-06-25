# frontend ディレクトリ構成・仕様ドキュメント

## 概要
このディレクトリは、Todoアプリのフロントエンド（ユーザーインターフェース）を構成します。
主な技術: React（またはNext.js）, TypeScript, API連携, Docker対応

---

## ディレクトリ構成（例: Next.jsの場合）

```
frontend/
  package.json           # 依存管理・スクリプト
  tsconfig.json          # TypeScript設定
  next.config.js         # Next.js設定
  public/                # 静的ファイル
  src/
    pages/               # ルーティングページ（Next.js）
      index.tsx          # トップページ
      login.tsx          # ログインページ
      register.tsx       # ユーザー登録ページ
      todos.tsx          # Todo一覧・操作ページ
    components/          # 再利用UIコンポーネント
      TodoList.tsx
      TodoItem.tsx
      Header.tsx
      ...
    hooks/               # カスタムフック(API連携等)
      useTodos.ts
      useAuth.ts
    utils/               # ユーティリティ関数
      apiClient.ts       # API通信ラッパー
      ...
    styles/              # CSS/SCSS/モジュール
      globals.css
      ...
  .env.local             # 環境変数（API_BASE等）
  Dockerfile             # Dockerビルド用
  ...
```

---

## 主要ファイル・役割

- **src/pages/**
  - Next.jsのルーティングページ。各画面のエントリポイント。
- **src/components/**
  - UI部品。Todoリスト、フォーム、ヘッダーなど再利用可能なReactコンポーネント。
- **src/hooks/**
  - カスタムフック。API連携や認証状態管理など。
- **src/utils/**
  - APIクライアントや共通関数。
- **public/**
  - 画像やfaviconなど静的ファイル。
- **styles/**
  - グローバルCSSやモジュールCSS。
- **.env.local**
  - APIエンドポイントや環境変数の設定。

---

## API連携
- バックエンド（例: http://localhost:4000）とfetch/axios等で通信
- JWT Cookie認証時は`credentials: 'include'`を必ず指定
- APIエラー時のハンドリング・認証切れ時のリダイレクト等も考慮

---

## 開発・運用Tips
- `npm run dev` で開発サーバー起動
- `npm run build` で本番ビルド
- `docker compose up` でバックエンド・フロントエンド一括起動
- `.env.local`でAPI_BASE等を設定

---

## 参考
- Next.js公式: https://nextjs.org/docs
- React公式: https://react.dev/

---

何か不明点があれば、`src/`配下の各ファイルや`apiClient.ts`を参照してください。
