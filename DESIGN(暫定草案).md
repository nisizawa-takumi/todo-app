# ToDoアプリ設計図（Next.js + React + Material UI + Prisma + TypeScript + Express + Bootstrap + Jest + MySQL）

---

## 1. 全体構成

```
+------------------+         HTTP/JSON         +-----------------------+
|  フロントエンド  | <======================>  |   バックエンドAPI      |
| (Next.js + React |        REST API           |   (TypeScript +       |
|   + Material UI) |                           |    Express + Prisma)  |
+------------------+                           +-----------------------+
         |                                                  |
         |                                                  |
         |----------------- DBアクセス (Prisma ORM) --------|
                                |
                                v
                      +----------------------+
                      |   MySQL データベース  |
                      +----------------------+
```

---

## 2. 技術スタック・利用技術

- **フロントエンド**  
  - Next.js（Reactベースのフレームワーク、TypeScriptサポート）
  - Material UI（UIコンポーネント）
  - Bootstrap（必要に応じてスタイル追加）
- **バックエンド**  
  - Express.js（TypeScriptで記述）
  - Prisma（O/R Mapperとして利用、MySQLと接続）
  - Jest（テスト）
- **データベース**  
  - MySQL

---

## 3. ディレクトリ構成例

```
todo-app/
├── frontend/                   # Next.js + React + Material UI
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── ... 
├── backend/                    # Express + TypeScript + Prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── prisma/             # Prisma設定
│   │   └── ...
│   ├── tests/                  # Jestによるテスト
│   └── ...
└── README.md
```

---

## 4. ToDo アプリの要件

- ToDo項目を新規作成できる
- ToDo項目の一覧を表示できる
- ToDo項目に対して「完了」をマークできる
- ToDo項目を削除できる

---

## 5. データベース（Prismaスキーマ例）

```prisma name=backend/src/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Todo {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 6. バックエンドAPI設計（Express + TypeScript）

| メソッド | エンドポイント   | 内容                | リクエストボディ例             | レスポンス例               |
|----------|------------------|---------------------|-------------------------------|---------------------------|
| GET      | /api/todos       | ToDo一覧取得        | -                             | [{...todo}, ...]          |
| POST     | /api/todos       | ToDo新規作成        | { title, description }        | {...todo}                 |
| PUT      | /api/todos/:id   | ToDo完了/編集       | { title?, description?, completed? } | {...todo}         |
| DELETE   | /api/todos/:id   | ToDo削除            | -                             | { message: "deleted" }    |

---

## 7. フロントエンド構成（Next.js + React + Material UI + Bootstrap）

- **ページ例**
  - `/` … ToDo一覧表示 + 追加フォーム
- **主なコンポーネント**
  - TodoList（ToDoリスト表示、完了/削除ボタン付き）
  - TodoForm（新規作成用フォーム）
  - TodoItem（単一ToDo項目の表示）
- **UIデザイン**
  - Material UIのコンポーネントを活用
  - 必要に応じてBootstrapで装飾やレイアウト調整

---

## 8. テスト

- **バックエンド：**  
  Jestでユニットテスト、APIエンドポイントのテスト
- **フロントエンド：**  
  必要に応じてReact Testing LibraryやJestでUIテスト

---

## 9. 補足

- API仕様は`/backend/README.md`やSwaggerなどで共有
- 型安全性はTypeScriptで担保
- PrismaによりDB操作も型安全、マイグレーションも容易

---

# まとめ

- **全体をNext.js + React + Material UIで構築**
- **バックエンドはTypeScript + Express + Prisma（MySQL）**
- **要件（作成・一覧・完了・削除）はREST APIで満たす**
- **テスト用にJestも導入**
- **ディレクトリ分割で役割を明確化**