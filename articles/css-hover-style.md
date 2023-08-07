---
title: "【CSS】まだホバー時のスタイルを :hover だけで指定してるの？"
emoji: "👆"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["css", "sass"]
published: true
---

## はじめに結論から

ホバースタイルは、 `:hover` だけで指定するのではなく、次のように指定しましょう！

```css
@media (hover: hover) {
  /* リンクの場合 */
  a:any-link:hover {
  }
  /* ボタンの場合 */
  button:enabled:hover {
  }
  /* 特定できない場合 */
  .button:where(:any-link, :enabled, summary):hover {
  }
}
```

@[codepen](https://codepen.io/kagankan/pen/gOQEJwV)

## ポイント 1 マウスのときだけホバースタイルを当てる

`:hover` 擬似クラスで指定したスタイルは、タッチデバイスの場合フォーカス状態で適用されてしまいます。
つまり、タッチしたあとのスタイルがずっとホバースタイルのままになってしまいます。
これは意図と合わないため、マウスで操作しているかどうかを区別してスタイルを当てる必要があります。

マウス（正確には、ホバーができる入力手段かどうか）を区別するには、 `hover` メディア特性を使用します。

https://developer.mozilla.org/ja/docs/Web/CSS/@media/hover

次のように指定することで、マウス操作のときだけホバースタイルを当てることができます。

```css
@media (hover: hover) {
  a:hover {
    background-color: red;
  }
}
```

### マウス操作もタッチ操作もできるデバイスの場合

Surface のような「マウス操作もタッチ操作もできるデバイス」は `@media (hover: hover)` の対象となるため、タッチ操作した場合は、ホバー時のスタイルが残り続けてしまいます。
これも区別しようと思うと [what-input](https://www.npmjs.com/package/what-input) で動的に区別する必要がありますが、そこまでする（JS を追加する）ほど優先度の高い問題ではないと考えて、受け入れることにしています。

### NG 例

マウス操作かどうかを区別する方法としてありがちな NG 例は、ウィンドウ幅のメディアクエリを使用することです。
この方法では、パソコンで狭い幅で表示している場合にホバースタイルが当たらなくなってしまいますし、逆に幅の広いタブレットではホバースタイルが適用されてしまいます。

```css:❌NG例
@media (min-width: 768px) {
  a:hover {
    background-color: red;
  }
}
```

## ポイント 2 クリック可能な要素にだけホバースタイルを当てる

まず意識しておきたいのは、 **ホバー時のスタイル変化は、「これをクリックしたら何かが起こりますよ～」ということを伝えるためのものです。**
（そうではない装飾目的のものももちろんありますが、それはここでは考えません）

- リンクをクリックしたら別のページに遷移する
- カルーセルの矢印ボタンをクリックしたらスライドが切り替わる
- アコーディオンがクリックしたら展開する

など…

逆に言えば、 **クリックして動作が起こらないときにはホバースタイルを当てるべきではありません。**
ホバーで反応があったら、クリックして何かが起こることを予想しますが、何も起こらなかったら混乱します。

クリックしてアクションが起こる要素にだけホバースタイルが当たるように、セレクタを工夫する必要があります。

### リンクかどうかを区別する

`a` 要素は、 `href` 属性が存在する場合はリンクです。
しかし、`href` 属性がなければリンクではなくなり、クリックしても何も起こりません。

a 要素に href つけないことなんてあるの？と思う方もいるかもしれませんが、
ナビゲーションやパンくずリストなどで現在のページはリンクにしないようにするために、a 要素に href をつけずに使うことがあります。
（HTML の仕様としても間違いではありません）

```html
<a href="/">他のページ</a>
<a aria-current="page">現在のページ（リンクではない）</a>
```

リンクかどうかを区別するには [`:any-link`](https://developer.mozilla.org/ja/docs/Web/CSS/:any-link) 疑似クラスが使用できます。

```css
a:any-link {
}
```

#### `:any-link` 擬似クラス

`:any-link` 擬似クラスは、`href` 属性がある `a` 要素（と、`area` 要素）にのみマッチするセレクタです。

https://developer.mozilla.org/ja/docs/Web/CSS/:any-link

リンクを対象とする擬似クラスには [`:link`](https://developer.mozilla.org/ja/docs/Web/CSS/:link) や [`:visited`](https://developer.mozilla.org/ja/docs/Web/CSS/:visited) もありますが、`:any-link`は閲覧状況によらずマッチします。

##### `[href]` との違い

`[href]` で選択するのと変わらないかと思ったのですが、[MDN の「ブラウザーの互換性」のセクション](https://developer.mozilla.org/ja/docs/Web/CSS/:any-link#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%BC%E3%81%AE%E4%BA%92%E6%8F%9B%E6%80%A7)に書いてある

> :any-link privacy: selector does not match <link> elements

という文を読むに、 `:any-link` は `<link href="">` にマッチしないようになっているらしいです（Safari 以外は）。
（まあ CSS を書く分には気にすることはないと思いますが）

### ボタンが無効になっていないかどうかを区別する

`button` や `input` は `disabled` 属性がついている場合、クリックできません。

「カルーセルの最後のスライドに到達していて、「次へ」のボタンを無効にしている」など、クリックできないボタンがある場合は、ホバースタイルを当てないようにする必要があります。

クリックできるかどうかを区別するには `:enabled` 疑似クラスを使用します。

```css
button:enabled {
}
```

#### `:enabled` 擬似クラス

- disabled でない `button` 要素
- disabled でない `input` 要素
- disabled でない `select` 要素
- disabled でない `textarea` 要素

が対象になります。

https://developer.mozilla.org/ja/docs/Web/CSS/:enabled

##### `:not(:disabled)` との違い

`:not(:disabled)` でもいいように見えますが、この書き方ではそもそも disabled の概念が存在しない要素（div や span など）が対象になってしまいます。
`:enabled` は disabled/enabled の概念がある要素のみが対象になります。

### summary 要素かどうかを区別する

`summary` 要素は疑似クラスでは識別できないので、要素セレクタを使用します。
クラスセレクタの後ろに付ける場合、`:is()` や `:where()` が使えます。

```css
.toggle:where(summary) {
}
```

### まとめて書くと

あるクラスが、a 要素に設定されるかもしれないし、button 要素に設定されるかもしれないし、summary 要素に設定されるかもしれないという場合は、次のように書くことができます。

```css
.button:where(:any-link, :enabled, summary):hover {
  background-color: red;
}
```

## 総合すると

こうなります。

```css
@media (hover: hover) {
  .button:where(:any-link, :enabled, summary):hover {
    background-color: red;
  }
}
```

## Sass mixin にしておくと便利

Sass では次のように mixin を用意して使用すると便利です。

```scss:mixin
@mixin hover {
  @media (hover: hover){
    &:where(:any-link, :enabled, summary):hover {
      @content;
    }
  }
}
```

```scss:使用例
.button {
  @include hover {
    background-color: red;
  }
}
```

## おまけ・クリック可能な親要素がホバーされたときのスタイル

「リンク（`a`）の中の画像（`img`）を拡大する」といったホバー演出などで使えます。
親要素は「クリック可能な要素かどうか」で選択しているので、わざわざ親要素側のクラスを特定する必要はありません。
（クリック可能な要素がネストされることはないので）

```css
:where(:any-link, :enabled, summary):hover .image {
  transform: scale(1.1);
}
```

別記事で紹介した[後置修飾スタイル](https://zenn.dev/kagan/articles/css-is-where-tips)で書けばこう書けます。

```css
.image:is(:where(:any-link, :enabled, summary):hover *) {
  transform: scale(1.1);
}
```

これも mixin にしておくと便利です。

```scss:mixin
@mixin group-hover {
  @media (hover: hover){
    &:is(:where(:any-link, :enabled, summary):hover *) {
      @content;
    }
  }
}
```

```scss:使用例
.image {
  @include group-hover {
    transform: scale(1.1);
  }
}
```
