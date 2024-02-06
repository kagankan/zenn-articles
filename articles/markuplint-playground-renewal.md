---
title: "Markuplint Playground をリニューアルしたので機能や使用技術を紹介"
emoji: "✨"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["markuplint", "webcontainer"] #, "vite", "react", "tailwindcss"
published: true
---

先日 [Markuplint](https://markuplint.dev/ja/) の [v4 がリリース](https://twitter.com/markuplint/status/1754029763885457842)されました 🎉
それに合わせて **[Markuplint Playground](https://playground.markuplint.dev/)**（ブラウザ上でお試しできるページ）がリニューアルされました！（しました！）🎉

![Markuplint Playground のスクリーンショット](/images/markuplint-playground-renewal/2024-02-04-17-04-11.png)

https://playground.markuplint.dev/

実際触ってもらうのが一番わかりやすいと思うので、ぜひ触ってみてください。
（※ブラウザ上で `npm install` を実行する都合上、長いとローディングに 30 秒程度かかることがあります 🙏）

この記事では、機能や実装内容などを紹介します。

## 主な機能の紹介

そもそも **Markuplint** とは、[ゆうてんさん](https://zenn.dev/yusukehirao)が開発されている HTML の静的解析ツールです。
Markuplint 自体の詳細については、ドキュメントやその他の記事をご参照ください。

https://markuplint.dev/ja/

https://zenn.dev/azukiazusa/articles/start-syntax-checking-with-markuplint

### ブラウザで Markuplint が使えます

Markuplint（`markuplint` パッケージ）は本来 Node.js で動作するツールで、コマンドラインやエディタの拡張機能を通じて使用されますが、それをブラウザ上で動かしています。
入力された HTML を Markuplint でチェックし、エラーや警告があればエディタ上に下線で表示する（これ自体はリニューアル前からあった機能）ほか、画面下部に一覧表示します。

![Markuplint Playground のスクリーンショット。画面左上にあるHTMLコードの一部には赤い下線が引かれている。画面左下には「Error 文書型が必要です」などのエラーメッセージがいくつか表示されている。](/images/markuplint-playground-renewal/2024-02-04-17-04-11.png)

###  `.markuplintrc` （設定ファイル）を変更できます

設定ファイル用のエディタで `.markuplintrc`（設定ファイル）を編集できます。
ルールがどんなコードを検出するのか知りたいときや、プロジェクトの設定ファイルをカスタマイズする際に便利です。

![Markuplint Playground のスクリーンショット。画面左側の設定ファイルの内容が{"rules":{"attr-duplication":{"value":true,"severity":"warning"}}}に変更されている。画面右下にはattr-duplicationルールの警告が1件のみ表示されている。](/images/markuplint-playground-renewal/2024-02-04-18-16-27.png)

### 設定ファイルをフォームで編集できます

これ、個人的にイチオシ機能です 😊
設定ファイルの編集を「Visual」のタブに切り替えると、フォームで編集できます。
プリセットをチェックボックスで選択したり、ルールのオプションをセレクトボックスやテキストボックスでポチポチ変更できます。

![設定フォームのスクリーンショット。2 つのアコーディオンが縦に並んでおり、「Parser & Specs」のアコーディオンの中には「.html」が選択されたセレクトボックスがある。「Presets」のアコーディオンの中には「markuplint:recommended」など 7 つのチェックボックスが並んでいる。](/images/markuplint-playground-renewal/2024-02-05-01-24-10.png =350x)

![設定フォームのスクリーンショット。「label-has-control」、「landmark-roles」、「no-boolean-attr-value」の項目が縦に並んでおり、「label-has-control」の横に「true」が選択されたセレクトボックスがある。「landmark-roles」の横には「custom...」が選択されたセレクトボックスがあり、その下に詳細な設定項目のフォームが続いている。](/images/markuplint-playground-renewal/2024-02-04-23-48-31.png =350x)

@[tweet](https://twitter.com/kagan_dev/status/1754481060640158138)

### サンプルコードを用意しています

「Examples...」ボタンから、サンプルコード・サンプル設定を適用できます。
どんなことができるか知りたいときにぜひ。
「BEM (MindBEMding)」のサンプルなんかおすすめです。

![スクリーンショット。Choose an example という見出しのモーダルが表示されている。](/images/markuplint-playground-renewal/2024-02-04-22-35-33.png =300x)

### プラグインの読み込みに対応しています

Markuplint は [ReactなどHTML以外のテンプレートエンジン・フレームワークにも対応しています](https://markuplint.dev/ja/docs/guides/besides-html)。
こういった言語には別途パーサープラグインやスペックプラグインが必要ですが、Playground でもインストールできるように対応しました。

### バージョンの切り替えができます

バージョン名を表示しているボタンをクリックすると、現在使用しているパッケージバージョンを表示でき、セレクトボックスで切り替えられます。
（と言っても、現在は latest と next の切り替えのみ対応していて、しかも今は v4 がリリースされたばかりで next バージョンがないので切り替えても意味ありません）

### コード・設定ファイルをURLで共有できます

HTML コードや設定ファイルを編集すると URL ハッシュにその内容が埋め込まれます。
URL を共有することで、その状態を再現できます。

## 主な使用技術

### WebContainers (WebContainer API)

今回のメインは、 **[WebContainers](https://webcontainers.io/)** です。
詳しい説明は他の記事に譲りますが、簡単に言うとブラウザ上で Node.js 環境を動かすことができるシステムです。

https://zenn.dev/steelydylan/articles/webcontainers

WebContainers を使うというアイデア、および実装は [Stylelint Demo](https://stylelint.io/demo/) ([GitHub](https://github.com/stylelint/stylelint-demo)) を参考にしました（大感謝）。

WebContainers によってブラウザ上で Node.js 環境を実行し、その中で `markuplint` を実行しています。HTML ファイルや設定ファイルもこのコンテナ上に書き込んでいます。
ブラウザで動く機能のみを取り出して実装する選択肢もあった（元々はそうだった）のですが、WebContainers を使うことで実際の動作とほぼ同一の環境で動かすことができました。

同様にブラウザ上で Node.js を動かすことができる [Sandpack](https://sandpack.codesandbox.io/) というのもあるらしいのですが、使っている事例があまり見つからず、前例があって安心して使えそうな WebContainers を使うことにしました。

### React / TypeScript / Vite

単に自分が慣れているということと、エコシステムが発展していてライブラリに困ることがないという理由で、[React](https://react.dev/) を採用しました。
stylelint-demo がバニラ TS だったので、バニラという選択肢も考えはしましたが、宣言的に書けないときついのでやめました。

[TypeScript](https://www.typescriptlang.org/) はもはや当たり前ですが、静的型付けがないとやってられないので入れます。

新しく環境作るときは [Vite](https://vitejs.dev/) 一択ですね。
設定が最小限で済むので、環境構築が楽です。

### Xterm.js

コンソール出力の実装のために、 [Xterm.js](https://xtermjs.org/) というライブラリを使用しました。
エスケープシーケンスの含まれた文字列を正しく表示してくれます。
（ブラウザ上でターミナルが動いてるだけでなんかワクワクしますよね）

![](/images/markuplint-playground-renewal/2024-02-06-23-51-14.png)

最初これを自前実装しようとしていたのですが、途中で Xterm.js があることを知りました（気づけてよかった）。
今見たら、[WebContainers のチュートリアル](https://webcontainers.io/tutorial/6-connect-a-terminal)にも紹介されていたので、使うのが当たり前っぽい。

サイズを可変にするために `xterm-addon-fit` というプラグインがあるのですが、これを使うとどうにもうまくいかなかった（大きくなったり小さくなったりを繰り返して振動してしまうことがあった）ので、画面幅が狭いときは CSS をむりやり上書きして改行させています。
（自分の実装が悪いだけな気はするのでどうにかしたいところです。）

### Monaco Editor

HTML と設定ファイルのエディタ部分には、[Monaco Editor](https://microsoft.github.io/monaco-editor/) を使用しています。
ブラウザでのコーディング用エディタ実装のデファクトスタンダードな気がしますね。

React コンポーネントとして使用するため、`@monaco-editor/react` を使っています。

### Tailwind CSS

ゆうてんさんからの提案もあり、スタイリングには [Tailwind CSS](https://tailwindcss.com/) を採用しました。
個人的には生の CSS を書くのが割と好きなのであまり積極的ではなかったのですが、実際使ってみると、

- スコープが絞られることの安心感
- カスタマイズ性の高さ
- GitHub Copilot との相性がよく、コード補完されやすい
- フレームワークに非依存なので流用しやすい

など、メリットが多いと感じました。

#### アイコン

Tailwind でアイコンを使用するため、 [`@egoist/tailwindcss-icons`](https://github.com/egoist/tailwindcss-icons) を導入しました。アイコンライブラリを好きに追加できるのでめちゃ便利でした。

https://zenn.dev/hayato94087/articles/1abcb002d1e254

### Headless UI

ポップオーバーとタブ切り替えの実装には、 [Headless UI](https://headlessui.com/) を使っています。
自前実装してもよかったのですが、タブ UI 実装時の `aria-selected` 指定など細かい実装をわざわざ自前で作るよりは既存のライブラリに任せたほうが安全だろうという判断です。

ポップオーバーについては [ポップオーバーAPI](https://developer.mozilla.org/ja/docs/Web/API/Popover_API) が安定して使えるようになったらそっちに置き換えたいですね。
タブ UI についてもそろそろウェブ標準で実装されませんかねー？　🤔

### lz-string

URL ハッシュにコードと設定ファイルの情報を埋め込む際に、 [`lz-string`](https://www.npmjs.com/package/lz-string) を採用しました。文字列圧縮のライブラリです。
これは[typescript-eslintのPlayground](https://typescript-eslint.io/play/)で使用されていたのを参考にしました。

たとえば、デフォルトで読み込まれるサンプルコード+設定ファイルは合わせて **1512 文字**（厳密にはキーや他の情報もあるのでもうちょい多い）ですが、lz-string で圧縮すると **1226 文字**にまで抑えられていました。

### react-split

画面分割のために [`react-split`](https://www.npmjs.com/package/react-split) を使用しました。
状況に応じて領域を大きくしたり小さくしたりできます。

## その他の実装について

### ルール設定のフォーム編集（JSON Schemaの読み込み）

前提として、Markuplint の設定ファイルが受け入れる構造は、[JSON Schema](https://json-schema.org/) で定義されています（[`invalid-attr` ルールの例](https://raw.githubusercontent.com/markuplint/markuplint/main/packages/%40markuplint/rules/src/invalid-attr/schema.json)）。
ルールのオプションをフォームで編集できる部分は、この JSON Schema の情報をもとに構築しています（実装は[ゆうてんさんが作成されていたコード](https://github.com/markuplint/markuplint/pull/214/files#diff-5d6556db76156db151470ce74723eafebc5fca85360c1a2f7a315169a3280899) をベースに使わせていただきました 🙏）。

スキーマの `type` でコンポーネントを分岐させていき、 `type` が `boolean` なら true か false を選ばせるセレクトボックスを表示、 `string` ならテキストボックスを表示、`object` ならさらにネスト…といった具合です。
https://github.com/markuplint/markuplint/blob/dev/playground/src/components/RuleConfig.tsx

### 画面構成に関する検討

画面上の要素配置には結構悩みました…。

今回のリニューアルでは、以下の要素を 1 画面内に配置しました。
（ここでの説明のために、実際には明示的にラベルをつけていないものにも便宜的に命名しています。）

- **「Code」**：HTML を入力するエディタ
- **「Config」**：設定ファイルを編集するエディタ
  - **「JSON」**：エディタでの JSON 編集
  - **「Visual」**：フォームでのビジュアル編集
- **「Problems」**：エラーや警告の一覧
- **「Examples」**：サンプルコードの適用
- **「Packages」**：インストールされているパッケージとバージョンの表示、バージョンの切り替え
- **「Console」**：コンソール出力の表示
- **「Status」**：リントが正常に完了しているのか、エラーが起きているのかの表示

![Markuplint Playgroundのスクリーンショット。それぞれの要素の名前が書き込まれている。画面全体の左上の領域が「Code」、左下の領域が「Problems」、右側の領域が「Config」に分割されている。画面右上に「Examples」のボタンがある。画面左下に「Status」「Console」「Packages」が並んでいる。](/images/markuplint-playground-renewal/2024-02-06-05-06-46.png)

これらを配置する上で以下のようなことを考慮しました。

- このアプリケーションのメインは「Code」「Config」「Problems」であるため、これらをメインに配置して、アクセス時にもすぐ目に入るようにしたい
- 「Problems」は「Code」に紐づく関係にある
- 「Code」と「Config」は並べて見たいケースがある（Code に検出したいコードを書いて、それを見ながら Config を編集するなど）
- 一方で、「Code」および「Config」のエディタは、編集のしやすさのために領域を大きくしたい

→ 左上に「Code」、左下に「Problems」、右に「Config」を並べて画面の基本的な構成とする。
領域の大きさについては、必要に応じてドラッグで大きさを変えられるようにすることで解決。

- 「Config」の、JSON エディタとビジュアルエディタは入力方法の切り替えであり、同時に見える必要はない。

→ タブ切り替えで実装し、どちらか一方が表示されるようにする。

- 「Examples」は、選択することで Code と Config が上書きされるため、
  - サンプルコードを選ぶ最中に Code と Config を見る必要はない
  - 選択した後は Code と Config を見てほしい

→ モーダルにして、選ぶときは背景から集中をそらし、選択後はモーダルを閉じて Code と Config を見せるようにする。

- 「Console」は、 Playground の機能に直接影響するものではない。最悪なくても成立する。だけど、エラーがあるときには見たい。

→ 必要なときだけ開けばいいので、ポップオーバーで表示。目立つ必要もないので、画面下部に小さく配置。

- 「Status」は常に見えるところにいてほしい、けど主張は強くなくていい
- エラーが発生しているときは、「Console」にその内容が表示されている場合もある

→ 画面下部、Console の横に小さく配置。

- 実際にコーディングで Markuplint を使う場合は、VSCode を使っているユーザーが多いはず（VSCode 拡張が提供されているため）なので、できるだけその体験に近づけたい

→ 上に「Code」、下に「Problems」の配置は VSCode の配置を意識。
→「Packages」や「Status」の表示も、VSCode のステータスバーを参考に配置。

そしてできあがった画面構成が、現在の形です。

参考までに、これらの考えがまとまるまでに作っていたボツ案も載せておきます。

:::details ボツ案のスクリーンショット

**製作途中のスクリーンショット 1。**
Stylelint Demo を参考に、
上に「Code」「Config」「Dependencies(Packages)」をタブ切り替えで、
下に「Problems」「Console」をタブ切り替えで配置していた。
縦積みなので、領域が狭い。
![製作途中のスクリーンショット1。](/images/markuplint-playground-renewal/2024-02-05-01-10-23.png)

**製作途中のスクリーンショット 2**
右側に「Code」と「Problems」/「Console」のタブ切り替え、左側にそれ以外を並べていた（めちゃめちゃ作業途中で、スタイリングもできていない状態）。
左側の領域がごちゃっとしており、強弱が分かりづらい。
![製作途中のスクリーンショット2。](/images/markuplint-playground-renewal/2024-02-05-01-12-02.png)

:::

### 直感的に理解できるための工夫

- 言語切替を実装しなかったためラベルはすべて英語で表記していますが、できるだけ言語によらずに理解できるように、主要な要素にはアイコンを使っています。
- フォームでの設定ファイル編集は、見た目が JSON の構造と近くなるよう、コロン（`:`）とインデントで表現しています。

![設定フォームのスクリーンショット。](/images/markuplint-playground-renewal/2024-02-04-23-48-31.png =320x)

## 今後の展望

どこまで手が回るかはわかりませんが…、もう少し改善したいところとしてはこのへんです。

- 他の言語（Pug, PHP, Astro, …）への対応
- React 等 HTML 以外の言語のシンタックスハイライト
- バージョン選択（latest/next だけでなく、特定のバージョンを選択できるように）
- ローディングが遅い問題の解決（パッケージインストールに 30 秒程度かかることがある。どうにかできるかは不明）
- `nodeRules`, `childNodeRules` のフォーム編集サポート

## おわりに

Markuplint Playground、自分がほしいものを詰め込んで作りました。
ちょっと HTML の構文チェックを行いたい、というときに便利だと思いますので、ぜひ使ってもらえると嬉しいです。
バグなどいくらでもあると思うので、Issue や Pull Request お待ちしています。

そして何より、日々のフロントエンド開発に Markuplint をぜひ導入しましょう！

## 参考にさせていただいたPlaygroundサイト

- [Demo | Stylelint](https://stylelint.io/demo/)
- [ESLint Playground - ESLint - Pluggable JavaScript Linter](https://eslint.org/play/)
- [Playground | typescript-eslint](https://typescript-eslint.io/play/)
- [TypeScript: TS Playground - An online editor for exploring TypeScript and JavaScript](https://www.typescriptlang.org/play)
- [Hello world • Svelte Examples](https://svelte.jp/examples/hello-world)
- [Prettier v3.0.3](https://prettier.io/playground/)
- [Online FlowChart & Diagrams Editor - Mermaid Live Editor](https://mermaid.live/edit)
- [TSLint Playground](https://palantir.github.io/tslint-playground/)
