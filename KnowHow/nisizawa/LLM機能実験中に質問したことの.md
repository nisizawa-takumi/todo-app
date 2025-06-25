# LLM 機能実験中に質問したこと（QA 形式）

---

## Q. Dockerfile でパッケージをインストールする場合と、docker-compose.yml の command でインストールする場合の違いは？

**A.**
両者の違いは「どのタイミングで」「どの層（イメージ or コンテナ）」にパッケージがインストールされるか、です。

- **Dockerfile でイメージビルド時にインストール**

  - タイミング: `docker build` 時（イメージ作成時）
  - インストール先: 作成される Docker イメージの中
  - メリット:
    - どのコンテナでも、イメージから起動すれば最初からパッケージが入っている
    - 再起動や exec で入っても常に使える
    - ビルドキャッシュが効くので、起動が速い
  - デメリット:
    - 依存パッケージを変えたら再ビルドが必要

- **docker-compose.yml の command でインストール**
  - タイミング: コンテナ起動時（`docker compose up` 時）に毎回コマンドでインストール
  - インストール先: 起動したそのコンテナの一時的なファイルシステム
  - メリット:
    - 依存パッケージをすぐに変えられる（ビルド不要）
  - デメリット:
    - 毎回インストールが走るので起動が遅い
    - exec で新しいシェルを開くとパッケージが使えない場合がある
    - 再起動時にパッケージが消えることもある

**結論:**  
本番や開発で安定して使いたい場合は Dockerfile でイメージビルド時にインストールが推奨です。  
一時的な検証や素早い試行錯誤なら command でのインストールも可ですが、安定性・再現性は低いです。

---

## Q. Ollama（オラマ）とは何ですか？

**A.**
Ollama は、ローカル環境で大規模言語モデル（LLM）を簡単に動かすためのオープンソースのツール／サーバーです。

### 主な特徴

- **ローカルで動作**  
  PC やサーバー上で、ChatGPT のような LLM を自分のマシンで直接動かせます（クラウド不要）。
- **多様なモデル対応**  
  Llama、Gemma、Qwen、ELYZA など、さまざまなオープンソース LLM をサポート。
- **API サーバー機能**  
  OpenAI API 互換のエンドポイントを提供し、curl や Python の requests、各種アプリから簡単に利用可能。
- **簡単なモデル管理**  
  `ollama pull モデル名`でモデルのダウンロード、`ollama run モデル名`で対話開始など、コマンドがシンプル。
- **CPU/GPU 両対応**  
  GPU があれば高速、CPU だけでも動作可能（ただし速度は遅くなります）。

---

## Q. Ollama の使い方は？

**A.**

### モデルのダウンロード

```
ollama pull llama2
```

### 対話開始

```
ollama run llama2
```

### API サーバーとして利用

サーバーを立てて、他のアプリやスクリプトから HTTP リクエストで LLM を利用できます。

---

## Q. Ollama はどんなときに便利ですか？

**A.**
Ollama は「ローカルで LLM を簡単に動かすためのサーバー＆CLI ツール」です。  
開発・検証・個人利用などで、クラウドに頼らず LLM を使いたい場合に非常に便利です。

---

## Q1. CORS エラーとは何ですか？なぜ発生しますか？

**A1.**  
CORS（Cross-Origin Resource Sharing）は、異なるオリジン（ドメインやポート）間でのリクエストを制御するブラウザのセキュリティ機能です。  
API サーバーが `Access-Control-Allow-Origin` ヘッダーを返さない場合、ブラウザはフロントエンドからのリクエストをブロックします。  
例：フロントエンド（http://localhost:3000）からバックエンド API（http://localhost:8080）へ直接リクエストした際、API サーバー側が許可を明示していないと CORS エラーが発生します。

---

## Q2. Flask（llm-api）で CORS エラーを解消するには？

**A2.**  
`flask-cors` パッケージを使い、Flask アプリで CORS を有効化します。

**手順:**

1. `requirements.txt` に `flask-cors` を追加
2. `app.py` または `suggestSchedule.py` で以下を記述
   ```python
   from flask_cors import CORS
   app = Flask(__name__)
   CORS(app)  # 全てのオリジンからのアクセスを許可
   # 必要に応じて CORS(app, origins=["http://localhost:3000"]) のように限定も可能
   ```
3. llm-api コンテナを再ビルド・再起動
   ```sh
   docker compose build llm-api
   docker compose up -d
   ```

---

