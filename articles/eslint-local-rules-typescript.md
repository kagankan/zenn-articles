---
title: "【自動修正も可能】カスタムESLintルールをTypeScriptで書く（eslint-plugin-local-rules）"
emoji: "🔧"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "typescript", "eslint", "react"]
published: false
publication_name: "kikagaku"
---

チームで開発をする中で、特定の書き方を強制するために ESLint を使うことがあります。
どうしてもデフォルトのルールでは表現できない場合もありますが、そんなときはカスタムルールを作ることで対応できます。
今回は `eslint-plugin-local-rules` というプラグインを使って、リポジトリ内で完結するルールを書く方法を紹介します。

https://www.npmjs.com/package/eslint-plugin-local-rules

## この記事の概要

- **ESLint のカスタムルール**を作る
- 外部に公開 (npm publish) する必要はなく、**リポジトリ内だけで完結**させる
- ルールを **TypeScript** で書く
- **自動修正機能**をつける
- **JSX** を検出する

## ESLintルールを作ることのメリット

具体的な方法を説明する前に、なぜ開発ルールを ESLint ルールにすることが重要なのか確認しておきます。
コードを書く人が気をつければいいんじゃない？と思うこともあるのですが、ルールを作ることで多くのメリットがあります。

- 開発ルールに沿っているか、**機械的にチェックできる。**
  - 人間（実装者）が意識する必要がなくなり、より本質的なことに集中できる
  - 実装者の手間が減るだけでなく、レビューの手間も減る
- **ルール（`.eslintrc`）自体が開発ドキュメントになる。**
  - message に理由を書いておくことで、 **なぜこのルールがあるのかも説明できる**
  - プロジェクトメンバーがお互いにルールを共有しやすく、特に新しいメンバーにもわかりやすい
  - しかも、常に実行されるドキュメントなので、だれも見ていないという状況になりにくく、古くなりにくい
- 自動修正できると、**修正も楽**になる

## 動作確認したバージョン

- typescript: 5.3.3
- eslint: 8.54.0
- eslint-plugin-local-rules: 2.0.1
- @typescript-eslint/utils: 6.20.0

## 検出したいコード

:::message

必ずしも読者のあなたが求めているルールではないと思いますが、基本的な考え方は共通なので、適宜あなたの検出したいコードに置き換えていただければと思います。

:::


以下のコード（JSX）を検出・自動修正するルールを作ります。

```tsx:これを
// ❌ NG
<Button _hover={{ bg: "blue.500" }}>ボタン</Button>
```

```tsx:こうする
// ✅ OK
<Button _hover={{ "@media (hover: hover)": { bg: "blue.500" } }}>ボタン</Button>
```

### どうして検出したいのか

