# React useEffect に関する質問

## Q.

useEffect 自体が react 内で非同期処理を行うための仕組みだから、その中で即時実行 await をしても非同期で処理が進んでくれるって感じか？

## A.

はい、その通りです！

useEffect は副作用（データ取得や購読など）を React のレンダリングとは別に非同期で実行するための仕組みです。そのため、useEffect の中で非同期関数を定義し、即時実行（fetchData() など）すれば、コンポーネントのレンダリングをブロックせずに非同期処理が進みます。

---

### まとめ

- useEffect は副作用を非同期で処理するための React の仕組み
- useEffect 内で非同期関数を定義し、即時実行すれば OK
- これにより、レンダリングと非同期処理が分離され、UI がスムーズに動作します

```jsx
<div style={{ textAlign: "center", fontSize: "2rem" }}>
  ローディング中...
  &lt;span
    role="img"
    aria-label="うさぎ"
    style={{
      display: "inline-block",
      animation: "spin 1s linear infinite",
    }}
  &gt;
    🐰
  &lt;/span&gt;
  &lt;style&gt;
    {`
        @keyframes spin {
            100% { transform: rotate(360deg); }
        }
    `}
  &lt;/style&gt;
&lt;/div&gt;
```

このコードは、React コンポーネント内でローディング中の状態を示すためのスピナー（アニメーション）を表示する部分です。外側の&lt;div&gt;には、テキストを中央揃え（textAlign: "center"）にし、フォントサイズを大きく（fontSize: "2rem"）するインラインスタイルが適用されています。これにより、ローディングメッセージ全体が目立つようになります。

「ローディング中...」というテキストの隣には、&lt;span&gt;要素でうさぎの絵文字（🐰）が表示されます。この&lt;span&gt;には、アクセシビリティのために role="img"と aria-label="うさぎ"が設定されており、スクリーンリーダーでも意味が伝わるようになっています。また、display: "inline-block"と animation: "spin 1s linear infinite"のスタイルが指定されており、うさぎの絵文字が 1 秒ごとに 360 度回転し続けるアニメーションが実現されています。

アニメーションの定義は、&lt;style&gt;タグ内で@keyframes spin として記述されています。100%の時点で transform: rotate(360deg)となることで、絵文字が一回転します。この&lt;style&gt;タグは JSX 内で直接記述されており、コンポーネント単位でアニメーションを定義できる点が特徴です。

このように、シンプルな構成でユーザーにローディング中であることを視覚的に伝える工夫がされています。

---

## Q.

なんで&lt;span&gt;のほうの定義と JSX での記述が両方必要なの？

## A.

この場合、&lt;span&gt;の定義と JSX での記述は役割が異なります。

- &lt;span&gt;タグは「どの要素（ここではうさぎの絵文字 🐰）にアニメーションを適用するか」を指定しています。つまり、回したい対象そのものです。
- &lt;style&gt;タグ内の@keyframes spin は、「spin という名前のアニメーションがどういう動きをするか」を定義しています。これは**アニメーションの中身（動き方）**を決めるものです。
- そして、&lt;span&gt;の style 属性で animation: "spin 1s linear infinite"と指定することで、「この span（うさぎ）に、spin アニメーションを 1 秒ごとに無限に適用してね」と指示しています。

---

### まとめ

- &lt;span&gt;は「どの要素を回すか」
- &lt;style&gt;の@keyframes は「どう回すか（動きの定義）」
- 両方必要で、片方だけではアニメーションは成立しません

---

## Q.

CSS-in-JS や CSS Modules を用いて実装するには？

## A.

はい、CSS-in-JS や CSS Modules を使うことで、アニメーション名の衝突を防ぎつつ、スコープを限定できます。  
それぞれの方法を簡単に紹介します。

---

### CSS-in-JS の場合

```js
import { css, keyframes } from "@emotion/react";

const bunnySpin = keyframes`
  100% { transform: rotate(360deg); }
`;

export default function LoadingSpinner({ variant = "default" }: LoadingSpinnerProps) {
  if (variant === "cute") {
    return (
      <div style={{ textAlign: "center", fontSize: "2rem" }}>
        ローディング中...
        <span
          role="img"
          aria-label="うさぎ"
          css={css`
            display: inline-block;
            animation: ${bunnySpin} 1s linear infinite;
          `}
        >
          🐰
        </span>
      </div>
    );
  }
  // ...existing code...
}
```

---

### CSS Modules の場合

```css
/* LoadingSpinner.module.css */
.bunny {
  display: inline-block;
  animation: bunnySpin 1s linear infinite;
}

@keyframes bunnySpin {
  100% {
    transform: rotate(360deg);
  }
}
```

