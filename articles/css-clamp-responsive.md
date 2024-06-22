---
title: "clamp(◯rem, (100vw - ◯rem) * ◯, ◯rem) という構文でメディアクエリを使わずにレスポンシブ実装"
emoji: "🗜️"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["css"]
published: true
---

私がレスポンシブなデザインを実装する際に、CSS の[`clamp()` 関数](https://developer.mozilla.org/ja/docs/Web/CSS/clamp)を以下のように使って実装しています、という紹介です。

```css
/* 
  画面幅が 30rem (480px) のとき 0rem で、
  画面幅が 1rem 広がるごとに 0.2rem ずつ増えていくような値。
  最大値は 10rem (160px)。
  （画面幅が 80rem (1280px) のとき 10rem になる）
 */
.sample {
  width: clamp(0rem, (100vw - 30rem) * 0.2, 10rem);
}
```

サンプルの CodePen を以下に示します。
ぜひ、「Edit on CodePen」からページを開いて画面幅を変えて試してみてください。
画面幅に応じて、要素の大きさが変化します。

@[codepen](https://codepen.io/kagankan/pen/OJYZJGg)

## どんなときに使う？

**画面幅の拡縮に応じて、値を変化**させたいときに使います。

- 画面幅が広いときはフォントサイズを大きく、狭いときは小さくしたい (`font-size`)
- 画面幅が広いときは余白を増やし、狭いときは減らしたい (`padding`, `margin`)
- 人物の写真など、画面内に映る位置が重要な画像の表示位置を調整したい (`transform`, `top`, `left` など)

上記のように、PC/SP のように離散的に切り替えるのではなく、連続的に変化させたいときに使います。
このように連続的な変化を活用することで、メディアクエリ（`@media (max-width: 768px)` など）を使わずに実装できます。

## どうやって読む？

紹介した式は、 `clamp(0rem, (100vw - <min-viewport-width>) * <slope>, <max-value>)` という形式の構文です。
最小値が `0rem`、最大値が `<max-value>` で、画面幅が `<min-viewport-width>` のとき 0 となり、そこから画面幅が広がるごとに `<slope>` の傾きで値が増えていきます。

`clamp(0rem, (100vw - 30rem) * 0.2, 10rem)` の値の変化を表したグラフを以下に示します。

![画面幅に対する値の変化を示すグラフ。横軸は画面幅 (100vw) を示し、縦軸は値 (rem) を示している。画面幅が30rem (480px) までは値が0rem、画面幅が30rem (480px) から80rem (1280px) の間は傾き0.2で値が増加し、画面幅が80rem (1280px) 以上では値が最大の10rem (160px) になる。](/images/css-clamp-responsive/figure.drawio.png)

## どうやって書く？

次のことを決めます。

- 最小値をいくつにしたいか（`<min-value>`）
- 画面幅がいくつのときに最小値にしたいか（`<min-viewport-width>`）
- 最大値をいくつにしたいか(`max-value`)
- 画面幅がいくつのときに最大値にしたいか(`max-viewport-width`)

このとき、`<slope>` は `(max-value - min-value) / (max-viewport-width - min-viewport-width)` となります。

例えば、以下のような場合を考えます。

- 画面幅が 30rem (480px) のとき 0
- 画面幅が 80rem (1280px) のとき 10rem にしたい

という場合、`<slope>` は `(10rem - 0rem) / (80rem - 30rem) = 0.2` となります。

```css
.sample {
  width: clamp(0rem, (100vw - 30rem) * 0.2, 10rem);
}
```

:::message
`clamp()` 関数には、 単位なしの `0` が使えないので注意が必要です。 `0rem` や `0px` などの単位をつける必要があります。
:::

### 最小値を 0 以外に変えたいとき

最小の値を 0 以外の値にしたいときは、 `<min-value>` の部分の値を変えてもいいのですが、そうすると計算がわかりにくくなるため、ここは `0rem` にしたまま、足し算してあげるのもよいです。

```css
.sample {
  width: calc(5rem + clamp(0rem, (100vw - 30rem) * 0.2, 10rem));
}
```

この場合、最大値も `5rem` 増えることを考慮する必要があります。

## `clamp(◯rem, ◯rem + ◯vw, ◯rem)` との違いは？

`clamp()` 関数を紹介している記事では `clamp(◯rem, ◯rem + ◯vw, ◯rem)` という形式の式を紹介していることが多いです（[参考記事 1](https://zenn.dev/kiteruri/articles/e512278dfeb613)、[参考記事 2](https://addapter.co.jp/blog/clamp)）。
これとの違いは書き方のみです。 `(100vw - 30rem) * 0.2` を展開すれば、 `20vw - 6rem` となるので、結局のところ係数が違うだけです。

`100vw` からの引き算で表現することで何が嬉しいかというと、**いつ最小値になるのか読み取りやすくなる**ことです。
`◯rem + ◯vw` と書いてしまうと、どの画面幅でどの値になるのかわかりにくくなってしまい、メンテナンス性が下がります。`100vw - ◯rem` と表現することで、ブレークポイントが `◯rem` であることがわかりやすくなります。

ただし、Sass 関数を用意したり、[計算機](https://min-max-calculator.9elements.com/)を使うという選択肢もあるので、チーム内で管理しやすい方法を選択するとよいでしょう。

## 参考記事

https://min-max-calculator.9elements.com/
https://zenn.dev/kiteruri/articles/e512278dfeb613
https://addapter.co.jp/blog/clamp