以前 [まだホバー時のスタイルを :hover だけで指定してるの？](https://zenn.dev/kagan/articles/css-hover-style) という記事にも書いた通り、 `:hover` を使用する際には `@media (hover: hover)` のメディアクエリを使うことでタッチデバイスで意図しないスタイルが当たることを避けたいです。

弊社のフロント実装では UI ライブラリに [Chakra UI](https://chakra-ui.com/) を使っています。
Chakra においては、CSS の `:hover` にあたる `_hover` props に `@media (hover: hover)` を入れることで表現でき、この書き方を強制したいです。
（Chakra の共通設定 (`chakra-config.ts`) でまとめて設定できないかと調べたのですが、無理でした）


## カスタムルールの手順

### 1. フォルダ・index ファイルを作る

`eslint-plugin-local-rule` をインストールします。

```sh
npm install --save-dev eslint-plugin-local-rules
```

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
なぜかというと型が全然足りていないからです。今回のケースで言うと、 `JSXAttribute` の型が入っておらず、全然型が推論されませんでした。

代わりに、 **`@typescript-eslint/utils`** を使います。
`@typescript-eslint/eslint-plugin` を使っているプロジェクトであれば依存パッケージとしてすでにインストールされているはずなので特にインストールは不要のはずです。明示的にインストールしたい場合はインストールします。

```sh
npm install --save-dev @typescript-eslint/utils
```

`@typescript-eslint` のカスタムルールの書き方は [typescript-eslintのドキュメント](https://typescript-eslint.io/developers/custom-rules/) に書かれています。
今回は外部に公開するわけではないので、 [`ESLintUtils.RuleCreator.withoutDocs`](https://typescript-eslint.io/developers/custom-rules/#undocumented-rules) を使います。
これを使えばいい感じに型を推論してくれます。

まずは、 **「JSX の props 全てにエラーを出すルール」** を作ってみて、ルールが有効になっているか確認してみましょう。
もし JSX を使っていない場合は、 `JSXAttribute` の代わりに `Identifier` にでもしてみてください（この場合、変数やプロパティなにもかもがエラーになるはずです）。

```ts:eslint-local-rules/rules.ts
import { ESLintUtils } from "@typescript-eslint/utils";

const rules = {
  "hover-prop-has-media-query": ESLintUtils.RuleCreator.withoutDocs({
    meta: {
      type: "problem",
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
          messageId: "hoverPropHasMediaQuery",
        });
      },
    }),
  }),
} as const;

export default rules;
```

ここで `"@typescript-eslint/utils"` の import がうまくいきませんでした。その場合は以下を参照してください。

:::details "@typescript-eslint/utils" の import でエラーが出る場合の対応

v6 以降では `@typescript-eslint/*` の import でエラーになるケースがあるようで、実際自分もエラーになりました。

https://github.com/typescript-eslint/typescript-eslint/issues/7284

上記の issue で書かれている通り、`tsconfig.json` の設定を変えることで解決しました。
今回は念のためプロジェクト全体の `tsconfig.json` は変えずに、ルールを書くディレクトリのみに設定を追加しました。

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
  extends: "../.eslintrc.json",
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: "./tsconfig.json",
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
コマンドで eslint を実行します。
VSCode のエディタ上で確認する場合は、設定ファイルを再読み込みさせるために、コマンドパレットから `ESLint: Restart ESLint server` を実行します（それでも適用されない場合、VSCode を再起動すると確実）。

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

これをどうやってコードで表現すればいいんでしょうか？

#### ESTree を確認する

ESLint では、 **ESTree** という[AST（抽象構文木）](https://ja.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E6%A7%8B%E6%96%87%E6%9C%A8) でコードを解釈しています。

ESTree について詳しくは sosukesuzuki さんの記事がわかりやすいです。

https://sosukesuzuki.dev/advent/2022/06/

#### 対象のコードの AST(ESTree)を特定する

ESTree を見るには、[typescript-eslint の Playground](https://typescript-eslint.io/play/) がおすすめです。

https://typescript-eslint.io/play/

`code` タブに、検出したいコードを入力し、右側の `ESTree` のタブを開いてみましょう。
このコードがどのような ESTree で解釈されているかを確認できます。

![typescript-eslint Playgroundのスクリーンショット。左側に、<Button _hover={{ bg: "blue.500" }}>ボタン</Button>というコード、右側にこのコードのESTreeが表示されている。](/images/eslint-local-rules-typescript/2024-02-04-01-52-04.png)

:::details コードとESTreeの全文（300行くらいあります）

```tsx:コード
<Button
  _hover={{
    bg: "blue.500"
  }}>ボタン</Button>
```

```json:ESTree
{
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "JSXElement",
        "openingElement": {
          "type": "JSXOpeningElement",
          "selfClosing": false,
          "name": {
            "type": "JSXIdentifier",
            "name": "Button",
            "range": [1, 7],
            "loc": {
              "start": { "line": 1, "column": 1 },
              "end": { "line": 1, "column": 7 }
            }
          },
          "attributes": [
            {
              "type": "JSXAttribute",
              "name": {
                "type": "JSXIdentifier",
                "name": "_hover",
                "range": [11, 17],
                "loc": {
                  "start": { "line": 2, "column": 2 },
                  "end": { "line": 2, "column": 8 }
                }
              },
              "value": {
                "type": "JSXExpressionContainer",
                "expression": {
                  "type": "ObjectExpression",
                  "properties": [
                    {
                      "type": "Property",
                      "key": {
                        "type": "Identifier",
                        "decorators": [],
                        "name": "bg",
                        "optional": false,
                        "range": [26, 28],
                        "loc": {
                          "start": { "line": 3, "column": 4 },
                          "end": { "line": 3, "column": 6 }
                        }
                      },
                      "value": {
                        "type": "Literal",
                        "value": "blue.500",
                        "raw": "\"blue.500\"",
                        "range": [30, 40],
                        "loc": {
                          "start": { "line": 3, "column": 8 },
                          "end": { "line": 3, "column": 18 }
                        }
                      },
                      "computed": false,
                      "method": false,
                      "optional": false,
                      "shorthand": false,
                      "kind": "init",
                      "range": [26, 40],
                      "loc": {
                        "start": { "line": 3, "column": 4 },
                        "end": { "line": 3, "column": 18 }
                      }
                    }
                  ],
                  "range": [19, 45],
                  "loc": {
                    "start": { "line": 2, "column": 10 },
                    "end": { "line": 4, "column": 3 }
                  }
                },
                "range": [18, 46],
                "loc": {
                  "start": { "line": 2, "column": 9 },
                  "end": { "line": 4, "column": 4 }
                }
              },
              "range": [11, 46],
              "loc": {
                "start": { "line": 2, "column": 2 },
                "end": { "line": 4, "column": 4 }
              }
            }
          ],
          "range": [0, 47],
          "loc": {
            "start": { "line": 1, "column": 0 },
            "end": { "line": 4, "column": 5 }
          }
        },
        "closingElement": {
          "type": "JSXClosingElement",
          "name": {
            "type": "JSXIdentifier",
            "name": "Button",
            "range": [52, 58],
            "loc": {
              "start": { "line": 4, "column": 10 },
              "end": { "line": 4, "column": 16 }
            }
          },
          "range": [50, 59],
          "loc": {
            "start": { "line": 4, "column": 8 },
            "end": { "line": 4, "column": 17 }
          }
        },
        "children": [
          {
            "type": "JSXText",
            "value": "ボタン",
            "raw": "ボタン",
            "range": [47, 50],
            "loc": {
              "start": { "line": 4, "column": 5 },
              "end": { "line": 4, "column": 8 }
            }
          }
        ],
        "range": [0, 59],
        "loc": {
          "start": { "line": 1, "column": 0 },
          "end": { "line": 4, "column": 17 }
        }
      },
      "range": [0, 59],
      "loc": {
        "start": { "line": 1, "column": 0 },
        "end": { "line": 4, "column": 17 }
      }
    }
  ],
  "comments": [],
  "range": [0, 63],
  "sourceType": "script",
  "tokens": [
    {
      "type": "Punctuator",
      "value": "<",
      "range": [0, 1],
      "loc": {
        "start": { "line": 1, "column": 0 },
        "end": { "line": 1, "column": 1 }
      }
    },
    {
      "type": "JSXIdentifier",
      "value": "Button",
      "range": [1, 7],
      "loc": {
        "start": { "line": 1, "column": 1 },
        "end": { "line": 1, "column": 7 }
      }
    },
    {
      "type": "JSXIdentifier",
      "value": "_hover",
      "range": [11, 17],
      "loc": {
        "start": { "line": 2, "column": 2 },
        "end": { "line": 2, "column": 8 }
      }
    },
    {
      "type": "Punctuator",
      "value": "=",
      "range": [17, 18],
      "loc": {
        "start": { "line": 2, "column": 8 },
        "end": { "line": 2, "column": 9 }
      }
    },
    {
      "type": "Punctuator",
      "value": "{",
      "range": [18, 19],
      "loc": {
        "start": { "line": 2, "column": 9 },
        "end": { "line": 2, "column": 10 }
      }
    },
    {
      "type": "Punctuator",
      "value": "{",
      "range": [19, 20],
      "loc": {
        "start": { "line": 2, "column": 10 },
        "end": { "line": 2, "column": 11 }
      }
    },
    {
      "type": "Identifier",
      "value": "bg",
      "range": [26, 28],
      "loc": {
        "start": { "line": 3, "column": 4 },
        "end": { "line": 3, "column": 6 }
      }
    },
    {
      "type": "Punctuator",
      "value": ":",
      "range": [28, 29],
      "loc": {
        "start": { "line": 3, "column": 6 },
        "end": { "line": 3, "column": 7 }
      }
    },
    {
      "type": "String",
      "value": "\"blue.500\"",
      "range": [30, 40],
      "loc": {
        "start": { "line": 3, "column": 8 },
        "end": { "line": 3, "column": 18 }
      }
    },
    {
      "type": "Punctuator",
      "value": "}",
      "range": [44, 45],
      "loc": {
        "start": { "line": 4, "column": 2 },
        "end": { "line": 4, "column": 3 }
      }
    },
    {
      "type": "Punctuator",
      "value": "}",
      "range": [45, 46],
      "loc": {
        "start": { "line": 4, "column": 3 },
        "end": { "line": 4, "column": 4 }
      }
    },
    {
      "type": "Punctuator",
      "value": ">",
      "range": [46, 47],
      "loc": {
        "start": { "line": 4, "column": 4 },
        "end": { "line": 4, "column": 5 }
      }
    },
    {
      "type": "JSXText",
      "value": "ボタン",
      "range": [47, 50],
      "loc": {
        "start": { "line": 4, "column": 5 },
        "end": { "line": 4, "column": 8 }
      }
    },
    {
      "type": "Punctuator",
      "value": "<",
      "range": [50, 51],
      "loc": {
        "start": { "line": 4, "column": 8 },
        "end": { "line": 4, "column": 9 }
      }
    },
    {
      "type": "Punctuator",
      "value": "/",
      "range": [51, 52],
      "loc": {
        "start": { "line": 4, "column": 9 },
        "end": { "line": 4, "column": 10 }
      }
    },
    {
      "type": "JSXIdentifier",
      "value": "Button",
      "range": [52, 58],
      "loc": {
        "start": { "line": 4, "column": 10 },
        "end": { "line": 4, "column": 16 }
      }
    },
    {
      "type": "Punctuator",
      "value": ">",
      "range": [58, 59],
      "loc": {
        "start": { "line": 4, "column": 16 },
        "end": { "line": 4, "column": 17 }
      }
    }
  ],
  "loc": {
    "start": { "line": 1, "column": 0 },
    "end": { "line": 6, "column": 0 }
  },
  "parent": null
}
```

:::

これを見ると、 `JSXAttribute` のうち、 `name` が `_hover` で、 `value` が `JSXExpressionContainer` で、その中が `ObjectExpression` で、その中の `properties` を見ていって、 `key` の `name` が `@media (hover: hover)` でないものを検出すればよさそうです（超ざっくり）。

これをもとに、条件を書いていきます。
node の `type` を調べるといい感じに型が絞られていきます。

```diff ts:eslint-local-rules/rules.ts
- import { ESLintUtils } from "@typescript-eslint/utils";
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
カスタムルールを書く際は、こんなふうに ESTree とにらめっこしながら条件を書いていきます。

### 5. 自動修正機能を実装する

`context.report` に `fix` メソッドを追加することで、自動修正を機能を加えることができます。
`meta` にも `fixable` プロパティを追加し、自動修正可能なことを知らせます。

```diff ts:eslint-local-rules/rules.ts
  import { ESLintUtils, AST_NODE_TYPES } from "@typescript-eslint/utils";
  
  const rules = {
    "hover-prop-has-media-query": ESLintUtils.RuleCreator.withoutDocs({
      meta: {
+       fixable: "code",
        type: "problem",
        messages: {
          hoverPropHasMediaQuery:
            "_hoverプロパティは "@media (hover: hover)" で内包してください。タッチデバイスでホバースタイルを適用しないためです。",
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

最終的なコードでは、三項演算子など、多少複雑なパターンにも対応させたので、上記で書いたものよりも長くなりました。
それも含めて全体像を掲載しておきます。


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
import type { TSESTree } from "@typescript-eslint/utils";
import { ESLintUtils, AST_NODE_TYPES } from "@typescript-eslint/utils";

const hasNoMediaQuery = (expression: TSESTree.ObjectExpression) =>
  expression.properties.some(
    (property) =>
      property.type === AST_NODE_TYPES.Property &&
      (property.key.type !== AST_NODE_TYPES.Literal ||
        property.key.value !== "@media (hover: hover)"),
  );

const rules = {
  "hover-prop-has-media-query": ESLintUtils.RuleCreator.withoutDocs({
    meta: {
      fixable: "code",
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
        const report = (targetNode: TSESTree.Node) => {
          context.report({
            node: targetNode,
            messageId: "hoverPropHasMediaQuery",
            fix: (fixer) => {
              const sourceCode = context.getSourceCode();
              const expressionText = sourceCode.getText(targetNode);
              const fixedPropertyText = `{ "@media (hover: hover)": ${expressionText} }`;
              return fixer.replaceText(targetNode, fixedPropertyText);
            },
          });
        };
        if (
          node.name.name === "_hover" &&
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
  extends: "../.eslintrc.json",
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: "./tsconfig.json",
      },
    },
  ],
};
```

:::


## 参考記事

https://zenn.dev/paiza/articles/create-typescript-eslint-custom-rule

https://tech.readyfor.jp/entry/2021/05/25/122617
