---
title: "【Chrome 123】DevToolsのフォントが変わってしまった/変更したいときの対処法"
emoji: "🗛"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["chrome", "devtools"]
published: true
---

Chrome 123 にアップデートしたら、DevTools のフォントが MS ゴシックになってしまいました 😭（Windows の民）

![Chrome DevToolsのスクリーンショット。HTMLがMSゴシックのフォントで描画されている](/images/devtools-font-setting/2024-04-06-20-11-07.png)

というのも、Chrome 123 の更新で Chrome の設定を反映するように変更されたためのようです。
https://developer.chrome.com/blog/new-in-devtools-123?hl=ja#misc

フォントの設定方法を記載します。
大きく 2 種類あります。

## 方法1 Chrome の設定を変える

特にこだわりのない人はこちらの方法が簡単です。

1. Chrome の「設定」→「デザイン」→「フォントをカスタマイズ」( `chrome://settings/fonts` ) にアクセス
2. 「固定幅フォント」に使いたいフォントを変更
元のフォントがいい人は `Consolas` を選択すれば OK。

![Chromeの設定のスクリーンショット。「固定幅フォント」の項目で「Consolas」が選択されている。](/images/devtools-font-setting/2024-04-06-20-17-18.png)

これで DevTools に反映されます 🎉

![Chrome DevToolsのスクリーンショット。HTMLがConsolasのフォントで描画されている](/images/devtools-font-setting/2024-04-06-20-37-21.png)

DevTools 以外でも、等幅フォントが使われる場面ではこの設定が反映されるはずです。

## 方法2 DevTools の設定だけを変える

Chrome の設定は変えたくなくて、DevTools だけ変更したい人はこちらの方法で対応できます。
（ただし、実験的な機能を使っており、外部の拡張機能を使うため自己責任で。）

1. DevTools の設定→「Experiments」（日本語では「試験運用版」）→`Allow extensions to load custom stylesheets` にチェックを入れる。
2. Chrome 拡張機能「DevTools Font Changer」をインストール
https://chromewebstore.google.com/detail/devtools-font-changer/fikbcnlbgoafooldbkgikejejhaddajg
1. オプションでフォントを設定して、DevTools をリロードします。
