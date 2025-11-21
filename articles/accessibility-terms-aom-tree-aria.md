---
title: "コンポーネントテストにも使う！「AOM」「アクセシビリティツリー」「WAI-ARIA」とは？"
emoji: "🔍"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["accessibility", "test", "html", "css"]
published: false
publication_name: "kikagaku"
---

:::message

この記事は、2024 年に**社内勉強会で発表した資料**をベースに、公開用として手直しを加えたものです。
修正はしているものの、社内メンバーの知識を前提としていて補足が不十分であったり、記事公開時点では古くなっている情報が含まれることがあります。

なお、弊社では **React + Next.js + Chakra UI** を使用しているプロジェクトが多いため、それらを前提とした記述になっています。

:::

以前「正しい HTML を書くことの大切さ」をお話ししました。

https://zenn.dev/kikagaku/articles/html-semantic-markup

今日はその重要性を補強するお話…

## 今日の目標

- 「AOM」「アクセシビリティツリー」「WAI-ARIA」の概念を知る
    - コンポーネントテスト・e2e テストを書くとき、なんとなくわかるようにする

## （基本のおさらい）ブラウザがページをどう表示しているか

### HTML→DOMにパース

DOM（どむ、Document Object Model）

HTML を解析して、DOM ツリーを構築する。

![DOMの作成プロセス](/images/accessibility-terms-aom-tree-aria/2025-11-17-02-58-04.png)

_https://web.dev/articles/critical-rendering-path/constructing-the-object-model?hl=ja より_

### CSS→CSSOMにパース

CSSOM（しーえすえすおーえむ、CSS Object Model）

CSS を解析してツリーを構築する。

![CSSOMツリー](/images/accessibility-terms-aom-tree-aria/2025-11-17-02-58-16.png)

_https://web.dev/articles/critical-rendering-path/constructing-the-object-model?hl=ja より_

### DOM + CSSOM → レンダリング（ブラウザで目に見える表示）

これがいつも見ている Web ページが表示されるまでにブラウザがやっていること！（超ざっくり）

![ブラウザ描画までのプロセス。DOMとCSSOMからブラウザ描画が行われる](/images/accessibility-terms-aom-tree-aria/2025-11-17-02-58-32.png)

これで見た目の表示はできましたが、スクリーンリーダー（音声読み上げソフト）のような見た目が使えないアプリケーションではどうでしょう？

## AOM、アクセシビリティツリー

AOM（えーおーえむ、Accessibility Object Model）

支援技術に公開するためのデータ構造。DOM は DOM ツリーって言うけど、AOM はなぜかアクセシビリティツリーって言う。

※「支援技術」の代表例はスクリーンリーダー（音声読み上げソフト）。ただし、点字リーダーなどその他任意のアプリケーションも含まれる。

### DOM + CSSOM → AOM

DOM と CSSOM から AOM が作られる。

ただし、CSS が影響していると言っても、AOM に影響するのは `display`, `visibility` のようなコンテンツを出す・消すようなプロパティくらい。**基本的には DOM から決定される**。

:::message

**つまりHTMLが重要！**

:::

![AOMの作成プロセス。DOMとCSSOMからAOMが作られる](/images/accessibility-terms-aom-tree-aria/2025-11-17-02-58-51.png)

### AOMが持つ情報

- **ロール (role)**：その要素の基本の役割。HTML の要素名（タグ名）と同じようなもの
- **名前 (name)**：読み上げ時に使われる名前。
- その他（プロパティ・ステート）：その要素の性質・状態。HTML の属性と同じようなもの。プロパティは変わらないもの、ステートは動的に変わるもの

HTML から AOM に解釈される情報の例：

| HTML | AOM |
| --- | --- |
| `<h1>ページタイトル</h1>`  | role: heading<br>name: “ページタイトル”<br>level: 1 |
| `<h2>見出し</h2>` | role: heading<br>name: “見出し”<br>level: 2 |
| `<button>送信する</button>` | role: button<br>name: “送信する”<br>focusable: true |
| `<button disabled>送信する</button>` | role: button<br>name: “送信する”<br>disabled: true |
| `<button style="display: none">送信する</button>` | （アクセシビリティツリーに公開されない） |

正しくない HTML で表現した場合、（見た目が同じだったとしても）AOM に公開される情報が間違ってしまいます。

| HTML | AOM |
| --- | --- |
| `<div onclick="（処理）">送信する</div>` | role: generic<br>name: "" |

※generic：「なにも意味がない」というロール。
※generic は範囲を示すだけで、それ単体が機能を持つわけではないので名前はつかない。

### アクセシビリティツリーを見てみよう

Devtool から、「Accessibility」のタブを開くと見れます。

（一番右にいるので、「>>」の中に隠れていることが多いです）

![DevtoolのAccessibilityタブ](/images/accessibility-terms-aom-tree-aria/2025-11-17-02-59-05.png)

## WAI-ARIA

WAI-ARIA（うぇいありあ、Web Accessibility Initiative っていう団体の、Accessible Rich Internet Applications っていう仕様）

HTML だけではどうしても表現できない情報を AOM に追加・編集するための機能。

`role="button"` とか `aria-label="削除"` といった属性をつけることで、アクセシビリティツリーに公開される情報だけ書き換えることができる。

