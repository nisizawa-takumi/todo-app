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

# MUI のクラス名と Emotion によるカスタマイズについて

## Q. Material-UI（MUI）のコンポーネントのデザインはどのようにカスタマイズできますか？

A.  
Material-UI（MUI）は各コンポーネントの内部要素に、`.MuiInputBase-root` や `.MuiInputBase-input` などのクラス名を自動で付与しています。  
Emotion や CSS Modules などの CSS-in-JS ライブラリを使えば、これらのクラス名をターゲットにしてスタイルを上書きできます。

例えば、以下のように書くことで MUI のデフォルトデザインを柔軟にカスタマイズできます。

```js
css`
  .MuiInputBase-root { ... }
  .MuiInputBase-input { ... }
  .MuiInputLabel-root { ... }
`;
```

## Q. カスタマイズ時のポイントは？

A.

- MUI のクラス名は公式ドキュメントやブラウザの開発者ツールで確認できます。
- Emotion の css でラップした親要素内に限定して、これらのクラスを上書きできるので、他の場所に影響しません。
- この仕組みを使えば、MUI のコンポーネントも自分好みにデザインできます！

```js
const priorityElement = form.elements.namedItem("priority") as HTMLInputElement;
        const rawPriorityValue = priorityElement.value.trim();
        const allowedPriorities = ["high", "medium", "low"] as const;
        type Priority = typeof allowedPriorities[number];

        function isPriority(value: string): value is Priority {
          return allowedPriorities.includes(value as Priority);
        }

        const priorityValue: Priority = isPriority(rawPriorityValue)
          ? rawPriorityValue
          : "medium";
```

---

## Q. `.includes()` の引数は `string` 型で問題ないのでは？

A.  
ご指摘の通り、`.includes()` の引数は `string` 型で問題ありません。  
TypeScript の型エラーは、`allowedPriorities.includes(rawPriorityValue)` の返り値が `boolean` であるにもかかわらず、`as "high" | "medium" | "low"` で型アサーションしている部分で発生しています。

---

## Q. 型安全に `"high" | "medium" | "low"` へ変換するには？

A.  
型安全にするには型ガード関数を使うのがベストです。

```typescript
// ...existing code...
const allowedPriorities = ["high", "medium", "low"] as const;
type Priority = (typeof allowedPriorities)[number];

function isPriority(value: string): value is Priority {
  return allowedPriorities.includes(value as Priority);
}
// ...existing code...
const priorityValue: Priority = isPriority(rawPriorityValue) ? rawPriorityValue : "medium";
// ...existing code...
```

こうすることで、型エラーが解消され、型安全も保たれます。

---

## Q. 型ガード関数とは何ですか？

A.  
型ガード関数とは、TypeScript で「ある値が特定の型であるかどうか」を判定し、`true` の場合はその型であることを型システムに伝える（絞り込む）ための関数です。

### 例

```typescript
function isPriority(value: string): value is "high" | "medium" | "low" {
  return ["high", "medium", "low"].includes(value as any);
}
```

この関数は、`value` が `"high"`・`"medium"`・`"low"` のいずれかなら `true` を返し、  
TypeScript は `true` の場合に `value` の型を `"high" | "medium" | "low"` として扱います。

### 型ガード関数の特徴

- 戻り値の型が `value is 型` という形になっている

## Q: React コンポーネントの削除時に連続的なアニメーションを与える実装の動作原理を解説してください

### A:

