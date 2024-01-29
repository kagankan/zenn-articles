---
title: "自動修正可能なリポジトリ内だけのJSX ESLintルールをTypeScriptで書く"
emoji: "🔧"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "typescript", "eslint", "react"]
published: false
---

外部に公開する必要もなく、プロジェクト内だけで完結したルールを作りたい場合。

`eslint-plugin-local-rules` というプラグインを使うと、ルールをプロジェクト内に書くことができます。

https://www.npmjs.com/package/eslint-plugin-local-rules

TypeScript で書く場合は、ドキュメントにもあるように `ts-node` を使用します。

公式ドキュメントには `@types/eslint` を使うように書いてあるのですが、これが罠で、
型が貧弱なので使わないほうがいいです。

今回のケースで言うと、 `JSXAttribute` の型が入っていませんでした。

そこで何を使うかというと、 `@typescript-eslint/utils` です。

`@typescript-eslint/eslint-plugin` を使っているプロジェクトであればすでにインストールされているはずです。

さらに罠なのが、
`@typescript-eslint/utils` を import しようとすると、エラーになることです。これは Issue も立っており。tsconfig.json の設定を変更する必要があります。
今回は念のためプロジェクト全体の tsconfig.json は変えずに、ルールを書くディレクトリのみに設定を追加しました。

## 今日のゴール

弊社では Chakra UI を使っています。
`_hover` プロパティに `@media (hover: hover)` を適用したいときに、全体共通の設定をすることはできないため、個別に記述するしかありません。
これを検出・自動修正するルールを作ります。

これを

```tsx
<Button _hover={{ bg: "blue.500" }}>ボタン</Button>
```

こうします。

```tsx
<Button _hover={{ "@media (hover: hover)": { bg: "blue.500" } }}>ボタン</Button>
```

## ルールを書く

### meta

プロジェクト内で伝わるように書いておけば OK です。

### 適用する

一旦、すべての JSXAttribute に適用して、ルールが有効になっているか確認してみましょう。


### 対象のコードを特定する

https://typescript-eslint.io/play/

がおすすめです。

`ESTree` のタブを開いてみましょう。

### 自動修正機能を実装する

## 完成！

最終的なコードはこんな感じです。

<!-- ディレクトリ構成 -->
<!-- .eslintrc -->
<!-- local-rules/rules.ts -->

