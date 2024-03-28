---
title: "【自動修正も可能】カスタムESLintルールをTypeScriptで書く（eslint-plugin-local-rules）"
emoji: "🔧"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "typescript", "eslint", "react"]
published: false
---

`eslint-plugin-local-rules` というプラグインを使うと、リポジトリ内で完結するルールを書くことができます。

https://www.npmjs.com/package/eslint-plugin-local-rules

## メリット

- プロジェクトメンバーがルールを共有しやすい
- 自動修正できるようにすることで、対応が楽
- 機械的にチェックできる
- message を指定することで、なぜこのルールがあるのかを説明できる
  - 特に新しいメンバーにもわかりやすい

## 前提条件

- ESLint のカスタムルールを作りたい
- 外部に公開する必要はなく、プロジェクト内だけで完結したルールを作りたい
- ルールを TypeScript で書きたい
- 自動修正機能をつけたい
- JSX を検出したい（※応用すれば JSX 以外も全然 OK）

## バージョン

- typescript: 5.3.3
- eslint: 8.54.0
- eslint-plugin-local-rules: 2.0.1
- @typescript-eslint/utils: 6.20.0

## 今日のゴール

※今回自分が作成したルールを例にしますが、適宜みなさんの検出したいコードに置き換えてください。

弊社では Chakra UI を使っています。
`_hover` props （CSS の `:hover` ）に `@media (hover: hover)` を適用したいときに、個別に記述するしかありません。

