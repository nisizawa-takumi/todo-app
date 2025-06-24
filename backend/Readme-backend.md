# backend ディレクトリ構成・仕様ドキュメント

## 概要
このディレクトリは、Todoアプリのバックエンド（APIサーバー）を構成します。
主な技術: Node.js (Express), TypeScript, Prisma ORM, MySQL, JWT認証, Docker対応

---

## ディレクトリ構成

```
backend/
  app/
    package.json         # 依存管理・スクリプト
    tsconfig.json        # TypeScript設定
    jest.config.js       # Jestテスト設定
    prisma/
      schema.prisma      # Prismaスキーマ（DB定義）
      migrations/        # マイグレーション履歴
      dev.db             # 開発用DB（sqlite時）
    src/
      index.ts           # メインAPIサーバー実装
      todo.test.ts       # 統合テスト（Jest+supertest）
      sample.test.ts     # サンプルテスト
      generated/         # Prisma自動生成コード
  docker-compose.yaml    # Docker統合起動設定
```

---

## 主要ファイル・役割

- **src/index.ts**
  - Expressアプリ本体。APIエンドポイント、認証、バリデーション、エラーハンドリングを実装。
  - JWT（HttpOnly Cookie）による認証、PrismaによるDB操作、CORS・セキュリティ設定。

- **src/todo.test.ts**
  - Jest+supertestによるAPI自動テスト。ユーザー登録・認証・Todo CRUDの正常系/異常系を検証。

- **prisma/schema.prisma**
  - DBスキーマ定義。User/Todoテーブル、リレーション、型などを記述。

- **docker-compose.yaml**
  - MySQL・バックエンド・フロントエンドの統合起動設定。開発・検証環境を簡単に再現可能。

---

## API仕様（抜粋）

- `POST /register`  ユーザー登録（email, password）
- `POST /login`     ログイン（JWT発行、Cookieセット）
- `GET  /me`        自分のユーザー情報取得（認証必須）
- `GET  /allTodos`  自分のTodo一覧取得（認証必須）
- `POST /createTodo`  Todo新規作成（認証必須）
- `PUT  /editTodo/:id` Todo編集（認証必須、自分のTodoのみ）
- `DELETE /deleteTodo/:id` Todo削除（認証必須、自分のTodoのみ）
- `POST /bulkUpdateTodos` Todo一括更新（認証必須、自分のTodoのみ）

- 認証はJWT（HttpOnly Cookie or Authorizationヘッダー）で行う。
- レスポンスは `{ success: true/false, data, error }` 形式で統一。

---

## セキュリティ・バリデーション
- パスワードはbcryptでハッシュ化
- JWTは1日有効、Cookieはsecure/sameSite/lax設定
- CORSは`http://localhost:3000`のみ許可
- APIごとに認証・権限チェック、入力バリデーションあり

---

## テスト・CI
- Jest+supertestでAPI自動テスト
- テスト前にDBクリーンアップ、ユーザー登録・認証・CRUD検証

---

## 開発・運用Tips
- `npx jest` でテスト実行
- `docker compose up` でMySQL/バックエンド/フロントエンド一括起動
- DBスキーマ変更時は `npx prisma migrate dev` を利用

---

## 参考
- Prisma公式: https://www.prisma.io/docs
- Express公式: https://expressjs.com/
- Jest公式: https://jestjs.io/

---

何か不明点があれば、`src/index.ts`や`prisma/schema.prisma`を参照してください。