この実装は、React で TODO リストのアイテムを削除（または追加）するときに、連続的で自然なアニメーション効果を与えるものです。  
主に [`react-transition-group`](https://reactcommunity.org/react-transition-group/) の `TransitionGroup` と `CSSTransition` を活用し、Emotion の css でアニメーション用の CSS クラスを定義しています。

---

#### 1. TransitionGroup & CSSTransition

- **TransitionGroup**  
  複数の子要素（ここでは TODO アイテム）をラップし、追加・削除時にアニメーションが適用できるようにします。

- **CSSTransition**  
  個々の子要素（TODO アイテム）のマウント/アンマウント時に、指定クラス（`classNames="todo"`）を付与します。  
  これにより、DOM のライフサイクルに合わせて、下記のクラスが自動的に付与/削除されます。

  - `.todo-enter` → `.todo-enter-active`（追加時）
  - `.todo-exit` → `.todo-exit-active`（削除時）

---

#### 2. アニメーション用 CSS

```js
const todoTransition = css`
  .todo-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  .todo-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 1000ms, transform 1000ms;
  }
  .todo-exit {
    opacity: 1;
    height: 373px; /* TodoItemの高さに合わせて調整 */
    overflow: hidden;
    margin-bottom: 16px; /* 必要なら */
    padding: 0 0;
  }
  .todo-exit-active {
    opacity: 0;
    height: 0;
    margin-bottom: 0;
    padding: 0 0;
    transition: opacity 1000ms, height 1000ms, margin 1000ms, padding 1000ms;
  }
`;
```

- **追加時（マウント時）**  
  新しいアイテムが追加されると、最初は`.todo-enter`（透明でちょっと下）から始まり、すぐに`.todo-enter-active`（不透明、通常位置、トランジションあり）に変わります。  
  →「下からふわっと現れる」アニメーション

- **削除時（アンマウント時）**  
  アイテム削除時はまず`.todo-exit`（不透明で通常の高さ）になり、すぐに`.todo-exit-active`（透明、高さ 0、マージン 0、トランジションあり）へ。  
  →「透明になりながら高さが 0 になって滑らかに消える」アニメーション

---

#### 3. nodeRef の理由

- `CSSTransition`の`nodeRef`を使うことで、React 18 以降の「ref 警告」を回避しています。
- 各 TODO ごとに異なる ref（`nodeRefs.current[todo.id]`）を割り当てているのは、アニメーションの管理のためです。

---

#### まとめ

- アニメーションしたい要素を`CSSTransition`でラップ
- `classNames`で CSS クラスが自動付与され、Emotion で定義したアニメーション CSS が適用
- 追加・削除イベントごとに DOM クラスが遷移し、CSS のトランジションで滑らかに状態変化
- ref 管理で安定した DOM 操作

---

#### 補足

- `height: 373px`は TODO アイテムの高さに合わせて手動指定しています（Auto Height トランジション対応が難しいため）。
- `TransitionGroup`の`component={null}`により、ラップ用の不要な DOM が挿入されません。
- `span`に`css={todoTransition}`を当てることで、この範囲内のアニメーションクラスだけにスタイルが適用されます。

---

## Q: React 18 以降の「ref 警告」とは？

### A:

React 18 以降でよく話題になる「ref 警告」とは、**react-transition-group**などのライブラリで、  
`CSSTransition`や`Transition`コンポーネントを使った際に表示される、以下のような警告です。

#### 警告メッセージ例

```
Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of ... which is inside StrictMode.
```

#### 原因

- React 18 では StrictMode が強化され、`findDOMNode` API の使用が非推奨になりました。
- `CSSTransition`など一部のライブラリは、アニメーション対象 DOM を特定するために`findDOMNode`を内部的に使っていました。
- しかし、React 18 以降では直接 DOM ノードを ref で取得することが推奨され、`findDOMNode`の利用に警告が出るようになっています。

#### 解決策

- **nodeRef プロパティの利用**  
  `CSSTransition`や`Transition`に`nodeRef`プロパティを渡して、アニメーション対象の DOM ノード（React 要素）への ref を明示的に指定します。

  ```jsx
  const nodeRef = useRef(null);

  <CSSTransition
    nodeRef={nodeRef}
    // ...その他のprops
  >
    <div ref={nodeRef}>アニメーション対象</div>
  </CSSTransition>;
  ```

  こうすることで、`findDOMNode`を使わずにアニメーション対象 DOM ノードを取得でき、警告が出なくなります。

