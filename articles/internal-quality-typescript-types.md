---
title: "【内部品質向上シリーズ】TypeScript（型）編"
emoji: "🐕"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: []
published: false
---

型の重要性は以下参照。

[wip:【内部品質向上シリーズ】防御的プログラミング編](https://www.notion.so/wip-178c5cd9cfb28033a8a0d27a1c7d7f56?pvs=21) 

# 実装ミスが機械的にチェックされるように実装する

## 「通る型」じゃなくて、「適切な型」をつける

TypeScriptのコンパイルが通ることで満足しているケースが多い。十分に（必要最小限にまで）型は狭くするべきである。

実例は、以前投稿した「TypeScript問題集」の第3章の問題群である。
これらは「TypeScriptのコンパイルは通る状態になっているが、よりよい型付けができる例」を取り扱ったもの。

https://zenn.dev/kagan/articles/typescript-practice#%E7%AC%AC-3-%E7%AB%A0-%E3%82%88%E3%82%8A%E5%AE%89%E5%85%A8%E3%81%AA%E5%9E%8B%E3%81%B8

TODO: ↑から具体例を持ってくる

# **意識：型はドキュメントである**

自分の中で大事にしている意識が「型はドキュメントである」ということ。もう少し言い換えると、「型がドキュメントになるように型を付けよう」ということ。

型を見ればそこにどんな値が入るのか、どんな使い方をするのかわかる状態にしておく。意図が伝わるようにする。

例えばこんな例。型で `string` を指定しながらコメントによって補足している。コメントによってドキュメンテーションを加えている例である。

```tsx
/** https://から始まる文字列を入れてください */
const url: string = "https://example.com";
```

そんなことをするより、型で指定してしまおう。

これならば別でドキュメンテーションすることは不要だろう。これだけで人間にも伝わるし、なんたって機械的にチェックすることができるから。

```tsx
const url: `https://${string}` = "https://example.com";
```

# null (undefined) の使い方を見直す

この記事ぜひ読んでください

[その Nullable で本当にいいの？](https://zenn.dev/suzuki_hoge/articles/2023-12-really-nullable-dd1edd8ecbf8b4)

- `0` と `null` に暗黙的に意味を持たせていないか
- `""` に特別な意味を持たせていないか
- 不要にリストをnullableにしていないか（ `string[] | null` など）
- 一緒にできるプロパティではないか

# `any` を使わない

`any` は型チェックをなくす危険な型。TypeScriptを使っている意味をなくしてしまう。

- `unknown` を検討する
- 多少でも絞れないか検討する
    - 例えば、「JSONで表現できるなんらかの値」なら `type-fest` で提供されている `JsonValue` になるはず

## 嘘つき `as` を使わない

`as` は型を上書きする**大変危険**なオペレータです。その部分は型が正しいことが検証されなくなってしまう（間違いがあっても素通りしてしまう）。

そのため原則として使わず、使わないとどうしても解決できないケースのみ使います。

### NG例

古めのコードを見ているとこういう コードを見ます。

```tsx
type OverviewArray = {
  enSection: string;
  jaSection: string;
  contents: OverviewContents[];
};

let obj = {} as OverviewArray;
```

上記の例では、 `OverviewArray` にあるべきプロパティがないのに `as` で無理やりアサーションしています。

こういう、明らかに正しくないのにアサーションしているパターンを個人的に 「嘘つき `as` 」と呼んでいます。

### 許容できる例

ではどういうときに使うかというと、以下のパターンがあるかと思います。

- `as const`
- 実装者が正しさを知っている場合（実装者が責任を持つ場合）
- テストコードでモックデータを誤魔化したい場合

### `as const`

`as const` は特別なアサーションで、型のwideningを防ぎ、オブジェクトや配列をreadonlyにする効果があります。

https://typescriptbook.jp/reference/values-types-variables/const-assertion

`satisfies` と組み合わせて使うのも便利です。

https://zenn.dev/tonkotsuboy_com/articles/typescript-as-const-satisfies

### 実装者が正しさを知っている場合（実装者が責任を持つ場合）

どうしてもアサーションをしなければいけないのは基本的にこのパターンのみです。
TypeScriptの型機能では解釈しきれない型を示すために使います。

例えば、 `Object.keys()` は必ず型が `string` になってしまうため、必ず動作するプログラムを書いても型エラーになります。

参考： https://chaika.hatenablog.com/entry/2023/08/08/083000

```tsx
const fruits = {
  apple: 'red',
  banana: 'yellow',
  grape: 'purple',
} as const;

const formattedFruits = Object.keys(fruits).map(
  // name は "apple" | "banana" | "grape" のハズだが、 `string` になってしまう
  (name) => {
    return `${name}(${fruits[name]})`; // `string` を使用してインデックスを付けることはできないとエラーが出てしまう
  }
);
```

こういう場合は `as` を使うのもやむなし…という場合があります。

```tsx
const formattedFruits = (Object.keys(fruits) as (keyof typeof fruits)[]).map((name) => {
  return `${name}(${fruits[name]})`;
});
```

ただしこれは、実装者目線で「こういう型になるはずだ」と責任を持っているからこそ許される行為です。
