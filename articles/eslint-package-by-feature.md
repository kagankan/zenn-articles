---
title: "package by feature でのファイルの依存関係をルールで守る（eslint-plugin-boundaries）" #依存関係
emoji: "📁" #📁📦
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["eslint", "react", "nextjs", "javascript", "ディレクトリ構成"] #architecture
published: false
publication_name: "kikagaku"
---

**package by feature** と呼ばれるディレクトリ構成が一般的になってきました。^[https://zenn.dev/miyamonz/articles/fa0f77b6cecf61]

キカガクでも、新規に作成するプロジェクトでは package by feature を採用したり、既存のプロジェクトでも段階的に移行したりしています。
今回は、この **package by feature のディレクトリ分割を ESLint でルール化する方法**を考えてみます。

## package by feature とは

詳しい説明は他の記事に譲りますが、ざっくり言うと、ファイルの種別ではなく機能を基準にディレクトリを分けていくようなディレクトリ構成の方法です。
これにより、1 つの機能に関わるファイルがまとまる（＝コロケーション）ため、読むのも書くのも楽になります。

https://zenn.dev/miyamonz/articles/fa0f77b6cecf61
https://zenn.dev/pandanoir/articles/d74d317f2b3caf

## import ルールを設けたい

package by feature でディレクトリを構成する場合、**別の機能のファイルを import することは避けたい**です。
本来独立しているべき機能が依存関係を持つことで、コードの理解が難しくなったり、変更が難しくなったりします。
特に意識したいのは、「その機能を消したいとなったときに、フォルダをまるごと消してしまえるようにする」ということです。他の機能のディレクトリから import されてしまうと、それが難しくなります。

人間の目だけでチェックするには限界があるため、今回はこれを機械的にチェックするための ESLint ルールを設けます。

## 想定するディレクトリ構成

package by feature を前提としたディレクトリ構成にもいくつかの選択肢はあると思いますが、今回は以下のようなディレクトリ構成を想定します。

今回は、例として、features ディレクトリを作成し、その中に機能ごとにディレクトリを作成しています。

もしくは、Next.js で [App Router](https://nextjs.org/docs/app/building-your-application/routing) を採用している場合、`app` ディレクトリ自体が `features` ディレクトリの役割になります。
ちなみに、Next.js のドキュメントではコロケーションについても解説されており、参考になります。
https://nextjs.org/docs/app/building-your-application/routing/colocation

```
📁features
    🗃️_components
        📁Button
            📄index.tsx
            📄index.stories.tsx
    🗃️_hooks
        📄useUser.ts
    📁login
        🗃️_components
            📁LoginForm
                📄index.tsx
                📄index.stories.tsx
    📁profile
        🗃️_components
            📁ProfileForm
                📄index.tsx
                📄index.stories.tsx
        🗃️_hooks
            📄useProfile.ts
    📁posts
        🗃️_components
            📁PostList
                📄index.tsx
                📄index.stories.tsx
        🗃️_hooks
            📄usePagination.ts
```

- 📁 は feature ベースで分けたディレクトリ
- 🗃️（`_` から始まるディレクトリ）は layer ベースで分けたディレクトリ
- 📄 はファイル

を示しています。

- 機能ごとにディレクトリを分ける
- 機能ごとのディレクトリはネストして OK
- `_` で始まるディレクトリは、layer ベースで分けたディレクトリ

この構成では、`_`（アンダースコア）を特殊な役割として使っています。
`_` で始まるディレクトリは、そのディレクトリの持ち物として扱います。
例えば、`features/dashboard/_components` は、`features/dashboard` の機能で使うためのディレクトリです。

`_` を利用するアイデアは、[Next.js でプライベートディレクトリとして扱われる記号](https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders)であることから採用しています。

## import ルール

import ルールを以下のようにしたいです。

- 同じ機能のディレクトリ内では import 可能
- 異なる機能からは import 不可
- 親のディレクトリからは import できる
- 子のディレクトリからは import できない

これが守られていないと、「このディレクトリの中だけで使っているつもりで変更したのに、実は他の機能にも影響が出てしまった」ということが起こりかねません。

ルールに違反してしまうような import をしたくなった場合は、ファイルを上の階層に移動します。
これにより、スコープの広いファイルであることを示します。

## eslint-plugin-boundaries

`eslint-plugin-boundaries` を使って、この import ルールを設定します。
https://github.com/javierbrea/eslint-plugin-boundaries
https://www.npmjs.com/package/eslint-plugin-boundaries

:::details 試したけどうまくいかなかったものたち

他にもいくつかの ESLint plugin の利用を検討しましたが、採用しなかったものも参考として紹介します。

- [`eslint-plugin-import` の `no-restricted-paths` ルール](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-restricted-paths.md)
- [`eslint-plugin-strict-dependencies`](https://www.npmjs.com/package/eslint-plugin-strict-dependencies)

→ package by **layer** の構造なら適してそうだが、feature ベースの分け方だとうまく使えなかった

- [`eslint-plugin-import-access`](https://github.com/uhyo/eslint-plugin-import-access/blob/master/docs/rule-jsdoc.md)

→TypeScript の import 補完も制御してくれるので使いたかったが、これに合わせようとするとフォルダごとに `index.ts`（エントリーポイント）を作る必要があり、導入のコストが高いため断念

:::

## 実際の設定

動作を確認したバージョン

- eslint: 8.54.0
- eslint-plugin-boundaries: 4.2.0

Flat Config には対応していません。
ディレクトリの深さは 4 階層まで対応しています。それ以上増やす場合、設定を追加してください。

<!-- prettier-ignore-start -->

```js:.eslintrc.js
module.exports = {
  plugins: ["boundaries"],
  overrides: [
    {
      files: ["features/**/*"],
      settings: {
        "boundaries/elements": [
          {
            type: "features",
            pattern: "features/*/*",
            mode: "full",
            capture: ["dir1"],
          },
          {
            type: "features",
            pattern: "features/*/*/*",
            mode: "full",
            capture: ["dir1", "dir2"],
          },
          {
            type: "features",
            pattern: "features/*/*/*/*",
            mode: "full",
            capture: ["dir1", "dir2", "dir3"],
          },
          {
            type: "features",
            pattern: "features/*/*/*/*/**",
            capture: ["dir1", "dir2", "dir3", "dir4"],
          },
        ],
      },
      rules: {
        "boundaries/element-types": [
          "error",
          {
            default: "disallow",
            rules: [
              {
                from: "features",
                allow: [
                  [
                    "features",
                    { dir1: "_*" },
                  ],
                  [
                    "features",
                    { dir1: "${from.dir1}", dir2: "_*" },
                  ],
                  [
                    "features",
                    { dir1: "${from.dir1}", dir2: "${from.dir2}", dir3: "_*" },
                  ],
                  [
                    "features",
                    { dir1: "${from.dir1}", dir2: "${from.dir2}", dir3: "${from.dir3}", dir4: "_*" },
                  ],
                ],
              },
            ],
            message: "features配下のファイルは同じ機能内でのみimport可能です",
          },
        ],
      },
    },
  ],
};
```

<!-- prettier-ignore-end -->

### 解説

### settings

まずは `settings` でパスのキャプチャパターンを定義します。
例えば、以下の設定を抜き出して考えてみます。

```js
{
  type: "features",
  pattern: "features/*/*/*/*",
  mode: "full",
  capture: ["dir1", "dir2", "dir3"],
},
```

例えば、 `features/hoge/_components/Button/index.tsx` というファイルがある場合このパターンにマッチし、`features`という名前で扱われ、 `dir1` に `hoge`、`dir2` に `_components` 、`dir3` に `Button` がキャプチャされます。
これをあとのルールで参照します。

#### rules

`rules` でルールを設定します。
`default: "disallow"` によって、一旦すべての import を禁止し、`allow` で許可するパターンを設定しています。

```js
{
  from: "features",
  allow: [
    ["features", { dir1: "_*" }],
    ["features", { dir1: "${from.dir1}", dir2: "_*" }],
    [
      "features",
      { dir1: "${from.dir1}", dir2: "${from.dir2}", dir3: "_*" },
    ],
    [
      "features",
      { dir1: "${from.dir1}", dir2: "${from.dir2}", dir3: "${from.dir3}", dir4: "_*" },
    ],
  ],
},
```

`from` には import 元のディレクトリを指定します。

- `dir1` が `_*` にマッチする、つまり `_`から始まるフォルダ名である場合、どこからでも import できます。
  - `features/_components/Button/index.tsx` を import する場合などです。
- `dir1` が `${from.dir1}` 、つまり import 元と同じディレクトリで、`dir2` が `_` から始まるフォルダ名である場合 import できます。
  - `features/hoge/_components/List/index.tsx` から `features/hoge/_hooks/useList.ts` を import する場合などです。

ちなみに、 features→ 他のリポジトリ、他のリポジトリ →features という import は特に制限を設けていません。

## おまけ TIPS

VSCode の [`vscode-icons`](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons) 拡張機能を使っている場合、 `components` や `hooks` という名前のディレクトリに対して固有のアイコンが表示されます。しかし、 `_components` や `_hooks` のようにアンダースコアを付けてしまうとデフォルトのフォルダアイコンになってしまいます。
これらのディレクトリにも固有のアイコンを表示させるためには、`settings.json` に以下のように設定を追加します。

```json:settings.json
  "vsicons.associations.folders": [
    {
      "icon": "component",
      "extensions": ["_components", "_component"]
    },
    {
      "icon": "hook",
      "extensions": ["_hooks", "_hook"]
    },
    {
      "icon": "tools",
      "extensions": ["_utils", "_util"]
    }
  ],
```

## 参考記事

https://zenn.dev/miyamonz/articles/fa0f77b6cecf61
https://zenn.dev/pandanoir/articles/d74d317f2b3caf

https://speakerdeck.com/77web/ta-ren-gahayakudu-merukodowoshu-ku-tameni

https://qiita.com/honey32/items/dbf3c5a5a71636374567
https://zenn.dev/manalink_dev/articles/bulletproof-react-is-best-architecture#features%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%88%E3%83%AA
