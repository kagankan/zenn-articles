---
title: "TypeScriptにBoolean.prototype.toString()がないので自前で型定義する"
emoji: "🥺"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["typescript"]
published: true
---

地味に困ったので、同じように困っている方もいるんじゃないかと思い記事にしておきます。

# 前提

JavaScriptには `Boolean.prototype.toString()` メソッドが存在しています。
Boolean、つまり `true`, `false` の値をそれぞれ `'true'`, `'false'`の文字列に変換することができます。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Boolean/toString


```js:使用例
true.toString(); // 'true'
('a' === 'b').toString(); // 'false'
```

# 困った

VSCode上でTypeScriptファイルを開き `true.` まで入力してみると、次の入力候補として`valueOf`が表示されますが、`toString`は表示されません 🤔

![VSCodeで true. まで入力した画面のスクリーンショット。候補としてvalueOfが表示されているが、toStringは表示されていない。](/images/ts-boolean-to-string/2023-01-01-07-16-41.png)

補完が出ないので仕方なく手打ちしてみると、 `Object.toString()` 扱い、つまりBooleanに定義されているものではなく遡って使用していることになっています 🤔🤔

![VSCodeで true.toString() の toString をホバーした様子のスクリーンショット。Object.toString() と表示されている。](/images/ts-boolean-to-string/2023-01-01-07-29-34.png)

それもそのはず、**TypeScriptには `Boolean.prototype.toString()`が定義されていないのである！！！！**

https://github.com/microsoft/TypeScript/blob/747172e6493cb2c70e77c21ed4eb87592dd9bcdb/src/lib/es5.d.ts#L511-L516

なお、型定義がないだけなので、使用ができないわけではありません。
明らかにTSの定義漏れで、2020年にIssueもPRも立てられているのですが、なぜか未だに修正されていません。

https://github.com/microsoft/TypeScript/issues/38347

# 対応

各自でできる対応として、型定義ファイル (.d.ts) に以下を追加して対応しました。
これで補完が効くようになります。

```ts:global.d.ts
export {};

declare global {
  interface Boolean {
    toString(): string;
  }
}
```

解決はしましたが、TS側で修正されてほしいものです 🥺
