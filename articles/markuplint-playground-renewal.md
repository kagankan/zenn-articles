---
title: "Markuplint Playground をリニューアルしたので機能や使用技術を紹介"
emoji: "✨"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["markuplint", "webcontainer"] #, "vite", "react", "tailwindcss"
published: false
---

先日 [Markuplint](https://markuplint.dev/ja/) の [v4 がリリース](https://twitter.com/markuplint/status/1754029763885457842)されました 🎉
それに合わせて **[Markuplint Playground](https://playground.markuplint.dev/)** （ブラウザ上でお試しできるページ）がリニューアルされました！（しました！） 🎉

![Markuplint Playground のスクリーンショット](/images/markuplint-playground-renewal/2024-02-04-17-04-11.png)

https://playground.markuplint.dev/

実際触ってもらうのが一番わかりやすいと思うので、ぜひ触ってみてください。
（※ブラウザ上で `markuplint` パッケージをインストールする都合上、長いとローディングに30秒程度かかることがあります 🙏）

この記事では、機能や実装内容などを紹介します。

## 主な機能の紹介

そもそも **Markuplint** とは、[ゆうてんさん](https://zenn.dev/yusukehirao)が開発している HTML の静的解析ツールです。
Markuplint 自体の詳細については、ドキュメントやその他の記事をご参照ください。

https://markuplint.dev/ja/

https://zenn.dev/azukiazusa/articles/start-syntax-checking-with-markuplint

### ブラウザでMarkuplintが使えます

Markuplint は本来 Node.js で動作するツールで、コマンドラインやエディタの拡張機能を通じて使用されますが、それをブラウザ上で動かしています。
入力されたHTMLをMarkuplintでチェックし、エラーや警告があればエディタ上に下線で表示する（これは以前からあった機能）ほか、「Problems」に一覧表示します。

![Markuplint Playground のスクリーンショット。画面左上にあるHTMLコードの一部には赤い下線が引かれている。画面左下には「Error 文書型が必要です」などのエラーメッセージがいくつか表示されている。](/images/markuplint-playground-renewal/2024-02-04-17-04-11.png)

###  `.markuplintrc` （設定ファイル）を変更できます

設定ファイル用のエディタで `.markuplintrc` （設定ファイル）を編集できます。
ルールがどんなコードを検出するのか知りたいときや、プロジェクトの設定ファイルをカスタマイズする際に便利です。

![Markuplint Playground のスクリーンショット。画面左側の設定ファイルの内容が{"rules":{"attr-duplication":{"value":true,"severity":"warning"}}}に変更されている。画面右下にはattr-duplicationの警告が1件のみ表示されている。](/images/markuplint-playground-renewal/2024-02-04-18-16-27.png)

### 設定ファイルをフォームで編集できます

これ、個人的にも一番嬉しい機能です 😊
設定ファイルの編集を「Visual」に切り替えると、フォームで編集できます。
プリセットをチェックボックスで編集できたり、ルールの有効・無効、オプションをセレクトボックスやテキストボックスで変更できます。

![設定フォームのスクリーンショット。](/images/markuplint-playground-renewal/2024-02-05-01-24-10.png =400x)

![設定フォームのスクリーンショット。](/images/markuplint-playground-renewal/2024-02-04-23-48-31.png =400x)

### サンプルコードを用意しています

「Examples...」ボタンから、サンプルコード・サンプル設定を適用できます。
どんなことができるか知りたいときにぜひ。
「BEM (MindBEMding)」 のサンプルなんかおすすめです。

![スクリーンショット。Choose an exampleという見出しのモーダルが表示されている。](/images/markuplint-playground-renewal/2024-02-04-22-35-33.png =400x)

### プラグインの読み込みに対応しています

Markuplintは [ReactなどHTML以外のテンプレートエンジン・フレームワークにも対応しています](https://markuplint.dev/ja/docs/guides/besides-html)。
こういった言語には別途パーサープラグインやスペックプラグインが必要ですが、Playgroundでもインストールできるように対応しました。

### バージョンの切り替えができます

バージョン名を表示しているボタンをクリックすると、現在使用しているパッケージバージョンを表示でき、セレクトボックスで切り替えられます。
（と言っても、現在はlatestとnextの切り替えのみ対応していて、しかも今はv4がリリースされたばかりでnextバージョンがないので切り替えても意味ありません）

### コード・設定ファイルをURLで共有できます

HTMLコードや設定ファイルを編集するとURLハッシュにその内容が埋め込まれます。
URLを共有することで、その状態を再現できます。

## 主な使用技術

### WebContainers (WebContainer API)

今回のメインは、 **[WebContainers](https://webcontainers.io/)** です。
詳しい説明は他の記事に譲りますが、簡単に言うとブラウザ上でNode.js 環境を動かすことができるシステムです。

https://zenn.dev/steelydylan/articles/webcontainers

WebContainers を使うというアイデア、および実装は [Stylelint Demo](https://stylelint.io/demo/) ([GitHub](https://github.com/stylelint/stylelint-demo)) を参考にしました（感謝）。

WebContainers によってブラウザ上でNode.js環境を実行し、その中で `markuplint` を実行しています。HTMLファイルや設定ファイルもNode上に書き込んでいます。
ブラウザで動く機能のみを取り出して実装することもできた（元々はそうだった）のですが、WebContainers を使うことで実際の動作とほぼ同一の環境で動かすことができました。

同様にブラウザ上でNode.jsを動かすことができる [Sandpack](https://sandpack.codesandbox.io/) というのもあるらしいのですが、使っている事例があまり見つからず、前例があって安心して使えそうな WebContainers を使うことにしました。

### React / TypeScript / Vite

単に自分が慣れているということと、エコシステムが発展していてライブラリに困ることがないという理由で、[React](https://react.dev/) を採用しました。
stylelint-demoがバニラTSだったので、バニラという選択肢も考えはしましたが、宣言的に書けないときついのでやめました。

[TypeScript](https://www.typescriptlang.org/) ももはや当たり前ですが、型があると安心です。

近年のフロントエンド開発は [Vite](https://vitejs.dev/) 一択だと思います。
設定がほとんどないので、環境構築が楽です。

### Xterm.js

コンソール出力の実装のために、 [Xterm.js](https://xtermjs.org/) というライブラリを使用しました。
エスケープシーケンスの含まれた文字列を正しく表示してくれます。

（最初これを自前実装しようとしていたのですが、途中で Xterm.js があることを知りました。
今見たら、[WebContainers のチュートリアル](https://webcontainers.io/tutorial/6-connect-a-terminal)にも紹介されていたので、使うのが当たり前っぽい。）

サイズを可変にするために `xterm-addon-fit` というプラグインがあるのですが、これを使うとどうにもうまくいかなかった（大きくなったり小さくなったりを繰り返して振動してしまうことがあった）ので、CSSをむりやり上書きして改行させています。
（自分の実装が悪いだけな気はするのでどうにかしたいところです。）

### Monaco Editor

HTMLと設定ファイルのエディタ部分には、[Monaco Editor](https://microsoft.github.io/monaco-editor/) を使用しています。
ブラウザでのエディタ実装といえばこれ、のデファクトスタンダードな気がしますね。

Reactコンポーネントとして使用するため、`@monaco-editor/react` を使っています。

### Tailwind CSS

ゆうてんさんからの提案もあり、スタイリングには [Tailwind CSS](https://tailwindcss.com/) を採用しました。
個人的にはCSSを書くのが好きなので最初は懐疑的でしたが、
実際使ってみるとスコープが絞られることの安心感がありますし、
GitHub Copilot との相性がよく、コード補完されやすいのも楽でした。

#### アイコン

Tailwindでアイコンを使用するとき、 [`@egoist/tailwindcss-icons`](https://github.com/egoist/tailwindcss-icons) が便利でした。

https://zenn.dev/hayato94087/articles/1abcb002d1e254

### Headless UI

ポップオーバーとタブ切り替えの実装には、 [Headless UI](https://headlessui.com/) を使っています。
自前実装してもよかったのですが、タブUI実装時の `aria-selected` 指定など細かい実装をわざわざ自前で作るよりは既存のライブラリに任せたほうが安全だろうという判断です。

ポップオーバーについては [ポップオーバーAPI](https://developer.mozilla.org/ja/docs/Web/API/Popover_API) が安定して使えるようになったらそっちに置き換えたいですね。
タブUIについてもそろそろ ウェブ標準で実装されませんかねー？ 🤔

### lz-string

URL ハッシュにコードと設定ファイルの情報を埋め込む際に、 [`lz-string`](https://www.npmjs.com/package/lz-string) を採用しました。
文字列圧縮のライブラリです。
これは[typescript-eslintのPlayground](https://typescript-eslint.io/play/)で使用されていたのを参考にしました。

たとえば、デフォルトで読み込まれるサンプルコード+設定ファイルは1512文字（厳密にはキーや他の情報もあるのでもうちょい多い）ですが、lz-stringで圧縮すると1226文字になっていました。

### react-split

画面分割のために [`react-split`](https://www.npmjs.com/package/react-split) を使用しました。
状況に応じて領域を大きくしたり小さくしたりできます。

## その他の実装について

### ルール設定のフォーム編集（JSON Schemaの読み込み）

前提として、Markuplintの設定ファイルが受け入れる構造は、[JSON Schema ファイル](https://raw.githubusercontent.com/markuplint/markuplint/v4.0.0/config.schema.json) （[`invalid-attr` の例](https://raw.githubusercontent.com/markuplint/markuplint/main/packages/%40markuplint/rules/src/invalid-attr/schema.json)）で定義されています。
ルールのオプションをフォームで編集できる部分は、この JSON Schema の情報をもとに構築しています。
実装は[ゆうてんさんが作成されていた JSON Schema の読み込み機能](https://github.com/markuplint/markuplint/pull/214/files#diff-5d6556db76156db151470ce74723eafebc5fca85360c1a2f7a315169a3280899) をベースに使いました。

スキーマの `type` でコンポーネントを分岐させていき、 `type` が `boolean` ならtrueかfalseを選ばせるセレクトボックスを表示、 `string` ならテキストボックスを表示、`object` ならさらにネスト…といった具合です。
https://github.com/markuplint/markuplint/blob/dev/playground/src/components/RuleConfig.tsx

### 画面構成に関する検討

画面上の要素配置には結構悩みました…。

今回のリニューアルでは、以下の要素を配置しました。
（ここでの説明のために、実際には明示的にラベルをつけていないものにも便宜的に命名しています。）

- **「Code」**：HTMLを入力するエディタ
- **「Config」**：設定ファイルを編集するエディタ
  - **「JSON」**：エディタでのJSON編集
  - **「Visual」**：フォームでのビジュアル編集
- **「Problems」**：エラーや警告の一覧
- **「Examples」**：サンプルコードの適用
- **「Packages」**：インストールされているパッケージとバージョンの表示、バージョンの切り替え
- **「Console」**：コンソール出力の表示
- **「Status」**：リントが完了しているのか、エラーが起きているのかの表示

![Markuplint Playground のスクリーンショット](/images/markuplint-playground-renewal/2024-02-04-17-04-11.png)

これらをどう画面内に入れ込めばわかりやすいかを考えました。

- このアプリケーションのメインは「Code」「Config」「Problems」であるため、これらをメインに配置して、アクセス時にもすぐ目に入るようにしたい。
- 「Problems」は「Code」に紐づくものである
- 「Code」と「Config」は並べて見たいケースがある
- 一方で、「Code」と「Config」のエディタは、編集のしやすさのために領域を大きくしたい
  - 左上に「Code」、左下に「Problems」、右に「Config」を並べて画面の基本的な構成とした。
  - 領域の大きさは `react-split` で、必要に応じて大きさを変えられるようにして解決
- 「Config」の、JSONエディタとビジュアルエディタは入力方法の切り替えであり、同時に見える必要はない。
  - タブ切り替え
- 「Examples」は、選択した後にCodeとConfigが上書きされるため、
  - サンプルコードを選ぶときにCodeとConfigを見る必要はない
  - 選択した後はCodeとConfigを見てほしい
  - モーダルにして、選ぶときは背景から集中をそらし、選択後はモーダルを閉じてCodeとConfigを見せる
- 「Console」は、別にPlaygroundの機能に直接影響するものではない。最悪なくても成立する。だけど、エラーがあるときには見たい。
  - 目立つ必要はなく、必要なときだけ開けばいいので、画面下に小さく配置し、ポップオーバーで表示
- 「Status」は常に見えるところにいてほしい、けど主張は強くなくていい。エラーがあるときは、「Console」にその内容が表示される場合もある
  - 画面下に小さく配置。Consoleの横。
- 実際にコーディングでMarkuplintを使う場合は、VSCodeを使っているユーザーが多そうなので、できるだけその体験に近づけたい
  - 上に「Code」、下に「Problems」の配置はVSCodeのそれに似せています。
  - 「Packages」や「Status」の表示も、VSCodeのステータスバーに似せています。

参考までに、これらの考えがまとまるまでに作っていたボツ案の一部です。

:::details ボツ案のスクリーンショット

製作途中のスクリーンショット1。
Stylelint Demo を参考に、
上に「Code」「Config」「Dependencies(Packages)」をタブ切り替えで、
下に「Problems」「Console」をタブ切り替えで配置していた。
![製作途中のスクリーンショット1。](/images/markuplint-playground-renewal/2024-02-05-01-10-23.png)

製作途中のスクリーンショット2（めちゃめちゃ途中の状態なので、スタイリングも雑なときのやつ）
右側に「Code」と「Problems」/「Console」のタブ切り替え、左側にそれ以外を並べていた。
![製作途中のスクリーンショット2。](/images/markuplint-playground-renewal/2024-02-05-01-12-02.png)

:::

### 直感的に理解できるための工夫

- 言語切替を実装しなかったためラベルはすべて英語で表記していますが、できるだけ言語によらずに理解できるように、主要な要素にはアイコンを使っています。
- フォームでの設定ファイル編集は、見た目がJSONの構造と近くなるよう、コロン（`:`）とインデントで表現しています。

![設定フォームのスクリーンショット。](/images/markuplint-playground-renewal/2024-02-04-23-48-31.png =320x)

## 今後の展望

どこまで手が回るかはわかりませんが…、もう少し改善したいところとしてはこのへんです。

- 他の言語（Pug, PHP, Astro, …）への対応
- React等HTML以外の言語のシンタックスハイライト
- バージョン選択
- ページロード時のパッケージインストールに30秒程度時間がかかることがあり、その辺りの改善（どうにかできるかは不明）
- `nodeRules`, `childNodeRules` のフォーム編集サポート
- （開発上の問題ですが）テストを書く

## おわりに

Markuplint Playground、ちょっとHTMLの構文チェックを行いたい、というときに便利だと思いますので、ぜひ使ってもらえると嬉しいです。
バグなどいくらでもあると思うので、Issue や Pull Request お待ちしています。

そしてもちろん、実際のフロントエンド開発に `markuplint` の導入をぜひ！

## 参考にさせていただいたPlaygroundサイト

- [Demo | Stylelint](https://stylelint.io/demo/)
- [ESLint Playground - ESLint - Pluggable JavaScript Linter](https://eslint.org/play/)
- [Playground | typescript-eslint](https://typescript-eslint.io/play/)
- [TypeScript: TS Playground - An online editor for exploring TypeScript and JavaScript](https://www.typescriptlang.org/play)
- [Hello world • Svelte Examples](https://svelte.jp/examples/hello-world)
- [Prettier v3.0.3](https://prettier.io/playground/)
- [Online FlowChart & Diagrams Editor - Mermaid Live Editor](https://mermaid.live/edit)
- [TSLint Playground](https://palantir.github.io/tslint-playground/)
