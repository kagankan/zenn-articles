---
title: "CSS を使って HTML を Markdown に復元してみよう！"
emoji: "⏪"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["css", "html", "markdown"]
published: true
---

:::message
この記事はお遊びです。実用を目的としていませんので細かいことは気にしないようお願いします。
:::

Zenn の記事や、README ファイルを GitHub のページ上で表示するときなど、普段は **Markdown で書いたファイルを HTML に変換** しますよね。

ですが、たまには **HTML を Markdown に変換** したくなりますよね？
とはいえ、プログラムで文字列処理したって面白くありません。
**「CSS を使って HTML を Markdown に変換」** がしたいのです。

なんのためにそんなことをするのかって？　
**やりたくなったからです。**

実際に作成したコードを CodePen にサンプルを以下に紹介します。
ページ上に Markdown のようなコードが表示されていますね。
ですが、HTML のタブを開くと `#` のような記号のないシンプルな HTML が並んでおり、Markdown を HTML に変換したかのように見えるので、ちょっと不思議な気持ちになれると思います。

「EDIT ON CodePen」のリンクから編集できるページを開いて、試しに **CSS をすべて削除**してもらうと、いつものユーザーエージェントスタイルに戻ってなんだか面白いですよ。

@[codepen](https://codepen.io/kagankan/pen/MWdyVaN)

実装の過程で置換要素に::before, ::after を追加する方法を見つけられたので、地味に発見がありました。それについては別記事にしています。

https://zenn.dev/kagan/articles/css-replaced-element

ちなみに、これによって Web ページ上でマークダウンをコピーできたらおもしろいなーとか思ったんですが、疑似要素は選択できないので結局無理でした。

以降で具体的な実装について各要素ごとに簡単に紹介していきます。

## 概要

### 目標

Markdown 文法で表現できる主要な HTML 要素を CSS でスタイリングして、あたかも Markdown ファイルを表示しているかのような見た目にする。

### 参照する Markdown フォーマット

Markdown は色々な仕様がありますが、わかりやすかったので以下のドキュメントを参考にします。

https://www.markdownguide.org/basic-syntax/
https://www.markdownguide.org/extended-syntax/

### 基本の実装方法

`::before`, `::after` 疑似要素を使って、記号を追加します。
たまに `attr()` で属性値を取得したりします。

## 見出し

```html:HTML
<h1>見出し</h1>
<h2>見出し</h2>
<h3>見出し</h3>
<h4>見出し</h4>
<h5>見出し</h5>
<h6>見出し</h6>
```

```md:Markdown
# 見出し
## 見出し
### 見出し
#### 見出し
##### 見出し
###### 見出し
```

疑似要素を使って `#` を追加します。

```css:CSS
h1::before {
  content: "# ";
}
h2::before {
  content: "## ";
}
h3::before {
  content: "### ";
}
h4::before {
  content: "#### ";
}
h5::before {
  content: "##### ";
}
h6::before {
  content: "###### ";
}
```

## 段落・改行

改行は、GitHub や Zenn だと単なる改行でも入りますが、原初の（？）定義だと行末に 2 個の半角スペースを入れます。
（CSS で表示する場合、不可視なのでほぼ意味ないですが…）

```html:HTML
<p>段落</p>
<p>スペース2個で<br />改行できます</p>
```

<!-- prettier-ignore-start -->
```md:Markdown
段落

スペース 2 個で  
改行できます
```
<!-- prettier-ignore-end -->

以下の `br` 要素は本来、疑似要素が適用されません。これについては[別の記事](https://zenn.dev/kagan/articles/css-replaced-element)で詳しく書いているのでそちらを参照してください。

段落間（`p`と`p`の間）の空行は、全体に一括でマージンを付けているので省略します。

```css:CSS
br {
  content: "";
}
br::before {
  content: "  \a";
  white-space: pre;
}
```

## 強調

```html:HTML
<p><strong>太字</strong></p>
<p><em>イタリック</em></p>
<p><s>取り消し線</s></p>
```

```md:Markdown
**太字**
_イタリック_
~~取り消し線~~
```

```css:CSS
em::before,
em::after {
  content: "*";
}
strong::before,
strong::after {
  content: "**";
}
s::before,
s::after {
  content: "~~";
}
```

## 引用文

```html:HTML
<blockquote>
  <p>
    引用文<br />
    引用文の中で改行
  </p>
</blockquote>
<blockquote>
  <p>引用文</p>
  <p>引用文の2つめの段落</p>
  <blockquote>
    <p>引用文のネスト</p>
  </blockquote>
</blockquote>
```

```md:Markdown
> 引用文
> 引用文の中で改行

> 引用文
> 引用文の 2 つめの段落
>
> > 引用文のネスト
```

引用のネストについてはいいやり方が思いつきませんでした…。
愚直に対応したい数分だけセレクタを書く必要があります。

```css:CSS
blockquote br::after {
  content: ">";
}
blockquote p::before {
  content: "> ";
}
blockquote p + p::before {
  content: "> \a> ";
  white-space: pre;
}
/* ネストに対応するなら、ネストの数だけセレクタを書く必要がある */
blockquote blockquote p::before {
  content: "> \a>> ";
  white-space: pre;
}
```

## リスト

```html:HTML
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>
    Third item
    <ul>
      <li>Indented item</li>
      <li>Indented item</li>
    </ul>
  </li>
  <li>Fourth item</li>
</ul>

<ol>
  <li>First item</li>
  <li>Second item</li>
  <li>
    Third item
    <ol>
      <li>Indented item</li>
      <li>Indented item</li>
    </ol>
  </li>
  <li>Fourth item</li>
</ol>
```

```md:Markdown
- First item
- Second item
- Third item
  - Indented item
  - Indented item
- Fourth item

1. First item
2. Second item
3. Third item
  1. Indented item
  2. Indented item
4. Fourth item
```

これについても、ネストに対応するなら、ネストの数だけセレクタを書く必要があります。

```css:CSS
ul > li::before {
  content: "- ";
}
ol {
  counter-reset: ol-counter;
}
ol > li {
  counter-increment: ol-counter;
}
ol > li::before {
  content: counter(ol-counter) ". ";
}

/* ネストに対応するなら、ネストの数だけセレクタを書く必要がある */
:where(ul, ol) ul > li::before {
  content: "  - ";
  white-space: pre;
}
:where(ul, ol) ol > li::before {
  content: "  " counter(ol-counter) ". ";
  white-space: pre;
}
```

## コード

ブロックコードの言語指定は、復元できないので省略します。

```html:HTML
<p><code>インラインコード</code></p>

<pre><code>{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
</code></pre>
```

````md:Markdown
`インラインコード`

```
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```
````

````css:CSS
code::before,
code::after {
  content: "`";
}

pre code::before,
pre code::after {
  content: "```";
  display: block;
}
````

## 水平線

```html:HTML
<hr />
```

```md:Markdown
---
```

```css:CSS
hr::before {
  content: "---";
}
```

## リンク

これまでと違い、属性の値が必要なのでひと手間必要です。
`attr` 関数を使って `href` 属性の値を取得します。

```html:HTML
<a href="https://example.com">リンク</a>
```

```md:Markdown
[リンク](https://example.com)
```

```css:CSS
a::before {
  content: "[";
}
a::after {
  content: "](" attr(href) ")";
}
```

## 画像

`br` と同様、 `img` 要素には本来疑似要素を適用できません。
[別記事](https://zenn.dev/kagan/articles/css-replaced-element) で詳しく書いているのでそちらを参照してください。

```html:HTML
<img src="image.jpg" alt="代替テキスト" />
```

```md:Markdown
![代替テキスト](image.jpg)
```

```css:CSS
img {
  content: url("dummy");
}
img::before {
  content: "![";
}
img::after {
  content: "](" attr(src) ")";
}
```

## テーブル

```html:HTML
<table>
  <thead>
    <tr>
      <th>Syntax</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Header</td>
      <td>Title</td>
    </tr>
    <tr>
      <td>Paragraph</td>
      <td>Text</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th style="text-align: left">Syntax</th>
      <th style="text-align: center">Description</th>
      <th style="text-align: right">Test Text</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: left">Header</td>
      <td style="text-align: center">Title</td>
      <td style="text-align: right">Here’s this</td>
    </tr>
    <tr>
      <td style="text-align: left">Paragraph</td>
      <td style="text-align: center">Text</td>
      <td style="text-align: right">And more</td>
    </tr>
  </tbody>
</table>
```

```md:Markdown
| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |

| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |
```

行の最後のセルに `|` を足す処理、もっと賢いやり方がありそうですが、どうにもできませんでした…。

また、`thead` と `tbody` の区切り (`| --- | --- |`) が挿入される順序を `thead` の後ろにしたかったのですが、各 `th` の後ろに挿入するしかありませんでした。

```css:CSS
th {
  text-align: start;
}
th::before,
td::before {
  content: "| ";
}
tr::after {
  content: " |";
}
thead th::after {
  content: "| -----";
  display: block;
}
thead th:last-child::after {
  content: "| ----- |";
}
thead th[style*="left"]::after {
  content: "| :--- ";
}
thead th[style*="left"]:last-child:after {
  content: "| :--- |";
}
thead th[style*="center"]::after {
  content: "| :---: ";
}
thead th[style*="center"]:last-child:after {
  content: "| :---: |";
}
thead th[style*="right"]::after {
  content: "| ---: ";
}
thead th[style*="right"]:last-child:after {
  content: "| ---: |";
}
```

## チェックリスト

```html:HTML
<ul>
  <li><input type="checkbox"> 未チェック</li>
  <li><input type="checkbox" checked> チェック済み</li>
</ul>
```

```md:Markdown
- [ ] 未チェック
- [x] チェック済み
```

リストのスタイルはすでに書いてあるので、チェックボックスについてのみ書きます。

```css:CSS
input[type="checkbox"] {
  /* リセット */
  appearance: none;
}
input[type="checkbox"]::before {
  content: "[ ] ";
  white-space: pre;
}
input[type="checkbox"]:checked::before {
  content: "[x] ";
}
```
