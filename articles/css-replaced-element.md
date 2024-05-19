---
title: "【CSS】実は br や img に ::before, ::after 疑似要素が入れられる（場合がある）【置換要素】"
emoji: "🥷" 
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["css"]
published: true
---

:::message

この記事で紹介するのはお遊びのようなものであり、実用を目的としていません。
後に説明する通り、ブラウザによって表示が異なるなど、動作が保証されませんのでご注意ください。

:::

## はじめに結論から

`br` や `img` には通常、`::before`, `::after` 疑似要素を追加できません。
しかし、以下の Codepen にサンプルを示した通り、`br` や `img` 自体のコンテンツを置き換えることで、疑似要素を適用できます。

:::message

Chrome, Edge でのみ確認。Firefox, Safari では動作しません。

:::

@[codepen](https://codepen.io/kagankan/pen/pomgLKg)



## （前提）`::before` 疑似要素、 `::after` 疑似要素 

`::before` 疑似要素、 `::after` 疑似要素は、要素の子要素に疑似要素を生成するセレクタです。
`content` プロパティを使って、疑似要素に表示する内容を指定します。

https://developer.mozilla.org/ja/docs/Web/CSS/::before


```css
.sushi::before {
  content: "🍣";
}
```

```html
<p class="sushi">寿司</p>
```

`::before`, `::after` 以外の疑似要素もありますが、この記事で触れるのはこれらのみであるため、以降で「疑似要素」という言葉は `::before`, `::after` を指すものとします。

## 疑似要素が適用されない要素

多くの要素に疑似要素を追加できますが、一部の要素には追加できません。
例えば、`br` や `img` には、疑似要素を適用できません。

```html
<br>
<img src="image.jpg" alt="">
```

```css
br::before {
  /* 表示されない */
  content: "⏎";
}

img::before {
  /* 表示されない */
  content: "🖼️";
}
```

## なぜbrやimgに疑似要素は入れられないのか

**「置換要素だから」** が、`br` や `img` に疑似要素が適用されない理由です。

勘違いしがちですが、「空要素（閉じタグがない要素）だから」**ではありません**。
空要素 (void element) と置換要素 (replaced element) は独立した概念です。

たとえば、空要素でも `hr` 要素には疑似要素を入れることができます。
逆に、空要素ではないが疑似要素が入れられない要素（置換要素）の例として、 `select` や `svg` があります。

## 置換要素 (replaced element) とは

簡単に言えば、置換要素は **コンテンツがCSSの影響を受けない要素** のことです。

- MDN ドキュメント: https://developer.mozilla.org/ja/docs/Web/CSS/Replaced_element
- CSS 仕様書: https://www.w3.org/TR/css-display-3/#replaced-element
- HTML 仕様書: https://html.spec.whatwg.org/multipage/rendering.html#replaced-elements

HTML 仕様の `15.4 Replaced elements` では置換要素になりうる要素の具体例が挙げられています。

>The following elements can be replaced elements: `audio`, `canvas`, `embed`, `iframe`, `img`, `input`, `object`, and `video`.

ここに、`br` は含まれていませんが、ブラウザ実装の挙動を見るに、`br` も置換要素として扱われていますし、その他にもいくつか存在します。
HTML 仕様書の例示はあくまで「例えばこれらが置換要素になりうるよ（それ以外がならないとは言ってない）」ってことのようです。

実際に置換要素として扱われている要素のリストは、Stack Overflow の回答で発見したので載せておきます。
https://stackoverflow.com/questions/38779034/list-of-replaced-elements/38779191#38779191


## 置換要素に疑似要素を入れる方法

そんな本来疑似要素を入れられない置換要素ですが、ブラウザによっては疑似要素を入れられる方法があります。
それは、 **`content` プロパティでコンテンツ自体を置き換えてしまう** ことです。
（置き換えられているコンテンツを、さらに上書きしてしまうということですね）

:::message

これらの方法は、 Chrome 124, Edge 124 でのみ表示を確認しました。
Firefox 126, Safari 16.4 では適用されませんでした。
ブラウザごとに挙動が異なるところを見るに、仕様上も定義されていない処理な気がしてます。

:::

要素ごとに方法が若干異なるため、以降でそれぞれ説明します。

### brに疑似要素を入れる

`br` に `content` プロパティを使ってコンテンツを置き換えることで、疑似要素を入れることができます。

```css
br {
  content: "";
}

br::before {
  content: "⏎";
}
```

この場合、元のコンテンツ（改行）を上書きしているため、当然改行されなくなります。
改行を残す場合には、疑似要素で `\a` を使用します。^[https://webrandum.net/css-content-br-space/]
（ちなみに、`br` の `content` に対して指定してもダメでした）

```css
br::after {
  content: "\a[after-br]";
  white-space: pre;
}
```

![スクリーンショット：br要素に疑似要素を追加した様子。DOMツリーと適用されているCSSが並べてある。](/images/css-replaced-element/2024-05-19-17-54-04.png)

### imgに疑似要素を入れる

`img` では、`br` の方法がそのまま使えません。
というのも、 `img` に対して適用できる `content` プロパティの値は、 画像（`<image>` 値）だけのようで、文字列（`""`）が入れられないためです。
さらに、単に画像で置き換えてしまうと元の状態と変わらないため、**あえて存在しない URL を指定して、読み込みを失敗させ alt テキストが表示された状態**にします。
そのため、元の画像は当然表示させることができず、画像が読み込めなかったときのアイコンと alt テキストが出てしまいますが、これで疑似要素を表示させることは可能です。

```css
img {
  content: url("dummy"); /* 画像の読み込みを失敗させる */
}
img::before {
  content: "[before-img]";
}
img::after {
  content: "[after-img]";
}
```

![スクリーンショット：img要素に疑似要素を追加した様子。DOMツリーと適用されているCSSが並べてある。](/images/css-replaced-element/2024-05-19-18-01-25.png)


これができるということは、**単に `src` に指定したパスの画像の読み込みが失敗したときにも、Chrome や Edge では疑似要素が表示される**ということです。

```html
<img src="not-found.jpg" alt="alt テキスト">
```

```css
img::before {
  content: "読み込みに失敗しました: ";
}
```

ちなみに、alt テキストを隠したい場合は`font-size`を変更すればできます。

```diff css
img {
  content: url("dummy"); /* 画像の読み込みを失敗させる */
+ font-size: 0;
}

img::before {
  content: "[before-img]";
+ font-size: 1rem;
}

img::after {
  content: "[after-img]";
+ font-size: 1rem;
}
```

## おわりに

通常では追加できない、`br` や `img` の中の疑似要素を追加する方法を紹介しました。
ただし、デフォルトのコンテンツが失われてしまうことや、ブラウザによって挙動が異なるなど問題しかないため実用上は全く使えませんのでご注意ください 😜

## 関連・参考記事

https://zenn.dev/osnya/articles/ad555dc232fb74
