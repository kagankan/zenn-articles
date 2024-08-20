---
title: "package by feature なファイルの依存関係をルールで守る（eslint-plugin-boundaries）" #依存関係
emoji: "📁" #📁📦
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["eslint", "react", "nextjs", "javascript", "ディレクトリ構成"] #architecture
published: false
publication_name: "kikagaku"
---

**package by feature** と呼ばれるディレクトリ構成が一般的になってきました。^[https://zenn.dev/miyamonz/articles/fa0f77b6cecf61]

キカガクでも、新規に作成するプロジェクトでは package by feature なディレクトリ構成を採用したり、既存のプロジェクトを段階的に移行させたりしています。
今回は、この **package by feature のディレクトリ分割を ESLint でルール化する方法**を紹介します。

## package by feature とは

詳しい説明は他の記事に譲りますが、ざっくり言うと、ファイルの種別ではなく機能を基準にディレクトリを分けていくようなディレクトリ構成の方法です。
これにより、1 つの機能に関わるファイルがまとまる（＝コロケーション）ため、読むのも書くのも楽になります。

https://zenn.dev/miyamonz/articles/fa0f77b6cecf61
https://zenn.dev/pandanoir/articles/d74d317f2b3caf

## import ルールを設けたい

package by feature でディレクトリを構成する場合、基本的に**同じ機能の中で import が完結し、別の機能のファイルとは独立するはず**です。
本来独立しているべき機能が依存関係を持ってしまうと、コードの理解が難しくなったり、変更時に意図しない影響を生んでしまったりします。
個人的に意識しているのは、「**その機能（ディレクトリ）を消したいとなったときに、他の機能に影響がないことを担保する**」という考え方です。

これを人間の目だけでチェックするには限界があるため、今回はこれを機械的にチェックするための ESLint ルールを設けます。

## 想定するディレクトリ構成

package by feature を前提としたディレクトリ構成にもいくつかの選択肢はあると思いますが、今回は以下のようなディレクトリ構成を考えます。

```txt:今回想定するディレクトリ構成
📁src/features
 ├──🗃️_components
 │   └──📁Button
 │       ├──📄index.tsx
 │       └──📄index.stories.tsx
 ├──📁user
 │   ├──🗃️_components
 │   │   └──📁UserList
 │   │       ├──📄index.tsx
 │   │       └──📄index.stories.tsx
 │   ├──🗃️_hooks
 │   │   └──📄useUser.ts
 │   └──📁profile
 │       └──🗃️_components
 │           └──📁Edit
 │               ├──📄index.tsx
 │               └──📄index.stories.tsx
 └──📁post
     ├──🗃️_components
     │   └──📁PostList
     │       ├──📄index.tsx
     │       └──📄index.stories.tsx
     └──🗃️_hooks
         └──📄usePagination.ts
```

記事投稿サイトのようなイメージで、ユーザー関連の機能(`user`)と記事関連の機能(`post`)があるという想定です。
`features` ディレクトリを作成し、その中に機能ごとのディレクトリを作成しています。
Next.js で [App Router](https://nextjs.org/docs/app/building-your-application/routing) を採用している場合、`app` ディレクトリ自体を `features` ディレクトリの役割として利用できます（余談ですが、Next.js のドキュメントには[コロケーションについて解説しているページ](https://nextjs.org/docs/app/building-your-application/routing/colocation)もあり、参考になります）。

ここで、それぞれの絵文字は以下のような意味を示しています。

- 📁 は feature ベースで分けた機能ディレクトリ
- 🗃️（`_` から始まるディレクトリ）は layer ベースで分けたディレクトリ
- 📄 はファイル

### `_` の役割

この構成では、`_`（アンダースコア）に特殊な役割を持たせています。
`_` で始まるディレクトリは、**その機能ディレクトリの持ち物**として扱います。
例えば、以下のような説明ができます。

- `src/features/post/_hooks` は、`post` の機能で使うためのカスタムフックを入れるディレクトリ
- `src/features/user/profile/_components` は、`user/profile` の機能で使うためのコンポーネントを入れるディレクトリ
- `src/features/_components` は、全体で共通して使うコンポーネントを入れるディレクトリ

なお、 `_` を利用するアイデアは、[Next.js でプライベートディレクトリとして扱われる記号](https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders)であることから採用しています。

## import ルール

ここでは import ルールを以下のようにしたいです。

- ✅ 同じ機能のディレクトリ内では import OK
- ✅ 親のディレクトリからは import OK
- ❌ 異なる機能のディレクトリからは import NG
- ❌ 子のディレクトリからは import NG

![import ルールを示した図](/images/eslint-package-by-feature/figure.drawio.png)

これらを守ることで、「このディレクトリの中だけで使っているつもりだったのに、実は他のディレクトリでも使っていた！」という問題を避けられます。

## eslint-plugin-boundaries

`eslint-plugin-boundaries` の `boundaries/element-types` ルールを使って、前述の import ルールを設定します。

https://www.npmjs.com/package/eslint-plugin-boundaries

他にもいくつかのプラグインを検討しましたが、最終的に目的の動作を実現できるものとしてこれを選びました。

:::details （参考）試したもののうまくいかなかったプラグイン

- [`eslint-plugin-import` の `no-restricted-paths` ルール](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-restricted-paths.md)
- [`eslint-plugin-strict-dependencies`](https://www.npmjs.com/package/eslint-plugin-strict-dependencies)

上記 2 つは、 package by **layer** のディレクトリ構成であればルールを書きやすそうでしたが、feature ベースの分け方だとうまくルールを構成できず断念しました。

- [`eslint-plugin-import-access`](https://github.com/uhyo/eslint-plugin-import-access/blob/master/docs/rule-jsdoc.md)

TypeScript の import 補完も制御してくれる点も有用で、使いたい候補でした。しかし、これで検出できる形にしようとすると、フォルダごとに `index.ts`（エントリーポイントとなるファイル）を作る必要があり、導入のコストが高いため断念しました。

:::

## 実際の設定

動作を確認したバージョン

- eslint: 8.54.0
- eslint-plugin-boundaries: 4.2.0

:::message
Flat Config への対応は考慮していません。
:::

:::message
ディレクトリの深さは 4 階層まで対応しています。それ以上増やす場合、設定を追加してください。
:::

<!-- prettier-ignore-start -->

```js:.eslintrc.js
module.exports = {
  plugins: ["boundaries"],
  overrides: [
    {
      files: ["src/features/**/*"],
      settings: {
        "boundaries/elements": [
          {
            type: "features",
            pattern: "src/features/*/*",
            mode: "full",
            capture: ["dir1"],
          },
          {
            type: "features",
            pattern: "src/features/*/*/*",
            mode: "full",
            capture: ["dir1", "dir2"],
          },
          {
            type: "features",
            pattern: "src/features/*/*/*/*",
            mode: "full",
            capture: ["dir1", "dir2", "dir3"],
          },
          {
            type: "features",
            pattern: "src/features/*/*/*/*/**",
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

以降で設定の内容を補足します。

### `settings`

まずは `settings` でそれぞれのファイルパスのキャプチャパターンを定義します。
例えば、以下の設定を抜き出して考えてみます。

```js
{
  type: "features",
  pattern: "src/features/*/*/*/*",
  mode: "full",
  capture: ["dir1", "dir2", "dir3"],
},
```

例えば、 `src/features/user/_components/UserList/index.tsx` というファイルはこのパターンにマッチします。`type` に指定した `features`という名前で扱われ、 `dir1` に `user`、`dir2` に `_components` 、`dir3` に `UserList` がキャプチャされます（以下の表のように対応しています）。

|   **capture**    |       |            | `dir1` | `dir2`        | `dir3`     |             |
| :--------------: | ----- | ---------- | ------ | ------------- | ---------- | ----------- |
|   **pattern**    | `src` | `features` | `*`    | `*`           | `*`        | `*`         |
| **ファイルパス** | `src` | `features` | `user` | `_components` | `UserList` | `index.tsx` |

これをあとのルールで参照します。

### `rules`

`settings` で定義したキャプチャパターンを元に、 `rules` でルールを設定します。
`default: "disallow"` によって一旦すべての import を禁止し、`allow` で許可するパターンを設定しています。

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

例えば、以下のように import を記述した場合の挙動を考えてみます。

```tsx:src/features/user/_components/UserList/index.tsx
import { Button } from "features/_components/Button"; // ✅ 親からのimportはOK
import { useUser } from "features/user/_hooks/useUser"; // ✅ 同じ機能内からのimportはOK
import { usePagination } from "features/post/_hooks/usePagination"; // ❌ 異なる機能からのimportはNG
import { Edit } from "features/user/profile/_components/Edit"; // ❌ 子からのimportはNG
```

対象ファイルである `src/features/user/_components/UserList/index.tsx` のパスは `settings` の項目で説明した通り、 `dir1` に `user`、`dir2` に `_components` 、`dir3` に `UserList` がキャプチャされています。
この情報を `from.dir1` などで参照し、それぞれの import が許可されるかどうかを判定します。

|                                                                           | `dir1`        | `dir2`            | `dir3`             | `dir4`      | 結果                                                   |
| ------------------------------------------------------------------------- | ------------- | ----------------- | ------------------ | ----------- | ------------------------------------------------------ |
| **対象ファイル**                                                          | **`user`**    | **`_components`** | **`UserList`**     | `index.tsx` | -                                                      |
| `"（略）/_components/Button/index.tsx"`<br>（親からの import）            | `_components` | `Button`          | `index.tsx`        |             | ✅ **`{ dir1: "_*" }`** にマッチ                       |
| `"（略）/user/_hooks/useUser.ts"`<br>（同じ機能の import）                | `user`        | `_hooks`          | `useUser.ts`       |             | ✅ **`{ dir1: "${from.dir1}", dir2: "_*" }`** にマッチ |
| `"（略）/post/_hooks/usePagination.ts"`<br>（別の機能の import）          | `post`        | `_hooks`          | `usePagination.ts` |             | ❌ `dir1` が異なるため、いずれにもマッチしない         |
| `"（略）/user/profile/_components/Edit/index.tsx"`<br>（子からの import） | `user`        | `profile`         | `_components`      | `Edit`      | ❌ いずれにもマッチしない                              |

:::message

ちなみに、 `features`ディレクトリと他のディレクトリ間での import については特に制限を設けていません。

:::

## エラーになる import をしたくなったときの対応

例えば、 `post` だけで使用していた `usePagination.tsx` を `user` でも使いたくなった場合を考えみましょう。
以下のように import を書いてみると、設定したルールによりエラーになります。

```tsx:src/features/user/_components/UserList/index.tsx
import { usePagination } from "features/post/_hooks/usePagination"; // ❌ ESLint エラー
```

このような import を許してしまうと、本来独立しているはずの `src/features/user` と `src/features/post` が依存関係を持ってしまうため避けるべきです。

これを回避するには、以下のいずれかの方法を取ります。

- `usePagination.tsx` を `src/features/_hooks` に移動する
- `usePagination.tsx` を `src/features/user/_hooks` にも別で作成する

## おまけ TIPS （`vscode-icons`を使っている場合）

VSCode の [`vscode-icons`](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons) 拡張機能を使っている場合、 `components` や `hooks` という名前のディレクトリに対して固有のアイコンが表示されます。しかし、 `_components` や `_hooks` のようにアンダースコアを付けてしまうと判定から外れてしまい、デフォルトのアイコンになってしまいます。
これらのディレクトリにも固有のアイコンを表示させるためには、`settings.json` に以下のように設定を追加するとよいです。

```json:.vscode/settings.json
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

## まとめ

`eslint-plugin-boundaries` を使って、package by feature なディレクトリ構成での import ルールを設定しました。
これにより、ファイル間での import のルールを機械的にチェックでき、実装やレビューの負荷が下がります。
これを目視でチェックしようとすると脳のリソースを無駄に使うことになってしまい、見落としやすくもある内容であるため、ぜひ導入してみてください。

## 参考記事

https://zenn.dev/miyamonz/articles/fa0f77b6cecf61
https://zenn.dev/pandanoir/articles/d74d317f2b3caf

https://speakerdeck.com/77web/ta-ren-gahayakudu-merukodowoshu-ku-tameni

https://qiita.com/honey32/items/dbf3c5a5a71636374567
https://zenn.dev/manalink_dev/articles/bulletproof-react-is-best-architecture#features%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%88%E3%83%AA
