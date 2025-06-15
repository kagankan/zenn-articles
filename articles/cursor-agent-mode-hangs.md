---
title: "Cursor のチャット (Agent Mode) でコマンド実行後に進まなくなる問題を解決した"
emoji: "✅️" 
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["cursor"]
publication_name: "kikagaku"
published: false
---

Cursor のチャット (Agent Mode) で、コマンド実行された後に進まなくなる事象に悩まされていました。
「Move to background」をすることで進むようになるという回避手段はあったのですが、全然根本的な解決になっていませんでした。

社内で相談したところ、以下の Cursor のフォーラムを教えてもらって解決しました。

https://forum.cursor.com/t/cursor-agent-mode-when-running-terminal-commands-often-hangs-up-the-terminal-requiring-a-click-to-pop-it-out-in-order-to-continue-commands/59969


要は `.zshrc` に存在する記述が干渉していたようです。
上記のフォーラムでは `ZSH_THEME` などが原因として挙げられていましたが、私の場合は Amazon Q のシェルスクリプトが原因でした。
（私の場合は `.zshrc` と `.zprofile` に記述がありました。）

[具体的な修正コードのコメント](https://forum.cursor.com/t/cursor-agent-mode-when-running-terminal-commands-often-hangs-up-the-terminal-requiring-a-click-to-pop-it-out-in-order-to-continue-commands/59969/37)を参考に、以下のようにしました。

冒頭に以下のようなコードを追加し、Agent Mode かどうかで分岐できるようにします。
`npm_config_yes` の存在によって Agent Mode か否かを判定します。

```sh
# https://forum.cursor.com/t/cursor-agent-mode-when-running-terminal-commands-often-hangs-up-the-terminal-requiring-a-click-to-pop-it-out-in-order-to-continue-commands/59969/37
if [[ -n "$npm_config_yes" ]] || [[ -n "$CI" ]] || [[ "$-" != *i* ]]; then
  export AGENT_MODE=true
else
  export AGENT_MODE=false
fi
```

その後、Cursor では実行したくない箇所に分岐を加えることで、Agent Mode でない場合には読み込まないようにして解決しました。

```diff
# Q pre block. Keep at the top of this file.
+ if [[ "$AGENT_MODE" != "true" ]]; then
  [[ -f "${HOME}/Library/Application Support/amazon-q/shell/zshrc.pre.zsh" ]] && builtin source "${HOME}/Library/Application Support/amazon-q/shell/zshrc.pre.zsh"
+ fi
```
