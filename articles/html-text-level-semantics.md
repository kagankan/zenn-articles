---
title: "strong, b, em, i, u, …、違いがわからんHTML要素の仕様を調べて「新しい見た目」を考えてみたら理解が深まった（全16要素）"
emoji: "✏️"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["html", "アクセシビリティ", "waiaria"]
published: true
---

「`strong`も`b`も太字になるのにどう違うんだ…？」
「`em`も`i`もイタリック体になるけど、そもそもイタリック体ってなんなんだよ…？」
「`strong`の重要と、`em`の強調って何が違うんだ…？」
などなど、使い方がよくわからなくなりがちな HTML 要素（主にテキストレベルセマンティックスに分類される要素）の違いを調べてみました。

長めの記事になっていますので、気になる要素だけつまみ食いしてもらうのもよいかと思います。

## 今回の調査対象はこちら

1. `span`
2. `strong`
3. `b`
4. `em`
5. `i`
6. `dfn`
7. `cite`
8. `var`
9. `mark`
10. `u`
11. `ins`
12. `del`
13. `s`
14. `strike`
15. `big`
16. `small`

### ブラウザのデフォルトの見た目確認用 CodePen

@[codepen](https://codepen.io/kagankan/pen/LYXvzYQ)

## 調査する内容

1. **HTML Standard の仕様に書かれている説明**
   - 一部、HTML 4.01 から HTML 5 での変更が理解の助けになるものもあり、HTML 4.01 時代の仕様も確認します。
2. **ブラウザで表示されるデフォルトの見た目（ユーザーエージェントスタイルシート）**

   - 意味をどう視覚的に表現しているか、という観点で考察します。
   - というか、本当に表現できているのか？　という疑いの目を向け、よりよい新しい見た目も考えていきます。

3. **ARIA in HTML で規定されている暗黙のロール**
   - 「ロール」というのは、スクリーンリーダーを始めとする支援技術にどういう役割の要素かを伝えるものです。これにより、スクリーンリーダーの読み上げでどう伝わるのかを確認します。

### 参照した文書

- [HTML Standard](https://html.spec.whatwg.org/multipage/)
- [HTML Standard 日本語訳](https://momdo.github.io/html/)
- [ARIA in HTML](https://www.w3.org/TR/html-aria/)
- [ARIA in HTML 日本語訳](https://momdo.github.io/html-aria/)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2 日本語訳](https://momdo.github.io/wai-aria-1.2/)
- [HTML 4.01 Specification](https://www.w3.org/TR/html4/)
- [HTML 4.01 Specification (ja)](http://www.asahi-net.or.jp/~sd5a-ucd/rec-html401j/cover.html)
- [HTML5 Differences from HTML4](https://www.w3.org/TR/html5-diff/)
- [HTML5 Differences from HTML4（HTML4 からの HTML5 の差分）](https://momdo.github.io/html5-diff/)

なお、この記事内では日本語訳の文章をメインで引用します。
ただし、原文は英語版ですので、正確かつ最新の情報をあたるには原文を参照してください。

### 参考にした書籍

- 『[HTML 解体新書](https://www.borndigital.co.jp/book/25999.html)』（ボーンデジタル）

### その他参考にした記事

https://yoshikawaweb.com/element-em-strong-mark-b-difference.html

https://seiai.ed.jp/sys/text/htm5/chp03/h03b01.html

## 調査結果の概要

### 検討した新しい見た目

@[codepen](https://codepen.io/kagankan/pen/JjwPreE)

### 早見表

| 要素     | 意味・役割             | 見た目       | 　暗黙のロール<br>（WAI-ARIA 1.2）                         |
| -------- | ---------------------- | ------------ | ---------------------------------------------------------- |
| `span`   | 意味を持たない         | （変化なし） | `generic`                                                  |
| `strong` | 重要性・深刻性・緊急性 | 太字         | `strong`                                                   |
| `b`      | キーワード             | 太字         | `generic`                                                  |
| `em`     | 強調                   | イタリック体 | `emphasis`                                                 |
| `i`      | 代替音声               | イタリック体 | `generic`                                                  |
| `dfn`    | 用語                   | イタリック体 | `term`                                                     |
| `cite`   | 作品のタイトル         | イタリック体 | 対応するロールなし                                         |
| `var`    | 変数                   | イタリック体 | 対応するロールなし                                         |
| `mark`   | ハイライト             | 背景色       | 対応するロールなし (WAI-ARIA 1.2)<br>`mark` (WAI-ARIA 1.3) |
| `u`      | 注釈                   | 下線         | `generic`                                                  |
| `ins`    | 追加                   | 下線         | `insertion`                                                |
| `del`    | 削除                   | 打ち消し線   | `deletion`                                                 |
| `s`      | 正確でないテキスト     | 打ち消し線   | `deletion`                                                 |
| `strike` | （廃止）               | 打ち消し線   | -                                                          |
| `big`    | （廃止）               | 大きい文字   | -                                                          |
| `small`  | 副次的な内容           | 小さい文字   | `generic`                                                  |

### HTML 4.01 と HTML 5 の比較表

| 要素     | HTML 4.01 での意味           | HTML 5 での意味        |
| -------- | ---------------------------- | ---------------------- |
| `span`   | 要素のグループ化             | 意味を持たない         |
| `strong` | より強い強調                 | 重要性・深刻性・緊急性 |
| `b`      | 太字で表示                   | キーワード             |
| `em`     | 強調                         | 強調                   |
| `i`      | イタリック体で表示           | 代替音声               |
| `dfn`    | 用語                         | 用語                   |
| `cite`   | 引用か、他のリソースへの参照 | 作品のタイトル         |
| `var`    | 変数                         | 変数                   |
| `mark`   | （当時存在せず）             | ハイライト             |
| `u`      | 下線を引いて表示             | 注釈                   |
| `ins`    | 追加                         | 追加                   |
| `del`    | 削除                         | 削除                   |
| `s`      | 打ち消し線を引いて表示       | 正確でないテキスト     |
| `strike` | 打ち消し線を引いて表示       | （廃止）               |
| `big`    | 大きい文字で表示             | （廃止）               |
| `small`  | 小さい文字で表示             | 副次的な内容           |

## `span` 要素

役割を持つ要素たちを見る前に、まずは特に意味を持たない `span` を確認しておきましょう。

### 仕様における説明

> `span`要素はそれ自身では何の意味もないが、たとえば`class`、`lang`、または`dir`などのグローバル属性とともに使用する場合に役立つ。この要素は、要素の子を表す。
> https://momdo.github.io/html/text-level-semantics.html#the-span-element

:::details 原文（英語）

> The `span` element doesn't mean anything on its own, but can be useful when used together with the global attributes, e.g. `class`, `lang`, or `dir`. It represents its children.
> https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-span-element

:::

**「何の意味もない」** 要素ということがわかります。
特に、「この要素は、要素の子を表す。（It represents its children.）」というのはポイントですね。 **この要素自体が意味を持つのではなく、内包される子要素に意味がある** と言っています。

### 使い方

仕様にある通り、「一部の文字に属性をつけたい」場面でのみ使用します。

```html:span要素を使ってclass属性を設定する例（改行位置を調整する用途）
<p><span class="inline-block">エンジニアのための</span><span class="inline-block">情報共有コミュニティ</span></p>
```

```html:span要素を使ってlang属性を設定する例
<p lang="ja">英語で「こんにちは」は <span lang="en">Hello</span></p>
```

#### 使うべきでないとき

意味的なまとまりがある場合は、`span` 要素を使うべきではありません。
例えば、テキストのまとまり（段落）を表す場合は、 `p` 要素など、意味のある要素を使うべきです。

```html:span要素を使うべきでない例
<article>
    <span>【CSS】まだホバー時のスタイルを :hover だけで指定してるの？</span>
    <span>かがん</span>
    <span>2023/08/06</span>
</article>

<!-- HTMLの意味上は以下と同じこと -->
<article>
    【CSS】まだホバー時のスタイルを :hover だけで指定してるの？ かがん 2023/08/06
</article>
```

上記の例では、HTML の表す意味としてはすべてのテキストが連続した文として表現されてしまいます。
`h2` や `p` など、意味のある要素を使うことで、テキストのまとまりを表現することができます。

```html:改善例
<article>
    <h2>【CSS】まだホバー時のスタイルを :hover だけで指定してるの？</h2>
    <p>かがん</p>
    <p>2023/08/06</p>
</article>
```

#### 判断基準

`span` 要素でマークアップしている箇所について、`span`タグを取り払っても意味・構造が表せているかを確認しましょう。

### デフォルトの見た目

特にスタイルは設定されず、見た目が変わることはありません。

要素に意味がないため、視覚的にも特別な装飾がないことは適切ですね。
新しい見た目を考えるまでもありません。

### 暗黙のロール

> `role=generic`
>
> https://www.w3.org/TR/html-aria/#el-span, https://momdo.github.io/html-aria/#el-span

WAI-ARIA 1.2 から、特別な意味を持たない[`generic` ロール](https://momdo.github.io/wai-aria-1.2/#generic)（[原文（英語）](https://www.w3.org/TR/wai-aria-1.2/#generic)）が設定されています。

`generic` ロールの意味を確認しておくと、以下のように書かれています。

> `generic`ロール
> それ自体にはセマンティックな意味を持たない名前のないコンテナー要素。

「意味を持たない」「コンテナー要素」など、`span` の HTML 仕様と同様の説明になっています。

ただし、Chrome, Firefox では`span`は`generic`ロールとしては扱われていませんでした（2023 年 8 月時点）。
とはいえ、`generic` ロールが伝わったところで特別に扱われることはないので、あまり影響はないように思います。

<!-- # 太字になる要素たち -->

## `strong` 要素

太字になるといえばコイツ、`strong` 要素です。

### 仕様

> `strong`要素は、そのコンテンツに対する強力な重要性、深刻性、または緊急性を表す。
> **重要性**：`strong`要素は、より詳細な、より陽気な、または単に常用文かもしれない部分から本当に重要である部分を区別するために、見出し、キャプション、または段落で使用できる。（これは`hgroup`要素が適切である、小見出しのマークアップとは区別される。）
>
> （中略）
>
> **深刻性**：`strong`要素は警告または注意の通知をマークアップするために使用できる。
> **緊急性**：`strong`要素は、ユーザーが文書の他の部分よりも早く確認する必要があるコンテンツを示すために使用できる。
> コンテンツの一部の相対的な重要性のレベルは、祖先`strong`要素の数によって与えられる。各`strong`要素が、その内容の重要性を増大する。
> `strong`要素を持つテキストの一部の重要性を変更は、文の意味を変更しない。
> https://momdo.github.io/html/text-level-semantics.html#the-strong-element

:::details 原文（英語）

> The `strong` element represents strong importance, seriousness, or urgency for its contents.
> **Importance**: the `strong` element can be used in a heading, caption, or paragraph to distinguish the part that really matters from other parts that might be more detailed, more jovial, or merely boilerplate. (This is distinct from marking up subheadings, for which the `hgroup` element is appropriate.)
>
> （中略）
>
> **Seriousness**: the `strong` element can be used to mark up a warning or caution notice.
> **Urgency**: the `strong` element can be used to denote contents that the user needs to see sooner than other parts of the document.
> The relative level of importance of a piece of content is given by its number of ancestor `strong` elements; each `strong` element increases the importance of its contents.
> Changing the importance of a piece of text with the `strong` element does not change the meaning of the sentence.
> https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-strong-element

:::

役割は「**重要性**」「**深刻性**」「**緊急性**」の 3 つに分類されています。

「**文の意味を変更しない。**」というのもポイントです。

#### 歴史（HTML 4.01 での仕様）

HTML 4.01 では、`em`要素が「強調」を表すのに対し、`strong`要素は「より強い強調」を表す要素として定義されていました。
つまり当時これらは性質の違いではなく程度の違いとして区別されていました。

> **EM:**
> 強調を示す。
> **STRONG:**
> より強い強調を示す。
> http://www.asahi-net.or.jp/~sd5a-ucd/rec-html401j/struct/text.html#h-9.2.1

:::details 原文（英語）

> **EM:**
> Indicates emphasis.
> **STRONG:**
> Indicates stronger emphasis.
> https://www.w3.org/TR/html4/struct/text.html#h-9.2.1

:::

HTML 5 では意味が変更され、 `em`が強調、`strong`は重要性と、性質の異なる要素になりました。

### 使い方

まず直感的な理解としては、

- その文を書いたときに、**太字で**表現したくなるような文字かどうか
- その文を読んだときに、**大きな声で**読み上げたくなるような箇所かどうか

というのが最初の判断基準になるかなと思っています。

その上で、「重要、深刻、緊急のどれかに当てはまること」を確認しましょう。
これらは **相対的な性質のため、他の部分と比較して考えてみましょう。**

```html:strong要素の使用例1
<!-- 文中で重要な部分を示している -->
<p>この記事は<strong>HTMLの要素の使い分け</strong>について書いています。</p>
```

上記の例では、**この文中で重要**なのは「この記事は」でも「について書いています」でもなく、「HTML の要素の使い分け」であることを表現しています。
たとえば「HTML 要素の使い分けについて書いています」でもなんとなく伝わりますが、「この記事は書いています」だけでは「何を！？」となってしまいますから、「HTML 要素の使い分け」の部分は重要と言えそうです。

```html:strong要素の使用例2
<!-- 緊急性の高い（他よりも先に見るべき）部分を示している -->
<ul>
  <li><strong>電気代を払う</strong></li>
  <li>筋トレする</li>
  <li>ケーキを買う</li>
</ul>
```

上記の例では、「電気代を払う」ことが、他の「筋トレする」や「ケーキを買う」よりも**緊急性**が高いことを示しています。

なお、視覚的には複数の要素を同時に見ることができるため、太字で表示された文字を先に見るということができますが、読み上げの際には順番に読まれるため、緊急性を表す場合には、`strong`タグによるマークアップだけでなく、 **その部分は先に記述する** のが適切と言えそうです（順序の入れ替えが可能な場合）。

#### 使うべきでないとき

太字で表しそうな部分ではあるが、重要性・深刻性・緊急性のいずれにも当てはまらない場合は、`b`要素を使用します。

また、単に太字という見た目のためだけであれば、`span`要素と `font-weight`プロパティを使用します。

### デフォルトの見た目

**`font-weight: bold;`** が適用され、**太字**で表示されます。

`strong`要素の役割である、重要性・深刻性・緊急性を視覚的に表現しているといえます。
特に「緊急性」は、 **「文書の中で先に届けたい内容である」** ということです。
太字は目立ち、先に目に入りやすいので、strong 要素が太字で表示されることは適切と言えそうです。
（情報が同時に取得できる視覚的な表現だからこそできることで、音で表現するのは難しいですね）

#### もっといい見た目を考える

より役割を表すスタイルを考えるとするならば、太字に加えて、**赤字** や **点滅** はありかもしれません。
例えば、ノートを取るとき、重要な部分を赤ペンで書いたりしますし、食品や医薬品の注意書きでも、特に重要な内容は赤字になっています。それに、緊急車両は赤いサイレンを光らせていますよね。

```css:strong要素の役割をより表すスタイルの案
strong {
    font-weight: bold;
    color: red;
    animation: blink 1s step-end infinite;
}

@keyframes blink {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}
```

@[codepen](https://codepen.io/kagankan/pen/XWyLjwb)

同じく太字になる `b` 要素とも区別でき、より意味が表現できる見た目なのではないでしょうか。

### 暗黙のロール

> `role=strong`
>
> https://www.w3.org/TR/html-aria/#el-strong, https://momdo.github.io/html-aria/#el-strong

WAI-ARIA 1.2 から、暗黙のロールが [`strong` ロール](https://momdo.github.io/wai-aria-1.2/#strong) （[原文（英語）](https://www.w3.org/TR/wai-aria-1.2/#strong)）として設定されています。
`strong` ロールは WAI-ARIA 1.2 で追加されたロールです。

ただし、Chrome, Firefox では対応しておらず、特にロールは設定されないようでした（2023 年 8 月現在）。
とはいえ、仕様としては決まっているので、`strong`要素でマークアップしていれば、いずれスクリーンリーダーでも重要性・深刻性・緊急性が伝わるようになるかもしれません。

### リッチテキストエディタにおける太字

リッチテキストが使用できるブログやメッセージングサービスなどでは、単なる「太字」の役割で `strong` 要素が出力されていることも多いです（Zenn のマークダウン記法で `**太字**` と記述して表示される **太字** も`strong`要素で出力されます）。ユーザーは「太字」という選択しかできず、最終的に出力される HTML を選択することはできないので、使い分けることは不可能です。

とはいえ、基本的には重要性を表すときに太字を選択することが多いと考えられるので、`strong`要素で出力されるのはそこまでおかしくないとは思います。

## `b` 要素

太字になるもう一つの要素が `b` 要素です。

### 仕様

> `b`要素は、たとえば、文書の概要でのキーワード、レビューでの製品名、対話的なテキスト駆動型ソフトウェアでの使用可能語、または記事リードなど、特別な重要性を伝えることなく、代わりの声やムードの意味合いなしに、実用的な目的に対して描かれている注目すべきテキストの範囲を表す。
> https://momdo.github.io/html/text-level-semantics.html#the-b-element

:::details 原文（英語）

> The `b` element represents a span of text to which attention is being drawn for utilitarian purposes without conveying any extra importance and with no implication of an alternate voice or mood, such as key words in a document abstract, product names in a review, actionable words in interactive text-driven software, or an article lede.
> https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-b-element

（"lede" というのは リード文を意味する"lead"をあえてスペルを変えて使用している単語です。）

:::

特定のキーワードなど、 **注目すべきテキスト** を表します。
重要性は表しません（`strong`要素は重要性を表していましたが、`b`はそうではありません）。

#### 歴史（HTML 4.01 での仕様）

HTML 4.01 では、`b`要素は「フォントスタイル要素」に分類されており、単なる見た目を表現するための要素でした（一方、`em`や`strong`は「構造化テキスト」に分類されていました）。

> **B**: ボールド体でレンダリング。
> http://www.asahi-net.or.jp/~sd5a-ucd/rec-html401j/present/graphics.html#edef-B

:::details 原文（英語）

> **B**: Renders as bold text style.
> https://www.w3.org/TR/html4/present/graphics.html#edef-B

:::

その役割が HTML 5 になって変更（再定義）されました。
HTML 5 での仕様は「太字で表現するような場面を`b`要素の意味にした」という理解ができそうです。

HTML 5 においては、`b`要素は`strong`要素などと同じ「テキストレベルセマンティックス」に分類されています。
「セマンティックス」ですから、単なる見た目ではなく、意味付けのために使用されるべきことがわかります。

### 使い方

「太字で表現したい箇所、だけど重要性があるわけではない」「他の文とはちょっと役割が違うんだよな」みたいなところ、というのが直感的なイメージです。
私はキャッチコピー的な部分で意外とよく使います。

```html:b要素の使用例（キャッチコピーのマークアップ）
<article>
  <h1>株式会社ダミーダミーの紹介</h1>
  <p><b>ダミーテキストで世界を変える。</b></p>
  <p>株式会社ダミーダミーは、ダミーテキストを提供することを目的に活動するダミー企業です。私たちはダミーであり続けることに誇りを持っており、真に革命的なダミーテキストを世界中に提供しています。私たちのヴィジョンは、「最もダミーであること」。これを追求する中で、ダミーテクノロジー、ダミーデザイン、ダミー革新に日々取り組んでいます。何も生み出さない、何も提供しない、それが株式会社ダミーダミー。一緒に最高のダミー体験をしませんか？</p>
</article>
```

キャッチコピーの部分は、デザイン上大きな文字・太字で表示されることが多いため、`h1-h6`であったり、`strong`であったりでマークアップされていることも多いです。しかし、文書構造的に見出しではないので、`h1-h6`要素は適切ではありません。また、役割は違うものの文の重要性に強弱があるわけでもないので、`strong`要素も違う気がします。よって`b`要素でマークアップするのが最適なケースが多いように思います。

#### 使うべきでないとき

単に太字にする目的であれば、`span`要素と `font-weight`プロパティを使用します。

#### 判断基準

判断基準としては、`b`要素にクラス名を付けてみて、適切に名前が付けられたら`b`要素が適しているといえます。

```html:クラス名で役割を区別した例
<article>
  <h1>株式会社ダミーダミーの紹介</h1>
  <p><b class="copy">ダミーテキストで世界を変える。</b></p>
  <p><b class="company-name">株式会社ダミーダミー</b>は、ダミーテキストを提供することを目的に活動するダミー企業です。私たちはダミーであり続けることに誇りを持っており、真に革命的なダミーテキストを世界中に提供しています。私たちのヴィジョンは、「最もダミーであること」。これを追求する中で、ダミーテクノロジー、ダミーデザイン、ダミー革新に日々取り組んでいます。何も生み出さない、何も提供しない、それが<b class="company-name">株式会社ダミーダミー</b>。一緒に最高のダミー体験をしませんか？</p>
</article>
```

上記の例では、`copy`クラスが「キャッチコピーという注目すべきテキストだから`b`要素で区別」、`company-name`クラスが「会社名というキーワードだから`b`要素で区別」されています。
もしその部分を適切に区別する名前が与えられないのであれば、単に見た目を太字にする目的であると判断でき、その場合は`b`要素を使うべきではありません。

### デフォルトの見た目

**`font-weight: bold;`** が適用され、 **太字** で表示されます（`strong`と同様）。

元々が「ボールド体でレンダリング」するための要素だったので、当たり前といえば当たり前ですね。
その前提はありつつも、「注目すべきテキスト」という意味を太字によって視覚的に区別できる表現になっているといえます。

ただ、`strong`も`b`も同じ見た目になるので、同じ重要性に見えてしまいますよね……。

#### もっといい見た目を考える

`b`の注目すべきテキストということも表現しつつ、`strong`の重要性を示そうと思ったら、こんな指定はどうでしょう？

一つは太さを変えることです（フォントに 900 のウェイトが搭載されている前提にはなりますが）。

```css:案1 太さを変える
b {
    font-weight: 700;
}

strong {
    font-weight: 900;
}
```

もしくは、`strong` の節で赤字を検討したので、strong だけ赤字にするという区別も考えられるかもしれません。

```css:案2 色を変える
b {
    font-weight: bold;
}

strong {
    font-weight: bold;
    color: red;
}
```

いずれにせよ、 `b` 要素の見た目を変えるというより、 `strong` 要素の重要性を強く出すという方向性で考えるのが良さそうな気がします。

### 暗黙のロール

> `role=generic`
>
> https://www.w3.org/TR/html-aria/#el-b, https://momdo.github.io/html-aria/#el-b

`generic` ロール、つまり `span` 要素と同じです。
よって、読み上げでは特別に扱われることはないことがわかります。

## `em` 要素

よく `strong` との使い分けがわからなくなりがちな `em` です。

### 仕様

> `em`要素は、要素のコンテンツの強調を表す。
>
> コンテンツの特定部分が持つ強調のレベルは、祖先の`em`要素の数によって与えられる。
>
> 強調の設置は、文の意味を変更する。このように要素は、コンテンツの不可欠な部位を形成する。強調が使用される正確な方法は、言語によって異なる。
> https://momdo.github.io/html/text-level-semantics.html#the-em-element

:::details 原文（英語）

> The `em` element represents stress emphasis of its contents.
>
> The level of stress that a particular piece of content has is given by its number of ancestor `em` elements.
>
> The placement of stress emphasis changes the meaning of the sentence. The element thus forms an integral part of the content. The precise way in which stress is used in this way depends on the language.
> https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-em-element

:::

**強調** を表す要素です。

`strong`が重要性を表すのに対し、`em`要素は重要性を意味しません。
（「強調」だが「重要」ではない、というのがなかなか直感的には理解しづらい…。）

また、 **「強調の設置は、文の意味を変更する。」** とあるのは大きなポイントです。
「文の意味を変更しない。」とされている `strong`要素の説明と対照的です。

### 使い方

ポイントは **「文の意味を変える」** ために **「強調」** するところです。
見た目の節で触れますが、日本語においては「カギカッコで囲みたいところ」や「圏点を打ちたいところ」というのが直感的な理解です。
また、読み上げたときに、声をちょっと変えて読みそうなところ、という理解もできます。

```html:em要素の使用例
<!-- ただの事実 -->
<p>カレーは美味しい食べ物です。</p>

<!-- （美味しい食べ物といえば？と聞かれて）カレーだよ、という意味になる -->
<p><em>カレーは</em>美味しい食べ物です。</p>

<!-- （カレーを知らない人に、どんな食べ物なの？と聞かれて）美味しいよ、という意味になる -->
<p>カレーは<em>美味しい</em>食べ物です。</p>

<!-- （カレーは飲み物、という主張に対して）いやいや食べ物だよ、という意味になる -->
<p>カレーは美味しい<em>食べ物</em>です。</p>
```

#### 使うべきでないとき

`em`要素のマークアップを追加・削除したときに、文の意味を変えていなければ、`em`要素は適切ではありません。

### デフォルトの見た目

**`font-style: italic;`** が適用され、 **イタリック体** で表示されます。

#### そもそも「イタリック体」ってなんなんだ？

「イタリック体」は欧文ならではの表現です。
混同されがちな「斜体（オブリーク体）」とは異なり、単に文字を傾けているだけではなく、別の書体です（CSS の `font-style`プロパティにおいても、 `italic`と`oblique`はそれぞれ別の指定です）。

https://ja.wikipedia.org/wiki/%E3%82%A4%E3%82%BF%E3%83%AA%E3%83%83%E3%82%AF%E4%BD%93

欧文においては、単語の強調・注意喚起といった場面でイタリック体が使用されるため、`em`要素の意味を表す見た目としては正しそうです。しかし、日本語フォントにはイタリック体なんてないですし、馴染みもないですよね。
日本語フォントにはイタリック体が搭載されていないため、イタリック体の指定は文字を傾けただけの斜体として表現されることが多いです。
ですがなんと、**メイリオでは「イタリック体に立体と同じ字形が実装」されています。**

> メイリオおよび Meiryo UI においては、日本語文字のイタリック体として立体と同じ字形が実装されている。このため、CSS を用いて `font-style: italic` とした場合も立体と同様に表示される。イタリック体が実装されていないわけではないので、`font-style: oblique` とした場合にもイタリック体を使用するため、立体と同じ字形が表示されることとなる。
> https://ja.wikipedia.org/wiki/%E3%82%A4%E3%82%BF%E3%83%AA%E3%83%83%E3%82%AF%E4%BD%93#%E6%9B%B8%E4%BD%93

そのため、Zenn でもマークダウン記法で _イタリック (italic)_ （`*イタリック*` または `_イタリック_` のように入力します）を使用することはできますが、Windows 環境で閲覧している場合、本文がメイリオで表示されるため、日本語部分は斜体表示にはなりません。つまり、 **`em` 要素の見た目が変わらないので、これでは意味が伝えられるとは言えないでしょう。**

#### 日本語における「強調」の表現を考える

イタリック体の Wikipedia に

> なお強調や題名などの用法は、和文の鉤括弧などの引用符の用法に似る。
> https://ja.wikipedia.org/wiki/%E3%82%A4%E3%82%BF%E3%83%AA%E3%83%83%E3%82%AF%E4%BD%93#%E7%94%A8%E6%B3%95

とある通り、日本語においてはカギカッコで囲むことで強調を表すことが多いです。
これを CSS で表現するとこうなります。

```css:日本語におけるem要素の意味を表すスタイル案1（カギカッコで囲む）
em:lang(ja) {
  quotes: "「" "」";
}
em:lang(ja)::before {
  content: open-quote;
}
em:lang(ja)::after {
  content: close-quote;
}
```

個人的にはむしろ**圏点、傍点**（文字の上に•（丸い点）や﹅（ゴマ）が振られているアレです）のほうが近いのでは？という説を推しています。

https://ja.wikipedia.org/wiki/%E5%9C%8F%E7%82%B9

圏点は CSS では [`text-emphasis` プロパティ](https://developer.mozilla.org/ja/docs/Web/CSS/text-emphasis)で設定できます（text-_emphasis_ なんですから、`em`要素の表現にぴったりでしょう）。

```css:日本語におけるem要素の意味を表すスタイル案2（圏点）
em:lang(ja) {
  text-emphasis: filled dot;
}
```

@[codepen](https://codepen.io/kagankan/pen/OJaebzq)

日本語で使うぶんには、これらの表現が`em`要素の意味を表せると思うのですよね。

### 暗黙のロール

> `role=emphasis`
>
> https://www.w3.org/TR/html-aria/#el-em, https://momdo.github.io/html-aria/#el-em

WAI-ARIA 1.2 で [`emphasis` ロール](https://momdo.github.io/wai-aria-1.2/#emphasis) （[原文（英語）](https://www.w3.org/TR/wai-aria-1.2/#emphasis)） が導入されています。

ただし、Chrome, Firefox では対応しておらず、特にロールは設定されないようでした（2023 年 8 月現在）。
とはいえ仕様としては決まっているので、いずれスクリーンリーダーでも強調が伝わるようになるかもしれません。

### リッチテキストエディタにおけるイタリック体

リッチテキストが使用できるブログやメッセージングサービスなどでは、単なる「イタリック体（斜体）」の役割で `em` 要素が出力されていることも多いです（Zenn のマークダウン記法で `*イタリック*` または `_イタリック_` と記述して表示される _イタリック (italic)_ も`em`要素で出力されます）。
ユーザーは「イタリック体（斜体）」という選択しかできず、最終的に出力される HTML を選択することはできないので、使い分けることは不可能です。

欧文ならば、イタリック体で表示したいときと強調したいときはほぼイコールなのかもしれませんが、和文においてはそうではない気がします。どれだけの日本人が強調の意味を意図してイタリックの装飾を使えているのでしょうか……。

## `i` 要素

`em`と同様イタリック体になる `i`です。

### 仕様

> `i`要素は、代わりの声やムードでテキストの範囲を表すか、またはそうでなければ、たとえば分類学上の名称、専門用語、他言語の慣用句、意見、または西洋のテキストで船名など、異なる品質のテキストを示す方法で通常の文からのオフセットを表す。
> https://momdo.github.io/html/text-level-semantics.html#the-i-element

:::details 原文（英語）

> The `i` element represents a span of text in an alternate voice or mood, or otherwise offset from the normal prose in a manner indicating a different quality of text, such as a taxonomic designation, a technical term, an idiomatic phrase from another language, transliteration, a thought, or a ship name in Western texts.
> https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-i-element

:::

「代替音声」とも表されるように、**声を変えて読むような箇所**を表現したり、**学術名**、**専門用語**などを表したりします。
「異なる品質のテキストを示す」という役割は`b`にも似ています。
（欧文の）**慣例的にイタリック体で表現されるテキスト**、というのがイメージです。

#### 歴史（HTML 4.01 での仕様）

HTML 4.01 では、`i`要素は「フォントスタイル要素」に分類されており、単なる見た目を表現するための要素でした（一方、`em`や`strong`は「構造化テキスト」に分類されていました）。

> **I:** イタリック体でレンダリング。
> http://www.asahi-net.or.jp/~sd5a-ucd/rec-html401j/present/graphics.html#edef-I

:::details 原文（英語）

> **I:** Renders as italic text style.
> https://www.w3.org/TR/html4/present/graphics.html#edef-I

:::

その役割が HTML 5 になって変更（再定義）されました。
HTML 5 での仕様は「イタリック体で表現するような場面を`i`要素の意味にした」という理解ができそうです。

HTML 5 においては、`i`要素は`strong`要素などと同じ「テキストレベルセマンティックス」に分類されています。
「セマンティックス」ですから、単なる見た目ではなく、意味付けのために使用されるべきことがわかります。

### 使い方

学術名、専門用語のような、欧文でイタリック体にするようなテキストに使います。
また、「異なる品質のテキストを示す」ような場面でも使うことができます。

以下は、HTML Standard に掲載されている`i`要素の使用例を GitHub Copilot に日本語訳してもらったものです。
夢の場面が`i`要素で表現されています。

```html:i要素の使用例
<p>レイモンドは眠ろうとした。</p>
<p><i>船は木曜日に出航した</i>、彼は夢見た。<i>船には多くの人が乗っていた。その中にはキャリーという美しいお姫様もいた。彼は毎日彼女を見ていた。彼女が自分に気づいてくれることを願って。</i></p>
<p><i>ついにある夜、彼は勇気を出して彼女に話しかけた――</i></p>
<p>レイモンドは火災報知器の音で目を覚ました。</p>
```

:::details 原文（英語）

```html:HTML Standardに掲載されているi要素の使用例
<p>Raymond tried to sleep.</p>
<p><i>The ship sailed away on Thursday</i>, he
dreamt. <i>The ship had many people aboard, including a beautiful
princess called Carey. He watched her, day-in, day-out, hoping she
would notice him, but she never did.</i></p>
<p><i>Finally one night he picked up the courage to speak with
her—</i></p>
<p>Raymond woke with a start as the fire alarm rang out.</p>
```

:::

ただ、欧文の慣習によるところが大きいので、日本語でこの要素を使うのはなかなか難しいです。
日本語のサイトを作るにおいては `i`要素がうまく使えるケースはあまりない、というのが私の見解です。無理に使う必要はないと思います。

#### 使うべきでないとき

アイコンフォントの表示のために `i` 要素が使われることがありますが、アイコンの意味はありませんので、その用途は不適切です。

#### 判断基準

`b`要素と同様ですが、`class`属性を付けてみて、役割を名付けられたら`i`要素を使えていそうです。

例えば先程の例では、「夢の場面」という役割を名付けることができ、この「夢の場面」が代わりの声やムードで表現されるべきものであると判断できます。

```html:class属性で役割を名付けた例
<p>レイモンドは眠ろうとした。</p>
<p><i class="dream">船は木曜日に出航した</i>、彼は夢見た。<i class="dream">船には多くの人が乗っていた。その中にはキャリーという美しいお姫様もいた。彼は毎日彼女を見ていた。彼女が自分に気づいてくれることを願って。</i></p>
<p><i class="dream">ついにある夜、彼は勇気を出して彼女に話しかけた――</i></p>
<p>レイモンドは火災報知器の音で目を覚ました。</p>
```

逆にこのような命名ができない場合は、`i`要素を使うべきではなさそうです。

### デフォルトの見た目

**`font-style: italic;`** が適用され、 **イタリック体** で表示されます。

元々が「イタリック体でレンダリング」するための要素だったので、当たり前といえば当たり前ですね。

#### もっといい見た目を考える

意味がイタリック体の文化から定義されている以上、もはやこういうのがイタリック体（もしくは斜体）なんだと受け入れるべきな気がします。

しかし、`em`の項目で書いた通りメイリオではイタリックはおろか斜体にすらならず見た目が変わりませんから、なにか手を加える必要がありそうです。

**「メイリオでイタリック体にならないなら、メイリオ以外のフォントにすればいいじゃない？」**

イタリック体の特徴といえば、

> 筆記体 (cursive)に似た字形を持つ
> https://ja.wikipedia.org/wiki/%E3%82%A4%E3%82%BF%E3%83%AA%E3%83%83%E3%82%AF%E4%BD%93

ことです。

日本語フォントで筆記体に似た（手書きに近い）字形を持つものといえば、**明朝体** です。
メイリオ（ゴシック系）ではなく、明朝体を指定することで、斜体にしてしまうというのはどうでしょう？

```css:日本語におけるi要素の意味を表すスタイル案
i:lang(ja) {
  font-family: serif;
}
```

@[codepen](https://codepen.io/kagankan/pen/ExGYQBg)

ゴシックの文中で明朝体の文字が出てきたら、なんだかそこだけ別の声やムードで表現されているような気がしませんか？
これにより`i`要素の「代わりの声やムードでテキストの範囲を表す」という部分も表せそうです。

### 暗黙のロール

> `role=generic`
>
> https://www.w3.org/TR/html-aria/#el-i, https://momdo.github.io/html-aria/#el-i

`generic` ロール、つまり `span` 要素と同じです。
よって、読み上げでは特別に扱われることはないことがわかります。

## `dfn` 要素

使い分けで迷うことはあまりないとは思うのですが、イタリック体で表示される要素ということで紹介します。

### 仕様

> `dfn`要素は、用語の定義実体を表す。`dfn`要素の最も近い祖先である段落、説明リストのグループ、またはセクションはまた、`dfn`要素によって与えられる用語の定義を含まなければならない。
> https://momdo.github.io/html/text-level-semantics.html#the-dfn-element

:::details 原文（英語）

> The `dfn` element represents the defining instance of a term. The paragraph, description list group, or section that is the nearest ancestor of the `dfn` element must also contain the definition(s) for the term given by the `dfn` element.
> https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-dfn-element

:::

用語の定義を説明する際の、用語自体を表します。

### 使い方

用語を表すときに使います。
祖先の段落がその説明をしている必要があります。

```html:dfn要素の使用例
<p>
  <dfn>dfn要素</dfn>は、用語の定義実体を表す。
</p>
```

### デフォルトの見た目

**`font-style: italic;`** が適用され、 **イタリック体** で表示されます。

`em`要素で触れた通り、欧文においては適切だと思うのですが、日本語においてはイタリック体の文化がないため、違和感があります。
日本語においては、「カギカッコ」で表現する方が理解しやすいのではないでしょうか？

```css:日本語におけるdfn要素の表現の案
dfn:lang(ja) {
  quotes: "「" "」";
}
dfn:lang(ja)::before {
  content: open-quote;
}
dfn:lang(ja)::after {
  content: close-quote;
}
```

@[codepen](https://codepen.io/kagankan/pen/mdQZLwR)

### 暗黙のロール

> `role=term`
>
> https://www.w3.org/TR/html-aria/#el-dfn, https://momdo.github.io/html-aria/#el-dfn

[`term` ロール](https://momdo.github.io/wai-aria-1.2/#term) （[原文（英語）](https://www.w3.org/TR/wai-aria-1.2/#term)）が暗黙のロールです。
ただし、Chrome, Firefox では対応しておらず、特にロールは設定されないようでした（2023 年 8 月現在）。

（ちなみに、[`definition` ロール](https://momdo.github.io/wai-aria-1.2/#definition) （[原文（英語）](https://www.w3.org/TR/wai-aria-1.2/#definition)）も存在しますが、こちらは定義の説明文側を表すロールです。）

## `cite` 要素

これもまた、使い分けで迷うことはあまりないとは思うのですが、イタリック体で表示される要素ということで紹介します。

### 仕様

> `cite`要素は、作品（たとえば、本、新聞、エッセイ、詩、楽譜、歌、脚本、映画、テレビ番組、ゲーム、彫刻、絵画、映画、演劇、オペラ、ミュージカル、展示、訴訟事例報告、コンピュータープログラムなど）のタイトルを表す。これは、引用されるまたは詳細に参照される（すなわち引用文）作品かもしれず、またはそれは単に通りがかりに記載される作品かもしれない。
>
> 人名は作品のタイトルではない―たとえ人々がその人を作品の一部とみなすとしても―したがって要素は人名をマークアップするために使用してはならない。（一部の場合、`b`要素が名前に対して適切であるかもしれない。たとえば、有名人の名前が注意を引くために別のスタイルを使用してレンダリングされるキーワードであるようなゴシップ記事において。他の例では、要素が本当に必要である場合、`span`要素を使用できる。）
> https://momdo.github.io/html/text-level-semantics.html#the-cite-element

:::details 原文（英語）

> The `cite` element represents the title of a work (e.g. a book, a paper, an essay, a poem, a score, a song, a script, a film, a TV show, a game, a sculpture, a painting, a theatre production, a play, an opera, a musical, an exhibition, a legal case report, a computer program, etc.). This can be a work that is being quoted or referenced in detail (i.e., a citation), or it can just be a work that is mentioned in passing.
>
> A person's name is not the title of a work — even if people call that person a piece of work — and the element must therefore not be used to mark up people's names. (In some cases, the `b` element might be appropriate for names; e.g. in a gossip article where the names of famous people are keywords rendered with a different style to draw attention to them. In other cases, if an element is really needed, the `span` element can be used.)
> https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-cite-element

:::

**「作品のタイトル」** を表す要素です。

#### 歴史（HTML 4.01 での仕様）

HTML 4.01 では、`cite`要素は「引用」を表す要素でした。
cite って「引用する」の意味なんですよね。
ちなみに cite と quote の違いは、quote が引用符（クォーテーションマーク）を用いて元の文をそのまま抜き出すのに対して、cite は参考文献のような感じで単に参照元として引き合いに出すような違いのようです。 ^[https://ja.hinative.com/questions/14091250]

> **CITE:**
> 引用か、他のリソースへの参照であることを示す。
> http://www.asahi-net.or.jp/~sd5a-ucd/rec-html401j/struct/text.html#edef-CITE

:::details 原文（英語）

> **CITE:**
> Contains a citation or a reference to other sources.
> https://www.w3.org/TR/html4/struct/text.html#edef-CITE

:::

その役割が HTML 5 になって変更され、引用に限らず作品のタイトルならなんでも使えることになっています。
（引用ではないケースのことが仕様では「単に通りがかりに記載される」と表現されているようです）

### 使い方

作品のタイトルを表すときに使います。著者名などは含みません。

```html:cite要素の使用例
<p>
  <cite>HTML解体新書</cite>は、HTMLを本格的に学ぶための書籍です。
</p>
```

#### 使うべきでないとき

文を引用する場合は、`blockquote`要素か `q`要素を使うべきです。

### デフォルトの見た目

**`font-style: italic;`** が適用され、 **イタリック体** で表示されます。

`em`要素で触れた通り、欧文においては適切だと思うのですが、日本語においてはイタリック体の文化がないため、違和感があります。

和文において、作品名（特に書名）は『』（二重鉤括弧）で囲むのが一般的ですから ^[http://sla.cls.ihe.tohoku.ac.jp/wpsys/wp-content/uploads/2019/04/sankoubunken_mokuroku_nihongo.pdf] 、これを使うのはどうでしょう？

```css:日本語におけるcite要素の表現の案
cite:lang(ja) {
  quotes: "『" "』";
}
cite:lang(ja)::before {
  content: open-quote;
}
cite:lang(ja)::after {
  content: close-quote;
}
```

@[codepen](https://codepen.io/kagankan/pen/JjeQLXZ)

### 暗黙のロール

> 対応するロールなし
> https://momdo.github.io/html-aria/#el-cite

> No corresponding role
> https://www.w3.org/TR/html-aria/#el-cite

「[対応するロールなし](https://momdo.github.io/html-aria/#dfn-no-corresponding-role)」は「意味は持つんだけど、ARIA で提供されているロールでは表現できない」ということです。

## `var` 要素

これも使い分けを迷うことはないと思いますが、イタリック体で表示される要素ということで紹介します。

### 仕様

> `var`要素は変数を表す。これは、数式やプログラミングコンテキスト、定数を表す識別子、物理量を識別する記号、関数パラメーター、または単に文のプレースホルダーとして使用される用語で、実際に変数であるかもしれない。
> https://momdo.github.io/html/text-level-semantics.html#the-var-element

:::details 原文（英語）

> The `var` element represents a variable. This could be an actual variable in a mathematical expression or programming context, an identifier representing a constant, a symbol identifying a physical quantity, a function parameter, or just be a term used as a placeholder in prose.
> https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-var-element

:::

特に言うこともなく、**変数**を表します。

### 使い方

数式の変数やプログラムの変数を表すときに使います。

```html:var要素の使用例
<p>
  今の年齢が<var>n</var>歳だとすると、<var>m</var>年後は<var>n</var>+<var>m</var>歳になります。
</p>
```

なお、HTML 中で数式を表現する場合は、[MathML](https://developer.mozilla.org/ja/docs/Web/MathML) (`math`要素)を使う方法もあります。

### デフォルトの見た目

**`font-style: italic;`** が適用され、 **イタリック体** で表示されます。

学術分野において、数式中の変数や物理量を表す記号をイタリック体で表す慣習があるからのようです。 ^[https://hontolab.org/tips-for-research-activity/how-to-use-mathmatic-symbol/] ^[https://www.eng.u-hyogo.ac.jp/faculty/hoshino/pc/latex/tex_si_styles/]

数式やプログラミングにおいてはアルファベットを使いますので、特に日本語における表現を考える必要もなさそうです。

### 暗黙のロール

> 対応するロールなし
> https://momdo.github.io/html-aria/#el-var

> No corresponding role
> https://www.w3.org/TR/html-aria/#el-var

「[対応するロールなし](https://momdo.github.io/html-aria/#dfn-no-corresponding-role)」は「意味は持つんだけど、ARIA で提供されているロールでは表現できない」ということ。

<!-- # 背景色がつく要素 -->

## `mark` 要素

デフォルトの見た目としては他と一線を画す、`mark`要素です。

### 仕様

> `mark`要素は、別のコンテキストにおいて関連性のために、参照目的でマークまたは強調表示されるある文書内の一連のテキストを表す。引用文または文から参照されるテキストのブロック内で使用される場合、ブロックが元々書かれたときに、元々存在しないが、オリジナルの著者によって重要だと考えられていないかもしれないだろう、テキストの一部に読者の注意を喚起するために追加されたハイライトを示す。この追加は、事前に予期しない精査である。文書の本文で使用した場合、ユーザーの現在のアクティビティーに関連性が高いために強調されている文書の一部を示す。
> https://momdo.github.io/html/text-level-semantics.html#the-mark-element

:::details 原文（英語）

> The `mark` element represents a run of text in one document marked or highlighted for reference purposes, due to its relevance in another context. When used in a quotation or other block of text referred to from the prose, it indicates a highlight that was not originally present but which has been added to bring the reader's attention to a part of the text that might not have been considered important by the original author when the block was originally written, but which is now under previously unexpected scrutiny. When used in the main prose of a document, it indicates a part of the document that has been highlighted due to its likely relevance to the user's current activity.
> https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-mark-element

:::

#### 歴史

この要素は HTML 4.01 にはなく、HTML 5 で新しく導入された要素です。

### 使い方

**ここに注目！** みたいなところ。
そのまんまですが、**マーカー（蛍光ペン）でラインを引くような箇所**、と考えるとイメージしやすいです。

- 引用した文中で、（引用した人が）注目すべき部分を示す
- 検索結果画面で、検索ワードと一致している部分を示す

ときに使います。

```html:mark要素の使用例
<!-- 引用者が一部分に注目させるために -->
<blockquote>
 <p>mark要素は、別のコンテキストにおいて関連性のために、参照目的でマークまたは<mark>強調表示</mark>されるある文書内の一連のテキストを表す。</p>
</blockquote>
```

```html:mark要素の使用例
<!-- ユーザーが「テキスト」で検索したときに -->
<p>mark要素は、別のコン<mark>テキスト</mark>において関連性のために、参照目的でマークまたは強調表示されるある文書内の一連の<mark>テキスト</mark>を表す。</p>
```

検索機能を実装するときにはぜひ使いたいですね。

### デフォルトの見た目

**黄色い背景色** が設定され、**マーカー（蛍光ペン）が引かれたような見た目**で表示されます。
Chrome では以下のようなスタイルシート記述でした。

```css
mark {
  background-color: mark;
  color: marktext;
}
```

注目付けるための強調表示としては、背景色がつく表現は適切だと思います。ぱっと見でわかりやすいですね。

### 暗黙のロール

> 対応するロールなし
> https://momdo.github.io/html-aria/#el-mark

> No corresponding role
> https://www.w3.org/TR/html-aria/#el-mark

「[対応するロールなし](https://momdo.github.io/html-aria/#dfn-no-corresponding-role)」は「意味は持つんだけど、ARIA で提供されているロールでは表現できない」ということ。

ただし、WAI-ARIA 1.3（※策定中で、正式勧告されていない）では、[`mark` ロール](https://w3c.github.io/aria/#mark)が提案されています。
Chrome, Firefox ではすでに実装されており、`mark`要素は`mark`ロールとして扱われていました。

Windows NVDA + Chrome で読み上げを行ったところ、以下のように読み上げられました。

```html:HTML
<mark>mark</mark>
```

```txt:読み上げ結果
ハイライトあり    mark  ハイライトありの外
```

ここからここまでがハイライトされている（`mark`要素でマークアップされている）、ということがスクリーンリーダーユーザーにも伝わっています。

<!-- # 下線が付く要素 -->

## `u` 要素

なんとも使うのが難しい、`u`要素です。

### 仕様

> `u`要素は、明示的にレンダリングされるが、非テキストの注釈、たとえば中国語のテキストで固有名詞（中国語の固有名詞のマーク）としてテキストを分類する、またはスペルミスとしてテキストを分類するような、明瞭に発音されないテキストの範囲を表す。
>
> ほとんどの場合、別の要素がより適切である可能性が高い。強調のマークアップに対して`em`要素を使用すべきであり、キーワードやフレーズに対して、コンテキストに応じて`b`要素か`mark`要素のいずれかを使用すべきであり、本のタイトルのマークアップに対して`cite`要素を使用すべきであり、明示的なテキスト注釈をもつテキストのラベル付けに対して`ruby`要素を使用すべきであり、技術用語、分類学上の名称、音訳、意図、または西洋の文書で船名を標識するために i 要素を使用すべきである。
> https://momdo.github.io/html/text-level-semantics.html#the-u-element

:::details 原文（英語）

> The `u` element represents a span of text with an unarticulated, though explicitly rendered, non-textual annotation, such as labeling the text as being a proper name in Chinese text (a Chinese proper name mark), or labeling the text as being misspelt.
>
> In most cases, another element is likely to be more appropriate: for marking stress emphasis, the `em` element should be used; for marking key words or phrases either the `b` element or the `mark` element should be used, depending on the context; for marking book titles, the `cite` element should be used; for labeling text with explicit textual annotations, the `ruby` element should be used; for technical terms, taxonomic designation, transliteration, a thought, or for labeling ship names in Western texts, the `i` element should be used.
> https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-u-element

:::

発音やテキストには含まれないが区別したいテキスト、を表すようです。

「ほとんどの場合、別の要素がより適切である可能性が高い。」と書かれちゃってます。
仕様のページを見てもらうとわかるのですが、これ以外の説明や例示はほとんどなく、説明の半分以上が「使わない方がいい」話をしてます。

#### 歴史（HTML 4.01 での仕様）

HTML 4.01 では、`u`要素は「フォントスタイル要素」に分類されており、単なる見た目を表現するための要素でした。
しかも、当時は **推奨しない（Deprecated）** とされていました。

> **U:** **推奨しない。** 下線を引いてレンダリングする。
> http://www.asahi-net.or.jp/~sd5a-ucd/rec-html401j/present/graphics.html#edef-U

:::details 原文（英語）

> **U:** **Deprecated.** Renders underlined text.
> https://www.w3.org/TR/html4/present/graphics.html#edef-U

:::

その役割が HTML 5 になって変更（再定義）されました。
そして、非推奨ではなく、正式な要素になっています（なんで復活させたんだろう…）。
HTML 5 での仕様は「下線を使うような場面を`u`要素の意味にした」という理解ができそうです。

HTML 5 においては、`u`要素は`strong`要素などと同じ「テキストレベルセマンティックス」に分類されています。
「セマンティックス」ですから、単なる見た目ではなく、意味付けのために使用されるべきことがわかります。

### 使い方

下線を引きたくなるような部分、というのが直感的な理解です。
仕様で例として示されているのは、スペルミスを示すために使う例です。

```html:u要素の使用例
<p>The <u>see</u> is full of fish.</p>
```

ただ、「ほとんどの場合、別の要素がより適切である可能性が高い。」と言われている通りで、基本的に使うことはないんじゃないかと思います。

さらに、仕様書には次のような注釈もあります。

> Note
> 視覚プレゼンテーションで `u` 要素の既定のレンダリングは、ハイパーリンク（下線）の慣習的なレンダリングと衝突する。著者は、ハイパーリンクと混同するかもしれない `u` 要素を使用しないよう推奨する。

:::details 原文（英語）

> Note
> The default rendering of the `u` element in visual presentations clashes with the conventional rendering of hyperlinks (underlining). Authors are encouraged to avoid using the `u` element where it could be confused for a hyperlink.

:::

使い所もない上、使うべきでもないと言われてしまっています。
（なんてかわいそうな要素…）

#### 使うべきではない例

単に下線を引く目的であれば、`span`要素に`text-decoration: underline;`を指定するのが適切です。

### デフォルトの見た目

**`text-decoration: underline;`** が適用され、**下線**が引かれます。

元々が「下線を引いてレンダリングする」ための要素だったので、当たり前といえば当たり前ですね。

#### もっとよい見た目を考える

「ハイパーリンク（下線）の慣習的なレンダリングと衝突する」と言われてしまっていますから、リンクとは区別できるような見た目を考えてあげましょう。
**Microsoft Word では、スペルミスの表現には「赤い波下線」** が使われています。 ^[https://support.microsoft.com/ja-jp/office/%E3%82%B9%E3%83%9A%E3%83%AB-%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%AE%E3%82%AA%E3%83%B3%E3%81%A8%E3%82%AA%E3%83%95%E3%82%92%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88%E3%82%8B-e2805461-77d4-4832-b006-061163c8d01a]
これを使うのはどうでしょうか？
波線にするだけでもよさそうですが、せっかくなので色も赤にしてみます。

```css:u要素の見た目を変える
u {
  text-decoration: underline wavy red;
}
```

@[codepen](https://codepen.io/kagankan/pen/NWeWYpm)

「中国語の固有名詞のマーク」のような他の用途はちょっと考慮できていないですが、少なくともスペルミスの分類としては適切な見た目になりました。

### 暗黙のロール

> `role=generic`
>
> https://www.w3.org/TR/html-aria/#el-u, https://momdo.github.io/html-aria/#el-u

`generic` ロール、つまり `span` 要素と同じです。
よって、読み上げでは特別に扱われることはないことがわかります。

## `ins` 要素・`del` 要素

この 2 つは対になる要素であり、共通する部分が多いため、まとめて紹介します。

### 仕様

> `ins`要素は、文書への追加を表す。
> https://momdo.github.io/html/edits.html#the-ins-element

:::details 原文（英語）

> The `ins` element represents an addition to the document.
> https://html.spec.whatwg.org/multipage/edits.html#the-ins-element

:::

> `del`要素は、文書からの削除を表す。
> https://momdo.github.io/html/edits.html#the-del-element

:::details 原文（英語）

> The `del` element represents a removal from the document.
> https://html.spec.whatwg.org/multipage/edits.html#the-del-element

:::

シンプルな説明で助かりますね。
編集内容を示す要素です。`ins`が追加を、`del`が削除を表します。

仕様の分類をよく見ると、これまでに紹介した要素が属する「4.5 テキストレベルセマンティックス」（英: Text-level semantics）ではなく、 **「4.7 編集 」（英: Edits）** に分類されています。
コンテンツモデル（子要素として含められる要素）も、テキストレベルセマンティックスに分類される多くの要素が「フレージングコンテンツ」（昔で言うところのインライン要素）であるのに対し、`ins`要素・`del`要素のコンテンツモデルは **「透過的」** （親要素のコンテンツモデルを継承する）です。
つまり、以下のような構造も OK です。

```html:ins要素・del要素の使用例
<article>
  <section>
    <p>元からあったセクション</p>
    <ins>
      <p>追加された文章</p>
    </ins>
  </section>
  <del>
    <section>
      <p>削除されたセクション</p>
    </section>
  </del>
</article>
```

### 使い方

「追加された」「削除された」ことを示すときに使います。

とはいえ、Web サイトというものは常に更新が加わり続ける性質のものだと思うので、追加したからと言って`ins`要素を使っていてはサイト全体が`ins`だらけになってしまいます。また、削除される内容は HTML ファイル上からテキスト自体削除されるので、`del`でマークアップするテキスト自体が消えることになります。
Git のログで追加された行を表すとき、など、明示的に変更差分を示すときのみに使うことになると思います。

### デフォルトの見た目

`ins`要素には **`text-decoration: underline;`** が適用され、**下線**が引かれます。

追加されたことを示すための表現として下線が利用されています。

`del`要素には **`text-decoration: line-through;`** が適用され、**打ち消し線**が引かれます。

現実の筆記においても、テキストをなかったことにするには打消し線を引くことは多いのでかなりわかりやすい表現です。

#### もっといい見た目を考える

他の選択肢を考えるとすれば、Git のログ表示 や、Zenn のコードブロックでも対応している diff 表現にならって、`ins`には「緑色の背景色」「先頭に＋（プラス）の記号をつける」、`del`には「赤色の背景色」「先頭に－（マイナス）の記号をつける」が考えられます。

```diff:（参考）Zennでのdiff表示
+ 追加
- 削除
```

```css:ins要素の表現の案
ins {
  background-color: lightgreen;
}
ins::before {
  content: "+";
}
```

```css:del要素の表現の案
del {
  background-color: lightpink;
}
del::before {
  content: "−";
}
```

@[codepen](https://codepen.io/kagankan/pen/oNQrBga)

### 暗黙のロール

**`ins`要素:**

> `role=insertion`
>
> https://www.w3.org/TR/html-aria/#el-ins, https://momdo.github.io/html-aria/#el-ins

**`del`要素:**

> `role=deletion`
>
> https://www.w3.org/TR/html-aria/#el-del, https://momdo.github.io/html-aria/#el-del

WAI-ARIA 1.2 から、[`insertion` ロール](https://www.w3.org/TR/wai-aria-1.2/#insertion)、[`deletion` ロール](https://www.w3.org/TR/wai-aria-1.2/#deletion)が設定されています。
Chrome, Firefox ではすでに実装されていました。

Windows NVDA + Chrome で読み上げを行ったところ、

```html:HTML
<ins>ins</ins>
<del>del</del>
```

```txt:読み上げられた内容
挿入マークあり    ins     削除マークあり    del
```

と読み上げられました。

挿入・削除が読み上げられるのは正しいのですが、 **どこまでが挿入・削除の範囲なのか、終了位置がわかりませんでした。**
この点はちょっと注意が必要です。

## `s` 要素

ラストスパートです…！　`del`要素に続き、打ち消し線が引かれる要素を見ていきましょう。

### 仕様

> `s`要素は正確ではないか、もはや関連しないコンテンツを表す。
> https://momdo.github.io/html/text-level-semantics.html#the-s-element

:::details 原文（英語）

> The `s` element represents contents that are no longer accurate or no longer relevant.
> https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-s-element

:::

正確ではなくなった、もしくは関係なくなった内容を示します。
「間違っちゃいないけど、関係ないなー」な内容。

#### 歴史（HTML 4.01 での仕様）

HTML 4.01 では、`s`要素は「フォントスタイル要素」に分類されており、単なる見た目を表現するための要素でした。
しかも、当時は **推奨しない（Deprecated）** とされていました。

> **STRIKE** 及び **S:** **推奨しない。** 取り消し線を引いてレンダリングする。
> http://www.asahi-net.or.jp/~sd5a-ucd/rec-html401j/present/graphics.html#edef-S

:::details 原文（英語）

> **STRIKE** and **S:** **Deprecated.** Render strike-through style text.
> https://www.w3.org/TR/html4/present/graphics.html#edef-S

:::

その役割が HTML 5 になって変更（再定義）されました。
そして、非推奨ではなく、正式な要素になっています。
HTML 5 での仕様は「取り消し線を使うような場面を`s`要素の意味にした」という理解ができそうです。

HTML 5 においては、`s`要素は`strong`要素などと同じ「テキストレベルセマンティックス」に分類されています。
「セマンティックス」ですから、単なる見た目ではなく、意味付けのために使用されるべきことがわかります。

### 使い方

打ち消し線を引きたくなるような部分で、「削除」ではない場合、`s`要素を使うとよさそうです。

```html:s要素の使用例
<p><s>7月31日までプレゼントキャンペーンを実施！</s></p>
<p>キャンペーンは終了しました。たくさんのご応募ありがとうございました！</p>
```

上記の例では、「7 月 31 日までプレゼントキャンペーンを実施」していたという事実は変わらないので、この部分は削除されていませんが、キャンペーンが終了したことで今は関係のない内容として `s`要素でマークアップするのが適切と言えます。

### デフォルトの見た目

**`text-decoration: line-through;`** が適用され、**打ち消し線**が引かれます。

元々が「取り消し線を引いてレンダリングする」ための要素だったので、当たり前といえば当たり前ですね。
ですが、削除を表す`del`と同じ表現になってしまっているのは気になるので、区別したいところです。

#### もっといい見た目を考える

「関連しない」ことを示す他の表現を検討するとしたら、透過させて薄くするとかですかね。

```css:s要素の意味を表す見た目の案1
s {
  opacity: 0.3;
}
```

もしくは、TODO リストのような表において、完了した項目の背景をグレーにする ^[https://canon.jp/business/solution/smb/tips/excel/layout/chart/201908] といったこともあるので、背景色をグレーに設定するのもありかもしれません。

```css:s要素の意味を表す見た目の案2
s {
  background-color: gray;
}
```

@[codepen](https://codepen.io/kagankan/pen/Poxremj)

### 暗黙のロール

> `role=deletion`
>
> https://www.w3.org/TR/html-aria/#el-s, https://momdo.github.io/html-aria/#el-s

HTML 仕様としては `del` 要素とは違う役割なのに、ARIA では`del`と同じ`deletion` ロールなんだ…！？ 🤔

Chrome, Firefox では対応しています。

Windows NVDA + Chrome で読み上げを行ったところ、`del`要素を使ったときと同様の読み上げになっていました。

```html
<s>s</s>
```

```
削除マークあり    s
```

## `strike` 要素（廃止済み）

廃止済み要素なので使うことはありませんが、`del`要素、 `s`要素と同じく打ち消し線を引く要素として紹介しておきます。

### 仕様

`strike` 要素は打ち消し線を引く要素として過去に存在したものの、現在は廃止されています。
ブラウザでは互換性のためにサポートされていますが、新しく作成するページに使うべきではありません。

> 要素が編集をマークする場合は代わりに`del`を使用し、そうでなければ代わりに`s`を使用する。
> https://momdo.github.io/html/obsolete.html#strike

:::details 原文（英語）

> Use `del` instead if the element is marking an edit, otherwise use `s` instead.
> https://html.spec.whatwg.org/multipage/obsolete.html#strike

:::

とある通り、`del` 要素か `s` 要素を使用することになります。

#### 歴史（HTML 4.01 での仕様）

HTML 4.01 では、`strike`要素は「フォントスタイル要素」に分類されており、単なる見た目を表現するための要素でした。
当時から **推奨しない（Deprecated）** とされていました。

> **STRIKE** 及び **S:** **推奨しない。** 取り消し線を引いてレンダリングする。
> http://www.asahi-net.or.jp/~sd5a-ucd/rec-html401j/present/graphics.html#edef-S

:::details 原文（英語）

> **STRIKE** and **S:** **Deprecated.** Render strike-through style text.
> https://www.w3.org/TR/html4/present/graphics.html#edef-S

:::

HTML 5 では `strike` が廃止となり `s` のみが生き残りました。

### デフォルトの見た目

**`text-decoration: line-through;`** が適用され、**打ち消し線**が引かれます。

意味の表現ではなく、「取り消し線を引いてレンダリングする。」という役割だった HTML 4.01 時点での仕様が後方互換性のために残されているものですね。

## `big` 要素（廃止済み）

廃止済み要素なので使うことはありませんが、`small`要素の対になる要素だったということで紹介しておきます。

### 仕様

現在は「次のリストの要素は完全に廃止されており、著者は使用してはならない」とされている「不適合機能」として掲載されています。

> 適切な要素または CSS を代わりに使用する。
>
> （中略）
>
> 同様に、`big`要素が見出しを表すために使用される場合、`h1`要素の使用を考慮する。
> https://momdo.github.io/html/obsolete.html#big

:::details 原文（英語）

> Use appropriate elements or CSS instead.
>
> （中略）
>
> Similarly, if the `big` element is being used to denote a heading, consider using the `h1` element;
> https://html.spec.whatwg.org/multipage/obsolete.html#big

:::

#### 歴史（HTML 4.01 での仕様）

HTML 4.01 では、`big`要素は「フォントスタイル要素」に分類されており、単なる見た目を表現するための要素でした。

> **BIG:** 「大きい」フォントでレンダリング。
> http://www.asahi-net.or.jp/~sd5a-ucd/rec-html401j/present/graphics.html#edef-BIG

:::details 原文（英語）

> **BIG:** Renders text in a "large" font.
> https://www.w3.org/TR/html4/present/graphics.html#edef-BIG

（"big" の説明なのに、"large"って表現するんかい 🙄）

:::

### デフォルトの見た目

`font-size: larger;` が適用され、一回り大きい文字で表示されます。

意味の表現ではなく、「『大きい』フォントでレンダリング。」という役割だった HTML 4.01 時点での仕様が後方互換性のために残されているものですね。

## `small` 要素

この記事ラストの要素です！ 昔は `big` 要素と対になる要素だった、 `small` です。

### 仕様

> `small`要素は、小さな活字体などの副次的なコメントを表す。
> https://momdo.github.io/html/text-level-semantics.html#the-small-element

:::details 原文（英語）

> The `small` element represents side comments such as small print.
> https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-small-element

:::

メインの文に対する、サブのテキストを意味します。

>小さな活字体は通常、免責事項、警告、法的制約、または著作権を取り上げる。小さな活字体はまた、時として帰属に対して、またはライセンス要件を満たすために使用される。

という注釈もあり、主に免責事項のようなよく小さい文字で書かれているテキストを表現するために使われます。

#### 歴史（HTML 4.01 での仕様）

HTML 4.01 では、`small`要素は「フォントスタイル要素」に分類されており、単なる見た目を表現するための要素でした。

> **SMALL:** 「小さい」フォントでレンダリング。
> http://www.asahi-net.or.jp/~sd5a-ucd/rec-html401j/present/graphics.html#edef-SMALL

:::details 原文（英語）

> **SMALL:** Renders text in a "small" font.
> https://www.w3.org/TR/html4/present/graphics.html#edef-SMALL

:::

その役割が HTML 5 になって変更（再定義）されました。
HTML 5 での仕様は「小さい文字で表現するような場面を`small`要素の意味にした」という理解ができそうです。

HTML 5 においては、`small`要素は`strong`要素などと同じ「テキストレベルセマンティックス」に分類されています。
「セマンティックス」ですから、単なる見た目ではなく、意味付けのために使用されるべきことがわかります。

（なんで `big` は廃止されたのに `small` は生き残っているんだろうなあ…。 🤔）

### 使い方

直感的には、`small`要素は「小さい文字で表現するようなテキスト」という理解ができます。
他の文に対して副次的な、おまけっぽい部分に使います（相対的な問題ですね）。

```html:small要素の使用例
<p>この商品は128円 <small>（税込み）</small> です。</p>
```

#### 使うべきでないとき

単に見た目を小さくしたいだけのときは、使うべきではありません。 `span`要素と`font-size`プロパティを使うべきです。

```html:small要素を使うべきでない例
<p>この商品は128<small>円</small>です。</p>
```

上記の例では、見た目上単位部分を小さく表示しているかもしれないが、「この商品は 128 円です。」という文の中で「円」だけが副次的な意味になるわけではありません（「128 円」で一つの意味を示しているのに、その中の一部の文字が分かれるのはおかしい）。次のように CSS で解決すべきです。

```html:修正例
<p>この商品は128<span style="font-size: smaller;">円</span>です。</p>
```

また、長文に使うべきではありません。

> `small`要素は、複数の段落、リスト、またはテキストのセクションのような幅のあるテキストの長さに使用すべきでない。この要素は、短いテキストのみを対象とする。たとえば、利用規約を記載するページのテキストは、`small`要素に適した候補ではない。このような場合、テキストは副次的なコメントではなく、ページの主要コンテンツである。

また、`footer` の著作権表記が `small` でマークアップされることがあるようですが、その必要はないように思います。

https://www.evoworx.co.jp/blog/small-tags-in-copyright/

### デフォルトの見た目

**`font-size: smaller;`** が適用され、**一回り小さい文字**で表示されます。

元々が「『小さい』フォントでレンダリング」するための要素だったので、当たり前といえば当たり前ですね。

その前提はありつつも、副次的なコメント、という意味を小さい文字で表現できていると言えます。
副次的、というのは文章中での相対的な問題だと思うので、 `small`（絶対値） ではなく `smaller`（相対値）で指定されているのも正しそうです。

### 暗黙のロール

> `role=generic`
>
> https://www.w3.org/TR/html-aria/#el-small, https://momdo.github.io/html-aria/#el-small

`generic` ロール、つまり `span` 要素と同じです。
よって、読み上げでは特別に扱われることはないことがわかります。

## 感想

今回調べた要素たちは、あえて使わずとも済んでしまうだけに、これまでぼんやりとした理解でいましたが、改めて調べたことで理解に落とし込むことができました。
特に、「使用例を考え」たり、「新しい見た目を考え」たりと自分で表現することでより深く理解できました。

`b`, `i`, `u`, `s`, `small`の「HTML 4.01 時代にフォントスタイル要素だったが HTML 5 でも存続した要素たち」については、HTML 5 になって「テキストレベルセマンティックス」に分類されるようになりましたが、それらは見た目から遡って意味を定義し直されたという印象です（経緯まで追えていないため、認識違ったらコメントください）。
それを踏まえると、これらの要素をうまく使うのは無理があるなあと感じます。
なんで意味を変えてまで残してしまったんだろう、というのが感想です。

## 余談・HTML を書くときに考えていること

最近 HTML を書くときに、 **「読み込んでいる CSS を全部無効にして、ユーザーエージェントスタイルシートだけで表示しても意味が伝わるような見た目になるか？」** ということを意識しながら要素を選択するようにしています。

見た目のためだけに HTML 要素を使うべきでない、というのはよく言われますが、一方でユーザーエージェントスタイルシートはその HTML 要素の意味を視覚的に表すような見た目を設定してくれています。
すなわち、正しく HTML 要素を選択していれば、すっぴんの（CSS なしの） HTML でも意味が伝わるような見た目になるはずです。
そんなことをイメージしながら HTML を書いています。

皆さんも実際に、自分の作成した Web ページで、 CSS を読み込んでいる `link`要素や`style`要素を消してページを見てみてください。
Devtoolsを開いて、コンソールで以下のスクリプトを実行することでも無効化できます。

```js:CSSを無効化するスクリプト
document
  .querySelectorAll(`link[rel="stylesheet"], style`)
  .forEach((style) => {
    style.remove();
  });
```

その状態でどれだけ文書構造が読み取れるでしょうか？
その結果が、どれだけ HTML 要素を正しく選択できているか、を確認する一つの指標になると思います。
