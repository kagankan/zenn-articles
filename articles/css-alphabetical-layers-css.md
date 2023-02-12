---
title: "スタイル適用順とフォルダの並び順が一致するCSS設計、ABC-CSS の紹介"
emoji: "📂"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["css", "CSS設計"]
published: true
---

私がたどり着いた、CSSの推しディレクトリ構成に名前をつけましたので紹介します！

# 概要

この **ABC-CSS** は、[FLOCSS](https://github.com/hiloki/flocss) や [ITCSS](https://itcss.io/) に影響を受けたCSS構成案です。^[公開当初は Alphabetical Layers CSS (ALCSS) という名前で公開しましたが、「ABC」ならABC順であることに加えてレイヤー名そのものも示せておトクじゃんということに気づいたので命名変更しました。URLに残っていますが、URLを変えてしまうとリンクが切れて悲しいのでそのままにしておきます。]

![ABC-CSSの概念図。ABC-CSS. A CSS architecture that uses layers in ABC order, such as Abstracts, Base, Components, etc.](/images/css-alphabetical-layers-css/2023-02-13-01-14-42.png)

スタイル定義を以下のレイヤー名で分類します。
1. **Abstracts**
2. **Base**
3. **Components**
4. **Features**
5. **Pages**
6. **Utilities**

最大の特徴はその名の通り、**レイヤー名をアルファベット順（ABC順）に並べたときに、スタイルが適用されるべき順番と一致する**ことです。
影響範囲が大きい・詳細度が低い（低くすべき）ものが先、範囲が小さく・詳細度が高くあるべきものが後に並ぶように単語を選択して設計しています。
これにより、ディレクトリを分けて開発を行う際に、エクスプローラーでの表示から適用順をイメージしやすくなります。

![](/images/css-alphabetical-layers-css/2023-02-08-01-47-11.png)

## 既存のCSS設計と比較したときの利点

先に断っておきますが、決して既存のCSS設計をけなすつもりはありません。
あくまで、自分はこうしたほうが使いやすいと思う、という話です。
むしろこれまでに考えてくれていた方がいたからこそこの提案も成り立っていますので、先人たちに感謝します。

### FLOCSSと比較して

- Foundationに分類されていた、「CSSが出力される記述」と「プリプロセッサだけで使われる記述」が分離できる
- 「Layoutに入る記述少ない問題」を解消できる
  - 作者のhilokiさん自身も[「ここだけの話な、FLOCSSのLは別にいらんで」](https://hiloki.github.io/s/flocss-layout/)とおっしゃっていたりします。
- ComponentとProjectの区別で迷うことがなくなる

### ITCSSと比較して

- ITCSSではレイヤー順とディレクトリ名が一致していないのでファイルツリーを表示したときに直感的にレイヤー順を意識しにくいが、ABC-CSSでは一致する
- ObjectsとComponentsの区別で迷うことがなくなる

# この記事で使用する命名規則

これまた私が提案している **[BrainBEMding](https://zenn.dev/kagan/articles/css-brain-bemding)** を使用しますが、**MindBEMding**など他の命名規則を使用しても全く問題ありません。
この記事で提案したいのは、クラス名をどんな名前にするかという命名規則ではなく、CSS記述をどう分類し、どう順序付けるかという部分です。

# 各レイヤーの詳細

## Abstracts

Sassなどのプリプロセッサにおける、変数・関数・mixinなどを定義します。
**これ自体をビルドしても何も出力されない**ことが分類の基準です。

`Abstracts` という名前はあまり馴染みがないと思います。それもそのはず、一番先頭に来るように無理やり命名したので当然です。^[なお、このAbstractsという名前はChatGPTに考えてもらいました。baseよりも先になるような単語を使いたく、「SCSSの変数や関数を記述したファイルをフォルダ分けするために適切なフォルダ名のうち、aから始まるものを5つ教えて」と聞いたら、abstracts, assets, arguments, adjustments, applicationsを上げてくれました。]
もし[プログラミングにおける「抽象型」「抽象クラス」](https://ja.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E5%9E%8B)の概念を知っていればそのようなイメージで、それ自体は意味を持たず、他の実装で使用されて初めて実体化するというイメージです。

プリプロセッサを使用しない場合は取り除いてもらってOKです。

```scss:Abstractsの記述例
$color-white: #fff;
$breakpoint: 768;

@mixin pc {
    @media screen and (min-width: #{$breakpoint * 1px}), print {
        @content;
    }
}
```

## Base

ブラウザのユーザーエージェントスタイルシートを打ち消すリセットCSSや、要素セレクタを使用した基本的なスタイルを定義します。
**全称セレクタ、要素セレクタ、擬似クラスセレクタなど、ユーザーが定義していないセレクタ**に対するスタイルのみを記述します。
（逆に、ユーザーが定義するセレクタとは、classやid、data属性のことを指します。）

```css:Baseの記述例
*,　*::before,　*::after {
    box-sizing: border-box;
}

img {
    max-width: 100%;
    height: auto;
}

:disabled {
    cursor: not-allowed;
}
```

## Components

**サイト上のパーツのスタイル**を定義します。BEMにおける「ブロック」の単位です。
classセレクタを使用します。idセレクタは詳細度をむやみに上げてしまうため使用しません。

```css:Componentsの記述例
.Button { /* ... */ }
.Button__Icon { /* ... */ }
```

なお、FLOCSSにおいてはヘッダーやフッターのようなサイト共通の要素はLayoutとして個別のレイヤーが設けられていますが、ここでは他のコンポーネントと同様Componentsに分類します。

```css:Componentsの記述例2 ヘッダーもComponentsに含める
.Header { /* ... */ }
```

レイアウトとしてのヘッダーを分離したい（ヘッダーの中身のスタイルではなく、ページ内の配置を記述する）場合、 `Layout` というコンポーネントを作ります。

```css:Componentsの記述例3 Layoutコンポーネントを作る例
.Layout { /* ... */ }
.Layout__Header { /* ... */ }
.Layout__Main { /* ... */ }
.Layout__Sidebar { /* ... */ }
.Layout__Footer { /* ... */ }
```

## Features

基本的にはComponentsと使い方は変わりませんが、**特定の機能でのみ必要となる**要素のスタイルを定義します。

```css:Featuresの記述例
.ProductList {
    /* 「商品」という機能に紐づく、商品一覧のような要素 */
}
```

Reactのディレクトリ構成などに見られる、featuresディレクトリ^[https://zenn.dev/sakito/articles/af87061a5016e6#src%2Ffeatures]^[https://zenn.dev/yodaka/articles/eca2d4bf552aeb#%2Ffeatures]を参考にしたものです。

## Pages

これも基本的にはComponentsと変わりませんが、**特定のページでのみ必要となる**要素のスタイルを定義します。

```css:Pagesの記述例
.AboutSection {
    /* Aboutページだけで使用する要素 */
}
```


### Components, Features, Pages の区別

「Components, Features, Pagesは基本的に同じ」だと説明しました。
つまり、Features, Pagesに入るスタイルをComponentsで定義しても問題はないのです。
なのですが、可能な限りFeatures, Pagesに分けておくことをおすすめします。

分けておく利点は **「影響範囲を明確にし、消しやすくすること」** です。
ちゃんと分類していれば、例えば「Aboutページが削除になりました！」という場合に、`pages/about`に分類されているファイルはAboutページでしか使っていないのだから消していいのだ、と判断しやすくなります。

#### 早計な抽象化は避けよ (Avoid Hasty Abstractions, AHA)

Components, Features, Pagesを使う上では、「早計な抽象化は避けよ（AHA Programming）」という考え方を意識しましょう。
https://smagch.com/posts/aha-programming/

なんでもかんでも共通化しようと思ってしまうと、「実はこのページだけちょっと違った！」なんてこともあります。
最初から共通化しようとしなくていいのです。新規作成するときは多少重複を許してでもPages配下で個別に作り、後々共通化できるのでは？と思ったときに共通化して、FeaturesやComponentsに移動していきましょう。


## Utilities

要素に意味があるのではなく、特定の見た目や機能といった**性質のみ**を指定するスタイルを定義します。
このレイヤーのみ `!important` の使用を許可します（必須ではありません）。

```css:Utilitiesの記述例
.color-blue {
    color: blue !important;
}

.inline-block {
    display: inline-block !important;
}
```


# ディレクトリ構成の例

:::details Sass(SCSS)を使用した場合のディレクトリ構成の例

```
├── abstracts
│   ├── _index.scss
│   └── abstracts.scss
├── base
│   ├── _index.scss
│   ├── base.scss
│   └── reset.scss
├── components
│   ├── _index.scss
│   ├── Button.scss
│   ├── Footer.scss
│   ├── Header.scss
│   └── ...
├── features
│   ├── product
│   │   ├── _index.scss
│   │   ├── ProductList.scss
│   │   └── ...
│   ├── user
│   │   ├── _index.scss
│   │   ├── UserList.scss
│   │   ├── UserProfile.scss
│   │   └── ...
│   └── ...
├── pages
│   ├── about
│   │   ├── _index.scss
│   │   ├── AboutHero.scss
│   │   ├── AboutSection.scss
│   │   └ ...
│   ├── index
│   │   ├── _index.scss
│   │   ├── IndexHero.scss
│   │   ├── IndexSection.scss
│   │   └ ...
│   └ ...
├── utilities
│   ├── _index.scss
│   └── utilities.scss
└── style.scss
```

各ディレクトリの `_index.scss` で `@use` で配下のファイルを読み込みます。
`abstracts/_index.scss` のみ `@forwards` を使用します。

```scss:src/scss/abstracts/abstracts.scss
$color-white: #fff;
```

```scss:src/scss/abstracts/_index.scss
@forward "./abstracts.scss";
```

```scss:src/scss/components/Button.scss
@use "src/scss/abstracts" as *;

.Button {
  color: $color-white;
}
```

```scss:src/scss/components/_index.scss
@use "./Button.scss";
@use "./Footer.scss";
@use "./Header.scss";
```

:::

# FLOCSS, ITCSS との対応

区別が難しいものもあるため、完全に対応しているというよりは、あくまで参考として見てください。

| ABC-CSS | FLOCSS | ITCSS |
|---|---|---|
|**Abstracts**  |-|Settings, Tools|
|**Base**       |Foundation|Generic, Base|
|**Components** |Layout, Object/Component|Objects, Components|
|**Features**   |Object/Project|-|
|**Pages**      |-|-|
|**Utilities**  |Object/Utility|Trumps|

# その他の補足

## レイヤーの追加と削除

それぞれのレイヤーは、必要に応じて取り除いても構いません。
たとえば、サイトの性質と規模に合わせて、FeaturesまたはPagesのどちらかを使わずに運用するといったことが考えられます。
また、LP～数ページ程度の小規模なサイトであれば、ComponentsとFeaturesを使わず、ほぼPagesだけで設計することも可能です。

また、レイヤーを追加することも制限しませんが、適用順とアルファベット順が一致するように英単語を選択するのが難しいとは思います……。


## プレフィックスの採用

FLOCSSで採用されているようなプレフィックスの使用は特に定めていません。
ただし、必要に応じてプレフィックスを設定するのもよいでしょう。

BrainBEMdingに従う場合、Components, Features, Pagesに属するクラスはパスカルケース、Utilitiesはケバブケースで接頭辞を付けます。

```css
/* Components */
.CButton
/* Features */
.FUserList
/* Pages */
.PIndexHero
/* Utilities */
.u-color-blue
```

## PC/SP、カラーテーマなどの状態変化の記述

必ずコンポーネント（Components, Features, Pages）の中で完結させます。

```css:❌NG
/* Button.scss */
.Button {}

/* dark-theme.scss のような別ファイル */
@media (prefers-color-scheme: dark) {
    .Button {}
}
```

```css:✅OK
/* Button.scss */
.Button {}

@media (prefers-color-scheme: dark) {
    .Button {}
}
```

## コンポーネントのマージン

「UIコンポーネントにはマージンをつけないべき」という主張がよくあります。

https://qiita.com/otsukayuhi/items/d88b5158745f700be534

基本的にはこの考え方がよいですが、かといって過度に気にし過ぎるのもよくありません。ケースに応じてはOKなパターンもあります。

ABC-CSSにおいては、以下のルールとします。

- **Components**に分類される要素ではmarginをつけることを**避ける**
- **Features, Pages**に分類される要素ではmarginをつけることを**許容する**

なぜなら、Features, Pagesは使用される場所が特定されているからです。


# まとめ

ABC-CSSというCSS設計を紹介しました。
アルファベット順に並んで幸せになれるのはもちろん、個人的にFLOCSSで悩んでいたComponentとProjectの判断の迷いがなくなりかなり扱いやすくなりました。
よければ使ってみてください！