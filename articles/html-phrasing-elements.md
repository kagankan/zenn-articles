---
title: "em, i, strong, b, …、目立たせるための要素の違いを本気で調べる"
emoji: "🌟"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["html"]
published: false
---

`em` `strong` 
`i` `b` `u` `mark` 

わかりやすさのため、多くのブラウザのデフォルト（ユーザーエージェントスタイルシート）でどのような見た目で表現されるかを基準に分類していますが、見た目はあくまでデフォルトでそう表示されますよというだけで、その見た目にするために使用するものではないということは注意してください。
見た目だけの目的であればCSSを使用してください。
逆に、意味としては合ってるけど意図せずスタイルがついてしまう、という場合も、CSSでスタイルをリセットして使用しましょう。


# 太字になる要素たち



## `strong` 要素

https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-strong-element

>The strong element represents strong importance, seriousness, or urgency for its contents.

「重要性」を表すとされています。

### 暗黙のロール

WAI-ARIA 1.2の仕様では暗黙のロールが `strong` に設定されています。
https://www.w3.org/TR/html-aria/#el-strong

ただし、ChromeとFirefoxで確認したところ現時点で実装はされていないようです。


## `b` 要素

https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-b-element

>The b element represents a span of text to which attention is being drawn for utilitarian purposes without conveying any extra importance and with no implication of an alternate voice or mood, such as key words in a document abstract, product names in a review, actionable words in interactive text-driven software, or an article lede.

"lede" というのは リード文を意味するleadをあえてスペルを変えて使用している言葉です。

「重要性は表さない」とされています。

### `b` 要素の暗黙のロール

https://www.w3.org/TR/html-aria/#el-b
`generic` です。
WAI-ARIA上は`span`と同じ扱いしかされないため、読み上げでは特別に扱われることはないことを意味します。

https://www.w3.org/TR/wai-aria-1.2/#generic
<!-- genericとNo corresponding と presentation(none) ってどういう違い？ -->

## エディタからの変換

Zennを始めとして、多くのマークダウン記法が使用できるサービスで **太字**（`**太字**` または `__太字__` のように入力します）が変換されるのは　`strong` 要素です。
Slack（Web版）では `b` 要素になっていました。

## `h1` - `h6` 要素

テキストレベルの要素ではないものの、比較として話題に上げておきます。
`h1` - `h6` の見出し要素も、太字（＆大きなフォントサイズ）で表示される要素です。

https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements

これらはその名の通り、「見出し」を表す要素ですので、太字や大きな文字の用途で使ってはいけません。
その後に続く内容の見出しである場合にのみ使用してください。


## `span` + CSS



# イタリックになる要素たち

そもそも日本語テキストの場合、イタリックという概念がないため、難しいですね。

## `em` 要素

https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-em-element

>The em element represents stress emphasis of its contents.

"stress emphasis" ってどちらも「強調」ですね。
「強勢」と訳すのがイメージに近いかもしれません。発音するときに読み方を変えるようなところ、ですね。

英語圏においては、このような強調はイタリック体で表現されるもので、ブラウザも `em` 要素には `font-style: italic;` のスタイルを指定していますが、日本語では馴染みがないですよね。
日本語においては圏点、傍点（文字の上に•（丸い点）や﹅（ゴマ）が振られているアレです）のほうが近いかもしれません。

https://ja.wikipedia.org/wiki/%E5%9C%8F%E7%82%B9


`em`要素は重要性を意味しません。
（「強調」ではあるが「重要」ではないというのは少し不思議に思うかもしれませんが、）

### 暗黙のロール

WAI-ARIA 1.1時点では暗黙のロールはありませんが、WAI-ARIA 1.2の仕様としては暗黙のロールは `emphasis` が導入されています。
https://www.w3.org/TR/html-aria/#el-em

ChromeとFirefoxで確認したところ現時点では実装はされていないようです。

## `i` 要素

>The i element represents a span of text in an alternate voice or mood, or otherwise offset from the normal prose in a manner indicating a different quality of text, such as a taxonomic designation, a technical term, an idiomatic phrase from another language, transliteration, a thought, or a ship name in Western texts.

英文の慣習によるところが大きいので、日本語でこの要素をつかうのは難しそうです。



### アイコンの i ではない

アイコンフォントの表示のために i 要素が使われることがありますが、アイコンの意味はありませんので、その用途は不適切です。

### 暗黙のロール

`generic`
https://www.w3.org/TR/html-aria/#el-i

多くのブラウザではイタリックになります。

## `var`

使用を迷うことはないと思いますが、イタリックで表示される要素として紹介します。

数式やプログラムの変数を表す要素です。