#### まとめ

- React 18 以降、「ref 警告」とは`findDOMNode`の非推奨利用に関する警告です。
- 主にアニメーション系ライブラリで発生します。
- `nodeRef`を使って明示的に DOM ノードを指定することで、この警告を解消できます。

### Q. フロントエンドの描画というのはほとんど CSS クラスをつけたり外したりすることだなと思った。DOM 操作は React、描画は CSS。この考えあってますか？

**A. とても良い観点です。あなたの考え方は現代のフロントエンド開発、とくに React のような宣言的 UI フレームワークでは、かなり正確です。**

---

#### 詳しい解説

1. **DOM 操作は React（またはフレームワーク）が担当**

   - React は「どんな状態のときにどの要素がどうあるべきか」を宣言的に記述します。
   - 実際の DOM（HTML ノード）の生成・削除や、クラスの付け外しなど細かい操作は React が自動で管理します。
   - 開発者自身が `document.getElementById` などで直接 DOM を触ることはほとんどありません。

2. **描画（見た目）は CSS が担当**

   - React が出力する HTML にどんなクラス名や属性を付けるかを決め、見た目は CSS でコントロールします。
   - 状態（例: `active`, `error`, `done` など）によってクラス名を切り替えることで、見た目やアニメーションを切り替えます。
   - つまり「状態 → クラス名 → CSS で見た目」という流れになります。

3. **クラス名の付け外しが重要な役割**
   - ボタンの hover や active、エラー時の強調、アニメーションなど、ほとんどの見た目の変化はクラス名の付け外しで実現されます。
   - たとえば
     ```jsx
     <button className={isActive ? "active" : ""}>Click</button>
     ```
     のように、状態によってクラス名を切り替えます。

---

#### まとめ

- React などのフレームワークは DOM 操作（＝どの要素をどう配置するか）を担当
- CSS（や CSS-in-JS）は見た目の描画を担当
- クラス名の付け外しや属性の切り替えが「状態 → 見た目」の橋渡し

# React の CRUD 関数の扱いに関する QA

---

## Q. CRUD 操作ができる関数の入ったオブジェクトを state で保持し、初回マウント時に一度だけ関数取得を行ったほうが効率的ですか？

**A. 必要ありません。**

- useTodoCrud のようなカスタムフックは、毎回レンダリング時に呼び出しても OK です。
- 返される CRUD 関数（例: addTodo, updateOne, deleteOne, fetchAll）は、初回マウント時に一度だけ取得する必要はありません。
- 何度取得しても問題ありませんし、効率も悪くなりません。

---

## Q. 初回マウント時に一度だけ実行したい処理は何ですか？

**A. データの取得(fetchAll)などの副作用です。**

- これは `useEffect(() => { fetchAll() }, [])` のように書きます。

---

## Q. CRUD 関数を state で保持する必要はありますか？

**A. 必要ありません。**

- CRUD 関数を state で持つことは、むしろ効率が悪くなる場合があります。
- React の state は主に「値の変化をトリガーに UI を再描画する」ためのものなので、関数自体を state で持つのは本来の用途ではありません。

---

## Q. 実装例は？

```js
// コンポーネント内
const { todos, addTodo, updateOne, deleteOne, fetchAll } = useTodoCrud("api");

useEffect(() => {
  fetchAll()
    .catch((e) => setError(e.message))
    .finally(() => setLoading(false));
}, []);
```

---

## Q. state で関数を持つと効率が悪くなる理由は？

**A. 不要な再レンダリングや再生成が発生する可能性があるためです。**

- useTodoCrud のようなカスタムフックは、毎回呼び出してもオーバーヘッドが非常に小さいです。
- 可読性・保守性の観点からも、state で持たずに直接使う方がシンプルです。

