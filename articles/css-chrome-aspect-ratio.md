---
title: "【CSS・Chrome 124】aspect-ratioを使っているページが何もしていないのに壊れた"
emoji: "🫠"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["css", "chrome"]
published: true
---

## はじめに結論

CSS の `aspect-ratio` プロパティを使っている場合、Chrome 124 で崩れる場合があります。
`aspect-ratio` を設定している要素に `min-width: 0;` を設定しておくと安全かも。

@[codepen](https://codepen.io/kagankan/pen/ExJzWRp)

以下詳細です。

## 現象

以前は問題なく表示できていたはずのページで、コンテンツがページ外にはみ出してしまう現象が発生していました。

原因を確認すると、以下のような条件で発生していました。

- 親で `display: grid;` を設定して横並びにしている
  - おそらく `flex` でも同様
- その中に `aspect-ratio` プロパティを設定している要素がある

同様の状況を再現したのが、冒頭に掲載した CodePen のサンプルです。

## 原因

Chrome 123.0.6262.0 で表示を確認したところ、問題なく表示されていました。
Chrome 124.0.6367.92 で確認したところ、コンテンツがページ外にはみ出してしまう現象が発生しました。
どうやら Chrome 側の仕様変更もしくはバグのようです。

Chrome 123 での表示：意図通り左半分に画像が配置されている。

![](/images/css-chrome-aspect-ratio/2024-05-01-04-53-57.png)

Chrome 124 での表示：画像が大きく表示されてしまい、右側のテキストが枠外に追いやられ、ページ外にはみ出している。

![](/images/css-chrome-aspect-ratio/2024-05-01-04-54-59.png)

バグであればそのうち Chrome 側の更新で修正されるかもしれませんが、治るとしてもいつになるか不明です。

## 解決策

以下のように `min-width: 0;` を設定することで修正できました。

```diff css
.element {
   aspect-ratio: 16 / 9;
+  min-width: 0;
}
```

`grid` や `flex` で親要素をはみ出してしまう場合は、だいたい `min-width: 0;` を設定すると解決することが多いですね。
