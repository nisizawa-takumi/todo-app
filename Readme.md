# Todo アプリ 起動手順

## 初めに

vscode では.md ファイルは右クリックでビューアが開く
わからなかった or 詰まったことがあったら問題または対処結果をここに追記

## 前提条件

- WSL の Ubuntu 内で Docker および Docker Compose がインストールされていること
- /home/<ubuntu ユーザ名>/に todo-app リポジトリを置くこととする

## 起動方法

※この起動方法をそのまま copilot に投げても各工程についていい感じの説明をしてくれます。気になる部分は適宜質問して掘り下げてもいいかもしれません。

1. リポジトリのルートディレクトリに移動します。

   ```sh
   cd /home/<ubuntuユーザー名>/todo-app
   ```

2. フロントエンド用環境変数を設定します。(セキュリティのため、.env ファイルは.gitignore している。)
   (今はまだないが)今後セキュリティ的に公開できないものがあれば、.env.example には追記しないため、直接西澤から環境変数をもらう必要がある。

   ```sh
   cp frontend/container/todo-app-frontend/.env.example frontend/container/todo-app-frontend/.env
   ```

3. Docker Compose でコンテナを起動します。

   ```sh
   docker compose up -d
   ```

4. 数分待ちます。

   ```sh
   docker compose logs -f frontend
   ```

   このコマンドで、フロントエンドのコンテナの処理のログが見れます。
   何かが始まったっぽいログが出れば、それでコンテナの立ち上げ完了です。(Storybook 9.0.10 for nextjs-vite started 的なもの)
   フロントエンドのコンテナの処理が終わっていれば、多分他のコンテナの処理も終わってます。（多分フロントエンドが一番立ち上げ重いため）

5. (ai 機能を使いたいなら)ai をダウンロードします。重いので注意
   他に使う ai モデルがあるかもしれません　あんまり見てません

   ```sh
   docker compose exec ollama ollama pull ezo-gemma-2-jpn:2b-instruct-q8_0
   docker compose exec ollama ollama pull gemma3:4b
   ```

6. (動かなかったときにやってください)以下のコマンドを実行します。(backend の環境変数の設定)

   ```sh
   cp /backend/app/.env.example /backend/app/.env
   ```

## playwright エラー出る件について

いろいろ考えてみたんですが現状の設計だと cookie の受け渡しがクロスオリジンになるせいでうまくテストできなかった、、、他にも原因あったらごめんなさい
詳細は/todo-app/KnowHow/nisizawa/playwright 勉強したときの.md の下のほう
あと playwright を実行するときは環境変数の変更が必要です。frontend/container/todo-app-frontend/.env に行ってコメントイン/コメントアウトしたのち、コンテナを立ち上げ直して下さい。(docker compose down/docker compose up -d)

## コンテナの停止

```bash
docker compose down
```

## よくあるコマンド

- コンテナのログ確認:  
  `docker compose logs`

- コンテナの中でターミナルを開く:  
  `docker compose exec <docker-compose.yml内のservices:直下(「frontend」など)> bash`

## よくあるトラブル・FAQ

### 1. ポートが既に使われている

エラー例:  
`Bind for 0.0.0.0:3000 failed: port is already allocated`

**対処法:**  
他で同じポートを使っているプロセスを停止するか、`docker-compose.yml` のポート番号を変更してください。

---

### 2. 権限エラーが発生する

エラー例:  
`Permission denied` や `EACCES` など

**対処法:**  
下記「所有権の変更について」のコマンドを実行してください。

---

#### Docker デーモンへのアクセス権限がない場合

エラー例:  
`permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock`

**対処法:**  
Docker コマンドを実行するユーザーが `docker` グループに所属しているか確認してください。  
所属していない場合は、以下のコマンドで追加し、再ログインしてください。

```sh
sudo usermod -aG docker <ubuntuユーザー名>
```

このコマンドは、現在のユーザーを "docker" グループに追加するためのものです。
"docker" グループに所属することで、sudo を使わずに docker コマンドを実行できるようになります。
<あなたのユーザー名> の部分は、実際に追加したいユーザー名（例: yourname）に置き換えてください。
例: sudo usermod -aG docker yourname
コマンドの意味:

- sudo: 管理者権限でコマンドを実行
- usermod: ユーザーアカウントを変更するコマンド
- -aG: 指定したグループにユーザーを追加（-a: 追加, -G: グループ指定）
- docker: 追加するグループ名
- <あなたのユーザー名>: 追加対象のユーザー名
  変更を反映するには、一度ログアウトして再ログインする必要があります。
  これは、Windows 側のコマンドプロンプトや PowerShell で

```
wsl --shutdown
wsl
```

## とすればいい。

### 3. 変更が反映されない

**対処法:**  
Docker イメージのキャッシュが原因の場合があります。以下のコマンドで再ビルドしてください。

```sh
docker compose up --build
```

---

### 4. コンテナがすぐに終了する

**対処法:**  
`docker compose logs` でログを確認し、エラー内容を特定してください。依存サービス（DB など）が起動していない場合もあります。

---

### 5. TypeError: Invalid URL が出て npm が使えない

WSL 内で win にインストールされた nodejs を使っていたためだった。
WSL 内で nodejs をインストールするか、すでに用意されたコンテナ内の nodejs 環境を使う
front-end コンテナ、back-end コンテナともに nodejs 環境を整備してあります

WSL 内で nodejs をインストールの場合(やらなくていいと思う)

```bash
sudo apt update
sudo apt install nodejs npm
node -v
npm -v
```

コンテナを使う場合

```bash
docker compose up -d
docker compose exec frontend bash
```

等とすればコンテナに入ることができる。コンテナ内では nodejs が使えて、npm も使える。

## その他

### 所有権の変更について

以下のコマンドは、`frontend/app` および `backend/app` ディレクトリの所有者を `<ubuntuユーザ名>` ユーザーおよびグループに再帰的に変更します。  
これにより、ファイルやディレクトリへのアクセス権限の問題を防ぐことができます。

```sh
sudo chown -R <ubuntuユーザ名>:<ubuntuユーザ名> /home/<ubuntuユーザ名>/todo-app/frontend/app
sudo chown -R <ubuntuユーザ名>:<ubuntuユーザ名> /home/<ubuntuユーザ名>/todo-app/backend/app
```

- `sudo`: 管理者権限でコマンドを実行します。
- `chown`: ファイルやディレクトリの所有者・グループを変更します。
- `-R`: 指定したディレクトリ以下を再帰的に処理します。
- `<ubuntuユーザ名>:<ubuntuユーザ名>`: 所有者:グループ を指定します。