Chakra 使っている場合、 `IconButton` で `aria-label` が必須になっていることで出会ったことがあるかもしれない。

![虫眼鏡アイコンのアイコンボタン](/images/accessibility-terms-aom-tree-aria/2025-11-17-02-59-15.png)

```tsx
<IconButton aria-label='検索する' icon={<SearchIcon />} />
```

https://chakra-ui.com/docs/components/icon-button

なぜ必須かといえば、アイコンボタンは見た目だけで機能を表現するボタンなので、このままでは AOM にしたときに名前（name）がなく、なんのボタンか伝わらない。なので `aria-label` で読み上げ用のテキストを設定することが必須。
（aria-label の役割を知らず、英語テキストにする人が多いのですが、aria-label は読み上げてユーザーに伝えるためのテキストなので、日本人ユーザー向けなら日本語で書きます）

| HTML | AOM |
| --- | --- |
| `<button><svg>（アイコン）</svg></button>`  | role: button<br>name: "" |
| `<button aria-label="検索"><svg>（アイコン）</svg></button>`  | role: button<br>name: "検索" |

### WAI-ARIAは基本使わない

AOM は DOM（つまり HTML）から構築されるので、基本的には不要。

上記の `IconButton` の例では `aria-label` を使いましたが、そもそもボタンの中にテキストを表示してしまえば目で見る人にとってもわかりやすく、わざわざ `aria-label` を書く必要もなくなります。
`aria-label` は Google 翻訳できないけど、普通のテキストなら Google 翻訳できるし。

#### △ `IconButton` で実装した場合

手紙のアイコンだけだと、「メールを送る」？「メッセージ機能」？「お問い合わせフォーム」？🤔 と迷ってしまいます。

![手紙のアイコンのボタン](/images/accessibility-terms-aom-tree-aria/2025-11-17-02-59-28.png)


#### ○ `Button`（アイコン＋テキスト）で実装した場合

ボタンの中にテキストを表示してしまえば、目で見る人にとっても機能がわかりやすく、わざわざ `aria-label` を書く必要もなくなります。

![手紙のアイコンと「お問い合わせ」テキストのボタン](/images/accessibility-terms-aom-tree-aria/2025-11-17-02-59-36.png)

HTML で表現していれば、WAI-ARIA は不要！「どうしても」の場合だけ使う。

### **“No ARIA is better than Bad ARIA”**

WAI-ARIA の「Read Me First」（最初にこれ読めのページ）には **“No ARIA is better than Bad ARIA”** と強く主張されている。**「間違った ARIA を使うぐらいなら使うんじゃねえ」**（意訳）

https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/

WAI-ARIA を使うと情報を強制的に上書きできる（できてしまう）ので、間違った指定をしたときにユーザーに間違った情報を伝えてしまう可能性がある。しかもそれが画面上には出ていないので気づきにくい。

前述の通り HTML で表現できていれば基本的には不要。

## テストでの役割

実はこの AOM・WAI-ARIA の知識、テスト（コンポーネントテストや e2e テストなど）のときにも使えます。

ある特定のボタンをクリックする操作をさせたいとき、「画面右下の赤いやつ」…なんていう指定はできません。機械的に解釈できる指定をする必要があります。そこで使えるのがアクセシビリティツリーの情報です。

Testing Library や Playwright では `getByRole` という機能があります。これでロールを元に要素を取得できます。

https://testing-library.com/docs/queries/byrole/

```tsx
// roleがtextboxで、nameが"メールアドレス"の要素を取得
page.getByRole('textbox', { name: 'メールアドレス' })

// roleがbuttonで、nameが"送信"の要素を取得
page.getByRole('button', { name: '送信' })
```

「テストが書きやすいページ」と「アクセシビリティが高いページ」は実は共通している。

## まとめ

- 支援技術に公開される情報を **「AOM」**、構築されたツリーを **「アクセシビリティツリー」** と呼ぶ
- ちゃんと HTML を書いていれば、アクセシビリティツリーが適切に構築される
- どうしても HTML では表現できない内容を支援技術に伝えたいとき、**「WAI-ARIA」** という技術がある
    - ただし、上記の通り、ちゃんと HTML を書いていれば基本的には不要
    - **“No ARIA is better than Bad ARIA”**
- コンポーネントテストや e2e テストでも使う

## 参考記事など

『Web アプリケーションアクセシビリティ』の著者のお一人でもある、ますぴーさんが AOM の話をされていたときのスライド（後日知ったので当日の発表は見ていないのですが、スライドだけでもおもしろいです）。

https://x.com/masuP9/status/1762672208286220357?s=20

https://docs.google.com/presentation/d/19qJXwKwOegDGcf5bqlhTYTNnaEqasBT5h-nW9vXu2nc/edit#slide=id.p

### その他資料

https://web.dev/articles/critical-rendering-path/render-tree-construction?hl=ja
https://web.dev/articles/critical-rendering-path/constructing-the-object-model?hl=ja
https://zenn.dev/oreo2990/articles/280d39a45c203e
https://developer.mozilla.org/ja/docs/Glossary/Accessibility_tree
https://masup9.github.io/aom/explainer.html