```js
import styles from "./LoadingSpinner.module.css";

export default function LoadingSpinner({ variant = "default" }: LoadingSpinnerProps) {
  if (variant === "cute") {
    return (
      <div style={{ textAlign: "center", fontSize: "2rem" }}>
        ローディング中...
        <span role="img" aria-label="うさぎ" className={styles.bunny}>
          🐰
        </span>
      </div>
    );
  }
  // ...existing code...
}
```

---

## Q.

CSS-in-JS のほうが抽象化の境界がはっきりしてて、制御しやすいのかな？

## A.

はい、その通りです。  
CSS-in-JS は「コンポーネントごとにスタイルを閉じ込める」ことができるため、抽象化の境界が明確で、スタイルのスコープや依存関係を制御しやすいです。

**主なメリット:**

- スコープが自動で限定される（他のコンポーネントと衝突しない）
- 動的なスタイル（props や状態に応じてスタイルを変更しやすい）
- TypeScript との親和性が高い（型安全にスタイルを扱える場合も多い）
- スタイルの重複や漏れを防げる

一方で、CSS Modules もファイル単位でスコープを限定できますが、動的なスタイルや条件分岐にはやや工夫が必要です。

**まとめ:**  
「コンポーネント単位でスタイルを管理したい」「動的なスタイルを多用したい」場合は、CSS-in-JS のほうが制御しやすいです。

---

## Q.

CSS Modules のメリットもある？

## A.

はい、CSS Modules にも多くのメリットがあります。

**CSS Modules の主なメリット:**

- クラス名のスコープが自動で限定される  
  （ファイルごとにクラス名がユニークに変換されるため、他のコンポーネントとスタイルが衝突しません）
- 通常の CSS 構文が使える  
  （CSS ファイルとして書くので、既存の CSS 知識やツール（autoprefixer, minifier など）がそのまま使えます）
- ビルド時に最適化される  
  （クラス名の圧縮や不要なスタイルの除去など、ビルドツールによる最適化が効きやすいです）
- パフォーマンスが良い  
  （ランタイムのオーバーヘッドが少なく、CSS-in-JS よりも軽量な場合が多いです）
- 静的解析や補完が効きやすい  
  （エディタの補完や型チェック（TypeScript + 型定義生成ツール）も利用できます）

**まとめ:**  
「静的なスタイルが多い」「既存の CSS 資産を活かしたい」「パフォーマンスやビルド時の最適化を重視したい」場合は、CSS Modules が特におすすめです。

## Q&A: `@jsxImportSource @emotion/react` とは？

---

**Q. `/** @jsxImportSource @emotion/react \*/` をファイルの先頭に書くと何が起こるの？\*\*

A.  
そのファイル内の JSX（例: `<div>...</div>`）が自動的に Emotion の JSX ファクトリー（`jsx`関数）で処理されるようになります。  
これにより、JSX 要素に `css` プロパティを直接指定でき、型エラーなく Emotion のスタイルを適用できます。TypeScript でも `css` プロパティが認識され、`css={...}` の記述が安全に使えるようになります。

---

**Q. どういう原理で動いているの？**

A.  
JSX は実際には JavaScript や TypeScript のコードとしてそのまま動くわけではなく、ビルド時に「JSX 変換（トランスパイル）」が行われ、関数呼び出しの形に変換されます。

- 通常の変換例

  ```jsx
  <div
    css={css`
      color: red;
    `}
  >
    Hello
  </div>
  ```

  は、通常（react-jsx）だとこう変換されます：

  ```js
  React.createElement("div", { css: ... }, "Hello");
  ```

  この場合、`css` プロパティは React 標準では認識されません。

- Emotion 用の変換  
  `/** @jsxImportSource @emotion/react */` を書くと、JSX の変換先が `@emotion/react` の `jsx` 関数になります。
  ```jsx
  /** @jsxImportSource @emotion/react */
  <div
    css={css`
      color: red;
    `}
  >
    Hello
  </div>
  ```
  は、こう変換されます：
  ```js
  import { jsx } from "@emotion/react";
  jsx("div", { css: ... }, "Hello");
  ```
  この `jsx` 関数は `css` プロパティを理解して、Emotion のスタイルを適用できるようになっています。

---

**Q. まとめると？**

A.

- `@jsxImportSource @emotion/react` を書くと、JSX が Emotion 用の関数で処理される
- そのため `css` プロパティが型エラーなく使える
- Emotion のスタイルが正しく適用される

これが「原理」です。  
JSX の変換先を Emotion 用に切り替える宣言、と覚えてください。

