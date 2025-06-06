素の React ならコンポーネントのスタイルは別の CSS ファイルをインポートすることになると思います。  
Next.js、Material UI、Storybook を用いた環境だと別な書き方で書きますか？

---

## Next.js・Material UI・Storybook 環境でのスタイル管理

Next.js や Material UI、Storybook を使う場合、スタイルの書き方・管理方法は「素の React + CSS ファイル」とは少し異なるパターンがよく使われます。それぞれの特徴をまとめます。

---

### 1. Next.js

- **グローバル CSS**  
  `pages/_app.tsx` などで

  ```js
  import "../styles/globals.css";
  ```

  のようにグローバル CSS をインポートできます。

- **CSS Modules**  
  `Component.module.css` のような拡張子のファイルを使い、

  ```js
  import styles from "./Component.module.css";
  ```

  として利用。クラス名が自動的にユニーク化されるので、コンポーネント単位でのスコープ管理がしやすいです。

- **styled-jsx**  
  Next.js が標準でサポートしている CSS-in-JS の方法。コンポーネント内に
  ```jsx
  <style jsx>{`
    .example {
      color: red;
    }
  `}</style>
  ```
  という形でスタイルを記述できます。

---

### 2. Material UI (MUI)

- **CSS-in-JS（Emotion）**  
  MUI v5 以降では Emotion という CSS-in-JS ライブラリを内部的に利用しています。  
  `sx`プロパティや`styled`ユーティリティを使って、JSX 内で直接スタイルを書くことができます。

  ```jsx
  <Button sx={{ color: "primary.main", margin: 1 }}>ボタン</Button>
  ```

  または

  ```jsx
  import { styled } from "@mui/material/styles";

  const MyButton = styled(Button)({
    backgroundColor: "red",
  });
  ```

- **Theme（テーマ）のカスタマイズ**  
  MUI はテーマを定義して、アプリ全体やコンポーネント単位でカラーパレットやフォントなどを統一できます。

---

### 3. Storybook

- **コンポーネント単位でスタイリングを完結させる**  
  Storybook では 1 つのコンポーネントが独立して表示されるため、グローバル CSS や外部 CSS ファイルよりも「CSS Modules」や「CSS-in-JS」のようにコンポーネント内で完結するスタイリングが推奨されます。

- **Material UI の ThemeProvider や styled を活用**  
  Storybook の`preview.js`でテーマを提供し、MUI のコンポーネントや`styled`を使ったスタイリングが一般的です。

---

## まとめ

Next.js + MUI + Storybook の環境では

- グローバル CSS（必要な場合だけ）
- CSS Modules（Next.js の標準）
- CSS-in-JS（MUI の`sx`や`styled`など）

が主流です。  
従来の「別 CSS ファイルを import」よりも、CSS-in-JS や CSS Modules によるコンポーネント単位のスタイリングが推奨される傾向です。

---

もし具体的な書き方サンプルや推奨パターンが知りたい場合は、用途に合わせてコード例を出せますのでご相談ください！