---

## まとめ

- state で関数を持つのは非推奨（効率も悪くなる可能性あり）
- オーバーヘッドは小さいので、可読性・一貫性を優先して直接使うのがベスト

# Q&A: React の useState の使い方について

## Q. この実装って useState を関数の中で使ってる気もするんですがこれって良いんですか？

### A.

React のルールでは、フック（useState, useEffect など）は「コンポーネント本体」または「他のカスタムフック」のトップレベルでのみ呼び出す必要があります。  
useTodoCrud は「カスタムフック」なので、その中で useState を使うのは問題ありません。

---

### NG 例（関数や if 文の中でフックを呼ぶのはダメ）

```javascript
function MyComponent() {
  if (条件) {
    // これはダメ
    const [x, setX] = useState(0);
  }
}
```

---

### OK 例（カスタムフックの中で useState を使う）

```javascript
function useMyLogic() {
  const [x, setX] = useState(0);
  // ...ロジック...
  return { x, setX };
}
```

---

## まとめ

- カスタムフックの中で useState を使うのは OK
- ただし、カスタムフック自体はコンポーネントのトップレベルで呼び出すこと

## Q. debounce での遅延実行というものについて解説お願いします。

A.  
はい、**debounce（デバウンス）**とは「短時間に何度も発生するイベントを、一定時間イベントが発生しなくなるまで待ってから 1 回だけ実行する」仕組みです。

---

Q. どういうときに使う？

A.

- 入力欄の onChange で API リクエストや重い処理を毎回実行したくないとき
- スクロールやリサイズなど、連続して発生するイベントの処理を間引きたいとき

---

Q. 仕組み（イメージ）は？

A.

- ユーザーが入力するたびにタイマーをセット
- その間にさらに入力があれば、前のタイマーをキャンセルして再セット
- 一定時間（例: 500ms）入力が止まったら、1 回だけ処理を実行

---

Q. 例：lodash.debounce を使った React での実装は？

A.

```typescript
import React from "react";
import debounce from "lodash.debounce";
// ...existing code...

const TodoTitle: React.FC<Props> = ({ todoItem, updateOne, setError = () => {}, variant = "standard" }) => {
  const [title, setTitle] = React.useState(todoItem.title);

  // updateOneを500ms遅延で呼ぶdebounced関数を作成
  const debouncedUpdate = React.useMemo(
    () =>
      debounce((newTitle: string) => {
        updateOne({ ...todoItem, title: newTitle }).catch((err) => setError(err.message));
      }, 500),
    [todoItem, updateOne, setError]
  );

  React.useEffect(() => {
    setTitle(todoItem.title);
  }, [todoItem.title]);

  return (
    <div css={getInputStyle(variant)}>
      <TextField
        label="タイトル"
        variant={getTextFieldVariant(variant)}
        value={title}
        name="title"
        id={`title-${todoItem.id}`}
        fullWidth
        onChange={(e) => {
          setTitle(e.target.value);
          debouncedUpdate(e.target.value);
        }}
        slotProps={{ input: { "aria-label": todoItem.title } }}
      />
    </div>
  );
};
```

---

Q. ポイントは？

A.

- 入力のたびに setTitle でローカル state を更新
- 入力が止まって 500ms 経過したら updateOne が 1 回だけ呼ばれる
- lodash.debounce は npm で`npm install lodash.debounce`で導入できます

---

Q. まとめ

A.  
debounce は「連続イベントの処理を間引く」ためのテクニックです。  
API 通信や重い処理を最小限にしたいときにとても有効です。

# React の useMemo・useCallback・debounce に関する QA

---

## Q1. なぜ`React.useMemo`で debounce した関数をラップするのですか？

**A1.**  
毎回新しい debounced 関数を作らないためです。  
`useMemo`を使わずに毎回`debounce(...)`を呼ぶと、レンダリングごとに新しい debounced 関数が生成されてしまい、debounce の「遅延実行」や「キャンセル」などの効果が正しく働かなくなります。

