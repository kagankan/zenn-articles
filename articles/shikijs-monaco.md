---
title: "@shikijs/monaco を使って Monaco Editor で JSX や Vue をお手軽シンタックスハイライト"
emoji: "🖌️"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["shiki", "monaco"]
published: true
---

[Markuplint Playground](https://playground.markuplint.dev/) の JSX (React), Vue, Svelte コードにシンタックスハイライトを追加したので、そこで使った `@shikijs/monaco` について紹介します。

![スクリーンショット。Vueのコードがシンタックスハイライトされていて、カラフル。](/images/shikijs-monaco/2024-05-28-23-16-05.png)

## Shiki とは

Shiki は今年（2024 年）の 2 月に v1 がリリースされたばかりの、比較的新しいシンタックスハイライトライブラリです。
内部では TextMate（VSCode と同じ文法）を使っているのが特徴です。

https://shiki.matsu.io/

シンタックスハイライトライブラリとしては [Prism](https://prismjs.com/) ([npm](https://www.npmjs.com/package/prismjs))や [highlight.js](https://highlightjs.org/) ([npm](https://www.npmjs.com/package/highlight.js)) などが有名ですが、これらのアップデートが停滞気味（Prism の最終更新が 2 年前、highlight.js は 8 ヶ月前（2024 年 5 月現在））なのに対し、Shiki は毎週ペースでアップデートが続いており、期待のライブラリです。

他の方のわかりやすい紹介記事も貼ってきおきます。

https://zenn.dev/funteractiveinc/articles/4ed268557a4796

## Monaco Editor とは

Monaco Editor は、VSCode に使われているコアパッケージです。
このパッケージを使用することで Web 上で VSCode のようなエディタを実装できます。

## Monaco Editor でのシンタックスハイライト

Monaco Editor では、 HTML, CSS, JavaScript, JSON あたりの言語にはシンタックスハイライトがデフォルトでサポートされていますが、それ以外の JSX, Vue などの言語はシンタックスハイライトがサポートされていません。

自前で追加するのも結構面倒で、[JSX ハイライトのライブラリ](https://www.npmjs.com/package/monaco-jsx-highlighter)はあったりしますが JSX 専用なので汎用的ではなかったり、[VSCode 用の TextMate ファイルを読み込ませる](https://zenn.dev/steelydylan/articles/vs-code-experience#3.-monaco-editor%E3%81%A7jsx%E3%82%92%E3%83%8F%E3%82%A4%E3%83%A9%E3%82%A4%E3%83%88%E3%81%99%E3%82%8B)ことはできるけどそもそも VSCode 向けに配布されている URL を探す必要があったり、記述量がやや多かったりと、どの方法もいまいちでした。

## @shikijs/monaco

そこで出てくるのが `@shikijs/monaco` です。
Shiki が提供しているライブラリで、Shiki のシンタックスハイライトを Monaco Editor で使えるようにしてくれます。

https://shiki.matsu.io/packages/monaco

ちなみに、「Shiki は VSCode と同じ TextMate を使っている」「Monaco Editor は VSCode のコア」と聞くとはじめから互換がありそうに聞こえますが、実は Monaco Editor のシンタックスハイライトは VSCode とは全く異なる実装になっているらしく ^[https://zenn.dev/link/comments/c2aa77f0f75f7e] 、変換が必要です。
その変換をやってくれるのが `@shikijs/monaco` というわけです。
ありがてえ～～。

これを使うとなんともお手軽に Monaco Editor にシンタックスハイライトを追加できます。
実装方法は[ドキュメント](https://shiki.matsu.io/packages/monaco)を参照されたし。なんですが、今回のケースでは `@monaco-editor/react` を使っているので、その実装を紹介しておきます。
Monaco Editor がマウントされたタイミングで `shikiToMonaco` を実行しています。

※以下のサンプルは関係する部分のみ抜き出して適当に省略しているのでイメージ程度に見てください。

```tsx:@monaco-editor/react と @shikijs/monaco を使ったシンタックスハイライトのサンプル
import MonacoEditor from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import { getHighlighter } from "shiki/bundle/web";

export const Editor = ({
  language,
}: {
  language: "jsx" | "tsx" | "vue" | "svelte";
}) => (
  <MonacoEditor
    language={language}
    theme="vs-dark"
    onMount={(editor, monaco) => {
      (async () => {
        const highlighter = await getHighlighter({
          theme: "dark-plus",
          langs: ["jsx", "tsx", "vue", "svelte"],
        });

        monaco.languages.register({ id: "jsx" });
        monaco.languages.register({ id: "tsx" });
        monaco.languages.register({ id: "vue" });
        monaco.languages.register({ id: "svelte" });

        shikiToMonaco(highlighter, monaco);
      })();
    }}
  />
);
```

## まとめ

`@shikijs/monaco` を使うことで、Monaco Editor に JSX, Vue, Svelte などのシンタックスハイライトをお手軽に追加できました。
Shiki には他にも `@shikijs/markdown-it`（markdown-it で使えるようにするプラグイン）や `@shikijs/twoslash`（TypeScript の拡張コメント記法に対応するプラグイン）などのプラグインが用意されており、拡張性も高く、他のライブラリとの連携もしやすくなっています。
今後の発展にも期待です 🤩
