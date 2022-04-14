---
title: "よりよいCSSを書くための、CSS / Sass (SCSS) 30のルールとその理由"
emoji: "📏"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["css", "sass", "scss"]
published: true
---

Webエンジニアを始めて丸2年が経ちました。
複数プロジェクトを進める中で、CSSコーディングを行うときの「こうしておくと便利」「このほうが管理しやすい」といった知見が溜まってきたのでまとめます。

# はじめに

- 長くなってしまった細かい説明はところどころ折りたたんでいます。概要だけで理解できたら飛ばしていただき、詳しい話が気になったら開いて読んでください。
- これらは「自分がよく取り入れている手法」であって、必ずしもどのプロジェクトにも当てはまるものではないと思います。
各項目について、自分がその判断に至った **「理由」** を説明していますので、
理由を読んだ上で自分のプロジェクトに取り入れるか判断いただくと良いと思います。
- この記事は、すでにCSSコーディングをしていてアイデアがほしい人に向けた記事で、
CSSをこれから学び始めるような **初学者向けではない** ことご了承ください。
一般的と思われるキーワードについては説明を省略しています。

# 環境構築編

## 1. メタ言語にはSassのSCSS記法を使う

### 理由

1.  **素のCSSの記法もそのまま使える** （SCSSがCSSのスーパーセットである）から。
2.  **シェアが高い** から。

:::details 詳しい選定理由

CSSを書くときの言語としては、

