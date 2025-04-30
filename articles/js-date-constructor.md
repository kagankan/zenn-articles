---
title: 【JS】`new Date("2025-05-01")` って何時何分？　～Dateコンストラクターとタイムゾーンの仕様～
emoji: "🕛️" # 🕛️🗓️
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript"]
published: true
---

日付および時刻を扱う処理を書いていた際、Date コンストラクターの仕様に混乱させられたので整理がてら記事にします。

## Date コンストラクターの基本動作

`new Date()` の形式で Date オブジェクトを生成できます。
引数なしで実行すると現在の日時を表し、引数を与えると指定した日時を表します。

```js
// 現在の日時を取得
new Date();

// 指定した日時を取得
new Date("2025-05-01");
new Date("2025-05-01T12:34:56Z");
```

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/Date

この記事では、**文字列を渡したときの挙動**について深堀りしていきます。

## 引数に渡せる文字列

ECMAScript において、[`Date` コンストラクタ](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-constructor)に渡したとき処理できる文字列は `Date.parse()` で処理できるのと同じであると規定されています。
そして [`Date.parse()`](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.parse) でパースできる文字列は、[Date Time String Format](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format) として定められています。「**ISO 8601 の拡張形式**」（の簡略化されたもの）です。

ISO 8601 の拡張形式とは **`YYYY-MM-DDTHH:mm:ss.sssZ`** のような形式で、`2025-05-01T12:34:56.000Z` のように書きます。
一部は省略も可能で、 `2025-05-01` や `2025-05-01T12:34` なども正しい形式です。

:::message

実は ISO 8601 形式といっても実は基本形式と拡張形式があって、プログラミング言語ではほぼ拡張形式らしいです。

> プログラミング言語の多くが拡張形式の日付を処理するようになっている。基本形式にも対応するものは必ずしも多くない。
> https://ja.wikipedia.org/wiki/ISO_8601

:::

:::message

なお、仕様書で定義されている ISO 8601 形式以外の文字列（例えば `new Date("10 06 2014")`）でもパースできる場合がありますが、それは実装依存であり、仕様で担保されたものではないことに注意しましょう。

> Date コンストラクター（および Date.parse と同等）で日付文字列を解釈する際には、常に入力が ISO 8601 形式 (YYYY-MM-DDTHH:mm:ss.sssZ) であることを確認してください。他の形式で解釈した場合には、その挙動は実装によって定義されていて、すべてのブラウザーで動くとは限りません。 RFC 2822 書式の文字列の対応は慣習的に行われているだけです。多数の異なる形式に対応するためには、ライブラリーが役に立ちます。
> https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#datestring

:::

## タイムゾーンについて

日付・時刻を扱う際、気をつけなければいけないのがタイムゾーンの問題です。
JavaScript におけるタイムゾーンについては以下の記事でわかりやすく解説されていたので紹介します。

https://zenn.dev/cloudbase/articles/1fec905b14fde7

JavaScript においては **実行している環境のタイムゾーンの影響を受ける**（より具体的に言えば、**PC 本体の時刻設定によって結果が変わる**）ことがあるというのが注意しなくてはいけないポイントです。

## 使用できる ISO 8601 形式のパターン

[Date Time String Format](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format) で定義されている形式について詳しく見ていきます。
基本となるのは `YYYY-MM-DDTHH:mm:ss.sssZ` ですが、それぞれ部分的に省略することも可能です。
どんなパターンがあるか整理してみます。

### 日付

| 説明　 | 形式         | 例           |
| ------ | ------------ | ------------ |
| 年     | `YYYY`       | `2025`       |
| 年月   | `YYYY-MM`    | `2025-05`    |
| 年月日 | `YYYY-MM-DD` | `2025-05-01` |

※ [Expanded Years](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-expanded-years) というのもありますがここでは省略。

### 時刻

| 説明　       | 形式            | 例              |
| ------------ | --------------- | --------------- |
| 時分         | `THH:mm`        | `T12:34`        |
| 時分秒       | `THH:mm:ss`     | `T12:34:56`     |
| 時分秒ミリ秒 | `THH:mm:ss.sss` | `T12:34:56.789` |