- `useMemo`を使うことで、依存配列（例: `[updateOne, setError]`）が変わらない限り、同じ debounced 関数を再利用できます。
- これにより、debounce の効果（遅延実行・キャンセル）が正しく機能します。

**ポイント:**  
「debounced 関数は毎回新しく作らず、同じものを使い続ける」ために`useMemo`でラップしています。

---

## Q2. `useCallback`の仕組みと使い方を教えてください。

**A2.**  
`useCallback`は、関数をメモ化（キャッシュ）する React のフックです。依存配列が変わらない限り、同じ関数インスタンスを再利用できます。

- 通常、関数コンポーネントはレンダリングのたびに関数（例: `updateOne`）を新しく作り直します。
- これが子コンポーネントやフックの依存配列に渡されると、毎回「新しい関数」と認識され、不要な再レンダリングや副作用の再実行が発生します。
- `useCallback`を使うと、依存配列が変わらない限り、同じ関数を返し続けます。

**使い方例:**

```typescript
const memoizedFn = useCallback(() => {
  // 何らかの処理
}, [依存する値1, 依存する値2]);
```

**例：`updateOne`を useCallback でメモ化**

```typescript
const updateOne = React.useCallback(
  async (newTodo: TodoType) => {
    // ここに更新処理
  },
  [setClientTodoList]
);
```

**まとめ:**

- 関数の再生成を防ぎたいときに使う
- 子コンポーネントや`useMemo`/`useEffect`の依存配列に渡す関数は`useCallback`でメモ化すると安全
- 依存配列が変わると新しい関数が生成される

**ポイント:**  
`useCallback`は「関数版の useMemo」と覚えると分かりやすいです。

---

## Q3. `debouncedUpdate`の依存配列を空にしたらうまくいきましたが、ESLint が警告します。なぜですか？

**A3.**  
依存配列を空にすると、`debouncedUpdate`は初回マウント時の`todoItem`をずっと参照し続けます。そのため、debounced 関数の中で使われる`todoItem`は「最初に渡されたもの」で固定され、毎回新しい debounced 関数が作られず、debounce の効果が安定して発揮されます。

**しかし、ESLint が警告する理由:**

- 依存配列を空にすると、`todoItem`が変わっても debounced 関数の中身が更新されません。
- 古い`todoItem`を参照し続けるため、「意図しないバグの温床になる可能性がある」と ESLint が警告します。

---

## Q4. 依存配列に`todoItem`を入れるとどうなりますか？

**A4.**  
依存配列に`todoItem`を入れると、`todoItem`が変わるたびに debounced 関数が再生成され、タイマーがリセットされます。そのため、連続入力時に意図しない挙動になることもあります。

---

## Q5. debounce の引数として`updateOne`、`setError`、`todoItem`をすべて渡す方法はどうですか？

**A5.**  
この方法も有効です！debounce の引数として`updateOne`、`setError`、`todoItem`など必要な値をすべて渡すことで、クロージャに依存せず、常に最新の値で処理を実行できます。

**例:**

```typescript
const debouncedUpdate = React.useMemo(
  () =>
    debounce(async (title: string, todoItem: TodoType, updateOne: Props["updateOne"], setError: Props["setError"]) => {
      try {
        await updateOne({ ...todoItem, title });
      } catch (err: any) {
        setError?.(err.message);
      }
    }, 500),
  []
);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setInputValue(e.target.value);
  debouncedUpdate(e.target.value, todoItem, updateOne, setError);
};
```

**ポイント:**

- `debouncedUpdate`の依存配列は空で OK（ESLint 警告も出ません）
- 必要な値は毎回引数で渡すので、常に最新の値で処理されます
- クロージャの罠を回避できます

**この方法は安全かつ推奨される設計です！**
