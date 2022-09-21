---
title: "【CSS】gridでできるこんなレイアウト10選（grid関連プロパティ総ざらい）"
 # 【CSS】レイアウトの9割はgridでキマる ～それ、gridでできるよ～　能力を引き出せ　
emoji: "🍱"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["css", "grid"]
published: true
---

IEがいなくなり安心して使えるようになった **[CSS Grid Layout](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Grid_Layout) (`display: grid;`)**。
みなさん、使っていますか？

これまでに面倒だった記述が楽に書けるようになるのはもちろん、
**要素数が増えたり減ったりしてもイイ感じに配置**できたり、
**ウィンドウ幅が変わってもイイ感じに配置**できたりと、
Gridは **レイアウトの対応力を高める強力な武器** となります。

Gridの便利さをお伝えするため、Gridの活用例をこれでもかと詰め込んだCodePenのサンプルを作成しました。
（ウィンドウ幅によって変わる仕組みもありますので、ぜひ**別タブで開いて**ご確認ください）

@[codepen](https://codepen.io/kagankan/pen/abGZZXK)

この記事では、ここで使用している個別の活用例10個を紹介します。
それぞれの項目の中では、どのようなプロパティで機能を実現しているか説明していきます。
（この記事には**ほぼすべてのgrid関連プロパティ**が登場します！）

# 1. 横並びのメニュー

よくありそうなヘッダーメニューのレイアウト

- ウィンドウ幅を縮めたとき、ロゴの大きさは変えず、メニューの領域を狭めていく。
- メニューリンクはすべて同じ幅で配置
- リンクの文字は上下左右中央揃え

これらの要素をGridで作ってみましょう。

![](/images/grid/2022-09-19-21-12-09.png)

```html:HTML
<header class="Header">
  <a href="">
    <img src="https://placehold.jp/180x60.png?text=ロゴ" alt="" />
  </a>
  <ul class="Header__List">
    <li><a href="">横並びヘッダー</a></li>
    <li><a href="">商品一覧</a></li>
    <li><a href="">お知らせ</a></li>
    <li><a href="">なんやかんや</a></li>
    <li><a href="">お問い合わせ</a></li>
  </ul>
</header>
```

```css:CSS
/* Gridに関連するプロパティのみ抜粋 */
.Header {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 20px;
}
.Header__List {
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  column-gap: 2px;
  justify-self: end;
  width: 100%;
  max-width: 800px;
  height: 100%;
}
.Header__List a {
  display: grid;
  align-items: center;
  justify-content: center;
  height: 100%;
}
```

いきなりですが、Gridのネスト構造になっています。

## 列幅を決める `grid-template-columns`

「ロゴとメニュー」は、`grid-template-columns: auto 1fr;` によって、ロゴに対しては `auto`、メニュー部分には `1fr` を割り当て、
**ロゴの大きさを保ったまま、メニューには残りの広さが割り当たる**ようにします。

https://developer.mozilla.org/ja/docs/Web/CSS/grid-template-columns

### 単位 `fr`

`fr` は領域をどのように配分するかを決める、Gridで使用される単位です。

https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout#the_fr_unit


## 左右の間隔 `column-gap`

「ロゴとメニューの間隔」や「リンク同士の間隔」を `column-gap` で指定しています。
子要素のmarginではなく、親側で指定できるのが便利ですね。

https://developer.mozilla.org/ja/docs/Web/CSS/column-gap

## 横に並べる `grid-auto-flow: column;`

Gridレイアウトはデフォルトでは子要素が縦に配置 (`grid-auto-flow: row;`) されますが、
`grid-auto-flow: column;` を設定すると横並びになります。

https://developer.mozilla.org/ja/docs/Web/CSS/grid-auto-flow

## 全部同じ幅にする `grid-auto-columns: 1fr;`

要素に対して自動的に割り当たる大きさを指定します。
`1fr` を指定することで、領域を均等に割り当てるので、すべての要素が同じ大きさで並びます。

https://developer.mozilla.org/ja/docs/Web/CSS/grid-auto-columns


## 上下の位置揃え `align-items`、左右の位置揃え `justify-content`

リンクの中身は、 `align-items: center;` で上下中央揃え、`justify-content: center;` で左右中央揃えにしています。
flexと同じですね。

https://developer.mozilla.org/ja/docs/Web/CSS/align-items

https://developer.mozilla.org/ja/docs/Web/CSS/justify-content

# 2. カードレイアウトの右下に配置する

リンクを表すアイコンだったり、記事や商品情報のタグだったり、なにかとカードレイアウトにありがちな、カードの端に配置する要素。これもGridでいけます。

![](/images/grid/2022-09-19-03-16-01.png)

```html:HTML
<li class="Card">
  <p>テキスト</p>
  <span>右下に置かれる何か</span>
</li>
```

```css:CSS
/* Gridに関連するプロパティのみ抜粋 */
.Card {
  display: grid;
  row-gap: 20px;
}
.Card > span {
  align-self: end;
  justify-self: end;
}
```


## 子要素側で配置指定 `justify-self` `align-self`

子要素の位置は、親要素から `*-items` で指定できますが、
このケースでは、一部の要素のみ右・下揃えにしたいため使えません。

特定の要素の揃え位置を変えるときに使えるのが、 `*-self` のプロパティです。
`justify-self` でその要素の横位置、 `align-self` で縦位置を指定します。

https://developer.mozilla.org/ja/docs/Web/CSS/justify-self

## 上下の間隔 `row-gap`

`row-gap` は子要素同士の上下の間隔を指定します。
ここでは、テキストが長いときにもpとspanの余白が空くように、このプロパティを設定しました。

https://developer.mozilla.org/ja/docs/Web/CSS/row-gap


### （余談） `grid-row-gap`, `grid-column-gap` じゃないの？

これらのプロパティができた当時は `grid-row-gap`, `grid-column-gap` でしたが、
後に `row-gap`, `column-gap` に統合されました。^[https://drafts.csswg.org/css-align/#gap-legacy]

互換性のためにブラウザでは `grid-` 付きのプロパティもサポートされていますが、
**現在ではあくまで `row-gap`, `column-gap` が正しいプロパティ** ですので、今後はこちらを使うようにしましょう。
なお、 `row-gap`, `column-gap` はflexでも使用できるプロパティです。

# 3. タイルレイアウト

記事一覧とかで使いがちなレイアウトです。

- ウィンドウ幅が狭まったら列数を減らす
- 要素が一定幅以下にならないようにする
- 要素の間には一定の間隔を空ける

![](/images/grid/2022-09-19-13-59-54.png)
![](/images/grid/2022-09-19-14-00-08.png)
![](/images/grid/2022-09-19-14-00-21.png)


```html:HTML
<ul class="CardList">
  <li>ウィンドウ幅に応じて列数が変わる</li>
  <li>長いテキスト長いテキスト長いテキスト長いテキスト長いテキスト長いテキスト長いテキスト長いテキスト</li>
  <li>テキスト</li>
  <li>テキスト</li>
  <li>テキスト</li>
  <li>テキスト</li>
</ul>
```

```css:CSS
/* Gridに関連するプロパティのみ抜粋 */
.CardList {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px 6%;
}
```

## 幅に収まる数だけ並べる `repeat(auto-fit, 〇〇)`

`grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));` によって
「要素が200px以上になることを保証しつつ、入るだけ横に並べる」ことを実現できます。

### `repeat` 関数

`grid-template-rows` `grid-template-columns` の中で使用できる関数です。
例えば、 `repeat(3, 1fr)` は `1fr 1fr 1fr` と同義です。

https://developer.mozilla.org/ja/docs/Web/CSS/repeat

このように数値を使用することもできますが、ここでは `auto-fit` キーワードを使用しています。


## `auto-fit` `auto-fill` キーワード

どちらも、repeat関数に設定して、「入るだけ入れる」ことを指定するキーワードです。

`auto-fit` と `auto-fill` の違いは、幅に対して要素が少ない場合の挙動です。
使い分けはこちらの記事の説明がわかりやすいので、こちらを参照ください。

https://ascii.jp/elem/000/001/659/1659899/


## `minmax` 関数

`minmax(200px, 1fr)` で `200px` 以上 `1fr` 以下になるような幅を示します。
min が max より大きい場合は min が勝つので、この場合は必ず200px以上になることが保証されます。

https://developer.mozilla.org/ja/docs/Web/CSS/minmax


## 一定の間隔を空ける  `gap`

`gap` プロパティは `row-gap` `column-gap` の一括指定です。

https://developer.mozilla.org/ja/docs/Web/CSS/gap



# 4. 1行のときは真ん中寄せ、2行以上のときは左寄せ

タイルレイアウトの発展形です。

- 1行のときは真ん中寄せ
- 2行以上のときは左寄せ
- これを、**クラスの出し分けなし**で行う。
- （※ここでは、ウィンドウ幅に応じた列数の変更はしない）

![](/images/grid/2022-09-19-03-39-01.png)
![](/images/grid/2022-09-19-03-39-01-2.png)

```html:HTML
<ul class="CenteredCardList">
  <li>1行のときは真ん中寄せ</li>
  <li>2行以上のときは左寄せ</li>
  <li>テキスト</li>
</ul>
```

```css:CSS
/* Gridに関連するプロパティのみ抜粋 */
.CenteredCardList {
  display: grid;
  /* template-columns と column-gap を合計して100%になるようにする */
  grid-template-columns: repeat(auto-fit, 22%);
  row-gap: 24px;
  column-gap: 4%;
  justify-content: center;
}
```

## 1行のときは真ん中寄せにするテクニック

`grid-template-columns: repeat(auto-fit, 〇〇);` を使用することで、「要素が少ないときは枠を埋めない」ようにすることができます。
（`repeat(4, 22%)` などにしてしまうと、必ず4列確保されてしまいます。）

複数行のときにきれいに表示するポイントは
**`grid-template-columns` と `column-gap` を合計してちょうど100%にする** ことです。
この場合だと、`22 + 4 + 22 + 4 + 22 + 4 + 22` で `100` になります。
列数を変える場合には、足し算の回数をそれぞれ増減させます（3列なら `◯ + △ + ◯ + △ + ◯` です）。
`calc`などで計算式を書いてしまうのもいいでしょう。また、整数である必要もありません。

## 全体の左右位置指定 `justify-content`

`justify-content: center;` で、全体を真ん中寄せにします。

https://developer.mozilla.org/ja/docs/Web/CSS/justify-content

# 5. 最後の列を飛ばして並べる

- 要素の間に矢印の装飾をつける
- ただし、一番端まで要素を並べてしまうと矢印がコンテンツ幅の外にはみ出てしまうので、最後の列は空けたい

![](/images/grid/2022-09-19-02-00-47.png)


```html:HTML
<ul class="Steps">
  <li>Step1</li>
  <li>Step2</li>
  <li>Step3</li>
  <li>Step4</li>
  <li>Step5</li>
</ul>
```

```css:CSS
/* Gridに関するプロパティのみ抜粋 */
.Steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px 40px;
}
.Steps > li:nth-child(4n) {
  grid-column-start: 1;
}
```

## 配置される列を指定する `grid-column-start`

`grid-column-start` は、子要素側に指定するプロパティで、その要素がどの列に配置されるかを指定します。

https://developer.mozilla.org/ja/docs/Web/CSS/grid-column-start

この概念は「グリッド線」と言います。

https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout#%E3%82%B0%E3%83%AA%E3%83%83%E3%83%89%E7%B7%9A

はじめのうちは理解が難しいと思うのですが、これが使いこなせるようになるとGridはぐっと強力な武器になります。
Chromeのdevtoolからは、**「grid」のボタンをON**にすることで、グリッド線の番号が表示され、わかりやすくなります。

![](/images/grid/2022-09-19-15-20-50.png)

![](/images/grid/2022-09-19-02-15-25.png)

`grid-column-start: 1;` の指定は、「この要素の開始を1番の列グリッド線に合わせてください」、つまり「一番左端の列に置いてください」ということになります。
これを `:nth-child(4n)` （4の倍数番目の子要素）に当てることで、最後の列を空け、次の行から始めることができます。

# 6. アイコンつきのリンク/ボタン

- リンク/ボタンの右側に、矢印のアイコンが入る
- テキストは真ん中揃え
- ただし、万が一長いテキストが入った場合、アイコンに重ならないように

![](/images/grid/2022-09-19-02-21-00.png)

```html:HTML
<a class="Link" href="">短い場合は真ん中</a>
<a class="Link" href="">長い場合はアイコンの大きさを避けて配置</a>
```

```css:CSS
/* Gridに関連するプロパティのみ抜粋 */
.Link {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  column-gap: 8px;
  align-items: center;
}
.Link::before {
  content: '';
}
.Link::after {
  justify-self: end;
  content: '→';
}
```

## `grid-template-columns: 1fr auto 1fr;`

疑似要素を追加することで、aタグの中には `::before`, `#text（テキストノード）`,  `::after` の3要素が並んだ状態になります。
これに `grid-template-columns: 1fr auto 1fr;` を当てることで、`::before`, `::after` が同じ大きさになり、文字はありのままの横幅で真ん中に並びます。

![](/images/grid/2022-09-19-02-38-37.png)

さて、ポイントは長いテキストが入ったときの挙動です。
`fr` は、余ったスペースに対する分割なので、**文字を配置してスペースを使い切ってしまった場合は、文字がない`::before`側には幅が割り当たりません。**
というわけで、右にあるアイコンは避けつつ、左のスペースは有効活用しながら文字が配置されます。

![](/images/grid/2022-09-19-02-45-31.png)


# 7. 見出しの装飾

左右に線の装飾がある見出しです。こんなのもGridで表現できます。

![](/images/grid/2022-09-19-02-50-25.png)

```html:HTML
<h2 class="Heading">見出し</h2>
```

```css:CSS
/* Gridに関連するプロパティのみ抜粋 */
.Heading {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  column-gap: 20px;
  align-items: center;
}
.Heading::before,
.Heading::after {
  min-width: 30px;
  height: 4px;
  content: '';
  border-top: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
}
```

## `grid-template-columns: 1fr auto 1fr;`

基本的な構造はアイコン付きリンクの例と一緒です。
`::before`, `#text（テキストノード）`,  `::after` の3要素が並んだ状態になるので、
これに `grid-template-columns: 1fr auto 1fr;` を当てて `::before`, `::after` を同じ幅にします。

疑似要素には `min-width: 30px;` をつけることで、文字が長く・ウィンドウ幅が狭くなっても、最低限の線の長さが確保されるようにしています。

![](/images/grid/2022-09-19-02-57-18.png)

# 8. 複雑なレイアウト

Gridといえば！な例ですね。

![](/images/grid/2022-09-19-00-45-33.png)


```html:HTML
<div class="ComplexGrid">
  <div class="ComplexGrid__Alpha">Alpha</div>
  <div class="ComplexGrid__Beta">Beta</div>
  <div class="ComplexGrid__Gamma">Gamma</div>
  <div class="ComplexGrid__Delta">このセルの高さは<br>入るテキストの長さに<br>合わせて決める</div>
</div>
```

```css:CSS
/* gridに関連するプロパティのみ抜粋 */
.ComplexGrid {
  display: grid;
  /* エリア名の文字数が合わないときは、スペースを入れて各列のおしりを揃えると見やすい */
  grid-template:
    'Alpha  Beta  Beta' 80px
    'Alpha     . Gamma' 80px
    'Alpha Delta Gamma' auto /
    40% 80px 1fr;
  gap: 4px;
}
.ComplexGrid__Alpha {
  grid-area: Alpha;
}
.ComplexGrid__Beta {
  grid-area: Beta;
}
.ComplexGrid__Gamma {
  grid-area: Gamma;
}
.ComplexGrid__Delta {
  grid-area: Delta;
}
```


## `grid-template` で一括指定

`grid-template` は、 `grid-template-areas`, `grid-template-columns`, `grid-template-rows` の一括指定です。
別々に記述するよりも、対応する行・列が視覚的にわかりやすくなるので、直感的に記述できます。

https://developer.mozilla.org/ja/docs/Web/CSS/grid-template


## エリアに名前を付ける `grid-template-areas` と `grid-area`

親要素（グリッドコンテナ）で `grid-template-areas` を指定してエリアに名前をつけ、
子要素では `grid-area` によって、その要素が入るエリアを定義します。

`grid-template-areas` のなにも要素が入らない（名前を付ける必要がない）エリアには `.` （ドット）を記載します。
ちなみに、エリア名の文字数が合わないときは、スペースを入れて各列のおしりが揃うようにしておくと見やすくなります。

https://developer.mozilla.org/ja/docs/Web/CSS/grid-template-areas

## PC/SPでレイアウトを切り替えるテクニック

`grid-template-areas` を切り替えることによって、ダイナミックにレイアウトを変更することも可能です。
サンプルではチェックボックスで変化させていますが、 **メディアクエリを使用してPCとSPでレイアウトを変化させる** のが想定用途です。
単純に指定を外せば、一発で「スマホでは縦積み」にすることも可能です。

![](/images/grid/2022-09-19-01-49-34.png)

:::message
HTMLの出現順序と視覚的な表示順序を変えてしまうと、スクリーンリーダーでの読み上げ順が不自然になったり、ボタンなどが含まれる場合はTabキーでのフォーカス移動が見た目と合わなくなったりしてしまいます。
**表示順序は可能な限りHTMLの並び順で変更**し、**CSSでの変更はできるだけ行わない**ようにしましょう。
:::

# 9. 要素を重ねるレイアウト

影のように、四角の要素が背後に重なったデザインです。
position: absolute;でもできますが、Gridでもできます。

![](/images/grid/2022-09-19-14-19-15.png)

```html:HTML
<div class="ShiftedLayer">
  <div>ずらした四角を重ねるレイアウト</div>
</div>
```

```css:CSS
.ShiftedLayer {
  display: grid;
  grid-template-rows: 20px auto 20px;
  grid-template-columns: 20px auto 20px;
  /* わかりやすさを優先する場合、以下の書き方もできる
  grid-template:
    '. . .' 20px
    '. . .' auto
    '. . .' 20px /
    20px auto 20px;
  */
}
.ShiftedLayer > div {
  grid-area: 1 / 1 / span 2 / span 2;
  padding: 20px;
  background-color: #fff;
}
.ShiftedLayer::after {
  z-index: -1;
  grid-area: 2 / 2 / span 2 / span 2;
  content: '';
  background-color: #09f;
}
```

## 配置される行・列を指定する `grid-area`

前の例では、名前を付ける使い方を紹介しましたが、こちらは数字で指定する方法です。
この用法では、 `grid-row-start`, `grid-column-start`, `grid-row-end`, `grid-column-end` の一括指定になります。

https://developer.mozilla.org/ja/docs/Web/CSS/grid-area

```
grid-area: 1 / 1 / span 2 / span 2;
``` 
は
```
grid-row-start: 1;
grid-column-start: 1;
grid-row-end: span 2;
grid-column-end: span 2;
```
と同義です。 
**「1行目・1列目から始めて、2行分・2列分使って配置します」** ということです。

このように、直接グリッド線を指定して配置した場合、要素を重ねることができます。

![](/images/grid/2022-09-19-21-43-20.png)


## 重なった要素の前後を指定する `z-index`

（Gridに限った話ではないですが）重ねた要素は、 `z-index` で前後の順序を指定できます。

※この場合は、そもそも `::after` ではなく `::before` で作れば `z-index` を使わずに解決できますが、紹介のために使用しました。

# 10. ページ全体のレイアウト

ページ全体のレイアウトにも、Gridは活用できます。

- h1とサイドナビが重なっている
- コンテンツが短い場合にも、ブラウザの高さいっぱいになるようにする

![](/images/grid/2022-09-19-14-33-37.png)

```html:HTML
<div class="Layout">
  <header class="Layout__Header">ヘッダー（中身略）</header>
  <h1 class="Layout__Hero">CSS Grid Layout 活用例詰め合わせ</h1>
  <nav class="Layout__Nav">サイドナビ的な</nav>
  <main>メインコンテンツ</main>
</div>
```

```css:CSS
.Layout {
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-template-columns: 1fr 15%;
  /* わかりやすさを優先する場合、以下の書き方もできる
  grid-template:
    '. .' auto
    '. .' auto
    '. .' 1fr /
    1fr 15%;
  */
  column-gap: 5%;
  min-height: 100vh;
}
.Layout__Header {
  grid-area: 1 / 1 / auto / span 2;
}
.Layout__Hero {
  grid-area: 2 / 1 / auto / span 2;
  padding-right: 15%;
}
.Layout__Nav {
  grid-area: 2 / 2 / span 2;
  margin-top: 40px;
}
```

## 配置される行・列を指定する `grid-area`

`grid-area` で直接配置位置を指定することで、h1とサイドナビを重ねています。
値を省略する場合（特別に指定しない場合）は `auto` キーワードを使うことができます。
（`grid-area`の説明は1つ前の項目でしているので省略します）

![](/images/grid/2022-09-19-16-11-42.png)

## 要素が少ないときにも高さいっぱいにする

`min-height: 100vh;` をつけることで、中身のコンテンツが少ないときにも、最低限ブラウザの高さに合わせることができます。
ただし、これだけだとヘッダーやh1の高さも広がってしまうので、 **「ヘッダー・h1はそのまま」「mainの高さを広げる」** ことを指定するために `grid-template-rows: auto auto 1fr;` を設定します。



# さいごに

この他にもGridの活用方法はたくさんあると思います。
CSSを書くときは、「もしかしたらこれもGridでできるかも…？」と考えてみるのもいいかもしれません。

MDNに「Gridによる、よくあるレイアウトの実現」という記事もあるので、これも参考になります。
https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Grid_Layout/Realizing_common_layouts_using_CSS_Grid_Layout