### タイムゾーン指定子

| 説明　                 | 形式     | 例       |
| ---------------------- | -------- | -------- |
| UTC                    | `Z`      | `Z`      |
| UTC 以外のタイムゾーン | `±HH:mm` | `+09:00` |

### 組み合わせ例

| 形式                                | 例                                      |
| ----------------------------------- | --------------------------------------- |
| `{日付}`                            | `2025`, `2025-05-01`                    |
| `{日付}{時刻}`                      | `2025T12:34`, `2025-05-01T12:34:56`     |
| `{日付}{時刻}{タイムゾーン}`        | `2025T12:34Z`, `2025-05-01T12:34+09:00` |
| `{日付}{（Zを挟んで）タイムゾーン}` | `2025-05-01Z+09:00`                     |

### 省略した場合の処理

`YYYY-MM-DDTHH:mm:ss.sssZ` が完全な形ですが、一部を省略した場合はフォールバック値が使われることが[仕様](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.parse)で定義されています。

> If the String conforms to the Date Time String Format, substitute values take the place of absent format elements. When the `MM` or `DD` elements are absent, `"01"` is used. When the `HH`, `mm`, or `ss` elements are absent, `"00"` is used. When the `sss` element is absent, `"000"` is used. When the UTC offset representation is absent, date-only forms are interpreted as a UTC time and date-time forms are interpreted as a local time.

- `MM` または `DD` 要素がない場合は、`"01"` が使用される。
- `HH`、`mm`、`ss` 要素がない場合は `"00"` が使用される。
- `sss` 要素がない場合は `"000"` が使用される。
- UTC オフセット表現（タイムゾーン指定子）がない場合、日付のみの形式は UTC 時刻として解釈され、日付時刻の形式はローカル時刻として解釈される。

日付がなければ 1 月 1 日にされる、時刻がなければ 0 時 0 分 0 秒にされる、というのは理解しやすいと思うのですが、最後の **「日付のみなら UTC」「日付時刻ならローカル」** というのは地味にトラップです。

## 具体例

### `new Date("2025-05-01")` は何時になるのか

タイトルにある `new Date("2025-05-01")` という、時刻やタイムゾーンを省略した日付のみの形式の文字列を渡した場合にどういう結果になるか考えてみます。

- `HH`、`mm`、`ss` がないので `"00"` が使われる
- `sss` がないので `"000"` が使われる
- **タイムゾーンがなく、日付のみなので UTC として解釈される**

ので、 **`new Date("2025-05-01T00:00:00.000Z")` と同じ** になります。
よって、これはどんなタイムゾーンの環境で実行しても同じ瞬間を指す Date オブジェクトを生成します。

| タイムゾーン | 等価な値                               | toISOString                  |
| ------------ | -------------------------------------- | ---------------------------- |
| UTC          | `new Date("2025-05-01T00:00:00.000Z")` | `"2025-05-01T00:00:00.000Z"` |
| JST          | `new Date("2025-05-01T00:00:00.000Z")` | `"2025-05-01T00:00:00.000Z"` |

:::message

**ポイント**：日付のみの文字列を渡した場合は UTC として解釈される

:::

いつでも一緒でわかりやすいじゃん、と思いきや、例えば以下のようなコードをニューヨーク時間（タイムゾーンオフセットがマイナスの例）の環境で実行すると、なんだか不思議なことになります。

```js
console.log(process.env.TZ);
// => "America/New_York"
console.log(new Date("2025-05-01").getDate());
// => 30
```

5 月 1 日の日付を指定したのに、なぜか 30 日と言われてしまいました。
`new Date("2025-05-01")` は UTC の 5 月 1 日 0 時を指しますが、その瞬間のニューヨーク時間は 4 月 30 日の 20 時であるからです。

### `new Date("2025-05-01T00:00:00")` は何時になるのか

