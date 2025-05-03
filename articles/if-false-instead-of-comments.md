---
title: "「今だけ除外したい」はコメントアウトじゃなくて `if (false)` にしよう"
emoji: "🤫"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "typescript"]
published: true
---

## 概要

部分的に実行したくないコードは以下のように書いてみましょう！

```tsx
// JavaScript
if (false) {
  doSomething();
}

function someFunction() {
  if (true) {
    return;
  }
  doSomething();
}

// TypeScript
if (false as boolean) {
  doSomething();
}

function someFunction() {
  if (true as boolean) {
    return;
  }
  doSomething();
}

// React
{(false as boolean) && <Component />}
```

## コメントアウトの問題点

- 実装中、デバッグのために部分的に実行したい
- 今は使わないけど、今後機能を有効にしたい

など、「今は実行したくないけど残したいコード」がある場合、コメントアウトが使われがちです（`Cmd + /` でコメントアウトできて楽ですもんね）。

```ts:コメントアウトの例
// 今は実行しないけど後で戻す
// doSomething();
```

ですが、この方法にはいくつか問題があります。

### TypeScriptエラー・ESLintエラーが出る

たとえば、変数宣言や import 文が不使用扱いになるので TypeScript のエラーや ESLint ルールの警告が発生します。

```ts:TypeScriptやESLintのエラー例
import { doSomething } from "./doSomething";
//       ^^^^^^^^^^^^ エラー
//       ts "doSomething が宣言されていますが、その値が読み取られることはありません。"
//       eslint (no-unused-vars) "'doSomething' is defined but never used."

// doSomething();
```

### 使用している箇所がわからなくなる

宣言でエラーが出るからと言って、import 文も消したりコメントアウトしたりしてしまうと、export している関数がどこからも参照されていない状態になってしまいます（他で使われていない場合）。
今後使うつもりがあるにも関わらず、使っていないと判断して消してしまうかもしれません。
[Knip](https://knip.dev/) を使って不使用 export を検出している場合にはエラーとして検出されてしまいます。

```ts:doSomething.ts
// 0個の参照
export const doSomething = () => {
  console.log("something");
};
```

## 解決策 `if (false)`

コメントアウトではなく、`if (false) { ... }` を使ってみましょう。
見たままの意味ですが、条件が常に偽なので、そのブロック中のコードは実行されません。
これで、コード解析の対象としてコードを残したまま、実行しないようにできます。

```ts
if (false) {
  doSomething();
}
```

### TypeScript の場合 `as boolean` をつける

ただし、この書き方だと、TypeScript や ESLint を使用している場合には設定によってはエラーにされてしまいます。
これらは基本的には検出してほしいルールですから、無効にするわけにもいきません。

- TypeScript「到達できないコードが検出されました。(Unreachable code detected.)」
  - [`allowUnreachableCode` オプション](https://www.typescriptlang.org/tsconfig/#allowUnreachableCode) で設定可能
- ESLint [`no-constant-condition`](https://eslint.org/docs/latest/rules/no-constant-condition)
- ESLint typescript-eslint [`no-unnecessary-condition`](https://typescript-eslint.io/rules/no-unnecessary-condition/)

そこで、 `false as boolean` を使用します。

```ts
if (false as boolean) {
  someFunction();
}
```

こうすることで、扱い上は true か false かわからない条件になるので、エラーにならなくなります。

### スキップしたい場合は `if (true) return;`

関数自体を実行したくないといった場合は、`if (true) return;` (`if (true as boolean) return;`) を使ってみましょう。
関数の冒頭に入れることで処理をスキップできます。
途中までは実行してそれ以降をスキップしたい、という場合にも使えます。

```ts
const someFunction1 = () => {
  if (true as boolean) {
    // 全部スキップ
    return;
  }
  console.log("全部スキップ");
};

const someFunction2 = () => {
  console.log("ここは実行");
  if (true as boolean) {
    return;
  }
  console.log("以降はスキップ");
};
```

### ReactコンポーネントでもOK

React コンポーネントでも同様に使えます。

```tsx
<>
  <p>常に表示</p>
  {(false as boolean) && <p>非表示</p>}
</>
```

## 注意事項

### 理由を残す

実行しないようにしたコードには以下の 2 点を必ずコメントで残しましょう（この方法に限った話ではなく、コメントアウトの場合も同様です）。

1. なぜ実行しないのに残しているのか
2. いつ復活させるつもりなのか

そうでないと、将来、削除してよいのか残しておくべきなのかの判断がつかなくなります。

### 出力されるコード

ビルド後のコードに残るかどうかは、ビルドツール・圧縮ツールによります。
少なくとも TypeScript の `removeComments` オプションだけでは消えなくなります。
不要なコードを出力しないよう設定を確認しましょう。
