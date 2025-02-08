---
title: "【JS】クイズで再確認するimport/exportの挙動 ～ インポートされたファイルは全体が実行されるよ"
emoji: "🚢"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript"]
published: false
---

JavaScript (ECMAScript) のモジュールシステムにおける `import` / `export` の挙動について、意外と理解していないかもしれないポイントをクイズ形式で確認してみましょう！
わかっている人にとっては当たり前の話ですが、自分もふとどうだったっけ？となることがあるので、再確認しておきます。
（記事を書き始めたときは第 1 問に関してだけ書くつもりだったので、他の 2 つはおまけみたいな感じです）

記事タイトルや見出しにめちゃめちゃヒントを書いていますが、あえてです。クイズを解くことよりも挙動を把握してもらうことが目的なので。

**動作確認環境**： Node.js `v20.16.0`

## クイズ第1問：export以外の処理があるファイルをインポートすると？

以下のファイルがある状況で、`index.js` を実行するとどう出力されるでしょうか？

```js:a.js
export const a = 1;

console.log('a.jsですよ');
```

```js:index.js
import { a } from './a.js';

console.log(`aの値は${a}です`);
```


```sh:実行コマンド
node index.js
```

:::details 答え

```txt
a.jsですよ
aの値は1です
```

:::

### ポイント：インポートされたファイルは全体が実行される

あえて記事タイトルにほぼ答えのようなヒントを書いておいたので、正解してもらえたでしょうか？
このヒントがなければ、 `a.js` に記載されている `console.log('a.jsですよ');` が実行されるかどうかで迷った人がいるかもしれません。

単なる変数を他のファイルから使用するためにインポートしていると、なんとなくその変数だけを取り出した気になってしまいがちです。
しかし、インポート・エクスポートが処理されるとき、インポートされたファイル（変数をエクスポートしているファイル）全体が実行されます（仕様の用語で言えば、モジュールが評価される）。

よく考えると当たり前の話で、以下のように前後の文によって値が決定するようなケースを考えてみれば、ファイル全体が実行されていないとおかしい、と思えるのではないでしょうか。

```js:a.js
const result = 1 + 2

export const obj = {
  value: result
};

obj.value += 3;
```

```js:index.js
import { obj } from './a.js';

console.log(obj);
```

```txt:実行結果
{ value: 6 }
```

#### 変数をエクスポートするファイルには副作用のある処理を書かないようにしよう

クイズのサンプルコードにおける `console.log()` のように、インポートしただけで実行されてしまい、値を返す以外の影響を生む処理のことを「副作用」と呼びます。
このサンプルコードくらい短ければどこに副作用があるか把握しやすいですが、コードが長くなってくると、どこにどんな副作用を持っているのかを把握するのが難しくなります。

単に変数の値を使いたかっただけなのに副作用が発生してしまった、ということを避けるため、基本的に変数をエクスポートするファイルでは、副作用を起こすコードを書かないのが安全でしょう。
他のファイルから参照される変数を置くファイルと、処理を実行するファイルは分割するのが望ましいです。

### 副作用のためだけのインポート

変数を持ってくる以外にも影響がある、ということは、その副作用を利用できるということです。
以下のように、特定の名前を指定せずにファイル（モジュール）をインポートした場合、副作用のためだけのインポートとして利用できます。

```js
import './a.js';
```

MDN にも以下のように説明があります。

>副作用のためだけにモジュール全体をインポートした場合、何もインポートされません。モジュールのグローバルなコードが実行されるだけで、値はインポートされないのです。
>
>https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import



## クイズ第2問：import文の前に処理があると？

以下のファイルがある状況で、`index.js` を実行するとどう出力されるでしょうか？

```js:a.js
console.log('a.js exportの前です');

export const a = 1;

console.log('a.js exportの後です');
```

```js:index.js
console.log('index.js importの前です');

import { a } from './a.js';

console.log('index.js importの後です');
```

```sh:実行コマンド
node index.js
```

:::details 答え

```txt
a.js exportの前です
a.js exportの後です
index.js importの前です
index.js importの後です
```

:::

### ポイント：インポート宣言の巻き上げ

`index.js importの前です` の出る順番に迷いませんでしたか？
`import` 文によるインポート宣言は、「巻き上げ」といって、他のコードが実行されるよりも前に処理される、つまりファイルの先頭に移動したように振る舞います。

>インポート宣言は巻き上げが行われます。この場合、インポートが導入する識別子がモジュール全体で利用できるということ、そしてその副作用がモジュールの残りのコードが実行される前に生じるということを意味しています。
>
>https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import


#### インポート宣言の前にコードを書くのはやめよう

`import` 文の前に他の処理を書くこと自体が間違っているわけではありませんが、前述の通り巻き上げの挙動によって、ファイルに記載の順序と実際に実行される順序が異なってしまいます。
紛らわしいので、`import` 文より前にコードを書かないようにするのが望ましいです。


## クイズ第3問：同じファイルを複数のファイルからインポートすると？

```js:shared.js
console.log('shared.jsです');
```

```js:a.js
import './shared.js';
console.log('a.jsです');
```

```js:b.js
import './shared.js';
console.log('b.jsです');
```

```js:index.js
import './a.js';
import './b.js';
console.log('index.jsです');
```

```sh
node index.js
```

:::details 答え

```txt
shared.jsです
a.jsです
b.jsです
index.jsです
```

:::

### ポイント：複数の経路でインポートされても、実行されるのは一度だけ

`shared.js` が 2 箇所でインポートされているので、`shared.jsです` が 2 回出力されるのではないか、と思ったでしょうか？
実際には同じファイル（モジュール）は一度だけ実行（仕様書の用語で言うと、Evaluate: 評価）されます。

ECMAScript の仕様書にも、以下のように「（モジュールの）評価は一度だけ実行されなくてはならない」との記載がありました。

>Evaluation must be only performed once, （後略）
>
>https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-example-cyclic-module-record-graphs:~:text=Evaluation%20must%20be%20only%20performed%20once

それが実現されるよう、モジュールを処理する手順が [Evaluate ()](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-moduleevaluation) の仕様の中で定められているようです。
（このあたりの仕様については、しっかり読み込んだわけではないので曖昧です）

## まとめ

- インポートされたファイルは全体が実行されるよ
  - 意図しない副作用を発生させないため、変数をエクスポートするファイルには副作用のある処理を書かないのが望ましいね
- インポート宣言は巻き上げが行われるよ
  - `import` 文より前に処理を書かないのが望ましいね。紛らわしいので。
- 複数の経路でインポートされても、実行されるのは一度だけ
