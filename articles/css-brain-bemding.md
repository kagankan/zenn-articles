---
title: "BrainBEMding ～モノと性質を意識した、MindBEMdingベースの新しいCSSクラス命名規則の提案～"
emoji: "🧠"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["css"]
published: false
---

# 概要

BEMの考え方に則ってCSSのクラスを命名する際に、**BrainBEMding** と名付けた以下の命名規則を提案します！

```css
.BlockName__ElementName--modifier-name { /* ... */ }
```

- ブロックは**パスカルケース**
- ブロックとエレメントの区切りは `__` （アンダースコア2つ）
- エレメントは**パスカルケース**
- エレメントとモディファイアの区切りは `--` （ハイフン2つ）
- モディファイアは**ケバブケース**

```css
.utility-style { /* ... */ }
```

- ユーティリティクラスは**ケバブケース**

## 主な特徴

- MindBEMdingの命名をベースに、ブロックとエレメントをパスカルケースに変更した命名規則
- 文字の範囲選択時に、ブロックからエレメントまでが一度に選択できる
- モノと性質を区別した命名になっている

詳しい理由などは以降で説明します。

## 命名規則の名前

MindBEMding をベースとした上で、より合理的・論理的な命名をしているという意味合いを込めて、 **BrainBEMding** という名前をつけました。


# そもそもBEMとは？

BEMはWeb開発における有名な**コンポーネント分割の考え方**です。
BEMの内容の説明はここでは省略しますので、詳しくは他の記事を参照ください。

公式：
https://en.bem.info/methodology/quick-start/

日本語訳：
https://github.com/juno/bem-methodology-ja/blob/master/definitions.md

「BEM = MindBEMding」と思われていることも多いですが、BEMは構造を捉えるための**考え方**なので、命名規則を定めるものではありません。

:::details （参考）BEM（bem.info）で紹介されている命名規則について
BEMの考え方を紹介しているbem.infoのサイトには命名規則のページがあります。
https://en.bem.info/methodology/naming-convention/
ただし、「この命名規則とする！」という説明ではなく、「こういったパターンがあるよね」という例示の形で、複数の命名規則を提示しています。

BEMが基本とする命名規則は `block-name__elem-name_mod-name_mod-val` です。
MindBEMdingと異なるのはモディファイア部分です。モディファイアの前がアンダースコア1個、モディファイアの名前と値に分けられています。
具体的には、サイズが小さいボタンであれば `.button_size_s` のように、`button` の `size` が `s` という命名になるようです。