## Q3. Next.js の API ルート経由でリバースプロキシする方法は？

**A3.**  
Next.js 側で `/api/suggest-schedule` などの API ルートを用意し、サーバーサイドで llm-api にリクエストを転送すれば CORS 問題は発生しません。  
ただし、まずは llm-api 側で CORS 許可するのが手軽です。

---

## Q4. 405 Method Not Allowed エラーの原因と対策は？

**A4.**  
このエラーは「そのエンドポイントが指定した HTTP メソッド（例：POST, OPTIONS など）を許可していない」場合に発生します。  
CORS プリフライトリクエスト（OPTIONS メソッド）に対して、Flask のエンドポイントが OPTIONS を許可していないことが主な原因です。

**対策:**

- Flask のルートで `methods=['POST', 'OPTIONS']` のように明示的に指定する
- 例:
  ```python
  @app.route('/ask-llm', methods=['POST', 'OPTIONS'])
  def ask_llm():
      if request.method == 'OPTIONS':  # CORSプリフライトリクエストへの空応答
          return '', 204
      # ...既存のPOST処理...
  ```
- `flask-cors` が正しく有効化されていれば通常は自動で OPTIONS も許可されますが、明示的に書くと確実です。

---

## Q5. OPTIONS メソッドとは何ですか？

**A5.**  
OPTIONS は HTTP のメソッドの一種で、「このエンドポイントはどんなメソッドやヘッダーを受け付けますか？」を問い合わせるためのリクエストです。  
主に CORS 通信時のプリフライトリクエストとして使われます。

---

## Q6. Docker の「ボリューム（volume）」とは何ですか？

**A6.**  
Docker のボリュームは、コンテナの外（ホスト側）にデータを永続化するための仕組みです。

- コンテナを削除・再作成してもデータが消えない
- 複数のコンテナ間でデータを共有できる
- ホスト OS のディレクトリとは独立して管理される

**例:**

```yaml
volumes:
  - ollama-data:/root/.ollama
```

これは「ホスト側の ollama-data というボリュームを、コンテナ内の/root/.ollama にマウントする」という意味です。

---

## Q7. docker compose up したときに毎回 pull し直しになる場合の対策は？

**A7.**  
`docker inspect ollama-data` で `No such object: ollama-data` と出る場合、ボリュームが正しく作成・マウントされていません。

**主な原因:**

- docker-compose.yaml の volumes 定義はあるが、実際にボリュームが作成されていない
- サービス起動時にマウント先のパスや権限の問題でボリュームが作成されなかった
- `docker compose down -v` などで消えてしまった直後
- Ollama コンテナがボリュームを使わず、内部ストレージにモデルを保存している

**対策:**

1. ボリュームの再作成と確認
   ```sh
   docker volume create ollama-data
   docker volume ls
   ```
2. Ollama サービスの volumes 指定を再確認  
   docker-compose.yaml の該当部分が

   ```yaml
   ollama:
     # ...existing code...
     volumes:
       - ollama-data:/root/.ollama
   ```

   となっていることを確認。

3. Ollama コンテナを再作成

   ```sh
   docker compose down
   docker compose up -d
   ```

   で再度起動し、`docker volume ls` で ollama-data が残っているか確認。

4. モデルを pull し直し、ボリュームに保存されるか確認
   ```sh
   docker compose exec ollama ollama pull 7shi/ezo-gemma-2-jpn:2b-instruct-q8_0
   ```
   pull 後、`docker volume inspect ollama-data` でマウント先が正しいか確認。

---

## Q8. まとめ

- CORS は API サーバー側で許可ヘッダーを返す必要がある
- Flask なら flask-cors で簡単に対応可能
- Docker ボリュームはデータ永続化のために必須
- ボリュームが正しく作成・マウントされているか確認すること

---

docker compose down
docker compose up -d

で再度起動し、docker volume ls で ollama-data が残っているか確認。

4. モデルを pull し直し、ボリュームに保存されるか確認

docker compose exec ollama ollama pull 7shi/ezo-gemma-2-jpn:2b-instruct-q8_0

pull 後、docker volume inspect ollama-data でマウント先が正しいか確認。

まとめ
ollama-data ボリュームが存在しないと、モデルは永続化されません
ボリュームを明示的に作成し、正しくマウントされているか確認
それでも解決しない場合は、Ollama のバージョンや docker-compose.yaml の記述を再確認
この手順で「pull し直し問題」が解決するはずです。
