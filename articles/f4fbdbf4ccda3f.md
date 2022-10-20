---
title: "【CSS】クリック可能な要素にだけスタイルを当てたい！"
emoji: "👆"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["css"]
published: false
---

ホバー時のスタイル指定をするときなど、 **「クリック可能な要素だけ」** を対象にしてスタイルを当てたい場合があります。
そんなときに使えるのが以下のようなセレクタです。

```css
:where(
  :any-link, /* リンクのあるaタグにマッチ */
  :enabled, /* disabledでないbuttonタグ、inputタグ、selectタグ、textareaタグにマッチ */
  summary, /* summaryタグにマッチ */
  label[for], /* forでinputタグに紐付けられたlabelタグにマッチ */
  label:has(input:enabled) /* inputタグを内包するlabelタグにマッチ */
) {
    /* 任意のスタイル */
}
```

@[codepen](https://codepen.io/kagankan/pen/bGMQpjz)


# 活用例

## クリック可能な要素に共通のスタイルを指定する

buttonタグやsummaryタグ、selectタグなどはデフォルトでは指差しカーソルにならないため、まとめて指定するといいかもしれません。

```css
:where(:any-link, :enabled, summary, label[for], label:has(input:enabled)) {
    cursor: pointer;
}
```

:::message
`input[type=text]` でもcursor: text;ではなくpointerが当たってしまうので、実際には `:enabled` の部分をinputのtype別に指定するなど考慮したほうがいいと思います。
:::

## ホバーしたときのスタイル

この制限をしたいがために考えました。
`.class` が指定されている要素のうち、クリック可能な場合のみホバースタイルを当てることができます。
（単に `.class:hover` で指定してしまうと、クリックできない要素や、disabledが設定されている場合にも適用されてしまう）

```css
.class:where(:any-link, :enabled, summary, label[for], label:has(input:enabled)):hover {
    opacity: 0.7;
}
```

## クリック可能な親要素がホバーされたときのスタイル

「リンク（`a`）の中の画像（`img`）を拡大する」といったホバー演出などで使えます。

```css
:where(:any-link, :enabled, summary, label[for], label:has(input:enabled)):hover .child {
    transform: scale(1.1);
}
```

## Sass mixinにしておくと便利

```scss:mixin
@mixin hover {
    &:where(:any-link, :enabled, summary, label[for], label:has(input:enabled)) {
        @media (hover: hover){
            &:hover {
                @content;
            }
        }
    }
}
```

```scss:使用例
.class {
    @include hover {
        opacity: 0.7;
    }
}
```


# セレクタの解説

## `:where()` セレクタ

```css
:where(:any-link, :enabled) {}
```

は

```css
:any-link, :enabled {}
```

と基本的には変わらないですが、

1. **無効なセレクタが含まれていても、他が無視されない**
2. **詳細度が常に0**

という特徴があります。

https://developer.mozilla.org/ja/docs/Web/CSS/:where

あえて詳細度を高めて使用したい場合は、 `:is()` セレクタを使用できます。

## `:any-link` 擬似クラス

`a` 要素に `href` 属性が指定されていない場合、クリック不可になります。
`:any-link` 擬似クラスは、`href` 属性がある `a` 要素にのみマッチするセレクタです。

https://developer.mozilla.org/ja/docs/Web/CSS/:any-link

似たセレクタに `:link`, `:visited` があり、 `:link` 擬似クラスは未訪問のリンクのみ、 `:visited` 擬似クラスは訪問済みのリンクのみにマッチする擬似クラスです。
また、 `:any-link` は `href` 属性がある `area` 要素にもマッチします。
（マッチしますが、area要素自体は不可視で、スタイルが当たらないのでcodepenのサンプルなどでは省略しました）

### `[href]` との違い

`[href]` で選択するのと変わらないかと思ったのですが、先述の[MDNの「ブラウザーの互換性」のセクション](https://developer.mozilla.org/ja/docs/Web/CSS/:any-link#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%BC%E3%81%AE%E4%BA%92%E6%8F%9B%E6%80%A7)に書いてある

>:any-link privacy: selector does not match <link> elements

という文を読むに、 `:any-link` は `<link href="" />` にマッチしないようになっているらしい（Safari以外は）。
（CSSを書く分には気にすることはないと思いますが）

## `:enabled`

- disabledでない `button` 要素
- disabledでない `input` 要素
- disabledでない `select` 要素
- disabledでない `textarea` 要素

が対象になります。

https://developer.mozilla.org/ja/docs/Web/CSS/:enabled

disabled属性がついた要素は、クリックが無効になるため、クリック可能な要素を選ぶときには対象外にする必要があります。

### `:not(:disabled)` との違い

`:not(:disabled)` にしてしまうと、そもそもdisabledの概念が存在しない要素（divやspanなど）も対象になってしまいます。
`:enabled` は disabled/enabled の概念がある要素のみが対象になります。

## `summary`

details要素の中に入れて、折りたたみの要素を作ることができる要素です。
フォーカスやクリックができるボタンのような要素ですが、disabledのような概念はないため :enabled で含めることはできず、タグそのものを指定する必要があります。

https://developer.mozilla.org/ja/docs/Web/HTML/Element/summary

## `label[for]`

label要素とinput要素を紐づける方法は大きく2つありますが、その一つであるforを使う場合にマッチさせます。

```html
<input type="checkbox" id="check">
<label for="check">チェック</label>
```

### 区別できないパターン

codepenのサンプルにも書いたのですが、 「disabledなinput要素にforで紐付けられた`label` 要素」を識別できず、対象に含んでしまいます。
さすがにfor属性の先の要素まで識別するのはできないかと思うので、これの判別は難しそうです。

## `label:has(input:enabled)`

label要素の中にinputを内包させる書き方にマッチします。

```html
<label><input type="checkbox">チェック</label>
```

### `:has()` セレクタ

最近導入されたセレクタですね。
そのため、少し古いブラウザでは反映されません。
Chrome, Safariでは最新版で使用可能となっていますが、Firefoxではフラグを有効にしないと使用できません（2022年10月現在）。

https://developer.mozilla.org/ja/docs/Web/CSS/:has



# さいごに

考慮漏れや、よりスマートに書く方法などありましたらコメントで教えてください！
