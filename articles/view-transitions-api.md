---
title: "View Transitions API でカードをｼｭｯと動かす"
emoji: "🃏"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["css", "javascript", "ViewTransitionsAPI"]
published: true
---

View Transitions API を使ってトランプゲームっぽく手札からカードを出して移動させるアニメーションを実装しました！
工夫した点や、詰まったところなどをまとめます。
全体的な実装と挙動は CodePen のサンプルを参照ください。

@[codepen](https://codepen.io/kagankan/pen/NWVpOLW)

GIF アニメ：

![アニメーション。上下に分かれてカードのような要素が並んでいる。要素をクリックすると、上から下、下から上にカードをが移動している。移動の際は連続的にカードが動いている。](/images/view-transitions-api/animation.gif)

## View Transitions API とは

異なる DOM でのアニメーションを実装するための仕組みです。
概要は MDN のドキュメントや以下に紹介する記事がわかりやすいです。

https://developer.mozilla.org/ja/docs/Web/API/View_Transitions_API

https://ics.media/entry/230510/

https://zenn.dev/yhatt/articles/cfa6c78fabc8fa

:::message

View Transitions API ではページ間の遷移でもアニメーション可能ですが、この記事では**同一ページ内での要素の表示切り替え**のみの実装を紹介します。

:::

## 実装の概要

トランジション実装のためにやることはシンプルです。

1. 変更の前後で同じ要素として扱ってほしい要素に対して、CSS で `view-transition-name: <name>;` を指定する
2. JavaScript で `document.startViewTransition` を使って変更を発生させる

これだけです。
`view-transition-name` の名前によって、異なる DOM でも同じ要素を特定でき、アニメーションが可能になるわけですね。

### カードに一意な名前をつけるために UUID を使う

前述の通り、要素には一意な名前を設定する必要があります。
配列のインデックスを使ってしまうと、遷移の前後で名前が変わってしまうので、固有の ID を用意しておく必要があります。
`crypto.randomUUID()`を使うことで、一意な ID を生成しました。

https://developer.mozilla.org/ja/docs/Web/API/Crypto/randomUUID

```js:UUIDを使って一意な名前を設定する例
const uuid = () => crypto.randomUUID();
const cards = Array.from({ length: 4 }, () => ({ id: uuid() }));

cards.forEach((card, index) => {
  const cardElement = document.createElement("button");
  cardElement.style = `view-transition-name:card-${card.id}; contain: paint;`;
  // ...
});
```

### アニメーションの速度を変更する

`::view-transition-group(*)`　の `animation-duration` を変更することでアニメーションの速度を変更できます。

```css
::view-transition-group(*) {
  animation-duration: 0.5s;
}
```

なお、 `*` はすべてのビュートランジションに対する指定で、特定の名前を指定することもできます。

### 移動するカードを前面に出す

重なり順は DOM の重なり順で決まります。そのため、重なり順を制御したい場合は `z-index` を使えば OK です。
今回は移動しているカードを動的に前面に出したいため、クリック時（遷移開始時）に `z-index` を指定しています。

```js:トランジションの最中だけ特定のカードを前面に出す例
card.style.zIndex = "1";

void (async () => {
  const viewTransition = document.startViewTransition(() => update());
  await viewTransition.finished; // アニメーション終了を待つ
  card.style.zIndex = ""; // 元に戻す
})();
```

### デフォルトのクロスフェードをなくす

アニメーションを特に指定しない場合、デフォルトでクロスフェードが設定されています。このアニメーションが不要な場合、 `::view-transition-old`, `::view-transition-new` に設定されているアニメーションを無効化します。

```css:デフォルトのクロスフェードを打ち消す例
::view-transition-old(*),
::view-transition-new(*) {
  animation: none;
}
```

今回はカードを動かすときにフェードさせる必要はないと判断し、デフォルトのクロスフェードを打ち消しています。
ただし、すべて打ち消してしまうと、透過が効かなくなる（？）ため、移動するカードのみに適用するようにしています。
その場合、動的に `style` 要素を設定する必要があるため、JavaScript で設定します。

```js:移動するカードのみに適用する例
const styleElement = document.createElement("style");
// 移動するカードのクロスフェードを打ち消し
styleElement.textContent = `
::view-transition-old(card-${card.id}),
::view-transition-new(card-${card.id}) {
   animation: none;
}
`;
document.head.appendChild(styleElement);
(async () => {
  const viewTransition = document.startViewTransition(() => update());
  await viewTransition.finished;
  document.head.removeChild(styleElement);
})();
```

### 対応していないブラウザでのフォールバック

2024 年 6 月現在、Chrome, Edge, Opera で実装されていますが、Safari, Firefox では未実装です。

https://caniuse.com/view-transitions

そのため、何も考えずに実装すると未対応ブラウザでエラーになります。
MDN などにも書いてありますが、実装されていない環境では View Transitions API を使わずに処理を行うようにすれば、アニメーションは行われませんが状態変化は行われます。

```js
const update = () => {
  // ...
};

if (document.startViewTransition) {
  // ビュートランジション対応ブラウザ
  document.startViewTransition(() => update());
} else {
  // 非対応ブラウザ用のフォールバック
  update();
}
```

## トラブルシューティング

### 同じ名前が複数あるとエラーになる

当然ながら、遷移前・遷移後の状態で要素を 1 対 1 対応させる必要があるため、ページ内に同じ `view-transition-name` が設定された要素が複数あるとエラーになります。
その場合はコンソールにエラーが出るので、うまくいかないときは確認しましょう。

### TypeScript で書こうとすると型エラーが出る

`document.startViewTransition` がまだ定義されていません。
[`@types/dom-view-transitions`](https://www.npmjs.com/package/@types/dom-view-transitions) をインストールすることで解決できます。

### z-index が無視される？（重なり順が意図通りにならない場合）

`position: absolute;` で配置した要素が、ビュートランジションでのアニメーション中に消えている（ように見える）ことがありました。
実際には消えているのではなく、z-index が意図通りになっておらず背後に隠れているだけでした。

View Transition における重なり順はなかなかややこしいです。

以下の記事でも説明されている通り、トランジションさせる必要がない要素にも `view-transition-name` を設定する必要があります。

https://www.nicchan.me/blog/view-transitions-and-stacking-context/

**トランジション中の要素の重なり順**の決定をまとめておくと、以下の順で判断されます。

1. `view-transition-name` がある（トランジションする）要素が前、それ以外が後ろ
   - トランジションアニメーションを前面に乗っけているイメージ。
2. `::view-transition-group(<name>)` に対する `z-index` が大きいものが前、小さいものが後ろ
3. 元の要素の `z-index` が大きいものが前、小さいものが後ろ（普段通り）

つまり、 **`view-transition-name` が設定されていない要素は、絶対にトランジションしている要素よりも前に来ることができません。**
そのため、常に前面に配置したい要素は、全く変化がないとしても `view-transition-name` を設定する必要があります。

```css
.description {
  /* 変化がないとしても、他の要素の前に配置するために必要 */
  view-transition-name: fixed-label;
}
```

## おわりに

View Transitions API が出現する以前は、DOM が切り替わるときにアニメーションを実装しようと思うと、頑張って 2 つの要素を同じ位置に配置して重なっているように見せる…みたいな実装が必要でした。もしくは、アニメーションの実装を優先させて、セマンティクスを犠牲にすることもあったりしました。

View Transitions API によって HTML 構造を保ちつつ、お手軽にアニメーションを実装できるようになり感動です。 🥰
