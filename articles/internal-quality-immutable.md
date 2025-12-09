---
title: "【内部品質向上シリーズ】イミュータブルなコード編（関数型プログラミング、参照透過性）"
emoji: "💭"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: []
published: false
---

[JavaScriptでイミュータブルなプログラミングをする](https://sbfl.net/blog/2018/09/25/javascript-immutable-programming/)

関連：

[wip:【内部品質向上シリーズ】防御的プログラミング編](https://www.notion.so/wip-178c5cd9cfb28033a8a0d27a1c7d7f56?pvs=21) 

https://zenn.dev/tockri/books/dcaf6c55e64448/viewer/immutable_is_awesome

# ミュータブル・イミュータブルとは

イミュータブル (immutable) は「不変性」を意味します。

プログラミングにおいては、一度定義したオブジェクトの状態を変えないことを意味します。

逆にミュータブルは変わることを意味します。

例えば以下のコードはミュータブルなオブジェクト（配列）を用いた処理です。

```jsx
// ミュータブルな例
const array = [1, 2, 3];

for(let i = 0; i < array.length; i++) {
  array[i] = array[i] * 2;
}
```

一方以下のコードはイミュータブルに書いたコードです。

```jsx
// イミュータブルな例
const array = [1, 2, 3];
const array2 = array.map((e) => e*2);
```

関連キーワード：

- 参照透過性
- 関数型プログラミング

# イミュータブルのよさ

## イミュータブルなら読みやすい

「同じ変数なら同じ値」なので、予測しやすい。

数行のコードならともかく、複雑な処理で行数が長くなっていくと、いつどこで変わっているのか追いづらくなっていきますよね。

## イミュータブルなら間違えにくい

関数でミュータブルな処理をしてしまうと、呼び出し元の値にまで影響を与えてしまう。

これは意図しない挙動であることが多く、思わぬバグを生みやすい。

# 改善具体例

## 変数を const （再代入不可）にする

（※厳密には変数の再代入のことをミュータブル / イミュータブルとは表現しないのですが、ここでは関連概念としてついでに説明します）

できるだけ `let` ではなく `const` を使いましょう。

```tsx
// ❌️ letな例
let message = "Hello";
message = message + " World";

// ✅️ constな例
const message = "Hello";
const newMessage = `${message} World`;
```

```tsx
// ❌️ letな例
const array = [1, 2, 3];
for (let i = 0; i < array.length; i++) {
  console.log(array[i]);
}

// ✅️ constな例
const array = [1, 2, 3];
for (const element of array) {
  console.log(element);
}
```

## 関数の引数をイミュータブルにする

## 配列をイミュータブルにする

## オブジェクトをイミュータブルにする

## TypeScriptで「変えられない」ようにする

ただ変えないのではなく、変えられないように宣言しておく

# イミュータブルを実現するライブラリ

immer や Immutable.js といったライブラリが存在します。（岸は使ったことないですが）

https://zenn.dev/uhyo/articles/immutable-immer

https://zenn.dev/luvmini511/articles/85e8e3c71a2f41
