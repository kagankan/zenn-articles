---
title: "Storybook で jsdom いらずの快適インタラクションテストを書く (with Chromatic)"
emoji: "📚" #🧪
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["storybook", "chromatic", "react", "nextjs", "test"]
published: false
publication_name: "kikagaku"
---

## 比較表

## jsdom でのテストの問題点

もともとは、Storybook の `*.stories.tsx` を jest のテストファイル `*.test.tsx` で読み込んでテストを行っていました。 jsdom で行っていました。

しかし、ブラウザ上では起きない問題が起きていました。
モックも Storybook と jest 用にそれぞれ設定する必要があり煩雑でした。
特に、これが**ユーザーの環境では起きない問題であること**が対応したくない要因です。。

## Storybook でのインタラクションテスト

## 欠点

時間がかかる

ただし、欠点を補うほどのメリットがあると判断しています。

### カバレッジ
### a11yのテスト
### step関数が使えない

## モックの実装

API アクセスは MSW でのモックが可能ですが、
`storybook-addon-module-mock` を使ってモックを実装します。

### next/router, next/navigation のモック

`@storybook/nextjs/router.mock` と `@storybook/nextjs/navigation.mock` を使ってモックを実装します。
他の記事を参照してください。

## Chromatic でのテスト実行

`play` 関数が定義されていれば、勝手に実行してくれます。
スナップショット数は増えないので、追加のコストはかかりません（もし認識間違っていたら教えてください）。

弊社ではすでに VRT の目的で Chromatic を導入しているので、その流れでインタラクションテストも導入することになりました。

Chromatic を導入しない場合、test-runner で実行することも可能です。

## 参考記事

https://zenn.dev/sora_kumo/articles/43f399cc73c0f3
https://zenn.dev/sora_kumo/articles/820024503f018c
https://blog.cybozu.io/entry/2023/05/29/090000
https://developers.prtimes.jp/2023/05/02/storybook_and_tests/
https://zenn.dev/makotot/articles/b0729488282148