一方で、 `new Date("2025-05-01T00:00:00")` という、時刻まで含んでいるがタイムゾーンを省略した文字列ではどうでしょう。

- `sss` がないので `"000"` が使われる
- **タイムゾーンがなく、日付時刻なのでローカルのタイムゾーンで解釈される**

よってこのコードは実行する環境のタイムゾーンに依存して値が変わります。

| タイムゾーン | 等価な値                                    | toISOString                  |
| ------------ | ------------------------------------------- | ---------------------------- |
| UTC          | `new Date("2025-05-01T00:00:00.000Z")`      | `"2025-05-01T00:00:00.000Z"` |
| JST          | `new Date("2025-05-01T00:00:00.000+09:00")` | `"2025-04-30T15:00:00.000Z"` |

:::message

**ポイント**：日付時刻の文字列を渡した場合はローカルタイムゾーンとして解釈される

:::

## 意図せぬ挙動を防ぐために

前提として、以下の点は守るとよいでしょう。

- 時刻を扱うならタイムゾーンを含めてやり取りする
- できるだけ UTC (`Z`) を使う

その上で、文字列から Date オブジェクトを生成する処理が必要になる場合、前述の通り、文字列に時刻を含むかどうかでタイムゾーンの扱いが変わることに注意しましょう。
例えば、以下のような関数があったとき、変わらないと勘違いしそうなコードが実は結果が違うということが起こり得ます。

```js
const getDateFromString = (dateString) => {
  const date = new Date(dateString);
  return date.getDate();
};

// Asia/Tokyo (JST) の場合
console.log(getDateFromString("2025-05-01"));
// => 1
console.log(getDateFromString("2025-05-01T00:00"));
// => 1

// America/New_York (EDT) の場合
console.log(getDateFromString("2025-05-01"));
// => 30
console.log(getDateFromString("2025-05-01T00:00"));
// => 1
```

予期せぬ挙動を引き起こす可能性があるので、どちらかに制限したうえで実行するのがよいでしょう。

### バリデーションで防ぐ

クライアントから受け取る値を使用するような場合、[Zod](https://zod.dev/) でバリデーションを行うのが安全です。

[`z.string().datetime()`](https://zod.dev/?id=datetimes) で UTC の ISO 8601 形式の文字列のみを検証できます（オプションをつけると他のタイムゾーンを許容するようにもできる）。

```js
z.string().datetime().parse("2020-01-01T00:00:00Z"); // ✅️ OK
z.string().datetime().parse("2020-01-01T00:00:00+09:00"); // ❌️ NG
z.string().datetime().parse("2020-01-01"); // ❌️ NG
```

時刻を除いて日付のみに制限する場合は [`z.string().date()`](https://zod.dev/?id=dates) が使えます。

```js
z.string().date().parse("2020-01-01"); // ✅️ OK
z.string().date().parse("2020-01-01T00:00:00Z"); // ❌️ NG
z.string().date().parse("2020-01-01T00:00:00+09:00"); // ❌️ NG
```

### 型レベルで防ぐ

TypeScript を使用している場合かつ、静的な文字列を直接指定するような場合に限られる簡易的な方法にはなってしまいますが、型レベルで制限する方法もあります。テンプレートリテラル型を使用します。

`1-2-3` のように桁が足りてない文字列も許容してしまうなど厳密さには欠けますが、どんな形式の文字列を期待しているかを実装時に読み取りやすくなるメリットがあります。

```ts
const getDateFromDateString = (dateString: `${number}-${number}-${number}`) => {
  const date = new Date(dateString);
  return date.getDate();
};

getDateFromDateString("2025-05-01"); // ✅️ OK
getDateFromDateString("2025-05-01T12:34:56"); // ❌️ NG

const getDateFromDatetimeString = (
  datetimeString: `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`
) => {
  const date = new Date(datetimeString);
  return date.getDate();
};

getDateFromDatetimeString("2025-05-01T12:34:56.789Z"); // ✅️ OK
getDateFromDatetimeString("2025-05-01"); // ❌️ NG
```