ちなみに、代替の命名規則の項目には [React Style](https://en.bem.info/methodology/naming-convention/#react-style) というパスカルケースを使用した例も存在しますが、今回紹介するパターンともまた異なった命名規則です。
:::

# 既存の命名手法 MindBEMding

BEMの考え方に基づいて提唱されたクラス名の命名規則です。
具体的には、 `block-name__element-name--modifier-name` のような命名になります。

元記事：
https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/

日本語訳：
https://gist.github.com/juno/6182957


## MindBEMding のメリット

- **有名**なので、Web開発者であれば知っていることが多く、共通化を図りやすい
  - 自分の知る限りは最も広く使われているCSSの命名規則だと思います
- ブロック、エレメント、モディファイアそれぞれの名前はすべてケバブケースという一貫したルールがある

## MindBEMding のデメリット

- **単語選択での選択範囲が不自然**
  - 文字列をダブルクリックすると単語の単位で選択できますが、アンダースコアは単語の一部、ハイフンは単語の区切りとして扱われます。つまり、 `block-name__element-name` では、 `name__element` という無意味な範囲が選択されてしまいます。

# 新しい命名規則 BrainBEMding の提案

そこで提案するのが **BrainBEMding**です。
冒頭で示した通り、 **`.BlockName__ElementName--modifier-name`** の命名です。

ヘッダーであれば `.Header`、
カードの中のタイトルであれば `.Card__Title`、
サイズが大きいボタンであれば `.Button--size-large` のような命名になります。

```css:具体的なCSSファイルのイメージ
.Button { /* ... */ }
.Button.Button--size-large { /* ... */ }
.Button__ArrowIcon { /* ... */ }
```

また、ユーティリティクラスはケバブケースとしているので、
文字色を青にするクラスであれば `.color-blue` となります。

```css:ユーティリティクラスのファイルのイメージ
.color-blue { color: blue; }
.color-red { color: red; }
```

## BrainBEMding のメリット

### 単語選択でブロックからエレメントまでひとつづきで選択できる

この問題を解消したいがための改良なので、当たり前といえば当たり前ですが、問題が解消できています。
なお、ブロックの途中からエレメントの途中までという中途半端な状態が問題であると認識しているので、モディファイアまで一続きで選択できないことは問題とはしません。

### 「モノ」と「性質」が区別できる

**他の命名規則にはない、この命名規則の一番大事なポイント**かもしれません。

BEMのB, E, M、つまりブロックとエレメントとモディファイアは3つが並列のように並んでいますが、よく考えると、ブロックとエレメントが要素のことを示しているのに対し、モディファイアはそれを調整する性質を示しています。
（モディファイア単体のクラスは設定することはなく、必ずブロック・エレメントのクラスと一緒に設定しますよね。）

この命名規則では、以下のように命名と概念が対応付けられています。

:::message

この命名規則の中では、

- **モノ**（要素、オブジェクトとも言える）は**パスカルケース**
- **性質**（属性、プロパティとも言える）は**ケバブケース**

:::

具体例をいくつか上げてみましょう。

- `.Header`：`Header` という**モノ**です。
- `.Card__Title` ：`Card`の中にある`Title` という**モノ**です。
- `.Button--size-large` ： `Button` という**モノ**に `size-large` という**性質**を与えます。

ケバブケースを使用することにしているユーティリティクラスについても同様の考え方が適用できます。

- `.color-blue` ：（どんなモノであるかに関わらず）文字が青色という**性質**を与えます。
- `.visually-hidden`：（どんなモノであるかに関わらず） `visually-hidden`（スクリーンリーダーのみで認識されるように、視覚的には非表示）な**性質**を与えます。 ^[Bootstrapなどで導入されているユーティリティです。TailwindCSSではvisually-hiddenと同様の機能は `sr-only` という名前で提供されています。]

### React, Vue などのコンポーネント名と相性がいい

React や Vue、そして個人的に最近よく使う Astro などのフレームワークにおいて、コンポーネント名はパスカルケースで記述します。^[https://ja.reactjs.org/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized] ^[https://ja.vuejs.org/style-guide/rules-strongly-recommended.html#component-name-casing-in-templates] ^[https://docs.astro.build/ja/core-concepts/astro-components/]
そのため、これらのフレームワークを使用したプロジェクトでは、CSSクラス名をパスカルケースにすることでコンポーネントと命名を揃えられます。

フレームワークを用いないプレーンなHTMLのプロジェクトだとしても、BEMにおけるブロックの概念はコンポーネントとほぼ同じような概念なので、自然に使用できます。

それに、HTMLタグこそ `h1`, `p` のように小文字英数字のみではありますが、DOMのインターフェイスを考えると `h1` 要素であれば [`HTMLHeadingElement`](https://developer.mozilla.org/ja/docs/Web/API/HTMLHeadingElement) のようにパスカルケースなので、違和感ないです（※これは半分こじつけ）。

### MindBEMdingを知っている人が理解しやすい

MindBEMdingを知っている人なら「ブロックとエレメントをパスカルケースにする」だけで理解でき、導入しやすいのも利点の一つです。
特に、「CSSのクラス名に `__`（アンダースコアが2つ）が含まれている」というのはBEMを示すこと以外ではあまり見ることがないので、全く別の開発者が見たとしても「これはBEMに基づいて命名されていそうだ」と伝わりやすいです。

## BrainBEMding のデメリット

個人的にはベストプラクティスといえる命名規則ですが、一応デメリットも上げると以下のようなものがあるかと思います。

- ほぼ使われていないので伝わりにくい。
- パスカルケースとケバブケースが混在するので、慣れるまでは混乱するかも。
- 大文字を使うので、ファイル名＝ブロック名にした場合（`BlockName.scss` など）、Gitの管理で大文字小文字が区別されず問題が起きる場合がある
  - `core.ignorecase` を `false` に設定してあげればいいんですが、デフォルトが `true` なんですよね……

# 想定問答集

想定される質問、というか自分がこの命名を決めるにあたって検討したことを並べておきます。
折りたたみにしていますので、気になる方は読んでみてください。


<!--  -->

:::details すでにこの命名を使用しているライブラリはあるの？
Reactでモーダルダイアログを実装するためのライブラリである [`react-modal`](https://reactcommunity.org/react-modal/) のクラス名がこの命名でした。
`ReactModal__Overlay--after-open` といったクラス名が使用されています。
逆に言うとreact-modal以外の例は知らないので、もし他にあれば教えてください！

https://reactcommunity.org/react-modal/styles/classes/#:~:text=ReactModal__Overlay%2C%20ReactModal__Overlay%2D%2Dafter%2Dopen%20and%20ReactModal__Overlay%2D%2Dbefore%2Dclose

:::

<!--  -->

:::details パスカルケースではなくローワーキャメルケース（.blockName__elementName）ではダメなの？

1単語だった場合にキャメルケースであることが伝わりにくいからです。

例えば、 `.button`, `.card` といった名前が使われているのを見た人が、新しく「エラーメッセージ」の命名をしようと思ったときに `.error-message` にすべきか、 `.errorMessage` にすべきか判断がしづらいです。
一方、 `.Button`, `.Card` であれば、 `.ErrorMessage` になりそうな感じがします。
（もちろんこういった規則はドキュメントに記載しておくべきですが、ドキュメントを見なくてもわかるような設計は負荷が少ないです）
:::

<!--  -->

:::details モディファイアやユーティリティをパスカルケース（--ModifierName）やローワーキャメルケース（--modifierName）にしないのはなぜ？

- パスカルケースにしないのは、前述の通りモノと性質を区別するため。
- ローワーキャメルではなくケバブケースなのは、CSSプロパティやキーワードとの互換性を保つため。
  - `background-color` や `inline-block` などのように、CSSのプロパティやキーワードはケバブケースである。ケバブケースなら、これらの命名をそのまま使用できる。
- Tailwindとの一貫性を保つため。
  - [以前の記事](https://zenn.dev/kagan/articles/1aa466bb6ef8eb#11.-%E3%83%A6%E3%83%BC%E3%83%86%E3%82%A3%E3%83%AA%E3%83%86%E3%82%A3%E3%82%AF%E3%83%A9%E3%82%B9%E3%81%ABtailwind-css%E3%82%92%E4%BD%BF%E3%81%86)で書いたのですが、私はユーティリティクラスとしてTailwind CSSを活用することが多いです。そしてそのTailwind CSSはケバブケースなので、合わせることで一貫性を保つことができます。

:::

<!--  -->

:::details アンダースコア1個やハイフン1個（.BlockName_ElementName-modifier-name）じゃいけないの？
たしかに、ブロックとエレメントで単語内の区切りにハイフンを使わなくなったことで、単独のハイフンでもモディファイアの位置を区別できるようになります。
しかし、アンダースコア2個、ハイフン2個の命名にすることで、BEMの命名であることを示しやすくなるため、MindBEMdingにならってそれぞれ2個を採用しています。
:::

<!--  -->

:::details SUIT CSSとは違うの？
[SUIT CSS](https://suitcss.github.io/)でも命名の一部にパスカルケースを採用しています。

[SUIT CSS naming conventions](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md) によれば、
`ComponentName-descendentName` や `ComponentName--modifierName`
といった命名です（BEMに置き換えると、Componentがブロック、descendentがエレメントにあたります）。

これを採用しなかったのは、以下のような理由です。

- ダブルクリックの際にブロック～エレメントまで含めて選択したいので、ブロックとエレメントの間の区切りにはハイフンではなくアンダースコアを使用したい。
- descendentNameとmodifierNameが同じ命名規則（ローワーキャメルケース）になっているが、モノと性質で区別したいため、合わない。
- モディファイアにはケバブケースを採用したい（理由は前述の通り）。
:::

<!--  -->

:::details コンポーネント名とクラス名は別にしたほうがファイル内検索しやすくないの？
コンポーネントを探したいときは `<Component` で検索すればいいし、クラス名（スタイル定義）を探したいときは `.Component` で検索すればいいので、困ったことはないです。
むしろコンポーネント名を変更する際に一括で変更できるので便利です。
:::

<!--  -->

:::details そもそもVueやAstroのScoped CSSだったら命名ルールそこまで気にしなくてよくね？

VueやAstroには、CSSの適用範囲をコンポーネント内に制限する**Scoped CSS**という仕組みがあります。
https://ja.vuejs.org/api/sfc-css-features.html#scoped-css
https://docs.astro.build/ja/guides/styling/#%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB%E3%81%AE%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%97

この機能を使えばComponent**A**の中で `Heading` というクラスを使って、Component**B**の中でも `Heading` というクラスを使っても、それぞれ独立してスタイルを指定することが可能になります。

スタイルが干渉してしまう、という問題はなくなったかもしれないですが、それでもやはり一意に特定できる名前というのは必要だと思っています。
自分の職場では、デザイナーと「.ProductSection__Headingのpadding-topを10pxに変更」のようなコミュニケーションも多いため、ブラウザから確認できる一意な名前が存在していることは結構重要です。
:::


<!--  -->

:::details CSS変数（カスタムプロパティ）の命名はどうするの？
これに関しては自分自身模索中です…！
今のところは「プロパティはケバブケースっしょ！」と思ってケバブケースに直しています。
（ComponentAの幅、のような変数であれば、 `--component-a-width`のように。もしくはComponentAの中で宣言するなら単に `--width` にしてしまうこともある）

というかそもそもCSS変数を使うことがそこまで多くなかったので、あんまり真面目に検討できていないという現状があります（最近だんだん使うようになってきたところです）。

ブロックに紐づく変数は（`--ComponentA-width`のように）パスカルケースに揃えたほうがわかりやすいかもしれない……とは思っています。
今後検討していきます。いい案があれば教えてください。
:::

<!--  -->

:::details そもそもクラス名に大文字使っていいんだっけ？
結論から言うとOKです。
（じゃなかったらこんな提案していないですが）

HTMLの仕様を確認すると、以下のように書かれています。

>When specified on HTML elements, the class attribute must have a value that is a set of space-separated tokens representing the various classes that the element belongs to.
>（中略）
>There are no additional restrictions on the tokens authors can use in the class attribute, but authors are encouraged to use values that describe the nature of the content, rather than values that describe the desired presentation of the content.
https://html.spec.whatwg.org/multipage/dom.html#global-attributes

（以下、Google翻訳）
>HTML 要素で指定する場合、class 属性には、要素が属するさまざまなクラスを表す、スペースで区切られたトークンのセットである値が必要です。
>（中略）
>作成者が属性で使用できるトークンに追加の制限はありませんがclass、作成者は、コンテンツの望ましい表現を説明する値ではなく、コンテンツの性質を説明する値を使用することをお勧めします。

クラス名に使用できる文字に関して、「追加の制限はない」ということで、特に指定はありません。
そしてこのクラス名は厳密に文字列として比較されるので、大文字小文字は区別されます。
なんなら英数字という制限すらないので、日本語や絵文字を使うことだって可能です（もちろん現実的に使うことはないですが）。

ただし、大文字小文字の違いが無視されるケースが（一応）存在します。それは **「互換モード（Quirksモード）」** の場合です。
HTMLの先頭に `<!DOCTYPE html>` が存在する場合、ブラウザは「標準モード」でHTMLを解釈します。この場合は前述の通りクラス名の大文字小文字は区別されます。
一方、 `<!DOCTYPE html>` がない場合、ブラウザは「互換モード」として古いブラウザの挙動で解釈します。この場合はクラス名の大文字小文字は区別されず、 `.class` と `.CLASS` には同じスタイルがあたります。

https://allabout.co.jp/gm/gc/23849/

HTMLの先頭にDOCTYPEを書かないことはまずないかと思いますので、基本的には気にしなくてよいかと思います。
:::


## その他の補足

### モディファイアの命名

モディファイアの命名ではプロパティ→値の並びになるようにすると良いです。

```
// ❌ NG
.Button--large-size
.Button--small-size
```

```
// ✅ OK
.Button--size-large
.Button--size-small
```

理由：

- クラス名を並べた際に頭が揃っていると、sizeという同じ話題について変化させていることがわかりやすい
- `width: 100px;`のような、CSSの`プロパティ: 値;`の記述と同じになって一貫性がある

（ただし、この場合は単に`.Button--large`, `.Button--small` でいいような気もしますけどね）

### モディファイアにブロック名やエレメント名を含めるか

絶対にブロック名＋モディファイアとするのか、

```css
.Header { /*  */ }
.Header.Header--is-open { /*  */ }
```

モディファイアは単体でクラスとして付与するのか

```css
.Header { /*  */ }
.Header.is-open { /*  */ }
```

という問題です。

これについては、どちらでも好きな方を使って構わないと思いますが、
自分の使い分けとしては

- 手動で設定する場合はブロック名＋モディファイア
- JSで操作して動的に付与する場合はモディファイア単体のクラスを付与

としています。

原則としてブロック名＋モディファイアにしておくほうが何のためなのかわかりやすいのでこちらを優先するのですが、JSで操作する場合にこれを採用してしまうと、CSSだけが知っていればよいブロック名という情報がJSファイルにも漏れてしまう（つまり、ブロック名を変えるときにCSSファイルだけでなくJSファイルも編集する必要が出てくる）ことになります。
モディファイアだけを付与することにすればそれを避けられますし、HTML属性を切り替える操作（例えば `details` 要素の `open` 属性を付け外す）とさして変わらない操作になります。

もしくは、JS操作にはdata属性のみを使う、というルールにするならば、data属性を使用しても構いません。

```css
.Header { /*  */ }
.Header[data-open="true"] { /*  */ }
```

# まとめ

BEMの考え方に則ってCSSのクラスを命名する際の命名規則として、**`BrainBEMding`** と名付けたフォーマットを提案しました。
単なる命名規則ではなく、命名の上で「モノと性質を区別する」という特徴があります。
よければ使ってみてください！