※どうして `@media (hover: hover)` が必要なのかは、[以前の記事](https://zenn.dev/kagan/articles/css-hover-style) を参照してください。

（全体共通の設定をすることができたらいいんですが）
これを検出・自動修正するルールを作ります。

```tsx:これを
<Button _hover={{ bg: "blue.500" }}>ボタン</Button>
```

↓

```tsx:こうする
<Button _hover={{ "@media (hover: hover)": { bg: "blue.500" } }}>ボタン</Button>
```

## カスタムルールの手順

### 1. フォルダ・index ファイルを作る

[ドキュメント](https://www.npmjs.com/package/eslint-plugin-local-rules) に従って、`eslint-local-rules` フォルダを作ります。
ここにカスタムルールのファイルを入れていきます。

TypeScript で書く場合は、ドキュメントにもあるように `ts-node` を使用します。
インストールされていなければインストールします。

```sh
npm install --save-dev ts-node
```

```js:eslint-local-rules/index.js
require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
  },
});

module.exports = require("./rules").default;
```

### 2. ルールを書く

ドキュメントには `@types/eslint` を使うように書いてあるのです **が、今回これは使いません。**

今回のケースで言うと、 `JSXAttribute` の型が入っておらず、全然型が推論されません。

代わりに、 `@typescript-eslint/utils` を使います。
`@typescript-eslint/eslint-plugin` を使っているプロジェクトであれば依存パッケージとしてすでにインストールされているはずですが、明示的にインストールしたい場合はインストールします。

```sh
npm install --save-dev @typescript-eslint/utils
```

今回は外部に公開するわけではないので、 `ESLintUtils.RuleCreator.withoutDocs` を使います。
これを使えばいい感じに型を推論してくれます。

まずは、「JSX の props 全てにエラーを出すルール」を作ってみて、ルールが有効になっているか確認してみましょう。

```ts:eslint-local-rules/rules.ts
import { ESLintUtils } from '@typescript-eslint/utils';

const rules = {
  'hover-prop-has-media-query': ESLintUtils.RuleCreator.withoutDocs({
    meta: {
      type: 'problem',
      messages: {
        // 検出されたときに表示したいメッセージ
        hoverPropHasMediaQuery: "JSXのpropsすべてがエラーになる検証用ルールです。",
      },
      schema: [],
    },
    defaultOptions: [],
    create: (context) => ({
      // 検出したいASTの種類を指定
      JSXAttribute: (node) => {
        context.report({
          node: node,
          // messagesのキーを指定
          messageId: 'hoverPropHasMediaQuery',
        });
      },
    }),
  }),
} as const;

export default rules;
```

:::details '@typescript-eslint/utils' の import でエラーが出る場合の対応

v6 以降では `@typescript-eslint/*` の import でエラーになるケースがあるようで、実際自分もエラーになりました。

https://github.com/typescript-eslint/typescript-eslint/issues/7284

上記の issue で書かれている通り、tsconfig.json の設定を変えることで解決しました。
今回は念のためプロジェクト全体の tsconfig.json は変えずに、ルールを書くディレクトリのみに設定を追加しました。

```json:eslint-local-rules/tsconfig.json
{
  "extends": "../tsconfig.json",
  // https://github.com/typescript-eslint/typescript-eslint/issues/7284
  "compilerOptions": {
    "baseUrl": "./",
    "module": "esnext",
    "moduleResolution": "Bundler"
  }
}
```

```js:eslint-local-rules/.eslintrc.js
module.exports = {
  root: true,
  extends: '../.eslintrc.json',
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
    },
  ],
};
```

:::

### 3. ルールを適用する

ESLint の設定ファイルに、今作ったルールを適用します。

```js:.eslintrc.js
module.exports = {
  plugins: ["local-rules"],
  rules: {
    "local-rules/hover-prop-has-media-query": "error",
  },
};
```

この段階でルールが有効になっているか確認してみましょう。
VSCode の場合は、設定ファイルを再読み込みさせるために、コマンドパレットから `ESLint: Restart ESLint server` を実行するか、VSCode を再起動すると確実です。

成功していれば、JSX のプロパティ全てがエラーになっているはずです。

### 4. 条件を書く

現時点では内容に関わらずすべての props をエラーにしてしまうので、条件を実装していきましょう。

今回検出したいのは以下のように、 `_hover` プロパティがあり、その値のオブジェクトのキーが `@media (hover: hover)` ではない場合です。

```tsx:エラーにしたいコード
<Button _hover={{ bg: "blue.500" }}>ボタン</Button>
```

```tsx:エラーにしたくないコード
<Button _hover={{ "@media (hover: hover)": { bg: "blue.500" } }}>ボタン</Button>
```

#### ESTree

ESLint では、 **ESTree** という[AST（抽象構文木）](https://ja.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E6%A7%8B%E6%96%87%E6%9C%A8) でコードを解釈しています。

詳しくは sosukesuzuki さんの記事がわかりやすいです。

https://sosukesuzuki.dev/advent/2022/06/

#### 対象のコードの AST(ESTree)を特定する

ESTree を見るには、typescript-eslint の Playground がおすすめです。

https://typescript-eslint.io/play/

`code` タブに、検出したいコードを入力し、右側の `ESTree` のタブを開いてみましょう。
このコードがどのような ESTree で解釈されれているかを確認できます。

![typescript-eslint Playgroundのスクリーンショット。左側に、<Button _hover={{ bg: "blue.500" }}>ボタン</Button>というコード、右側にこのコードのESTreeが表示されている。](/images/eslint-local-rules-typescript/2024-02-04-01-52-04.png)

これを見ると、
`JSXAttribute` のうち、 `name` が `_hover` で、 `value` が `JSXExpressionContainer` で、その中が `ObjectExpression` で、その中の `properties` を見ていって、 `key` の `name` が `@media (hover: hover)` でないものを検出すればよさそうです（超ざっくり）。

これをもとに、条件を書いていきます。
nodeの `type` を調べるといい感じに型が絞られていきます。

```diff ts:eslint-local-rules/rules.ts
- import { ESLintUtils } from '@typescript-eslint/utils';
+ import { ESLintUtils, AST_NODE_TYPES } from "@typescript-eslint/utils";

  const rules = {
    "hover-prop-has-media-query": ESLintUtils.RuleCreator.withoutDocs({
      meta: {
        type: "problem",
        messages: {
-         hoverPropHasMediaQuery: "JSXのpropsすべてがエラーになる検証用ルールです。",
+         hoverPropHasMediaQuery:
+           "_hoverプロパティは '@media (hover: hover)' で内包してください。タッチデバイスでホバースタイルを適用しないためです。",
        },
        schema: [],
      },
      defaultOptions: [],
      create: (context) => ({
        JSXAttribute: (node) => {
+         if (
+           node.name.name === "_hover" &&
+           node.value?.type === AST_NODE_TYPES.JSXExpressionContainer
+         ) {
+           const expression = node.value.expression;
+           if (expression.type === AST_NODE_TYPES.ObjectExpression) {
+             if (
+               expression.properties.some(
+                 (property) =>
+                   property.type === AST_NODE_TYPES.Property &&
+                   (property.key.type !== AST_NODE_TYPES.Literal ||
+                     property.key.value !== "@media (hover: hover)")
+               )
+             ) {
                context.report({
                  node: expression,
                  messageId: "hoverPropHasMediaQuery",
                });
+             }
+           }
+         }
        },
      }),
    }),
  } as const;

  export default rules;
```

これで再度リントを実行して、確認してみましょう。

### 5. 自動修正機能を実装する

`fix` メソッドを使います。
`meta` にも `fixable` を追加します。

```diff ts:eslint-local-rules/rules.ts
  import { ESLintUtils, AST_NODE_TYPES } from "@typescript-eslint/utils";
  
  const rules = {
    "hover-prop-has-media-query": ESLintUtils.RuleCreator.withoutDocs({
      meta: {
+       fixable: "code",
        type: "problem",
        messages: {
          hoverPropHasMediaQuery:
            "_hoverプロパティは '@media (hover: hover)' で内包してください。タッチデバイスでホバースタイルを適用しないためです。",
        },
        schema: [],
      },
      defaultOptions: [],
      create: (context) => ({
        JSXAttribute: (node) => {
          if (
            node.name.name === "_hover" &&
            node.value?.type === AST_NODE_TYPES.JSXExpressionContainer
          ) {
            const expression = node.value.expression;
            // 略
                context.report({
                  node: expression,
                  messageId: "hoverPropHasMediaQuery",
+                 fix: (fixer) => {
+                   const sourceCode = context.getSourceCode();
+                   const expressionText = sourceCode.getText(expression);
+                   const fixedPropertyText = `{ "@media (hover: hover)": ${expressionText} }`;
+                   return fixer.replaceText(expression, fixedPropertyText);
+                 },
                });
            // 略
          }
        },
      }),
    }),
  } as const;
  
  export default rules;
```

`eslint --fix` で自動修正ができるか確認してみましょう。

## 完成！

最終的なコードでは、三項演算子など、多少複雑なパターンにも対応させたのでそれも掲載しておきます。


:::details 完成したコード

```txt:ディレクトリ構成
├── eslint-local-rules/
│   ├── .eslintrc.js
│   ├── index.js
│   ├── rules.ts
│   └── tsconfig.json
├── src/
├── .eslintrc.js
└── tsconfig.json
```

```js:.eslintrc.js
module.exports = {
  plugins: ["local-rules"],
  rules: {
    "local-rules/hover-prop-has-media-query": "error",
  },
};
```

```ts:eslint-local-rules/index.js
require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
  },
});

module.exports = require("./rules").default;
```

```ts:eslint-local-rules/rules.ts
import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils, AST_NODE_TYPES } from '@typescript-eslint/utils';

const hasNoMediaQuery = (expression: TSESTree.ObjectExpression) =>
  expression.properties.some(
    (property) =>
      property.type === AST_NODE_TYPES.Property &&
      (property.key.type !== AST_NODE_TYPES.Literal ||
        property.key.value !== '@media (hover: hover)'),
  );

const rules = {
  'hover-prop-has-media-query': ESLintUtils.RuleCreator.withoutDocs({
    meta: {
      fixable: 'code',
      type: 'problem',
      messages: {
        hoverPropHasMediaQuery:
          "_hoverプロパティは '@media (hover: hover)' で内包してください。タッチデバイスでホバースタイルを適用しないためです。",
      },
      schema: [],
    },
    defaultOptions: [],
    create: (context) => ({
      JSXAttribute: (node) => {
        const report = (targetNode: TSESTree.Node) => {
          context.report({
            node: targetNode,
            messageId: 'hoverPropHasMediaQuery',
            fix: (fixer) => {
              const sourceCode = context.getSourceCode();
              const expressionText = sourceCode.getText(targetNode);
              const fixedPropertyText = `{ "@media (hover: hover)": ${expressionText} }`;
              return fixer.replaceText(targetNode, fixedPropertyText);
            },
          });
        };
        if (
          node.name.name === '_hover' &&
          node.value?.type === AST_NODE_TYPES.JSXExpressionContainer
        ) {
          const expression = node.value.expression;
          if (expression.type === AST_NODE_TYPES.ObjectExpression) {
            if (hasNoMediaQuery(expression)) {
              report(expression);
            }
          } else if (expression.type === AST_NODE_TYPES.ConditionalExpression) {
            if (
              expression.consequent.type === AST_NODE_TYPES.ObjectExpression &&
              hasNoMediaQuery(expression.consequent)
            ) {
              report(expression.consequent);
            }
            if (
              expression.alternate.type === AST_NODE_TYPES.ObjectExpression &&
              hasNoMediaQuery(expression.alternate)
            ) {
              report(expression.alternate);
            }
          } else if (expression.type === AST_NODE_TYPES.LogicalExpression) {
            if (
              expression.right.type === AST_NODE_TYPES.ObjectExpression &&
              hasNoMediaQuery(expression.right)
            ) {
              report(expression.right);
            }
          }
        }
      },
    }),
  }),
} as const;

export default rules;
```

以下、 `@typescript-eslint/utils` の import でエラーが出る場合の対応です。

```json:eslint-local-rules/tsconfig.json
{
  "extends": "../tsconfig.json",
  // https://github.com/typescript-eslint/typescript-eslint/issues/7284
  "compilerOptions": {
    "baseUrl": "./",
    "module": "esnext",
    "moduleResolution": "Bundler"
  }
}
```

```js:eslint-local-rules/.eslintrc.js
module.exports = {
  root: true,
  extends: '../.eslintrc.json',
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
    },
  ],
};
```

:::


https://zenn.dev/paiza/articles/create-typescript-eslint-custom-rule