学術分野において、数式中の変数や物理量を表す記号をイタリック体で表す慣習があるためと思われます。 ^[https://hontolab.org/tips-for-research-activity/how-to-use-mathmatic-symbol/] ^[https://www.eng.u-hyogo.ac.jp/faculty/hoshino/pc/latex/tex_si_styles/]


## エディタ

Zennを始めとして、マークダウン記法で *イタリック* （`*イタリック*` または `_イタリック_` のように入力します）が変換されるのも `em` 要素です。
Slack（Web版）では`i`要素になっていました。

なお、Windows環境で閲覧している方（自分含む）の場合、本文がメイリオで表示されるため、イタリックの表示にはなりません。

https://ja.wikipedia.org/wiki/%E6%96%9C%E4%BD%93

>Windows Vista以降のマイクロソフト製OSに標準で搭載されているメイリオでは、日本語文字の斜体自体が用意されなかった。メイリオの場合、文章をイタリックに指定しても、欧文は斜体になっても日本語部分は斜体にならない。


# 背景色がつく要素
## `mark`

https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-mark-element

>The mark element represents a run of text in one document marked or highlighted for reference purposes, due to its relevance in another context. When used in a quotation or other block of text referred to from the prose, it indicates a highlight that was not originally present but which has been added to bring the reader's attention to a part of the text that might not have been considered important by the original author when the block was originally written, but which is now under previously unexpected scrutiny. When used in the main prose of a document, it indicates a part of the document that has been highlighted due to its likely relevance to the user's current activity.

蛍光ペンでラインが引かれたような見た目になります。

検索結果画面で、検索ワードと一致している部分を示す、
引用した文中で、（引用した人が）強調する
ときに使います。

### 暗黙のロール

https://www.w3.org/TR/html-aria/#el-mark

対応するロールなし（No corresponding role）
「意味は持つんだけど、ARIAで提供されているロールでは表現できない」ということ。

WAI-ARIA 1.3（※策定中で、正式勧告されていない）では、markロールが提案されている。
https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/mark_role
https://w3c.github.io/aria/#mark

Chromeの場合

```
mark {
    background-color: mark;
    color: marktext;
}
```



# 下線が付く要素
## `u` 要素
## `ins` 要素

https://html.spec.whatwg.org/multipage/edits.html#the-ins-element

# 打ち消し線がつく要素
## `del`

https://html.spec.whatwg.org/multipage/edits.html#the-del-element

仕様の分類をよく見ると、 `s` や `em` `strong` などが属する「4.5 Text-level semantics」ではなく、「4.7 Edits」に分類されています。

>The del element represents a removal from the document.

削除されていることを示します。
追加を表す `ins` 要素と対になります。

### 暗黙のロール

WAI-ARIA 1.2 から、`deletion` ロールが設定されています。
https://www.w3.org/TR/html-aria/#el-del
Chrome, Firefoxでは実装されていました。

## `s`

https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-s-element

>The s element represents contents that are no longer accurate or no longer relevant.

正確ではなくなった、もしくは関係なくなった内容を示します。

https://www.w3.org/TR/html-aria/#el-s

No corresponding role
（genericではないんですね 🤔）

~~打ち消し~~
Markdown では、sになるかdelになるかはパーサーによって異なるようです

→VSCode拡張のMarkdown All in One, Markdown PDFで出力→ `s`
Zenn→ `s` ^[https://zenn.dev/zenn/articles/markdown-guide#%E3%82%A4%E3%83%B3%E3%83%A9%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB]
Qiita, GiHub →　`del` ^[https://gist.github.com/mignonstyle/083c9e1651d7734f84c99b8cf49d57fa?permalink_comment_id=2928307#gistcomment-2928307] ^[https://qiita.com/Qiita/items/c686397e4a0f4f11683d#strikethrough---%E6%89%93%E3%81%A1%E6%B6%88%E3%81%97%E7%B7%9A]

Slack（Web版）ではsタグになっていました。


「間違っちゃいないけど、関係ないなー」な内容。

## （廃止） `strike` 要素

# 使用例を考察する

https://developer.mozilla.org/en-US/about

MDNのAboutページでは、「見出しではないものの、見た目上の差異をつけているリード文のような箇所に `b` 要素を使用しています。
たしかにこの一文は文書構造上見出しではないので h1~h6要素は適切ではなく、


https://www.digital.go.jp/about/

デジタル庁の組織情報ページではキャッチコピーの部分に`strong`要素を使用しています。

# 具体例

同じ文章のマークアップを変えるとどう意味が変わるか？

「CSSがあたってしまうから使いたくない」ことに関して
→リセットしよう


# まとめ