## React の createContext・useContext の使い方 QA

---

## Q. createContext と useContext の基本的な使い方は？

**A.**

1. **createContext でコンテキストを作成**

   ```javascript
   import React, { createContext } from "react";

   // デフォルト値を指定して Context を作成
   const MyContext = createContext("デフォルト値");
   ```

2. **Provider で値を渡す**

   ```jsx
   <MyContext.Provider value="共有したい値">
     <子コンポーネント />
   </MyContext.Provider>
   ```

3. **子コンポーネントで useContext を使って値を取得**

   ```javascript
   import React, { useContext } from "react";

   const value = useContext(MyContext);

   return <div>{value}</div>;
   ```

**まとめ**

- createContext でコンテキストを作る
- Provider で値をラップして渡す
- 子孫コンポーネントで useContext を使って値を取得

これで、親から子孫までグローバルに値を共有できます。

---

## Q. context の値の変更はどうしますか？

**A.**

context の値を変更したい場合は、context に「値」と「値を変更する関数（セッター）」の両方を持たせるのが一般的です。

1. **Context の作成**

   ```typescript
   import React, { createContext, useContext, useState } from "react";

   // 型定義
   type MyContextType = {
     value: string;
     setValue: (v: string) => void;
   };

   // デフォルト値
   const MyContext = createContext<MyContextType | undefined>(undefined);

   // Provider
   export const MyProvider = ({ children }: { children: React.ReactNode }) => {
     const [value, setValue] = useState("初期値");
     return <MyContext.Provider value={{ value, setValue }}>{children}</MyContext.Provider>;
   };
   ```

2. **子コンポーネントで値を取得・変更**

   ```typescript
   import { useContext } from "react";
   import { MyContext } from "./MyProvider";

   const MyComponent = () => {
     const ctx = useContext(MyContext);
     if (!ctx) return null;

     return (
       <>
         <div>{ctx.value}</div>
         <button onClick={() => ctx.setValue("新しい値")}>値を変更</button>
       </>
     );
   };
   ```

**ポイント**

- 値の変更は Provider 側で useState などを使って管理
- 子コンポーネントは useContext でセッター関数を呼び出して値を変更

これが context の値を変更する基本的な方法です。

---

## Q. createContext の最初の引数は使わず、Provider をラップする関数コンポーネントによって状態を定義するのですか？冗長に見えますが、外部から直接コンポーネントの情報を参照するならこれをやる必要がありますか？

**A.**

はい、その理解で正しいです。

**解説**

- createContext の最初の引数（デフォルト値）は、Provider で値が渡されなかった場合のみ使われます。
- 実際のアプリでは、Provider で値（state やセッター）を明示的に渡すのが一般的です。
- 状態（state）やセッター関数は Provider をラップする関数コンポーネント内で定義し、それを Context の value として渡します。

**なぜ冗長に見えるのか**

- Context は「グローバルな値の共有」が目的なので、外部から直接値やセッターを参照したい場合はこのパターンが必要です。
- 直接 useState や props で渡すだけでは、深い階層のコンポーネントで値を共有・変更できません。
- Context ＋ Provider パターンは「どこからでも値を取得・変更できる」仕組みを作るためのものです。

**まとめ**

- グローバルに値や状態を共有したい場合は、Provider ＋ Context ＋ useContext のパターンが必要
- 冗長に見えますが、React の設計思想に沿ったやり方です
- 小規模な用途なら props やローカル state で十分ですが、多階層・多箇所で値を共有したい場合は Context が便利です
- 「外部から直接コンポーネントの情報（状態やセッター）を参照したい」場合は、このパターンが推奨されます。

# ResizeObserver とは？

## Q. ResizeObserver というのはどういう機能ですか？

**A.**  
ResizeObserver は、DOM 要素のサイズ（幅や高さ）が変化したときに自動で通知してくれるブラウザの API です。

監視したい要素を `observe` で登録すると、その要素のサイズが変わるたびにコールバック関数が呼ばれます。  
これにより、ウィンドウリサイズや内容の変化など、あらゆるサイズ変化をリアルタイムで検知できます。

React の再レンダリングやイベントに依存せず、純粋に DOM のサイズ変化だけを検知できるのが特徴です。

---

## Q. 使い方の例は？

**A.**

```javascript
const observer = new ResizeObserver((entries) => {
  for (let entry of entries) {
    console.log(entry.target.offsetHeight); // 高さの変化を取得
  }
});
observer.observe(document.getElementById("myElement"));
```

React でも、ref で取得した要素に対して使うことができます。