- （素の）CSS
- [Sass - インデント記法](https://sass-lang.com/documentation/syntax#the-indented-syntax)
- [Sass - SCSS記法](https://sass-lang.com/documentation/syntax#scss)
- [Less](https://lesscss.org/)
- [Stylus](https://stylus-lang.com/)
- （PostCSS）

が選択肢になります。

素のCSSは管理がしにくいため、メタ言語は当然使いたくなります。
ここで、Sassインデント記法やStylusは独自記法のため、素のCSS記述を流用しようとした場合にも変換が必要になりますが、SCSS記法ではその必要がありません。
この点においてはLessでも問題ないのですが、最初に使い始めたのがSassで慣れていることや、Sass(SCSS)のほうがシェアが高いということも理由にSassを使用しています（シェアが高いということは情報が見つかりやすいので）。

また、Sassの機能をPostCSSのプラグインで代替することも一度考えましたが、Sassで使っていた機能が置き換えきれないことや、他のメンバーが一見しただけではどの機能が使える環境なのかわかりにくいことなどを理由に断念しました。
（自分は採用しませんでしたが、）PostCSSで置き換える方法については以下の記事などが参考になります。
[Sassを使わずにPostCSSだけでCSSを書く理由](https://zenn.dev/yuki0410/articles/2e7f38a1ee5e5637b597-2)

:::

## 2. LibSass (node-sass) ではなく Dart Sass (sass) を使う

### 理由

1. LibSassはすでに **非推奨** となっているから。

「LibSass, Dart Sassとはなにか」や、「Dart Sassへの移行」については以下の記事などを参照してください。
[node-sassからDartSassへsassコンパイラの移行 / 開発者向けブログ・イベント | GMO Developers](https://developers.gmo.jp/12920/)

## 3. SassのビルドにはViteを使う

gulpなどのタスクランナーを使用せず、JSのビルド環境である Vite を使用してSassをビルドする。
https://ja.vitejs.dev/

### 理由

1. 環境構築が **楽** だから。

もともとgulpでタスクを組んでいたのですが、ViteでSassもビルドできることを知ってからViteを使っています。
厳密に言うと、ViteはJSのビルド環境であり、CSSはJSで使うasset扱いされるのでSassオンリーでビルドするのは正規の使い方ではないっぽいですが、問題なく使えちゃうので使ってます。
それに、CSSのコーディングをする際はどうせJSのコーディング環境も作ることになるので、まとめて設定することで楽にできます。

:::details JSとSassをバンドルするときのvite.config.jsの例
（一部を抜き出してきたので、もしかしたら必要な記述抜けてたりするかもしれません）
`vite`, `sass`, `postcss`, （導入するなら） `tailwindcss`, `autoprefixer` を `npm install` する必要があります。

```js
// vite.config.js
import { defineConfig } from "vite";
import glob from "glob";
import path from "path";

export default defineConfig({
  build: {
    outDir: `dist`,
    // ソースマップはJSのみ。
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

:::

## 4. Stylelintを使う

プロジェクトにはStylelintを導入します。autofixが可能なものについては、VSCodeで保存時に自動修正されるようにします。

https://stylelint.io/

### 理由

1.  **コーディングルールの統一** を図るため
2.  機械的に処理できる部分に **頭を使いたくない** ため


:::details 自分がよく使う .stylelintrc とその説明

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

#### stylelint-config-recess-order

プロパティの順番設定です。
position → display → font → ... といった感じで、影響の大きい方から順に並びます。
同じプロパティが近くに並ぶようにしておくことで、どこに書かれているかわかりやすくなりますし、
プロパティの並び順に頭を使う必要がなくなります。

```scss
.class {
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

#### stylelint-config-recommended-scss

[stylelint-config-recommended-scss - npm](https://www.npmjs.com/package/stylelint-config-recommended-scss)

SCSS用の推奨ルールセット。

recommendedよりも有効化されているルールが多い [stylelint-config-standard-scss - npm](https://www.npmjs.com/package/stylelint-config-standard-scss) というのもありますが、
こちらは自分にとっては扱いづらく、結局多数のルールをオフにしてしまったので、recommendedに戻ってきました。
（とはいえ、知らないルールを知るために一度使ってみるのはおすすめです）

#### stylelint-prettier/recommended

StylelintでPrettier（コード整形）を実行する設定です。

実はPrettier公式的には非推奨（PrettierはStylelintと別で実行するのが推奨）らしいのですが、まとめて実行できたほうが都合がいいので使い続けています。
[いつのまにかeslint-plugin-prettierが推奨されないものになってた | K note.dev](https://knote.dev/post/2020-08-29/duprecated-eslint-plugin-prettier/)
[Integrating with Linters · Prettier](https://prettier.io/docs/en/integrating-with-linters.html)

#### selector-pseudo-element-colon-notation

`:before`　`:after` を `::before` `::after` に強制させるルールです。
コロン1つでも実用上問題があるわけではないのですが、好みとしてこのルールを入れています。

（補足）
CSSの仕様としてCSS2まではコロン1つだったのですが、CSS3では「擬似クラス」と「疑似要素」を区別するため、疑似要素である `::before` `::after` はコロン2つになりました。

>Note: CSS3 では疑似クラスと擬似要素を見分けやすくするために、 ::after の表記法（二重コロン付き）が導入されました。ブラウザーでは CSS2 で導入された :after も使用できます。
>https://developer.mozilla.org/ja/docs/Web/CSS/::after

#### scss/selector-no-union-class-name

「クラス名をアンパサンドでネストしない」ためのルールです。
これについては後述します。

#### unit-disallowed-list

「pxではなくremで指定する」ためのルールです。
これについても後述します。

:::

## 5. VSCode拡張 SCSS IntelliSense を使う

SCSS書く上で絶対使ったほうがいい拡張です。
https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss

### 理由

- 以下の機能が便利だから。
  - `$` を打つと **Sass変数を補完** してくれる
  - 補完表示中、値がカラーコードである変数は **色が表示される**
  - mixinも補完してくれる
  - Sass変数右クリックで **「定義へ移動」** のジャンプも使える

# CSS設計編

## 6. BEMの考え方に従う。ただし命名規則は `.BlockName__ElementName--modifierName`

クラス命名の際にはBEMの考え方に則りつつ、
クラス命名を **`.BlockName__ElementName--modifierName`** のルールにします。
（MindBEMdingには従わない）

### 理由

1. **ブロック名からエレメント名までが1単語として扱われる** から
   1. これにより、ダブルクリックで選択しやすいし、option + ←→での単語選択がしやすい
2. モディファイア名を、JSやテンプレートエンジンの変数名と合わせやすいから
3. 他のライブラリと衝突しにくいから

:::details この命名規則にした理由の補足

一般的なMindBEMdingの命名規則では、 `.block-name__element-name--modifier-name` とされていますが、これには不便なところがあります。
それは「ダブルクリックでの文字列選択」です。ブラウザやエディタで文字列をダブルクリックすると単語のまとまりで範囲選択ができるのですが、
`-` （ハイフン）と `_` （アンダースコア）は扱いが異なり、ハイフンで区切られた部分は別単語扱いになってしまいます。

例えば `.block-name__element-name--modifier-name` の例だと、
`element` の部分をダブルクリックすると、 `name__element` というまとまりで選択されてしまいます。

「BlockとElementの間は `__` 」、「Modifierの前は`--`」というルールは守りつつ、上記の不都合を解消するため、BlockとElementをパスカルケース（アッパーキャメルケース）にすることにしました。

「パスカルケースの命名って、 **Reactのコンポーネントっぽい** けど変ではないのか？」と、これを考えたときは思ったのですが、
よく考えてみると、BEMにおけるBlockという概念はReact同様にコンポーネントと捉えて差し支えないと思いました。
Blockはコンポーネント、Elementはコンポーネントの中の要素、Modifierはコンポーネントのpropsです。
その意味も込めてパスカルケースを採用しました。

そして、Modifierのみローワーキャメルケースにしているのは、JS変数名と合わせることが可能なためです。
EJSやNunjucks等のテンプレートエンジンでクラス名を変数で切り替える際などに、同様の命名が可能です。
:::

## 7. `.Block__Element1__Element2` を許容する

`.Block__Element1__Element2` (エレメントのネスト) を許容します。
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

### 理由

1.  **スタイルに明確な親子関係が存在する場合** には、クラス名で明示したほうがいいから。

### 詳しく

以下のようなケースは、それらが親子である必要のあるスタイルの当て方になっています。

- グリッドコンテナーとグリッドアイテムの関係がある場合
- position: relative（相対配置の基準）と position: absoluteの関係がある場合

このようなスタイル（クラス）は親に依存していることを明示しておくと、それを意識した上で編集できます。

一方で、マークアップのネスト構造が変更されても成立する場合には、ネストさせません。

## 8. モディファイア単体にスタイルを当てない

```scss
// ❌NG
.Block {
    color: black; // デフォルトのスタイル
}
.Block--modifier {
    color: red; // モディファイアのスタイル
}
```

```scss
// ✅OK
.Block {
    color: black; // デフォルトのスタイル
    &.Block--modifier {
        color: red; // モディファイアのスタイル
    }
}
```

### 理由

1. **詳細度を上げて、** モディファイアで指定したスタイルを確実に当てるため。

### 詳しく

NG例では、`.Block` と `.Block--modifier` の詳細度が同じため、なにかの拍子に記述順が変わってしまうとモディファイアのスタイルが優先されなくなってしまいます。
OK例では、モディファイアのセレクタが`.Block.Block--modifier`になり、詳細度が上がるため、必ずモディファイアのスタイルが優先されます。

## 9. ネストされたエレメントのスタイルは、スタイルが当たるエレメントに書く

見出しがわかりにくくてすみません。具体例を見てください。

```scss
// ❌NG
.Block {
    &.Block--modifier {
        .Block__Element {
            //  → .Block.Block--modifier .Block__Element {}
            // 親のブロックにモディファイアがついているときのエレメントのスタイル
        }
    }
}
.Block__Element {
}
```

```scss
// ✅OK
.Block__Element {
    .Block.Block--modifier & {
        //  → .Block.Block--modifier .Block__Element {}
        // 親のブロックにモディファイアがついているときのエレメントのスタイル
    }
}
```

### 理由

1.  **「この要素に当たるスタイルは何か」** がわかりやすくなるから。

### 詳しく

NG例では、`.Block__Element` に対して当たるスタイル記述が分散してしまいます。さらに、詳細度の高いセレクタが先に来てしまっており、Stylelintの `no-descending-specificity` ルールにも反します。
[no-descending-specificity | Stylelint](https://stylelint.io/user-guide/rules/list/no-descending-specificity/)

OK例では、 `.Block__Element` に対して当たるスタイルが1箇所にまとまり、どのように変化するかが読み取りやすくなります。

## 10. ディレクトリ構造を頑張りすぎない

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

:::details それぞれのファイルにどんな記述をしているかの具体例

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

// 色
$color-mine-shaft: #333;
$color-white: #fff;

// ブレークポイント
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
:::

### 理由

1.  ディレクトリやファイルを分割しすぎると、どこに記述すればよいかの判断が煩雑になるため。

### 詳しく

- `global.scss` は、他のファイルで `@use` して使うファイルです。そのため、スタイルを出力する記述は含めず、変数やmixinのみを書きます。
  - 変数やmixinは、`variables.scss`, `mixin.scss` と分けるやり方もよくありますが、参照するファイルが多くなるデメリットのほうが大きいと感じて、 `global.scss` に一元化しました。
  - 特に、 `$breakpoints` （ブレークポイントの値を持つ変数）と `@mixin pc` （メディアクエリのmixin）なんかは「変数」「mixin」という違いで分けるよりも、「ブレークポイントの管理」という役割で一緒の場所に記述したほうがまとまりがいいです。
- `_components`配下はブロックごとにファイルを作成します。
- `style.scss` (エントリーポイント) で必要ファイルを読み込む際、npmで管理できる外部ライブラリのCSSは `node_modules` から参照します。
- `utilities` 的なディレクトリは（これまでは作っていたのですが）作らず、tailwindに置き換えてみました（次の項目で詳細）。

## 11. ユーティリティクラスにTailwind CSSを使う

ユーティリティクラスを作る代わりに、Tailwind CSSを使用します。
https://tailwindcss.jp/

### 理由

1.  クラス命名を考えなくていいから。
2.  使うときに新しく定義しなくてもいいから。
3.  使っているクラス名だけが出力されるから。

### 詳しく

Tailwind CSSは「ユーティリティファースト」を掲げて、CSSファイルを編集せず、HTMLにクラスを書き込むことでスタイルを調整していくことを推奨しているフレームワークです。

なんですが、自分は **「原則いつもどおりにクラス名を定義して、SCSSファイルにCSSを書いていく」「ユーティリティクラスが必要になった場合、クラス名を書く代わりにTailwindを使う」** という使い方をしています。

この使い方を、こちらの記事の言葉を借りて「ユーティリティセカンド」と呼ぶことにしています。
[ユーティリティセカンドなCSS設計：CSS Nite2021-03-12感想 | ウェビンブログ | ウェビングスタジオ](https://webbingstudio.com/weblog/entry-890.html)

一方で、「どこまでをクラス名定義して、どこからはtailwind使うか」はたまに迷います。
少なくとも、`mt-[10px]` のような、数値を直接指定する使い方をするぐらいならクラス名を作って当てることとしています。


:::details tailwind.config.js の例

```js
module.exports = {
  prefix: "tw-", // tailwindから出力していることをわかりやすくするため"tw-"をつけているが、つけなくてもいいし、FLOCSSライクに "u-" とするのもアリだと思う
  content: ["./src/**/*.njk"], // この中のファイルに含まれるクラス名だけ出力される
  theme: { // 定義したものだけ使いたいので、extendはしない
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
:::

## 12. リセットCSSには `destyle.css` を使用する

リセットCSSにもいろいろありますが、自分が好きなのは `destyle.css` です。

https://www.npmjs.com/package/destyle.css

### 理由

 1. **ちゃんとスタイルを消してくれる**から。

特に、**buttonタグ**のスタイルが他のリセットCSSではリセットしきれていないことが多いのですが、destyle.cssではちゃんと消してくれます。
ちなみに、不要なスタイルはちゃんと消しつつ、buttonタグのフォーカス時のoutlineは消さないような仕様になっています。

# Sass(SCSS)ルール編

## 13. `@import` ではなく `@use` を使う

### 理由

1.  `@import` は**非推奨**となっているため。
2.  `@use` はスコープが制限されて、変数名の衝突を気にする必要がなくなるため。

`@import` から `@use` への移行の説明は他の記事に譲ります。
https://haniwaman.com/dart-sass/

従来の `@import` ではファイル個別に読み込む必要がなかった共通ファイルを都度読み込むのは面倒ではありますが、慣れるとそこまで気になりません。

なお、ネストされたブロック内では `@use` が使えないのですが、その場合は `@include meta.load-css` が使えるみたいです。
[Sass：sass：meta](https://sass-lang.com/documentation/modules/meta#load-css)
[DartSassがなかなか辛かったのでGulpを修正してみた｜notes by SHARESL](https://notes.sharesl.net/articles/2423/)


## 14. @useは `as *` で読み込む

:::details 具体例

```scss
// global.scss
$variable: 20px;
```

```scss
// ❌NG
@use "./global.scss";

.Block {
    font-size: global.$variable;
}
```

```scss
// ✅OK
@use "./global.scss" as *;

.Block {
    font-size: $variable;
}
```
:::

### 理由

1. 先述のVSCode拡張 [SCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss) が `module.$variable` の書き方に対応しておらず、 `as *` `$variable` なら対応しているから。
2. `@import` での使い心地と近くなるため、移行しやすいから。

拡張を使いたかったという理由のほうが強いです。

## 15. クラス名を `&` アンパサンドでネストしない

```scss
// ❌NG
.Block {
    &__Element {
        &--modifier {

        }
    }
}
```

```scss
// ✅OK
.Block {
}
.Block__Element {
    &.Block__Element--modifier {
    }
}
```

### 理由

1. **クラス名で検索できなくなるから。**

### 詳しく

「`.Block__Element` のスタイルを編集したいからファイルを探したい」とか、「`.Block__Element--modifier` の名前をまとめて変更したい」とか、クラス名の出現箇所を特定したい場面はよく発生します。
一人で制作をしているならまだしも、複数人で制作をする場合は特に、どこになんのクラスが書いてあるか把握しづらくなります。
クラス名がフルネームで書いてあれば、検索することで使用箇所が一発で見つけられます。

こちらの記事もわかりやすいです。
https://qiita.com/xrxoxcxox/items/16002a866aa7ba8fb346

### Stylelintルールも存在

Stylelintの項目で紹介していますが、 [scss/selector-no-union-class-name](https://github.com/stylelint-scss/stylelint-scss/blob/master/src/rules/selector-no-union-class-name/README.md) というルールがあるので、活用しましょう。

# 管理編

## 16. マージンはmargin-topおよびmargin-leftでつける

### 理由

1. **要素の関係性** でマージンを指定できるから。

### 詳しく

マージンは「要素の関係性」で生まれるものだと思っています。
どういうことかというと、「見出しとテキストの間は20px空けたくて、テキストとテキストの間は10pxにしたいんだよなー」とか。
`margin-top` （および `margin-left` ）で指定するルールを基本にしておけばこれを実現しやすいです。

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


## 17. 変更するつもりのないプロパティに指定をしない

※内容はだいぶ適当ですが、プロパティの書き方に注目してください。

```scss
// ❌NG
.Block {
    margin: 0 auto;
    background: linear-gradient(#fff, #000);
    transition: 0.2s all;
}
```

```scss
// ✅OK
.Block {
    margin-right: auto;
    margin-left: auto;
    background-image: linear-gradient(#fff, #000);
    transition-duration: 0.2s;
    transition-property: color;
}
```

### 理由

1. 意図せずスタイルを上書きしてしまう可能性があるから。

### 詳しく

上記のNG例では、すべてショートハンドの記法を使用していますが、これは実際には、以下のように解釈されます。
（Chromeのdevtoolで確認して貼り付けました）

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

このように、変更する気のないプロパティにまで値をセットしていると、別の場所で指定していた値を不要に上書きしてしまう可能性があります。
また、別の人が編集する際に、「このプロパティは意味があって指定しているのか、個別に書くのをめんどくさがっただけなのか」がわかりにくいです。
必要のあるプロパティだけ指定するようにしましょう。

## 18. transition-propertyをallにしない

`transition-property: opacity;` など、トランジションさせることを意図したプロパティのみを指定する。

### 理由

1. トランジションをかける意図のないプロパティまでトランジションさせてしまうため。

## 19. スタイルの上書き（カスケーディング）はできるだけ避ける（禁止はしない）

```scss
// ❌NG
.class {
    font-size: 16px;
    @media screen and (min-width: 768px), print {
        font-size: 20px;
    }
}
```

```scss
// ✅OK
.class {
    @media screen and (max-width: 767.98px) {
        font-size: 16px;
    }
    @media screen and (min-width: 768px), print {
        font-size: 20px;
    }
}
```

### 理由

1. カスケーディングが多くなるほど、記述がいつどこに影響するのか把握することが難しくなるため。


:::details 必ずしも上書きを禁止する必要はない、という例

```scss
// ✅OK
.Block {
    color: black;
    &.Block--green {
        color: green;
    }
    &.Block--blue {
        color: blue;
    }
}

// 上書きを完全になくそうとするとこうなるが、
// むしろデフォルトのスタイルの詳細度が上がってしまうため、こうはしなくていいと思う
.Block {
    &.Block--green {
        color: green;
    }
    &.Block--blue {
        color: blue;
    }
    &:not(.Block--green):not(.Block--blue) {
        color: black;
    }
}
```
:::

## 20. グローバルなz-indexは変数管理する

ここでは、
「特定のブロック内で前後関係を指定する場合のz-index（`position: absolute;`で配置した子要素など）」 を **「ローカルのz-index」** 、
「ページ全体の前後関係を指定する場合のz-index（追従ヘッダー、モーダルなど）」を **「グローバルのz-index」** と呼ぶことにします。

これはグローバルのz-indexについてのルールです。

```scss
// ❌NG
.Header {
    z-index: 10;
}
.Modal {
    z-index: 20;
}
```

```scss
// ✅OK
// global.scss
$z-index: (
  header: 10,
  modal: 20
);
// （簡略化のため、`@use` の記述省略）
.Header {
    z-index: map.get($z-index, header);
}
.Modal {
    z-index: map.get($z-index, modal);
}
```

### 理由

1.  `z-index` は前後関係を定義するものなので、他の数字がいくつかを把握した上で指定する必要がある。
2.  1箇所で管理することで、サイト全体で使用されている値を把握できるから。


上記は比較的シンプルな形ですが、より高機能な管理方法を提案している方もいました。
https://zenn.dev/attt/articles/manage-z-index-with-css-vars

## 21. ローカルのz-indexを指定するときは、親要素に `z-index: 0;`を指定する

### 理由

- スタッキングコンテキストを生成することで、子要素が親要素の外側に出ないようにするため。

### 詳しく

これについてはサンプルを見るのが早いと思いますので、こちらをスクロールしてみてください。

@[codepen](https://codepen.io/kagankan/pen/MWrXovG)

`header` は追従させてコンテンツより前に出すためz-indexを指定しています。
さらに、 `Danger` ブロックと `Safe` ブロックの子要素には各ブロック内の前後を指定するためにz-indexが指定されていて、不幸なことにこの数字が `header` よりも大きくなっています。
スクロールしてみると、 `Danger` ブロックの子要素が `header`よりも前に来てしまいます。

ここで、「z-indexの数字を制御すればいいのでは？」と思うかもしれませんが、それだと管理すべきz-indexが大量になってしまいます。
`Safe` ブロックには親である `.Safe` クラスに `z-index:0;` を指定していることで、スタッキングコンテキストを生成し、スコープを制限することができます。

z-indexとスタッキングコンテキストについて詳しくは以下の記事を参照してください（自分も正確に理解できてないですが・・！）
https://ics.media/entry/200609/

## 22. 色を管理する変数名は、無理に役割名をつけずに色そのものの名前にする

```scss
// ❌NG
$color-text: #000;
$color-text-sub: #333;
```

```scss
// ✅OK
$color-black: #000;
$color-mine-shaft: #333;
```

### 理由

1.  役割の区別に迷うが多いため。
2.  色名の命名は機械的に行うことができるため。

### 詳しく

「メインカラー」や「テキストカラー」など、役割で色を管理する方法がよくありますが、
この方法で管理しようとしても結局「ここでも同じ色使われてるけど役割としては同じ？違う？」とか、「ここのテキストだけ色を変えたい」など、管理しきれないパターンが発生することが経験としてよくありました。
なので無理に役割名でつけようとせず、色そのものの名前を採用することにしました。

### 色名の取得方法

色の命名には **Name That Color（VSCode拡張）** を使用しています。
https://marketplace.visualstudio.com/items?itemName=guillaumedoutriaux.name-that-color
カラーコードを範囲選択してコマンドを実行すると、それに対応した色名を出力してくれます。
また、そのままSass変数を作成するコマンドもあります。

このVSCode拡張以外でカラーコードに対して一意の名前をつける方法としては、 **htmlcsscolor.com** の色名を参照するのも一つの手段です。
https://www.htmlcsscolor.com/
例えばZennのプライマリーカラー `#3EA8FF` は `Summer Sky` という名前でした。
[HEX color #3EA8FF, Color name: Summer Sky, RGB(62,168,255), Windows: 16754750. - HTML CSS Color](https://www.htmlcsscolor.com/hex/3EA8FF)


## 23. 横方向のlinear-gradientは（to leftではなく）to rightにする

```scss
// ❌NG
.class {
    background-image: linear-gradient(to left, red, green);
}
```

```scss
// ✅OK
.class {
    background-image: linear-gradient(to right, green, red);
}
```

### 理由

1. コード上の並びと実際の表示の並びが同じになり、直感的に捉えやすいから。

細かい話ではありますが、コードは可能な限り直感的に捉えやすい記述にしておくことで、別の人（未来の自分を含む）が理解しやすくなります。

# アクセシビリティ・ユーザビリティ編

## 24. （前提知識）ブラウザの入力方法には3種類あることを理解する

具体的にどうする以前に、意識の話です。
Webブラウザの操作方法は以下の3種類があるということを認識しましょう。

- **マウス**（クリック、ホバー、ホイールなど）
- **タッチ**（タップ、スワイプなど）
- **キーボード**（Enterによるボタン押下, Tabによるフォーカス移動、矢印キーによるスクロールなど）

### 理由

（なぜこんなことを書いたのか、という理由です。）
世のWebサイトでは、マウス操作・タッチ操作は考慮されていても、 **「キーボード操作」** が考慮されていないことが多いから。
（具体的な実装については次の2つで触れてます。）

## 25. フォーカス時のoutlineを消さない

デザイン上見栄えが悪いという理由で、フォーカス時のアウトラインが消されることがありますが、これは絶対にやってはいけません。

```scss
// ❌NG
a:focus {
    outline: none !important;
}
```

### 理由

フォーカス時のアウトライン（フォーカスリングと呼ばれる）は、キーボードのTabキーの操作でフォーカスを移動した場合に、どこをフォーカスしているかを表示するためのもので、これを削除するとどこをフォーカスしているかわからなくなるから。

### どうすべきか

1.  outlineの代わりに、box-shadowなどでサイトのデザインに合わせたスタイルを当てる
2.  `what-input` を使用して、マウス操作・タッチ操作の場合にのみoutlineを消す

自分は後者の`what-input`による区別を使用しています。
`what-input`は、現在の入力方法を検出するJSライブラリです。
現在の入力方法に応じてhtmlタグに `data-whatinput` や `data-whatintent` というdata属性を付与されるので、これをもとにスタイルを決定できます。

https://www.npmjs.com/package/what-input

使用方法については以下の記事などが詳しいので、そちらを参照ください。
https://qiita.com/xrxoxcxox/items/82e083b3f47309873262
https://www.tam-tam.co.jp/tipsnote/html_css/post16551.html

## 26. inputタグをdisplay:noneしない

チェックボックスやラジオボタンのスタイリングをする際、 `input`タグを非表示にして`label`タグにスタイルを当てることがありますが、このとき`input`タグを `display:none` で **消してはいけません** 。

### 理由

`display: none` してしまうと、Tabキーによるフォーカスが不可能になり、 **キーボード操作が不可能** になるため。

### どうすべきか

`opacity: 0` などを使用します。
詳しい説明は以下の記事が詳しいので、そちらを参照ください。

https://qiita.com/Garyuten/items/b87b7d91279c0bded576


## 27. ホバースタイルの有無は画面幅ではなく `@media (hover: hover)` で切り替える

```scss
// ❌NG
.Button {
    @media screen and (min-width: 768px) {
        &:hover {
            background-color: red;
        }
    }
}
```

```scss
// ✅OK
.Button {
    @media (hover: hover) {
        &:hover {
            background-color: red;
        }
    }
}
```

### 理由

PCの画面幅だからといってマウス操作とは限らないし、
SPの画面幅だからといってタッチ操作とは限らないから。

### 詳しく

「マウスホバーに対してはホバーアクションさせるけど、タッチ操作のときはしない」という実装をしたい場合に、画面幅のメディアクエリで切り替えている例をよく見ます。
しかし、画面幅と操作方法はイコールではありません。

ホバー操作が可能な入力かどうかは `hover` メディアクエリで判定できます。
[hover - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/@media/hover)

ただし、これだとSurfaceなどのマウス操作も可能なタブレットPCでタッチ操作をしている場合にもhoverスタイルが当たってしまいます。
このようなケースにも正確に対応するためには、 `what-input`を使用する必要があります。
（とはいえ、タッチ操作にホバースタイルが当たっても操作不能になるわけではないので、多くの場合では `@media (hover: hover)` での対応で問題ないと思っています。）

## 28. pxではなくremで指定する

```scss
// ❌NG
p {
    font-size: 16px;
}
```

```scss
// ✅OK
html {
    font-size: 62.5%;
}

p {
    font-size: 1.6rem;
}
```

### 理由

1. **ブラウザのフォントサイズ変更機能** が適用されるから。
2. （rootが10pxになるように指定しておけば、pxを1/10するだけなので、実装も面倒ではないから）

文字サイズの変更機能などについては、以下の記事が詳しいので、そちらを参照ください。
https://shibajuku.net/font-size-still-relative/

## 29. メディアクエリは 1px ではなく0.02px で切り替える

```scss
// ❌NG
@media screen and (max-width: 767px) {
    // SP
}
@media screen and (min-width: 768px) {
    // PC
}
```

```scss
// ✅OK
@media screen and (max-width: 767.98px) {
    // SP
}
@media screen and (min-width: 768px) {
    // PC
}
```

### 理由

- 拡大率が100%以外の場合などに、画面サイズが小数点になることがあり、 **どちらのスタイルも当たらなくなることがある** ため。

### 詳しく

この値についてはBootstrapの実装を参考にしました。

>Why subtract .02px? ブラウザは現在、range context queriesをサポートしていません。そのため、min- and max- prefixesの制限や、小数の幅を持つビューポート（高 dpi のデバイスなど、特定の条件下で発生する可能性があります）を回避するために、より精度の高い値を使用しています。
>[Breakpoints (ブレイクポイント) · Bootstrap v5.0](https://getbootstrap.jp/docs/5.0/layout/breakpoints/)

ちなみに、0.01pxだと、丸められてしまったため、0.02pxが最適な値みたいです。

## 30. PCのメディアクエリにはprintをつける

```scss
// ❌NG
@media screen and (max-width: 767.98px) {
    // SP
}
@media screen and (min-width: 768px) {
    // PC
}
```

```scss
// ✅OK
@media screen and (max-width: 767.98px) {
    // SP
}
@media screen and (min-width: 768px), print {
    // PC
}
```

### 理由

- これをつけないと、ページの印刷時にメディアクエリで指定したスタイルが全く当たらなくなってしまい、表示が崩れるから。

### 詳しく

`screen and` をつけずに画面幅だけを指定すれば印刷時にも適切なスタイルが当たると思ったこともありました（Bootstrapなどのフレームワークでも`screen and`はつけていません）。
しかし、一般に印刷時の幅は500px～600pxくらいで判定されるため、大体の場合SP表示になってしまいます。印刷するとき出したいのは基本的にPC表示のレイアウトです。
そのため、 `screen and` をつけつつ、PC表示のスタイルにのみ `, print`　をつけるという対策を取ることとしました。

デジタルだけで活動している開発者の皆さんは「印刷なんかしない」なんて思ってるかもしれませんが、
紙に印刷したい人・印刷したい場面は（意外にも？）この世に多く発生します。

なお、この対応はあくまで **「崩壊を避ける」のみであって、「印刷表示を完璧にする」とは思っていません** 。
印刷時のスタイルというのは、ブラウザによっても挙動が異なり、本気で対応しようと思うと一筋縄ではいきません・・・。

# 最後に

あなたのCSSコーディングがより素晴らしいものになりますように。
そして世に生み出されるWebサイトがよりよいものでありますように。

