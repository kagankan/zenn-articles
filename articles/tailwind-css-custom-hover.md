---
title: "Tailwind CSS の hover: を、非活性な要素やタッチ操作に適用させない ～ addVariant の活用"
emoji: "🍃"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["tailwindcss"]
published: true
---

## 背景

以前公開した記事で、単純な `:hover` セレクタの問題点を書きました。

https://zenn.dev/kagan/articles/css-hover-style

詳しくは上記の記事に書いていますが、要約すると問題は大きく以下の 2 点です。

1. スマホなどのタッチデバイスでもホバースタイルが適用されてしまう
2. disabled 状態の button など、クリックしても反応しない要素にもホバースタイルが適用されてしまう

これらの問題が次のようなメディアクエリと疑似クラスを組み合わせたスタイル記述によって解決できることを紹介しました。

```css
@media (hover: hover) {
  .class:where(:any-link, :enabled, summary):hover {
    /* ホバースタイル */
  }
}
```

今回はこれを **Tailwind CSS で実現するには？** という記事です。

## 確認した環境

- Tailwind CSS v3.4.1

## Tailwind CSS における擬似クラスの使用

前提として、Tailwind CSS では擬似クラスを適用するための記法が規定で用意されています。
クラスの前に `hover:` とつけることで、ホバー時のスタイルを指定できます。

```html
<!-- デフォルトは bg-sky-500、ホバー時に bg-sky-700にする -->
<a href="" class="bg-sky-500 text-white hover:bg-sky-700">リンク</a>
```

https://tailwindcss.com/docs/hover-focus-and-other-states#hover

これは CSS の `:hover` にあたり、 `.hover\:bg-sky-700:hover {}` というセレクタが出力されます。
しかし、これは冒頭でも述べた通り、私の求めるセレクタではありません。

## `addVariant` によるカスタマイズ

Tailwind CSSは設定ファイルによってカスタマイズが可能です。
プラグイン機能を使うことで独自のスタイルを定義することが可能で、その機能の一つである `addVariant` を使うと、疑似クラスなどの修飾子を追加することができます。

https://tailwindcss.com/docs/plugins#adding-variants

ここでのポイントは

- 擬似クラスだけでなく、メディアクエリを追加することもできる
- 疑似クラスとメディアクエリの組み合わせも可能
- 既存の修飾子を上書きすることができる

ということです。
（なんと自由度の高いことでしょう…。これに気づいたとき、Tailwind の株が上がりました）

## 最終的な実装

というわけで設定に追加してみます。

```js:tailwind.config.js
import plugin from "tailwindcss/plugin";

export default {
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant(
        "hover",
        "@media(hover:hover){ &:where(:any-link, :enabled, summary):hover }"
      );
    }),
  ],
};
```

これで求めているセレクタが出力されるようになりました！
規定の `hover:` 修飾子を上書きしているので、HTML（クラス名）を変更する必要はありません。

Tailwind Play にてサンプルを作成してますので、よければ参考にどうぞ。

https://play.tailwindcss.com/53iSQTHPOQ?file=config
