# コンテナ起動方法

リポジトリ内で、

```bash
dokcer compose up -d
```

とするだけ。自動で開発用サーバが立ち上がります。
http://localhost:3000/で nextjs サイト、http://localhost:6006/で storybook サイトが見れます。
frontend/container/todo-app-frontend 内のファイルを書き換えると、自動でサイトの情報も書き換わるはず。
これでうまくいくはずだと思ってますが、行かなかった開発メンバーは連絡して

# コンテナ内で行った環境構築手順メモ(pull とか clone したものを動かすときはやらなくていいはず。 これはあくまでコンテナ内にプロジェクトが何もなかった時の初期設定手順)

まずコンテナに入る

```bash
docker compose up -d
docker compose exec frontend bash
```

以下、コンテナ内での操作
~/container にいることを想定

```bash
npx create-next-app@latest
```

```bash
Need to install the following packages:
create-next-app@15.3.3
Ok to proceed? (y) y
✔ What is your project named? … todo-app-frontend
✔ Would you like to use TypeScript? … No / <Yes>
✔ Would you like to use ESLint? … No / <Yes>
✔ Would you like to use Tailwind CSS? … <No> / Yes #MaterialUIを使うため
✔ Would you like your code inside a `src/` directory? … No / <Yes>
✔ Would you like to use App Router? (recommended) … No / <Yes>
✔ Would you like to use Turbopack for `next dev`? … <No> / Yes #試験的な機能っぽい？
✔ Would you like to customize the import alias (`@/*` by default)? … <No> / Yes
Creating a new Next.js app in /container/todo-app-frontend.
```

```bash
cd todo-app-frontend/
```

~/container/todo-app-frontend にいることを想定

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
```

```bash
npm create storybook@latest
```

```bash
Need to install the following packages:
create-storybook@9.0.10
Ok to proceed? (y) y
~~
? New to Storybook? › - Use arrow-keys. Return to submit.
❯   Yes: Help me with onboarding
    No: Skip onboarding & don't ask again
✔ Do you want to manually choose a Storybook project type to install? … no
```

```bash
npm install --save-dev jest
npm install --save-dev @types/jest ts-jest babel-jest
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

補足: copilot: プロジェクトで最新の JavaScript 機能や TypeScript を使っている場合、そのままだと Jest が理解できないコードがあるため、Babel でテスト実行時もトランスパイルする必要があります。そのため、babel-jest というアダプタを入れます。

```bash
npm init playwright@latest
```

```bash
Need to install the following packages:
create-playwright@1.17.136
Ok to proceed? (y) y
> npx
> create-playwright
Getting started with writing end-to-end tests with Playwright:
Initializing project in '.'
✔ Do you want to use TypeScript or JavaScript? · TypeScript
✔ Where to put your end-to-end tests? · tests
✔ Add a GitHub Actions workflow? (y/N) · true
✔ Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true
✔ Install Playwright operating system dependencies (requires sudo / root - can be done manually via 'sudo npx playwright install-deps')? (y/N) · true
Installing Playwright Test (npm install --save-dev @playwright/test)…
```

```bash
npm install --save-dev concurrently # 複数のnpmスクリプトを並列実行するためのツール
```

[注:コンテナ外操作]コンテナ外(wsl)からファイルを操作できるよう、所有者を書き換え

```bash
sudo chown -R <ubuntuユーザ名>:<ubuntuユーザ名> /home/<ubuntuユーザ名>/todo-app/frontend/container
```

# 構成(まだかなり雑、変わる可能性高)

```
todo/
　├── api.js        // fetchTodos, addTodo, deleteTodo など API 通信
　├── logic.js      // filterTodos, validateTodo, sortTodos などロジック
　└── rendering.js  // TodoList, TodoItem, AddTodoForm など UI
```

json-server を用いたダミー api サーバによる開発、テスト
