---
title: "Markuplint Playgroundをリニューアルしました"
emoji: "✨"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["html", "tailwindcss", "markuplint", "webcontainer"]
published: false
---


https://playground.markuplint.dev/


この記事では、使用技術の選定理由や、実装のポイントなどを紹介します。

## 主な機能

- HTMLコードを入力すると、Markuplintでチェックした結果が表示されます
- `.markuplintrc` の設定ファイルを変更できます
- 設定ファイルはGUIでも編集できます

## 主な使用技術

- [Tailwind CSS](https://tailwindcss.com/)
- [WebContainers](https://webcontainers.io/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Xterm.js](https://xtermjs.org/)
- Monaco Editor
- lz-string

## WebContainers

https://webcontainers.io/

Stylelint Demo の実装を参考にしました。

https://stylelint.io/demo/

https://github.com/stylelint/stylelint-demo

WebContainer API は、ブラウザ上でNode.js を動かすことができるサービスです。
MarkuplintはNode.js で動作するため、WebContainer API を使うことで、ブラウザ上でMarkuplint を動かすことができます。
ブラウザで動く部分のみを取り出し、実装することもできた（元々はそうだった）のですが、WebContainer API を使うことで、ローカル環境での動作とほぼ同一の環境で動かすことができます。


同様にブラウザ上でNode.jsを動かすことができる Sandpack というのもあるらしいのですが、事例があまり見つからず、WebContainer API を使うことにしました。

https://sandpack.codesandbox.io/


## Tailwind CSS

ゆうてんさんからの提案もあり、スタイリングには Tailwind CSS を採用しました。

https://tailwindcss.com/

特に困ることはありませんでした。

GitHub Copilot との相性がよく、コード補完されやすいのが楽でした。

### アイコン


## React

自分が書きやすいという理由と、ライブラリに困ることがないという理由で、React を採用しました。

## Vite

特に考えるまでもなく、Vite を採用しました。

https://vitejs.dev/

## Xterm.js

ブラウザ上でターミナルを実装するために、Xterm.js を採用しました。

https://xtermjs.org/

## Monaco Editor

ブラウザ上でエディタを実装するために、Monaco Editor を採用しました。

https://microsoft.github.io/monaco-editor/

## lz-string

URL にコードを埋め込むために、lz-string を採用しました。
ハッシュを圧縮しました。


## 今後の展望

