---
title: "フロント開発2年やって行き着いた、CSS/Sass(SCSS)のルールとその理由"
emoji: "📑"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["css", "sass", "scss"]
published: false
---


## この記事について

CSSコーディングを行うときの「こうしておくと便利」「このほうが管理しやすい」という知見が溜まってきたのでまとめます。

なお、こういったルールや設計手法には必ずしも正解は存在せず、ケースバイケースで最適な手法は異なります。
各項目について、自分がその判断に至った「理由」を説明していますので、
理由を読んだ上で自分のプロジェクトに取り入れるか判断いただくと良いと思います。

また、詳しい説明については他の方の記事へのリンクにて代えさせていただいています。

### 対象

- CSSを一通り書ける人。
- Sassなどのメタ言語を使ったことがある人。
- スタイルの指定方法の選択で迷ったことがある人。

### 対象でない人

- CSSをこれから学び始める初学者

## 環境構築編

### メタ言語としてSassのSCSS記法を使う

CSS開発時には[Sass](https://sass-lang.com/)、中でも[SCSS記法](https://sass-lang.com/documentation/syntax#scss)を使用します。

#### 理由

素のCSSの記法もそのまま使える（SCSSはCSSのスーパーセットである）から。

Sass記法や、[Stylus](https://stylus-lang.com/)は独自記法のため、素のCSS記述を流用しようとした場合にも変換が必要になりますが、SCSS記法ではその必要がありません。
この点においては[Less](https://lesscss.org/)でも問題ないのですが、最初に使い始めたのがSassで、特に乗り換える理由もなかったのでSassを使用しています。
（後付けの理由としては、Sass(SCSS)のほうがシェアが高いということも理由になります。）

また、Sassの機能をPostCSSのプラグインで代替することも一度考えましたが、Sassで使っていた機能が置き換えきれないことや、他のメンバーが一見しただけではどの機能が使える環境なのかわかりにくいことなどを理由に断念しました。
（自分は採用しませんでしたが、）PostCSSで置き換える方法については以下の記事などが参考になります。
[Sassを使わずにPostCSSだけでCSSを書く理由](https://zenn.dev/yuki0410/articles/2e7f38a1ee5e5637b597-2)

### LibSass (node-sass)ではなくDart Sass(sass)を使う

#### 理由

LibSassはすでに非推奨となっているから。
LibSassが非推奨になった話や、Dart Sassへの移行については多くの記事が出ているので詳しくはそちらを参照してください。

[Dart Sass（@use）の基本的な書き方と@importから乗り換える方法 | HPcode（えいちぴーこーど）](https://haniwaman.com/dart-sass/)
[node-sassからDartSassへsassコンパイラの移行 / 開発者向けブログ・イベント | GMO Developers](https://developers.gmo.jp/12920/)

### SassのビルドにはViteを使う

[Home | Vite](https://ja.vitejs.dev/)

#### 理由

環境構築が楽だから。

もともとgulpでタスクを組んでいたのですが、ViteでSassもビルドできることを知ってからViteを使っています。
厳密に言うと、ViteはJSのビルド環境であり、CSSはJSで使うasset扱いされるのでSassオンリーでビルドするのは正規の使い方ではないっぽいですが、問題なく使えちゃうので使ってます。

以下、JSとSassをまとめてバンドルするときの設定ファイル例です。

```js
// vite.config.js
import { defineConfig } from "vite";
import glob from "glob";
import path from "path";

export default defineConfig({
  build: {
    outDir: `dist`,
    sourcemap: process.env.NODE_ENV !== "production",
    rollupOptions: {
      // inputにscssファイルを指定するとコンパイルできる
      input: Object.fromEntries(
        glob
          .sync("{js,css}/**/*.{js,scss}", {
            ignore: "**/_**/**/*.{js,scss}",
            cwd: `./src`,
          })
          .map((file) => {
            const { dir, name } = path.parse(file);
            return [`${dir}/${name}`, path.resolve("src", file)];
          })
      ),
      // 出力CSSファイル名はassetFileNamesで指定する。inputが.scssなら、[ext]には"css"が入る
      output: {
        entryFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },

  // postcssも簡単に指定できる
  css: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
});
```

`vite`, `sass`, `postcss`, （導入するなら） `tailwindcss`, `autoprefixer` を `npm install` する必要があります。

### Stylelintを使う

プロジェクトにはStylelintを導入しています。autofixが可能なものについては、VSCodeで保存時に自動修正されるようにしています。

[Home | Stylelint](https://stylelint.io/)

#### 理由

- コーディングルールの統一を図るため
- 機械的に処理できる部分に頭を使いたくないため


#### .stylelintrc.js

自分は大体こんな感じのstylelintrcを使ってます。

```js
module.exports = {
  extends: ["stylelint-config-recess-order", "stylelint-config-recommended-scss", "stylelint-prettier/recommended"],
  ignoreFiles: ["**/*.js"],
  rules: {
    "unit-disallowed-list": [
      "px",
      {
        ignoreMediaFeatureNames: {
          px: ["min-width", "max-width"],
        },
        ignoreProperties: {
          px: [/^\$?border(?!-radius)/],
        },
      },
    ],
    "selector-pseudo-element-colon-notation": "double",
    "scss/selector-no-union-class-name": true,
  },
};
```

##### stylelint-config-recess-order

プロパティの順番設定です。
position → display → font → ... といった感じで、影響の大きい方から順に並びます。
同じプロパティが近くに並ぶようにしておくことで、同じプロパティの重複指定にも気づきやすくなります。

```scss
.Block {
    // positionなどの、影響が大きいプロパティが上
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    padding: 10px;
    font-size: 16px;
    // font-sizeなどの、影響が小さいプロパティが下
}
```

##### stylelint-config-recommended-scss

[stylelint-config-recommended-scss - npm](https://www.npmjs.com/package/stylelint-config-recommended-scss)

SCSS用の推奨ルールセット。

recommendedよりも有効化されているルールが多い [stylelint-config-standard-scss - npm](https://www.npmjs.com/package/stylelint-config-standard-scss) というのもありますが、
自分にとっては扱いづらく、結局多数のルールをオフにしてしまったので、recommendedに戻ってきました。
（とはいえ、知らないルールを知るために一度使ってみるのはおすすめです）

##### stylelint-prettier/recommended

StylelintでPrettier（コード整形）を行う設定です。

実はPrettier公式的には非推奨（PrettierはStylelintと別で実行するのが推奨）らしいのですが、まとめて実行できたほうが都合がいいので使い続けています。

[いつのまにかeslint-plugin-prettierが推奨されないものになってた | K note.dev](https://knote.dev/post/2020-08-29/duprecated-eslint-plugin-prettier/)
[Integrating with Linters · Prettier](https://prettier.io/docs/en/integrating-with-linters.html)


##### selector-pseudo-element-colon-notation

`:before`　`:after` を `::before` `::after` に強制させるルールです。
CSS2まではコロン1つだったのですが、CSS3では「擬似クラス」と「疑似要素」を区別するため、疑似要素である `::before` `::after` はコロン2つになりました。

>Note: CSS3 では疑似クラスと擬似要素を見分けやすくするために、 ::after の表記法（二重コロン付き）が導入されました。ブラウザーでは CSS2 で導入された :after も使用できます。
>https://developer.mozilla.org/ja/docs/Web/CSS/::after

とはいえ、コロン1つでも問題があるわけではないので、好みとしてこのルールを入れています。

##### scss/selector-no-union-class-name

後述の「クラス名をアンパサンドでネストしない」ためのルールです。


##### unit-disallowed-list

後述の「pxではなくremで指定する」ためのルールです。

### VSCode拡張 SCSS IntelliSense を使う

[SCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss)

#### 理由

便利だから。

- `$` を打つと変数を補完してくれる
- 補完表示中、値がカラーコードである変数には色が表示される
- mixinも補完してくれる
- 変数右クリックで「定義へ移動」のジャンプも使える

## Sass(SCSS)ルール編

### @import ではなく @useを使う

#### 理由

`@import` は非推奨となっているため。
従来の `@import` ではファイル個別に読み込む必要がなかった共通ファイルを都度読み込むのは面倒なのですが、
一方で、 `@use` はスコープが制限されるため、変数名の衝突を気にする必要がなくなるのは利点です。

なお、ネストされたブロック内では `@use` が使えないのですが、その場合は `@include meta.load-css` が使えるみたいです。
[Sass：sass：meta](https://sass-lang.com/documentation/modules/meta#load-css)
[DartSassがなかなか辛かったのでGulpを修正してみた｜notes by SHARESL](https://notes.sharesl.net/articles/2423/)


### @useは `as *` で読み込む

```scss
// global.scss
$variable: 20px;
```

```scss
// NG

// Block.scss
@use "./global.scss";

.Block {
    font-size: module.$variable;
}
```

```scss
// OK

// Block.scss
@use "./global.scss" as *;

.Block {
    font-size: $variable;
}
```

#### 理由

先述のVSCode拡張 [SCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss) が `module.$variable` の記述には対応していないから。
`module.$variable` には対応しておらず、 `as *` `$variable` なら対応しているため、こちらの記法を採用することにしました。
また、`@import` での使い心地と近くなるため、移行しやすいという利点もあります。

### クラス名を `&` アンパサンドでネストしない

```scss
// NG
.Block {
    &__Element {
    }
}


// OK
.Block {
}
.Block__Element {
}
```

#### 理由

クラス名で検索しづらくなるから。

一人で制作をしているならまだしも、複数人で制作をする場合は特に、どこになんのクラスが書いてあるか把握しづらくなります。
クラス名がフルで書いてあれば、検索することで一発で使用箇所が見つけられます。

[Sassの機能でネストが最初に紹介されるけどあまり使わない方が良いと思う - Qiita](https://qiita.com/xrxoxcxox/items/16002a866aa7ba8fb346)

#### Stylelintルールもあります

Stylelintの項目で触れましたが、 [scss/selector-no-union-class-name](https://github.com/stylelint-scss/stylelint-scss/blob/master/src/rules/selector-no-union-class-name/README.md) というルールがあるので、活用しましょう。


### 色変数名の命名にはName That Color（VSCode拡張）を使用する

[Name That Color](https://marketplace.visualstudio.com/items?itemName=guillaumedoutriaux.name-that-color)
カラーコードを選択すると、それに対応した色名を出力してくれます。
また、そのままSass変数を作成するコマンドもあります。

#### 理由

色名の命名に頭を使わなくてよくなるから。

#### 他の手法

このVSCode拡張以外でカラーコードに対して一意の名前をつける方法としては、htmlcsscolor.com の色名を参照するのも一つの手段です。
[HTML CSS Color Online color library: development, web-design, photoshop, art - HTML CSS Color](https://www.htmlcsscolor.com/)
例えばZennのプライマリーカラー #3EA8FF は "Summer Sky" という名前でした。
[HEX color #3EA8FF, Color name: Summer Sky, RGB(62,168,255), Windows: 16754750. - HTML CSS Color](https://www.htmlcsscolor.com/hex/3EA8FF)


## CSS設計編

### BEMの考え方に従う。ただしMindBEMdingの命名規則には従わない

BEMの説明については割愛しますが。

クラス命名を `.BlockName__ElementName--modifierName` のルールにします。

#### 理由

一般的なMindBEMdingの命名規則では、 `.block-name__element-name--modifier-name` とされていますが、これには不便なところがあります。
それは「ダブルクリックでの文字列選択」です。ブラウザやエディタで文字列をダブルクリックすると単語のまとまりで範囲選択ができるのですが、
`-` （ハイフン）と `_` （アンダースコア）は扱いが異なり、ハイフンで区切られた部分は別単語扱いになってしまいます。

例えば `.block-name__element-name--modifier-name` の例だと、
`element` の部分をダブルクリックすると、 `name__element` というまとまりで選択されてしまいます。

「BlockとElementの間は `__` 」、「Modifierの前は`--`」というルールは守りつつ、上記の不都合を解消するため、BlockとElementをパスカルケース（アッパーキャメルケース）にすることにしました。

「パスカルケースの命名って、Reactのコンポーネントっぽくない？」と思った方はその通り。
BEMにおけるBlockという概念を考え直したとき、これってReact同様にコンポーネントと捉えて差し支えないと思いました。
Blockはコンポーネント、Elementはコンポーネントの中の要素、Modifierはコンポーネントのpropsです。
その意味も込めてパスカルケースを採用しました。

なお、Modifierのみローワーキャメルケースにしているのは、JS変数名と合わせることが可能なためです。
EJSやNunjucks等のテンプレートエンジンでクラス名を変数で切り替える際などに、同様の命名が可能です。

### エレメントのネストを許容する

`.Block__Element1__Element2` を許容します。
ただし、必ずしもマークアップのネスト構造と一致させることはせず、スタイルに親子関係が影響する場合にのみネストします。

```html
<div class="Block">
    <div class="Block__Grid">
        <div class="Block__Grid__A">
            <p class="Block__Text"></p>
        </div>
        <div class="Block__Grid__B">
            <p class="Block__Text"></p>
        </div>
    </div>
</div>
```

```scss
.Block__Grid {
    display: grid;
    grid-template-areas: "A B";
}
.Block__Grid__A {
    grid-area: "A";
}
.Block__Grid__B {
    grid-area: "B";
}
.Block__Text {
    font-size: 1.5rem;
}

```


#### 理由

スタイルに明確な親子関係が存在する場合には、エレメントのネストで明示したほうがいいから。

- グリッドコンテナーとグリッドアイテムの関係がある場合
- position: relative（相対配置の基準）と position: absoluteの関係がある場合

など。
マークアップのネスト構造が変更されても成立する場合には、ネストさせません。

### モディファイア単体にスタイルを当てない

```scss
// NG
.Block {
    // デフォルトのスタイル
}
.Block--modifier {
    // モディファイアのスタイル
}
```

```scss
// OK
.Block {
    // デフォルトのスタイル
    &.Block--modifier {
        // モディファイアのスタイル
    }
}
```

#### 理由

詳細度を上げるため。

NG例では、`.Block` と `.Block--modifier` の詳細度が同じため、なにかの拍子に記述順が変わってしまうとモディファイアのスタイルが優先されなくなってしまいます。
OK例では、モディファイアのセレクタが`.Block.Block--modifier`になり、詳細度が上がるため、必ずモディファイアのスタイルが優先されます。

### ネストされたスタイルは、スタイルが当たるエレメントで書く

```scss
// NG
.Block {
    &.Block--modifier {
        .Block__Element {
            // .Block.Block--modifier .Block__Element {}
        }
    }
}
.Block__Element {
    // .Block__Element {}
}
```

```scss
// OK
.Block__Element {
    // .Block__Element {}
    .Block.Block--modifier & {
        // .Block.Block--modifier .Block__Element {}
    }
}
```

#### 理由

その要素に当たるスタイルがわかりやすくなるから。

NG例では、`.Block__Element` に対して当たるスタイル記述が分散してしまいます。さらに、詳細度の高いセレクタが先に来てしまっており、Stylelintの `no-descending-specificity` ルールにも反します。
[no-descending-specificity | Stylelint](https://stylelint.io/user-guide/rules/list/no-descending-specificity/)
OK例では、 `.Block__Element` に対して当たるスタイルがどのように変化するかが読み取りやすくなります。


### ディレクトリ構造を頑張りすぎない

FLOCSSとかSMACSSとか、いろいろな設計手法がありますが、
「FLOCSSのcomponentとprojectってどうやって区別したらええねん・・・」とかなったので、そういった手法には則らないことにしました。
結果、自分は以下のような構造にしました。

```bash
├── css
│   ├── _base       # 共通で使うもの
│   │   ├── base.scss   # タグに直接指定するスタイルなど
│   │   └── global.scss # 変数・mixinなど共通で使用するもの（スタイルを生成しないもの）
│   ├── _components # コンポーネント（Block)
│   │   ├── BlockName.scss
│   │   └── ...
│   └── style.scss  # エントリーポイント
```

```scss
// _base/base.scss
@use "../_base/global.scss" as *;

body {
  font-family: "Noto Sans JP", sans-serif;
  color: $color-mine-shaft;
  background-color: $color-white;
}
img {
  max-width: 100%;
  height: auto;
  vertical-align: bottom;
}
```

```scss
// _base/global.scss
$color-mine-shaft: #333;
$color-white: #fff;

$breakpoints: (
  medium: 768,
);
@mixin sp {
  @media screen and (max-width: #{map-get($breakpoints, medium) - 0.02}px) {
    @content;
  }
}
@mixin pc {
  @media screen and (min-width: #{map-get($breakpoints, medium)}px), print {
    @content;
  }
}
```

```scss
// _components/BlockName.scss
@use "../_base/global.scss" as *;
.BlockName {
    color: $color-mine-shaft;
}
```

```scss
// style.scss
@use "node_modules/destyle.css/destyle.css"; // リセットCSS

@use "./_base/base.scss";

@use "./_components/BlockName.scss";
@use "./_components/...";

@use "node_modules/tailwindcss/utilities"; // ユーティリティクラス (tailwind)
```

#### 理由

ディレクトリやファイルを分割しすぎると、どの記述をどこに配置すればよいかの判断が煩雑になるため。

### ユーティリティクラスにtailwindを使う

tailwindではユーティリティファーストを掲げていますが、自分は

#### 理由

クラス命名を考えなくていいから。
使うときにいちいち定義しなくてもいいし、使ったクラス名だけが出力されるから。

#### tailwind.config.js

```js
module.exports = {
  prefix: "tw-", // tailwindから出力していることをわかりやすくするため"tw-"をつけているが、つけなくてもいいし、FLOCSSライクに "u-" とするのもアリだと思う
  content: ["./src/**/*.njk"], // この中のファイルに含まれるクラス名だけ出力される
  theme: { // 定義したものだけ使いたいので、extendしない
    screens: {
      pc: { raw: `screen and (min-width: ${768}px), print` },
      sp: { raw: `screen and (max-width: ${768 - 0.02}px)` },
    },
    colors: {
      "white": "#fff",
      "mine-shaft": "#333",
    },
  },
};
```

### リセットCSSにはdestyle.cssを使用する

リセットCSSにもいろいろありますが、自分は必ずdestyle.cssを使用しています。

[destyle.css - npm](https://www.npmjs.com/package/destyle.css)

#### 理由

ちゃんとスタイルを消してくれるから。
他のリセットCSSでは、buttonタグのスタイルが消えていなかったりとリセットされきらないことが多いのですが、destyle.cssではちゃんと消してくれます。
ちなみに、不要なスタイルはちゃんと消しつつ、buttonタグのフォーカス時のoutlineは消さないような仕様になっています。



## 管理編

### グローバルなz-indexは変数管理する

```scss
// NG

// Header.scss
.Header {
    z-index: 10;
}

// Modal.scss
.Modal {
    z-index: 20;
}
```

```scss
// OK

// global.scss
$z-index: (
  header: 10,
  modal: 20
);

// Header.scss
@use "./global.scss" as *;
@use "sass:map";
.Header {
    z-index: map.get($z-index, header);
}

// Modal.scss
@use "./global.scss" as *;
@use "sass:map";
.Modal {
    z-index: map.get($z-index, modal);
}
```

#### 理由

z-indexは前後関係を定義するものなので、他の数字がいくつかを把握した上で指定する必要があります。
1箇所で管理することで、サイト全体で使用されている値を把握できるから。


### ブロック内のエレメントにz-indexを指定するときは、ブロック（親）に `z-index: 0;`を指定する

これについてはサンプルを見るのが早いと思いますので、こちらを見てください。

`header` は追従させてコンテンツより前に出すためz-indexを指定しています。
また、 `Danger` ブロックと `Safe` ブロックの子要素にもz-indexが指定されています。
スクロールしてみると、 `Danger` ブロックの子要素が `header`よりも前に来てしまいます。

ここで、「z-indexの数字を管理すればいいのでは？」と思うかもしれませんが、それだと管理すべきz-indexが大量になってしまいます。
`Safe` ブロックには親である `.Safe` クラスにz-index:0;を指定していることで、スタッキングコンテキストを生成し、スコープを制限することができます。

z-indexとスタッキングコンテキストについて詳しくは以下の記事を参照してください（自分も正確に理解できているわけではなく、雰囲気でやっています・・！）
[君は真に理解しているか？z-indexとスタッキングコンテキストの関係 - ICS MEDIA](https://ics.media/entry/200609/)


### マージンはmargin-topおよびmargin-leftでつける

#### 理由

要素の関係性でマージンを指定できるから。

どういうことかというと、「見出しとテキストの間は20px空けたいんだけど、テキストとテキストの間は10pxにしたいんだよなー」とかありますよね。
margin-top（およびmargin-left）で指定するルールを基本にしておけば実現しやすいです。

```scss
p {
    h1 + & {
        margin-top: 20px;
    }
    p + & {
        margin-top: 10px;
    }
}
```

同様に、「同じものが連続するときのマージン」も指定しやすいです。

```scss
li {
    & + & {
        margin-top: 10px;
    }
}
```


### メディアクエリは 1px ではなく0.02px で切り替える

```scss
// NG
@media screen and (max-width: 767px) {
    // SP
}
@media screen and (min-width: 768px) {
    // PC
}
```

```scss
// OK
@media screen and (max-width: 767.98px) {
    // SP
}
@media screen and (min-width: 768px) {
    // PC
}
```

#### 理由

拡大率が100%でない場合などに、画面サイズが小数点になることがあり、どちらのスタイルも当たらなくなることがあるため。

この値についてはBootstrapの実装を参考にしました。
ちなみに、0.01pxだと、丸められてしまうため、0.02pxが最適な値みたいです。

>Why subtract .02px? ブラウザは現在、range context queriesをサポートしていません。そのため、min- and max- prefixesの制限や、小数の幅を持つビューポート（高 dpi のデバイスなど、特定の条件下で発生する可能性があります）を回避するために、より精度の高い値を使用しています。
>[Breakpoints (ブレイクポイント) · Bootstrap v5.0](https://getbootstrap.jp/docs/5.0/layout/breakpoints/)

### PCのメディアクエリにはprintをつける

```scss
// NG
@media screen and (max-width: 767.98px) {
    // SP
}
@media screen and (min-width: 768px) {
    // PC
}
```

```scss
// OK
@media screen and (max-width: 767.98px) {
    // SP
}
@media screen and (min-width: 768px), print {
    // PC
}
```


#### 理由

これをつけないと、ページの印刷時にスタイルが全く当たらなくなってしまい、表示が崩れるから。
印刷時にもまともな表示をさせるためこの対応をする。

`screen and` をつけなければ印刷時にも適切なスタイルが当たると思ったこともあったが、一般に印刷時の幅は600pxくらいで判定されるため、大体の場合SP表示になってしまう。
しかし印刷するとき出したいのは基本的にPC表示のレイアウトである。
そのため、 `screen and` をつけつつ、PC表示のスタイルにのみ `, print`　をつけるという対策を取ることとした。

なお、印刷時のスタイルというものは、ブラウザによっても挙動が異なり、一筋縄ではいかない。
この対応はあくまで、「めちゃくちゃ崩れるのを避ける」のみであって、「印刷表示を完璧にする」わけではないことはご留意ください。


### 変更するつもりのないプロパティに指定をしない

※内容はかなり適当ですが、プロパティの書き方に注目してください。

```scss
// NG
.Block {
    margin: 0 auto;
    background: linear-gradient(#fff, #000);
    transition: 0.2s all;
}
```

```scss
// OK
.Block {
    margin-right: auto;
    margin-left: auto;
    background-image: linear-gradient(#fff, #000);
    transition-duration: 0.2s;
    transition-property: color;
}
```

#### 理由

予期せずスタイルを上書きしてしまう可能性があるから。

上記のNG例では、すべてショートハンドの記法を使用していますが、これは実際には、以下のように解釈されます。
（Chromeのdevtoolで確認することができます）

```scss
.Block {
    margin: 0 auto;
    background: linear-gradient(#fff, #000);
    transition: 0.2s all;
}

// ↓同一

.Block {
    margin-top: 0px;
    margin-right: auto;
    margin-bottom: 0px;
    margin-left: auto;
    background-image: linear-gradient(rgb(255, 255, 255), rgb(0, 0, 0));
    background-position-x: initial;
    background-position-y: initial;
    background-size: initial;
    background-repeat-x: initial;
    background-repeat-y: initial;
    background-attachment: initial;
    background-origin: initial;
    background-clip: initial;
    background-color: initial;
    transition-property: all;
    transition-duration: 0.2s;
    transition-timing-function: ease;
    transition-delay: 0s;
}
```

このように変更する気のないプロパティにまで値をセットしていると、別の場所で指定していた値を不要に上書きしてしまう可能性があります。
必要のあるプロパティだけ指定するようにしましょう。

### transition-propertyをallにしない

`transition-property: color;` など、トランジションさせることを意図したプロパティのみを指定する。

#### 理由

トランジションをかける意図のないプロパティまでトランジションさせてしまうため。

### スタイルの上書き（カスケーディング）はできるだけ避ける（禁止はしない）

```scss
// NG
.class {
    font-size: 16px;
    @media screen and (min-width: 768px), print {
        font-size: 20px;
    }
}
```

```scss
// OK
.class {
    @media screen and (max-width: 767.98px) {
        font-size: 16px;
    }
    @media screen and (min-width: 768px), print {
        font-size: 20px;
    }
}
```

#### 理由

一つの要素に対するスタイルのカスケーディングが多くなるほど、どこの記述が影響しているか把握するのが難しくなるため。


#### 例外

必ずしも上書きを禁止する必要はない。

```scss
// OK
.Block {
    color: red;
    &.Block--green {
        color: green;
    }
    &.Block--blue {
        color: blue;
    }
}

// 上書きをなくそうとするとこうなるが、
// 逆にデフォルトのスタイルの詳細度が上がってしまうため、こうはしなくていいかな・・・
.Block {
    &.Block--green {
        color: green;
    }
    &.Block--blue {
        color: blue;
    }
    &:not(.Block--green):not(.Block--blue) {
        color: red;
    }
}
```




### 横方向のlinear-gradientは（to leftではなく）to rightにする

```scss
// NG
.class {
    background-image: linear-gradient(to left, #fff, #000);
}
```

```scss
// NG
.class {
    background-image: linear-gradient(to right, #000, #fff);
}
```

#### 理由

コード上の並びと実際の表示の並びが同じになり、わかりやすいから。
細かい話ではありますが、コードは可能な限り直感的に捉えやすい記述にしておくことで、別の人（未来の自分を含む）が理解しやすくなります。


## アクセシビリティ関連

### （前提）ブラウザの入力方法には3種類あることを理解する

具体的にどうする以前に、意識の話です。
Webブラウザの操作方法は以下の3種類があるということを認識しましょう。

- マウス（クリック、ホバー、ホイールなど）
- タッチ（タップ、スワイプなど）
- キーボード（Enterによるボタン押下, Tabによるフォーカス移動、矢印キーによるスクロールなど）

#### 理由

世のWebサイトでは、マウス操作・タッチ操作は考慮されていても、キーボード操作が考慮されていないことが多いから。
具体的な実装についてはこのあとの項目でいくつか触れます。

### フォーカス時のoutlineを消さない

デザイン上見栄えが悪いという理由で、フォーカス時のアウトラインが消されることがありますが、これは絶対にやってはいけません。

```scss
// NG
a:focus {
    outline: none !important;
}
```

#### 理由

キーボードのTabキーで操作した場合に、フォーカス対象がわからなるから。

#### どうすべきか

- outlineの代わりに、box-shadowなどでサイトのデザインに合わせたスタイルを当てる
- what-inputを使用して、マウス操作・タッチ操作の場合にのみoutlineを消す

自分は後者の"what-input"による区別を使用しています。
[what-input - npm](https://www.npmjs.com/package/what-input)は、現在の入力方法を検出するJSライブラリです。
現在の入力方法に応じてhtmlタグに `data-whatinput` や `data-whatintent` というdata属性を付与されるので、これをもとにスタイルを決定できます。

使用方法については以下の記事などが詳しいので、こちらを参照ください。
[見た目重視でoutlineを消したいにしても、せめてこうしませんか？ - Qiita](https://qiita.com/xrxoxcxox/items/82e083b3f47309873262)
[もうoutlineを消さない。クリック・タップ・キーボードのイベントを判定してくれるJSライブラリ「what-input」 ｜ Tips Note by TAM](https://www.tam-tam.co.jp/tipsnote/html_css/post16551.html)

### inputタグをdisplay:noneしない

チェックボックスやラジオボタンのスタイリングをする際、inputタグを非表示にしてlabelタグにスタイルを当てることがありますが、このときinputタグを `display:none` で消してはいけません。

#### 理由

`display: none` してしまうと、Tabキーによるフォーカスが不可能になり、キーボード操作が不可能になるため。

#### どうすべきか

`opacity: 0` などを使用します。
詳しい説明は以下の記事が詳しいので、こちらを参照ください。

[アクセシビリティで気をつけるcheckbox,radioのCSS - Qiita](https://qiita.com/Garyuten/items/b87b7d91279c0bded576)


### ホバースタイルの有無は画面幅ではなく `@media (hover: hover)` で切り替える

```scss
// NG
.Button {
    @media screen and (min-width: 768px) {
        &:hover {
            background-color: red;
        }
    }
}
```

```scss
// OK
.Button {
    @media (hover: hover) {
        &:hover {
            background-color: red;
        }
    }
}
```

#### 理由

PCの画面幅だからといってマウス操作とは限らないし、
SPの画面幅だからといってタッチ操作とは限らないから。

ホバー操作が可能な入力かどうかは `hover` メディアクエリで判定できます。
[hover - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/@media/hover)

ただし、これだとSurfaceなどのマウス操作も可能なタブレットPCでタッチ操作をしている場合にもhoverスタイルが当たってしまいます。
このようなケースにも正確に対応するためには、 what-inputを使用する必要があります。
（とはいえ、タッチ操作でホバースタイルが当たっても操作不能になるわけではないので、多くの場合では `@media (hover: hover)` での対応で問題ないと思っています。）

### pxではなくremで指定する

```scss
// NG
p {
    font-size: 16px;
}
```

```scss
// OK
html {
    font-size: 62.5%;
}

p {
    font-size: 1.6rem;
}
```

#### 理由

ブラウザのフォントサイズ変更機能が適用されるから。
root (html) が10pxになるように指定しておけば、指定したいpx数を1/10するだけなので、計算も面倒ではありません。

文字サイズの変更機能などについては、以下の記事が詳しいので、こちらを参照ください。

[Webサイトのfont-size・・・それでも僕は相対値。 - Shibajuku](https://shibajuku.net/font-size-still-relative/)


## 最後に

あなたのコーディングがより快適になりますように。
そして世に生み出される

