---
title: "【初学者向け】具体例で学ぶTypeScript練習問題集"
emoji: "✍🏼"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["typescript"]
published: true
---

TypeScript を学習中の方に勧められる練習問題集として手頃なものがないなと思い、作ってみました。
TS の問題集としては[type-challenges](https://github.com/type-challenges/type-challenges/blob/main/README.ja.md) がよく話題に上がりますが、実用上あそこまでの型パズルを使うことはあまりないため、最初に取り組むにはハードルが高いです（もちろん知っていたら便利ではありますが、初学者向けではない）。

## 想定読者

- JavaScript を書くことには慣れている
- TypeScript はこれから・まだ慣れていない
- TypeScript の基本的な型についてはすでに知っている

## はじめに

- JavaScript の機能に関する問題は扱いません。TypeScript の型システムに関する問題のみ扱います。
- そもそも TypeScript についてよくわかっていない場合、[サバイバル TypeScript](https://typescriptbook.jp/)などで学習から始めてみてください。
- 「型がつけられると何が嬉しいのか」を理解してもらえるように、エラーにしたいコードの例を出すようにしています。
- レベル 1 から 3 まで設定しています。ただし、あくまで独断によるものですので、実態と合っているかは保証できません。

## 第 1 章 JS から TS へ ～型注釈～

JavaScript で書かれた既存のコードを TypeScript に移行したときに遭遇するような、
「JavaScript では問題ないものの、TypeScript ではエラーになる」書き方を修正してみましょう。

### 【レベル 1】引数の型注釈 1（文字列）

**文字列**を受け取る関数を考えます。
関数が文字列だけを受け取るように、型注釈を追加してください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBA5gUygGQWOUAWMC8MAUUCAHrAPQBUMgsOSA8G4D-7MgygxODWDINHqgFzaATiYEkMgH2aBZBkB+DIE0GGBTIBKXAD4YAbwBQMGACckAVzVgYRUgDoANmgyYA3EoC+lpWTIxAoOQxAzwaAs7UBYCYCiGQHYMgZoZAH4ZASYZAIAZACoZAS4YA1kArBkBIhhjAEQZACIZAMQZWQHUGQDMGQHkGQAMGQFUGRKVEFFMsfAAiTAQjIxBKqUtS1HQKyoA3BDUATxh69D0SKEbmpFazKtGlOwdAGXIYQFO5QGg5QHsGSOjs-KKS8fLMfABGAAYm3bK2g4UrM5b9-DBNOqagA)

```js
const getLength = (text /* ✍🏼 ここに型注釈を書きます */) => {
  return text.length;
};

// ✅ 想定通りのコード。エラーにならないようにしてください
getLength("hello");
getLength("very long text");
getLength("");

// ❌ 以下はエラーにしてください
getLength(10);
getLength({});
getLength(null);
```

:::details 解答例

```ts
const getLength = (text: string) => {
  return text.length;
};
```

:::

### 【レベル 1】引数の型注釈 2（配列）

**数値の配列**を受け取り、すべての要素を 2 倍にして返す関数を考えます。
関数が数値の配列だけを受け取るように、型注釈を追加してください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAJiArgIwDYFMYF4YAoCGATofgJ4wD0AVDILDkgPBuA-+zIMoMLg1gyDR6oBc2gE4mBJDIA+zQLIMgPwZAmgwwqFAJTYAfDADeAKBgxC6KIkJgYREqQB0AW3wAHXLjCITcrIpsmpMAEwyA3CoC+XlRQoYQFByGEBng0As7UAsBMAohkA7BkBmhkAfhkBJhkAgBkAKhkBLhkT2QCsGQEiGXMARBkAIhkAxBnZAdQZAMwZAeQZAAwZAVQYilQQUDFwAbQBGABo3foBmAF1PVqQ0dC7ugAZ+1zmYQZnRrzbJrtWVf0DAGXIYQFO5QGg5QHsGLJyahubx9qnOgCJu+-7712eYe8H7rfWOnpe3v0bKhUD8Jh1umNflMlN5PEA)

```js
const double = (array /* ✍🏼 ここに型注釈を書きます */) => {
  return array.map((num) => num * 2);
};

// ✅ 想定通りのコード。エラーにならないようにしてください
double([1, 2, 3]);
double([10, 20, 30]);
double([]);

// ❌ 以下はエラーにしてください
double(["1", "2", "3"]);
double([1, "2", null]);
double(1);
double({});
```

:::details 解答例

```ts
const double = (array: number[]) => {
  return array.map((num) => num * 2);
};
```

:::

### 【レベル 1】引数の型注釈 3（オブジェクト）

**名前の文字列と年齢の数値を持つオブジェクト**を受け取りメッセージを出力する関数を考えます。
関数がオブジェクトだけを受け取るように、型注釈を追加してください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAtgUwhAhgcwTAvDAFAVwgQCcYB6AKhkFhyQHg3Af-cGUGRwawZBo9UAubQCcTAkhkA+zQLIMgPwZAmgwwKZAJTYAfDADeAKBgxQkEABsEAOg0g0uZSpgADACTzCJbWBSIAvoFUGQMkMgQAYLV4tvQJ7gZ2tAcwYRQCAGQFNzQBc9QHsGDyIvHxgAahgARn8gwFsGYJMjSQBuRXt8xTIyGEBQchhAZ4NALO1ALATAKIZAOwZAZoZAH4ZASYZgwAqGQEuGVpZAKwZASIYBwBEGQAiGQDEGFkB1BkAzBkB5BkADBkdRxURkH1x5GFtEAC4YACJAKk1AOYSjgBoYH0OAZgAGGHs89aRUDG3duwRDo8BGoMACtpXG4YQ4AJgArM9XhsPggvntfscAFIoABuKAAysBiABLAAOUBBtxg4IAnDD8nCtjskX8ACoATwJCBx+KJJLBKWSVMUxVKgBlyGCAU7lANBykV6-Xmy1Wb02nzpPz+gAA5C7XUlHR5HKnkUrhQBG+TxAOGmgHVtQDoSgFAIR281GgGiGRoBKWzQD6DGsaYrvnAUMijoAYuXVoORj11JRggFqGVo8QDJqYBVBMAEgxze2O50zN3y+GI5XHQCQchdQ6VAKP6gAgMxqRwAyDIAco0AigxJh1Ovqu93vWle32AbbVA6THtdvXiNH8IAALPHEEAAAQQAA87AStNpQHAdS9cnqYIBYOUAgZEDCuAIQZ66m3UA)

```js
const message = (user /* ✍🏼ここに型注釈を書きます */) => {
  console.log(
    `${user.name}さん、${user.age}歳です。来年は${user.age + 1}歳ですね。`
  );
};

// ✅ 想定通りのコード。エラーにならないようにしてください
message({ name: "太郎", age: 30 });
message({ name: "花子", age: 25 });
message({ name: "JavaScript", age: 29 });
message({ name: "TypeScript", age: 11 });

// ❌ 以下はエラーにしてください
message({ name: "一郎", age: "30" }); // 年齢を文字列で渡しているのでエラーにしたい
message({ namae: "二郎", age: 30 }); // キーを間違えているのでエラーにしたい
message({ name: "三郎" }); // 必須のキーが抜けているのでエラーにしたい
message({ name: "四郎", age: 30, mail: "shiro@example.com" }); // 不要なキーがあるのでエラーにしたい
```

:::details 解答例

```ts
const message = (user: { name: string; age: number }) => {
  console.log(
    `${user.name}さん、${user.age}歳です。来年は${user.age + 1}歳ですね。`
  );
};
```

:::

### 【レベル 1】引数の型注釈 4（オブジェクトの必須ではないプロパティ）

**誕生日を表すオブジェクト**を引数に取り、その日が誕生日ならお祝いする関数を考えます。
「月」「日」は必須ですが、年齢は言いたくない場合を考えて、「年」は任意のプロパティとして定義してください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAFgQwA5IJ4CECWAnKcAmCqMAvDABQBGOehxA9AFQyCw5IDwbgP-syDKDN4NYMgaPVAFzaAJxMBJDIA+zQLIMgPwZAmgwxG9AJSkAfDADeAKBgxQkWFBB1SWmKgCmCbAC4YAJgAMDgCwAaGAFtweewEZPOgCYAF8Abl0YTAAzCmM6ADofMDxSEjJqXAIiZN84GAAyQpgE3NMMzJoc1ES6VR09PQMIEAAbS0S2kABzciimmAADQHmGQGGGQBWGQB+GQAWGKcBOhkBxhinAQH+AEkbBpqzaXKsbGAB+YZgNstr97BgAWhgdmsTL0MBna0A7BkApBkBUqMB8V0BT00BzBjkgFsGFZDGD2ABEEIGTVCQxhykielCMEsbQgli0MJa7U63T6EK+f3+gHsGQBCDIAohhkgG0GQDJDIAgBghiKioW0EW02no9BggFByGCAZ4NAFnagCwEimvQDNDFNAJMM9MAFQyAS4YpnxAFYMgEiGZWAEQZABEMgDEGPiAdQZAGYMgHkGQAGDIBVBg12kQKAw1To5E0FmsdkcTndnhSfhggRgwR9YWZNrQWGyDqdlwCAE4owBWT35ezxv1EexRwORYN2sNER3eRM+oKpgOhIPIEP23NOr1wAJOIuoOsZjlcmCAGXIYIBTuUA0HIkhVKo1my3W8vZ3aoPORt0e-OpWslxEwVumQAyDJrXv9+wbAPoMVqzofHk5d0bjDfsAGZ-Bml9yazA1xqN1v9bugA)

```js
const happyBirthday = (birthday /* ✍🏼 ここに型注釈を書きます */) => {
  const today = { year: 2024, month: 1, day: 1 };
  if (today.month === birthday.month && today.day === birthday.day) {
    console.log(
      `ハッピーバースデー！${
        birthday.year
          ? ` ${today.year - birthday.year}歳のお誕生日ですね！`
          : ""
      }`
    );
  } else {
    console.log("お誕生日ではありません。");
  }
};

// ✅ 想定通りのコード。エラーにならないようにしてください
happyBirthday({ year: 2000, month: 1, day: 1 });
happyBirthday({ year: 1995, month: 5, day: 9 });
happyBirthday({ month: 1, day: 1 });
happyBirthday({ month: 10, day: 10 });

// ❌ 以下はエラーにしてください
happyBirthday({ year: 2000, month: 1 }); // day がないのでエラーにしたい
happyBirthday({ year: 1995, day: 31 }); // month がないのでエラーにしたい
```

:::details 解答例

```ts
const happyBirthday = (birthday: {
  year?: number;
  month: number;
  day: number;
}) => {
  // 略
};
```

:::

### 【レベル 2】引数の型注釈 5（関数）

**「数値を引数に取り、返り値のない関数」** を引数として受け取る関数を考えます。
正しく型注釈を指定して、修正してみましょう。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBMCGAbRMC8MAUAzArmYMA9AFQyCw5IDwbgP-syDKDLYNYMg0eqAXNoBOJgSQyAfZoLIMgfgyBNBhjFCASjQA+GAG8AUDDjhoMAE7wwAEzQwAsvCgALAHRrNIALYZxpAIwAGANzyYufBlMbRTgL5PZhQhhAUHIYQGeDQCztQCwEwCiGQDsGQGaGQB+GQEmGQCAGQAqGQEuGRIZAKwZASIZcwBEGQAiGQDEGBkB1BkAzBkB5BkADBkBVBiLZBGQMDDAcc3FUKTkFAEssTC7zGCkAVnEBhUVIEEQAUyNEEABzTu6vZ29Zbx22xA7e-ucAmEBUfUAHUw5Af3lAeIZc2urAIIYAeQBpZ1AF5dWNhgAERHJYaIE7A5+C6AGXIYIBTuUA0HKAewYsjkag1mq0kMdpFCiIFAEWp13hgDRNDiAQjtALoMZUAFgw1IqAaIZYoBzBjRVUA+gwtI4daAqU4yc6BG4cQDhpoB1bUA6Er06p3QBSDHSGcy2dlOS0hiMMHyjIN8IgcBolhBgfAAEbACEzZwKX4QRYrNabPk7BR7KHY9pbcwAGhgYwATALZhdABragAp1SrFEXyxXVJms9mVLk-JT2gGbEE4sEQnxeIA)

```js
const call = (func /* ✍🏼 ここに型注釈を書きます */) => {
  const rand = Math.random() * 10;
  func(rand);
};

// ✅ 想定通りのコード。エラーにならないようにしてください
call((num) => {
  if (num > 5) {
    console.log(num);
  }
});
call(() => {
  // 引数を使わなくてもOK
  console.log("called");
});

// ❌ 以下はエラーにしてください
call({}); // 関数以外を渡そうとしているのでエラーにしたい
call((str) => {
  // 引数を文字列として使おうとしているのでエラーにしたい
  if (str.includes("abc")) {
    console.log(str);
  }
});
call((num, num2) => {
  // 存在しない引数を使おうとしているのでエラーにしたい
  console.log("called");
});
```

:::details 解答例

```ts
const call = (func: (num: number) => void) => {
  // 略
};
```

:::

### 【レベル 2】引数の型注釈 6（組み込みオブジェクト）

**日付オブジェクト**を受け取り、その日が平日か休日かを判定する関数を考えます。
正しく型注釈を指定して、修正してみましょう。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAlhAEiANnAJgQwJ4wLwwAUWUApjAPQBUMgsOSA8G4D-7MgygwuDWDINHqgFzaATiYEkMgD7NAsgyA-BkCaDDCoUAlPgB8MAN4AoGDFCRYWXARKkAdAHNSUACI5CMgNxqYAJ1MBXe2Bg78eAgAYYAHz93HE8CADZbAF9bFQoKGEBQchhAZ4NALO1ALATAKIZAOwZAZoZAH4ZASYZAIAZACoZAS4Y89kArBkBIhirAEQZACIZAMQZ2QHUGQDMGQHkGQAMGQFUGepUEZDQdQjBSAHcYCzIrGyGkVAxLCenZ0kIAIgAmbx2AFgBafaOARm8tmQXh5bG1mcw53e8zgHZz73Odq4WYuMAMuQwQCncoBoOUA9gzlSqdXoDRYjFbYbZ7Q4nM5oq7WShxDYgwBomvxAIR2gF0GZqACwZOvVANEMWUA5gxQ9qAfQZBrdRpY9gBmAAcFwuNmxjzI+KJpIpHWpdIZbWZQA)

```js
const isHoliday = (date /* ✍🏼 ここに型注釈を書きます */) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

// ✅ 想定通りのコード。エラーにならないようにしてください
isHoliday(new Date());
isHoliday(new Date("2024-02-10"));
isHoliday(new Date("2017-10-12"));

// ❌ 以下はエラーにしてください
isHoliday("2024-01-01"); // Date 以外を渡そうとしているのでエラーにしたい
isHoliday(20381010); // Date 以外を渡そうとしているのでエラーにしたい
```

:::details 解答例

```ts
const isHoliday = (date: Date) => {
  // 略
};
```

:::

### 【レベル 2】引数の型注釈 7（イベントリスナー）

HTML 要素に **keydown のイベントリスナー** を追加するコードを考えます。
正しく型注釈を指定して、修正してみましょう。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAFgQzAEwDYFMDS6CeAREAdzBgF4YAKdGAegCoZBYckB4NwH-2ZBlBg8GsGQaPVALm0ATiYCSGQB9mgWQZAfgyBNBhh0aASjIA+GAG8AUDFo0YgUHIYgZ4NAWdqAsBMBRDIDsGQM0MgH4ZAkwyAgBkAVDIEuGW90BWDIEiGT4BEGQAiGQDEGbkB1BkAzBkB5BkADBkBVBj8tGABLADNKdAA6AGtcMlJyACIAUTAodAAnAqVNbW1QSBAMDNQQAHMKYtKKmEBahltAGQZAHqNYwBiGSVDAfQYqgG5EgF8NOdmNZBBgAFcAW3RSjIAjEGQcDIRkZCKANx2oABkk6B2KjpycVeICgBp4JDQsXAJiAppkA)

```js
const handleKeyDown = (e /* ✍🏼 ここに型注釈を書きます */) => {
  // ✅ 想定通りのコード。エラーにならないようにしてください
  if (e.key === "Enter") {
    console.log("Enter キーが押されました");
  }
};

document.body.addEventListener("keydown", handleKeyDown);
```

:::details 解答例

[KeyboardEvent](https://developer.mozilla.org/ja/docs/Web/API/KeyboardEvent) オブジェクトを使います。

```ts
const handleKeyDown = (e: KeyboardEvent) => {
  // 略
};
```

変数にする必要がない場合、無名関数を直接渡して推論に任せることもできます。

```ts
document.body.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    console.log("Enter キーが押されました");
  }
});
```

:::

### 【レベル 3】window を拡張する

グローバルな変数を使う場合、TypeScript に型を教えてあげる必要があります。
たとえば、[Google Tag Manager](https://developers.google.com/tag-platform/devguides/datalayer?hl=ja#use_a_data_layer_with_event_handlers) を使用する場合、Google Tag Manager のスクリプトによって定義される `dataLayer` というグローバルな配列に対して、値をプッシュします。

**`window` オブジェクトに `dataLayer` という配列の型定義を追加** してください。
配列に追加できる値は、任意のオブジェクトとします。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/PTAElhyQeDcH-3UaPVBZ2oSv9BJDIX-jAFSodQZBmDIeQZADBkFUGQEQYAoMkUQUHJRBngwUCwEwKIZA7BkGaGQH4ZBJhkCAGQCoZAlwydA1gyArBkCRDGJKAIhkBiDCNyFSZAO4BLAHYATAPaqAdNoCGAF2MAZYwE8ApgCcDABwCuAZwAWACgDeoWwButpqmAFygAESBwaYA+prGALa2EaAAvgCUANxqWnqGJuZWdo6unr6gAcb26sYARgA2tvFJtuERVTX1TbFVDS4p6dm5OvpGZpY2Ds7u3j5koKAAxroNuvbt9rbaEQA0C8u6mkH2bupHAGrG-W2gAKwADPuL0SHtS+6muonqAF4p+0yOQ0o0MayWZnOmiyoCogCPTQAa2qxAOsMgFuGQCLDIAxhkAxQwiQBBDIAihkA9QyAboZAJ0MgHMGQCyDIBohhG+QMbiW9lWDQAmjD4Ui0VjcYTSZTaRQqIAZclAgFO5QDQcoB7BiEoiUxHIIIZhUmJQMXwAqk4nA4AMLGNy2LzZWFgBGACnUsNIeTiRMTyYBNBhpgAsGOWKQD6DEq8mM6tVOearTaMXaHWTnW7hJ6SEA)

```js
// ✍🏼 型定義を追加してください

// ✅ 想定通りのコード。エラーにならないようにしてください
window.dataLayer.push({ event: "event_name" });
window.dataLayer.push({ variable_name: "variable_value" });
window.dataLayer.push({
  color: "red",
  conversionValue: 50,
  event: "customize",
});
window.location; // 既存のプロパティにもアクセスできる
window.scrollY; // 既存のプロパティにもアクセスできる

// ❌ 以下はエラーにしてください
window.dataLayer.toUpperCase(); // 存在しないプロパティにアクセスするとエラーにしたい
window.bar; // 存在しないプロパティにアクセスするとエラーにしたい
```

:::details 解答例

**例 1: インターフェースを使う**
`interface` は既存の型に新しいプロパティを追加します。

```ts
interface Window {
  dataLayer: object[];
}

window.dataLayer.push({ event: "event_name" });
```

**例 2: 型エイリアスを使う**
`type` は既存の型を変更できず、新しい型として定義します。
`declare` によって`window` の型を指定します。
（モジュールの場合に使えます）

```ts
type ExtendedWindow = Window & {
  dataLayer: object[];
};
declare const window: ExtendedWindow;

export {};

window.dataLayer.push({ event: "event_name" });
```

※個別のファイルに書く必要が出てきてしまうため、 `*.d.ts` ファイルに書くことがおすすめです。

https://dev.classmethod.jp/articles/typings-of-window-object/

:::

### 【レベル 3】オブジェクトのインデックス

**じゃんけんで勝つ手を定義したオブジェクト** を考えます。
例えば、「グーに勝つ手」つまり「パー」を知りたいとき、`win["gu"]` を参照して `"pa"` を得ます。
同様に、「『グーに勝つ手』に勝つ手」つまり「チョキ」を知りたいとき、`win[win["gu"]]` を参照して `"choki"` を得ます。
JavaScript として実行すれば問題なく動くコードですが、TypeScript の型チェックではエラーになってしまいます。
エラーが出ないように修正してください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/PTAElhyQeDcH-3UCoZCXDIH4ZAyDIL8VBWDIEQZARDIMQZBrBkDv5QY2tB1BkDMGQeQZADBkFUGLAKAGMB7AOwGcAXUAdwCW7UAF5QAb0ahQAcwCuALlAAiAA4BDZQBopoZgAtWAawFLl87bo1mDxgZYC+AbkaMQoQKDkoQM8GgLO1AWAmAUQyAdgyAzQxIgJMMgEAMiEgEGICRDNj4BJS0DCwcnKwANgCmAHQ5rDIAFAAGgA0McYC7SoAmDIDSRoD2DAAk4oLsANrmcsoAug7lAJQubFy5hcVlVbWNBPXNbR2dyz39A8OjWRNFJRXV83MLh4vtQivnqxZ9N4Mjru6AMuSggKdygNByTbGp1PRMY9n5XbTA4LVpnLrKQC8G4AZHf6dycoHcgA1tQAU6mRsIBahiQgCSGQBDyoBzR0AmgyAaIZABYMXzIgH0GLBAA)

```js
// ✍🏼 エラーが出ないように修正してください
const win = {
  gu: "pa",
  choki: "gu",
  pa: "choki",
};

// ✅ 想定通りのコード。エラーにならないようにしてください
console.log(`グーに勝つ手は${win["gu"]}`);
console.log(`グーに勝つ手に勝つ手は${win[win["gu"]]}`);
console.log(`グーに勝つ手に勝つ手に勝つ手は${win[win[win["gu"]]]}`);

// ❌ 以下はエラーにしてください
console.log(`グーに勝つ手は${win["👌"]}`); // 存在しないキーを参照するとエラーにしたい
```

:::details 解答例

Widening と呼ばれる型推論の仕組みによって、`win` は `{ gu: string; choki: string; pa: string; }` と推論されてしまいます。
そのため、値を `string` ではなく、具体的な文字列リテラル型にする必要があります。

**例 1: `as const`（const アサーション）**

```ts
const win = {
  gu: "pa",
  choki: "gu",
  pa: "choki",
} as const;
```

**例 2: 型注釈**

```ts
type Hand = "gu" | "choki" | "pa";
const win: Record<Hand, Hand> = {
  gu: "pa",
  choki: "gu",
  pa: "choki",
};
```

:::

## 第 2 章 JS から TS へ ～型ガード～

「JavaScript では問題ないものの、TypeScript ではエラーになる」書き方のうち、
型注釈は必要ないものの、分岐（型ガード）が必要になるケースを修正してみましょう。

### 【レベル 1】型ガード 1（`find`）

`.find()` で見つかった要素に対して処理を行うコードを考えます。
条件に一致する要素が見つからなかった場合は `undefined` になるため、プロパティにアクセスするとエラーになります。
エラーにならないように修正してください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAllApgWwjAvDA2gKBjAb3gBMAuGARgBoYwBDZRcgIgRQuZgF8q9CTyAJhr1GLNskGcefInDIwAzCIZMYrJMkXTeAXQDcOUJFgAnRBACuAG1iYJEAHQAzOGGIAKDxICUGAHzwmo7yGOiYFD6GOAD0MTCAsOSAPBuAP-swgBUMgJcMgD8MgNYMgFYMgJEM+YAiDIARDIBiDLmAgAyAZ4qAYC6ASQyAd-KAxtaA6gyAZgyA8gyABgyAqgwlOEbgECDWiI7WIADmHuZWto6iiFFAA)

```js
const items = [
  { id: 1, name: "item1" },
  { id: 2, name: "item2" },
  { id: 3, name: "item3" },
];
const result = items.find((item) => item.id === 1);

// ✍🏼 エラーにならないように、処理を修正してください

console.log(result.name);
```

:::details 解答例

**例 1: オプショナルチェイニング**
この場合、見つからなかった場合は`undefined`が出力されます。

```ts
const result = items.find((item) => item.id === 1);
console.log(result?.name);
```

**例 2: 型を絞り込む**
（`result !== undefined` なども可）
この場合、見つからなかった場合は何も出力されません。

```ts
const result = items.find((item) => item.id === 1);
if (result) {
  console.log(result.name);
}
```

（参考）関数内であれば、早期リターンを使うこともできます。

```ts
function func() {
  const result = items.find((item) => item.id === 1);
  if (!result) return;
  console.log(result.name);
}
```

**例 3: 非 null アサーション**
`!`（非 null アサーション演算子）を使うと「絶対に存在する！（null や undefined ではない！）」ということを TypeScript に伝えることができます。
ただし、型を上書きするだけで処理を変更するものではないため、`result` が `undefined` の場合は実行時エラーになります。
あくまで開発者が `result` が `undefined` にならないことを保証できる場合にのみ使うべきで、使用はできるだけ避けましょう。

```ts
const result = items.find((item) => item.id === 1)!;
console.log(result.name);
```

:::

### 【レベル 1】型ガード 2（`querySelector`）

**特定のクラス名を持つ要素を取得し、クリックイベントを設定する** コードを考えます。
ここで、`querySelector()` の返り値には `null` が含まれます（そのクラス名のついた要素があるとは限らないので、存在しない場合は `null` になります）。
`null` に対してメソッドを呼び出すことはできないため、エラーにならないように修正してください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/PTAElhyQeDcH-3UCoZCXDIH4ZDWDIKwZCRDGwIgyAiGQYgwqBnioGAugSQyB38oMbWg6gyBmDIPIMgBgyCqDNgFADGA9gHYDOAF1ABTADYiAtiN7CAvKAAm3TgFdpsgHQBHVSIBOATwDK4kZ0Hd9ACgBEmzmICG-frYCUAbnZmNgzU6KigCiAG4yggAyAJZCMgZ2jtGcANa2ADSg1u6gcgB8oADe7KCgPALcEppi3ADmdoD1DIBXDIDDDA0sgDEMgH4MNID6DB7eAL5eQA)

```js
// ✍🏼 エラーにならないように処理を修正してください
const element = document.querySelector(".class");
element.addEventListener("click", () => {
  console.log("クリックされました");
});
```

:::details 解答例

**例 1: オプショナルチェイニング**

```ts
const element = document.querySelector(".class");
element?.addEventListener("click", () => {
  console.log("クリックされました");
});
```

**例 2: 型を絞り込む**
（`element !== null` なども可）

```ts
const element = document.querySelector(".class");
if (element) {
  element.addEventListener("click", () => {
    console.log("クリックされました");
  });
}
```

（参考）関数内であれば早期リターンを使うこともできます。

```ts
function func() {
  const element = document.querySelector(".class");
  if (!element) return;
  element.addEventListener("click", () => {
    console.log("クリックされました");
  });
}
```

**例 3: 非 null アサーション**
`!`（非 null アサーション演算子）を使うと「絶対に存在する！（null や undefined ではない！）」ということを TypeScript に伝えることができます。
ただし、型を上書きするだけで処理を変更するものではないため、`element` が `null` の場合は実行時エラーになります。
あくまで開発者が `element` が `null` にならないことを保証できる場合にのみ使うべきで、使用はできるだけ避けましょう。

```ts
const element = document.querySelector(".class")!;
element.addEventListener("click", () => {
  console.log("クリックされました");
});
```

:::

### 【レベル 2】型ガード 3（`querySelectorAll`）

DOM 操作の際に、特定の要素に対して処理を行うことがあります。
ここでは、 **特定のクラスを持つ `button` 要素に対して `disabled` を設定する** 処理を考えます。

このとき、 `querySelectorAll` で要素を取得するとひとつひとつの要素は `Element` 型になります。
（`button`要素に限らず、`div` や `a` など他の要素も含まれる可能性があるのでこうなります）
そのため、 `disabled` にアクセスするとエラーになります。
エラーにならないように修正してください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/PTAElhyQeDcH-3UCoZCXDIH4ZDWDIKwZCRDGwIgyAiGQYgwqBnioGAugSQyB38oMbWg6gyBmDIPIMgBgyCqDNgFAAmA9gMYCuAWwCmAOwAuAOgCO-YQCcAngGVhAG2G9x3eQEE1agBQAiSQGcADpoCWAQzUBaAEb9x20cYCUkgGY6Aora8ABaGhi5u3KKeoAC8AHygAN7soKAR7pKc1ma2ThqccaDi8nIA3OwAvp5lQA)

```js
// ✍🏼 エラーにならないように処理を修正してください
document.querySelectorAll(".special-button").forEach((button) => {
  button.disabled = true;
});
```

:::details 解答例

**例 1: `instanceof` で型を絞り込む**

```ts
document.querySelectorAll(".special-button").forEach((button) => {
  // この行では button は Element 型
  if (button instanceof HTMLButtonElement) {
    // この行では button は HTMLButtonElement 型
    button.disabled = true;
  }
});
```

**例 2: `disabled` を持つかどうかをチェックする**

```ts
document.querySelectorAll(".special-button").forEach((button) => {
  if ("disabled" in button) {
    button.disabled = true;
  }
});
```

**例 3: `querySelectorAll` で要素名を指定し、クラス名は `matches` でチェックする**
`querySelectorAll` の引数が要素名と一致する場合、その要素の型を返します。
（ただし、取得される `button` 要素の数が多い場合、`forEach` のループが元の実装よりも重くなる可能性があります）

```ts
document
  .querySelectorAll("button")
  .forEach((button /* すでに button は HTMLButtonElement 型 */) => {
    if (button.matches(".special-button")) {
      button.disabled = true;
    }
  });
```

**例 4:（できれば避けたい）ジェネリクスを使う**
`querySelectorAll` のジェネリクスを使って返り値の型を指定できます。
ただしこれは、`querySelectorAll` で取得した要素が `HTMLButtonElement` であることを保証するものではないため、実行時にエラーが起きる可能性があります。

```ts
document.querySelectorAll<HTMLButtonElement>(".button").forEach((button) => {
  button.disabled = true;
});
```

**例 5:（非推奨）型アサーションを使う**
以下でもエラーの回避は可能ですが、推奨しません。
ジェネリクスと同様に、実行時にエラーが起きる可能性があります。
さらに、ジェネリクスでの型指定以上に実際と異なった型を指定できてしまうため、型安全性が低くなります。

```ts
document.querySelectorAll(".special-button").forEach((button) => {
  (button as HTMLButtonElement).disabled = true;
});
```

:::

### 【レベル 2】型ガード 4（エラー）

`try...catch` でエラーをキャッチするコードを考えます。
`try` ブロック内でエラーが発生した場合、`catch` ブロックにエラーオブジェクトが渡されます。
`tsconfig.json` で `strict: true` を設定している場合、キャッチしたエラーオブジェクトの型は（`any` ではなく）`unknown` になります。
そのため、エラーオブジェクトのプロパティにアクセスするとエラーになります。
エラーにならないように修正してください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/C4JwngBA3gUBEEsBmEAUA7ApgdwgEQENhNUBKAOgHNNgAxAVwBtGBNTAkMiAPggCYADAFYBpaHHgRgACxAB7XFlwBREPM4AiQFTmgLO1Alf6BzBkCaDICAGDaQDcEgL4SAxnPQBnOY0zlGcyqg0BlenZ2mE5O5lbWEHZEdtJomGKw8AD0SRCAsOSAPBuAP-sQgBUMgJcMgD8MgNYMgFYMgJEMpYAiDIARDIBiDMWAZ4qAYC6ASQyAd-KAxtaA6gyAZgyA8gyABgyAqgxV9o4ubh5eqO4AtsFOBNSWMNZAA)

```js
try {
  if (new Date().getFullYear() > 2050) {
    throw new Error("未定義です。");
  }
  console.log("Success");
} catch (e) {
  // ✍🏼 エラーにならないように処理を修正してください
  console.log(e.message);
}
```

:::details 解答例

**例 1: `instanceof` で型を絞り込む**
`e` を `Error` 型として扱うためには、`instanceof` を使って型を絞り込む必要があります。

```ts
try {
  if (new Date().getFullYear() > 2050) {
    throw new Error("未定義です。");
  }
  console.log("Success");
} catch (e) {
  if (e instanceof Error) {
    console.log(e.message);
  }
}
```

**例 2: `typeof` や `in` で型を絞り込む**
この方法でも`message` プロパティにアクセスできますが、`Error` オブジェクトを想定している場合にはやや冗長です。

```ts
try {
  if (new Date().getFullYear() > 2050) {
    throw new Error("未定義です。");
  }
  console.log("Success");
} catch (e) {
  if (typeof e === "object" && e !== null && "message" in e) {
    console.log(e.message);
  }
}
```

:::

## 第 3 章 より安全な型へ

ここからは、そのままでも TypeScript として正しいコードではあるものの、より安全な型指定にする余地のあるコードを修正していきます。
意図しないコードに対してエラーが起きるような型指定をすることで、バグを未然に防ぐことができます。

### 【レベル 1】変数の型注釈

条件に応じて真偽値を代入するコードを考えます。
正しく型注釈を指定して、真偽値以外の値が代入された場合にエラーになるように修正してみましょう。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/DYUwLgBAlgzgygYwE4HtigCYG4IHpcSCw5IDwbgP-sSDR6oBc2gE4mBJDIL-xgBUqDqDIGYMg8gyAGDIKoMgIgwAoAQHcoAOwwphAOgCGGDAFEAbiDFgAMrDBqQSABQAiGMjTBDAGgj6AlBAC8APggBvARGgAza6IlTpJqjoAJoQzgCsAAyRdm4eHvgQgKDkEIDPBoBZ2oBYCYBRDIB2DIDNDIA-DICTDIBADIAVDICXDIWA1gyAVgyAkQx1fIARDIBiDDXs3Pzu8bCIQZgOEGBIAK4gWL0AvhAgwDAgrr0JBIAy5BBVtV28gvHQ8KboIBjDhgByAPKGUx7TQh5Q3vr9R5ixKxAIKGIwaCDSYAoADmRkAnQyAeoZALcMhUA1ww8QAxDIA-BhYgH0GQw2W4Qe7TTFAA)

```js
let isScrolled; // ✍🏼 型注釈を追加してください

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    // ✅ 想定通りのコード。エラーにならないようにしてください
    isScrolled = true;
  } else {
    // ❌ エラーにしてください
    isScrolled = "NO";
  }

  if (isScrolled) {
    console.log("スクロールされました");
  }
});
```

:::details 解答例

```ts
let isScrolled: boolean;
```

:::

### 【レベル 1】関数の返り値の型注釈

関数の実行が成功したか失敗したかを真偽値（`true`, `false`）で返す関数を考えます。
正しく型注釈を指定して、真偽値以外の値が返された場合はエラーになるように修正してみましょう。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBMAWBTYBrAygV2MREIwF4YAKASzAAcMoAuGaAJ3IHMBKGAegCoZBYckB4NwD-7MQCvxgKIZAJAqA7BkDR6oCSGQLRRgLO1A6gyAzBkDyDIAMGQKoMgEQYYXDoQB8MAN4AoGDFIAzEuSqwCrmACJEDBiAbv2VjY2DIhQGAxgANycxoAy5DB2AIYANhCIMHIigJoMUnKAG-qAMQxqeoDRDFKA5gyAFQyAlwyAPwyA1gzq2vrWMAC+rSFhETBQDBiI0RzGgKDkMIDPBkqAWAliUoDNDLWAkwyAQAw1DYBWDICRDOt6gBEMgGIMjZq6epZtkUA)

```ts
const checkSuccess = (input: string) /* ✍🏼 返り値の型を設定してください */ => {
  if (input === "error") {
    return; // ❌ false を返すのを忘れているのでエラーにしてください
  }
  return true; // ✅ 想定通りのコード。エラーにならないようにしてください
};
```

:::details 解答例

```ts
const checkSuccess = (input: string): boolean => {
  if (input === "error") {
    // return; // 😊 嬉しいことに、true, false 以外を返しているとエラーになります
    return false;
  }
  return true;
};
```

:::

### 【レベル 2】ユニオン型

**曜日を表す文字列** を受け取って、平日か休日かを返す関数を考えます。
正しく型注釈を指定して、想定外の文字列が渡された場合はエラーになるように修正してみましょう。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBA5gUygEQIYE8CyCIVYmAXhgAoAoGGAEwwC4ZoAnASzDhgHoOZBYckB4NwD-7MQMoMgOwZA0eqAkhkB38oGNrQOoMgMwZA8gyADBkCqDIBEGMgEoiAPhgBvCgwDuzKMAAWpGuj0nKlYKggIYAIkwB5AHKetKYubh6eACoAqgCigcEwru5eAOrRyHHOCaFe4QASkRnOiWEAYgBKAJKBxvGUjEgAroxgXoDOeoCnpoDmDICaDJ4A3PEAvvHFXgDKAILhhSFJnmORAfROmTD1UE0tnoCI8l29A5nDmVQIAGaoDQA2UMu1a43NB85HMMODA2RcMICg5DCAzwaALO1AFgJgCiGUSAZoZAD8MgEmGQBADIAKhkAlwyQwDWDIArBkAkQxozSACIZAGIMKKUai0ZFAkBAlwQADpLiA4CRECgMNhcPgECRvP5PDodH1ONxPB0ep5SeAIBTqbT6Yy0FgcHhEByFgEeXyvjs9iLPtxADLkMEAp3KAaDlAPYMSNRRI02jJ4spNLpDKQspZCvZngmACEAMLc3mi8m2qUOply1mKzwAW3APoG1olduljuZ8rZHJKLHs0b9Nsl9plSdDrsmUTKyAmAE1o0A)

```ts
const getDayMessage = (
  day: string // ✍🏼 この型を修正してください
) => {
  switch (day) {
    case "MON":
    case "TUE":
    case "WED":
    case "THU":
    case "FRI": {
      return "平日です";
    }
    case "SAT":
    case "SUN": {
      return "休日です";
    }
    default: {
      return;
    }
  }
};

// ✅ 想定通りのコード。エラーにならないようにしてください
console.log(getDayMessage("MON")); // "平日です"
console.log(getDayMessage("SUN")); // "休日です"

// ❌ 以下はエラーにしてください
console.log(getDayMessage("ABC"));
console.log(getDayMessage("mon"));
console.log(getDayMessage("Friday"));
console.log(getDayMessage("SATURDAY"));
```

:::details 解答例

```ts
const getDayMessage = (
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"
) => {
  // 略
};
```

:::

### 【レベル 2】引数を読み取り専用にする

**配列を受け取って、新しい要素を追加した配列を返す関数** を考えます。
`.push()`, `.sort()` などのメソッドは、元の配列に影響を与えます。
そのため、引数を変更するつもりがなかったのに、意図せず元の配列が変更されてしまうことがあります。
これを防ぐために、 **引数を読み取り専用** にしてください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAhgEwQSSgUwLYwLwwBRwBOhcAngFwxgCuGARmoQNoC6MA9AFQyCw5IDwbgH-2YgZQZAdgyBo9UBJDIDv5QMbWgdQZAZgyB5BkAGDIFUGQCIMMTuwCUOAHwwA3gCgYHdjEAy5DEDCiqMCyiYHQlSYEhNQC9mS+YD8GQGIMgPoMgIEMgIAMgBUMgJcMgD8MgNYM8oGaFvDEZAB0AA7UEAAWeAAsegDcyYRoUNSEYCkkpCUAviVmoJCwIIQAlgDmHWBwADY4MEwAjAA0MABMEwDMLCUt0FRoAO4AgqmkQ4go6Bh47d29A8XN4BAg-Whp-SBdeGCrG7XFVsPjU7MT+SxnkJfXW73Q49Pr9V7sayACH+vIBNBkA0QyAEwZAEEMgCiGQAyDIArBkA0gyAYwZArFkYAi1MA8QyASIZAFoMgEh-94wMbTGAzb5sWKY3GKPyaXywoA)

```ts
const addItem = (array: number[] /* ✍🏼 この型を修正してください */) => {
  // ❌ 元の配列を変更してしまうため、エラーにしたい
  array.push(4);
  return array;
};

const original = [1, 2, 3];
const newArray = addItem(original);
console.log(newArray); // [1, 2, 3, 4]
console.log(original); // （変更するつもりがなかったにも関わらず） [1 ,2, 3, 4] になってしまいます
```

:::details 解答例

`readonly` をつけることで、読み取り専用の配列にできます。

```ts
const addItem = (array: readonly number[]) => {
  // 😊 嬉しいことに、元の配列を書き換える操作はエラーになります
  // array.push(4);

  // なので、新しい配列を作成して返すことで、元の配列に影響を与えないようにする
  return [...array, 4];
};
```

`readonly number[]` は、`ReadonlyArray<number>` と書くこともできます。

```ts
const addItem = (array: ReadonlyArray<number>) => {
  // 略
};
```

（参考）typescript-eslint には、関数の引数が読み取り専用であることをチェックするルールがあります。
[prefer-readonly-parameter-types | typescript-eslint](https://typescript-eslint.io/rules/prefer-readonly-parameter-types/)

:::

### 【レベル 2】テンプレートリテラル型 1

**日付を表す文字列** を格納する変数を考えます。
ここでは、 **`年/月/日`（スラッシュ区切り）の形式の文字列のみ** に制限したいです。
スラッシュ区切り以外がエラーになるように修正してみましょう。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAJgQygUwDIEtoC4bQE7pgDmA2gLowD0AVDILDkgPBuA-+zIMoMgdgyDR6oEkMgd-KDG1oHUGQGYMgeQZABgyBVBkAiDDGqUYAXhgkAUDCoLAoOQxAp3KBoOUD2DIGeDQFnagLATAUQztARvqB4fUBADIAqGQJcMgH4ZA1gyArBkCRDF+mAEQyAYgweIhIy6jAARABMAAxxAIyUAByUMQAsUQA0kbEJAGyUickAzHE5efFxAJyUdYmVkZQKgDLkekaunoKA+gzSgOYMgJoMVUkxALQpY4kFOZowgFzKgOBKloDhpoDq2oAyDICqCUHs-V2hfSOJAKxxAOwxNbMtC8vrG-57B73SIzHJiRXZc4CnpuyAC4TAGBKj2kz3chzeZAA3EA)

```ts
const dateList: string[] /* ✍🏼 この型を修正してください */ = [
  // ✅ 以下は想定通りの形式。エラーにならないようにしてください
  "2001/8/24",
  "2006/11/30",
  "2009/9/1",

  // ❌ 以下はエラーにしたいです
  "2012-8-16", // 区切り文字が違うのでエラーにしたい
  "20150729", // 区切り文字がないのでエラーにしたい
  "2021/10", // 日の部分がないのでエラーにしたい
];
```

:::details 解答例

```ts
const dateList: `${number}/${number}/${number}`[] = [
  // 略
];
```

:::

### 【レベル 2】テンプレートリテラル型 2

リンクの情報を持つオブジェクトを考えます。
**`href` は `/` から始まる文字列か、`http://` または `https://` から始まる文字列** に制限したいです。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/C4TwDgpgBAcghgNwJLAgWygXigbwFBRQA2cARhEQFxQDOwATgJYB2A5gNwFQAW9EAZtTpM27KAHpxUQLDkgHg3AP-tRAygyA7BkDR6oCSGQHfygY2tA6gyAzBkDyDIAMGQKoMgEQY8AX054AxgHtmdKI1Roa1eMg8BtAF0sKD8uSShAUHIoQFO5QGg5QHsGQGeDQCztQCwEwCiGFUBmhkAfhkBJhkBzBkBNBkAgBkAKhkBLhhzAawZAKwZASIZai0AIhkAxBmrDU0suHGIyCmoAIgAJRzQIQYAaHj5BKEHxQahrSZ6+8ip5gEFSRwBXYCmZgSHxMn3D5dXCXpINoYBhZ2A4e0Pp3hP58SdmF7elis1ncBttyMNGPRHDRuIwjp85oNuMBgGBKJJ+rCoTDGAA6Ei4pyOexwZi4gBWYEWV2B-U2gwA4o5HKwiBMPrMhsjUV5JAB3AW41jM1kQQljQHXXDrUGDAAqfPcqHoUAAFA89vQ+H8iCAoAANACU8M5825YF54mAipREHo4rQkrwYSkgBlyGIJSo1TrmKw3GX0p5-V7vY6I37-S5A-0gwPPEMmr6DXE-eMAmkxulDACiAA84GgwGzE4iBXzcRB84W2Q6nQF2EA)

```ts
type NavItem = {
  label: string;
  href: string; // ✍🏼 この型を修正してください
};

const items: NavItem[] = [
  // ✅ 以下は想定通りのコードです。エラーにならないようにしてください
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "AbeHiroshi", href: "http://abehiroshi.la.coocan.jp/" },
  { label: "Google", href: "https://www.google.com" },
  { label: "Twitter (Currently X)", href: "https://twitter.com" },

  // ❌ 以下はエラーにしてください
  { label: "Contact", href: "contact" },
  { label: "Contact", href: "./contact" },
  { label: "Example", href: "www.example.com" },
];
```

:::details 解答例

```ts
type NavItem = {
  label: string;
  href: `/${string}` | `${"http" | "https"}://${string}`;
};
```

:::

### 【レベル 2】要素数の決まった配列 1

ポケモンの情報を持つオブジェクトを考えます。
ポケモンにはそれぞれにタイプ（属性）が備わっており、1 匹のポケモンが持つタイプは 1 つまたは 2 つです。
**要素数が 1 または 2 の配列**のみを受け入れるように型注釈を指定して、タイプが 0 だったり、3 つ以上だったりする場合はエラーになるように修正してください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/C4TwDgpgBACg9gawgWzgOygXigbwFBRRoCGyEAXFAM7ABOAlmgOYDcBUoklNDzA2gF0WUAPQiogZQZAdgyBo9UBJDIDv5QMbWgdQZAZgyB5BkAGDIFUGQCIMeAL5s8AY3Q0oYegmKmAFgFdK8JKgzZ8hEmUoAiQBWGQGqGQEGGQFOGQDKGPwAadk4KKD4-QHMGQGSGQFkGPwFY4zwzC2AoB2IGAC8SgBMXRBR0LFx2HwS-QCuGQDaGQB+GQEmGQGeGGLjwBKTAbwYpQCkGGKg-QCcGCUAxBiyckzEoQH6GQBKGQHWGQBkGAAYtQGMGQH0GQCiGQEAGAGZAEwZAU7lAKDlD08BNBkBohkAWDUAIFUB7BkAKhkBLhg6gGsGFRHPTJJ55cxoSzxAByjgANgjqm46p5GqRmhtNoAsf8AMwyAa4Z+oR4pRBNFROJ-kCQWCnoAIf8ANOaAZX0voA5hg6gD2GAnY8GASH+jCYoZYEY4mPRiCjah4Gt5Mf4CYA6hkARQzEjiDMl+H6AToZAIsMHUmM3mhsA-gyALQZFpSoNTgaDwUzWTr9YBvhlmc15TwFxiAA)

<!-- prettier-ignore-start -->

```ts
type Pokemon = {
  name: string;
  type: string[]; // ✍🏼 この型を修正してください
};

// ✅ 以下は想定通りのコードです。エラーにならないようにしてください
const pikachu: Pokemon = {
  name: "ピカチュウ",
  type: ["でんき"],
};
const charizard: Pokemon = {
  name: "リザードン",
  type: ["ほのお", "ひこう"],
};

// ❌ 以下はエラーにしたいです
const typeNull: Pokemon = {
  name: "タイプ：ヌル",
  // 要素数が0なのでエラーにしたいです（※問題には関係ないですが、本当はノーマルタイプです）
  type: [],
};
const lugia: Pokemon = {
  name: "ルギア",
  // 要素数が3以上なのでエラーにしたいです（※問題には関係ないですが、本当はエスパー・ひこうタイプです）
  type: ["エスパー", "ひこう", "みず"],
};
const terapagos: Pokemon = {
  name: "テラパゴス",
  // 要素数が3以上なのでエラーにしたいです（※問題には関係ないですが、本当はノーマルタイプです）
  type: ["ノーマル", "ほのお", "みず", "でんき", "くさ", "こおり", "かくとう", "どく", "じめん", "ひこう", "エスパー", "むし", "いわ", "ゴースト", "ドラゴン", "あく", "はがね", "フェアリー"],
};
```
<!-- prettier-ignore-end -->

:::details 解答例

`string[]` 型の場合、0 個でも、1 個でも、2 個でも、3 個でも…要素数に依らず配列であれば受け入れてしまいます。
`[string]` と `[string, string]` はそれぞれ 1 個と 2 個の要素を持つ配列を表します。
これらのユニオン型にすることで、要素数を制限できます。

```ts
type Pokemon = {
  name: string;
  type: [string] | [string, string];
};
```

:::

### 【レベル 3】要素数の決まった配列 2

配列の先頭の要素の先頭の文字を取得する関数を考えます。
引数の型が `string[]` だと、配列が空でも受け入れますが、実行時にエラーが発生してしまいます。
引数の型を **「要素数が 1 以上の配列」** に制限して、コンパイル時にエラーが出るようにしてください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAFgUwIYBMDyAzAEslMC8MAFEgE6lICeAXDNKQJZgDmA2gLowD0AVDILDkgHg3AP-sxAygyA7BkDR6oCSGQHfygY2tA6gyAzBkDyDIAMGQKoMgEQYYPLgEoCAPhgBvAFAwYpBFACupMDDIVKrAAzsAdMDhkAIJQRJ6GANyWAL6RllxcMICg5DCAzwaAWdqAWAmAUQwSgM0MgD8MgJMMlqCQIAA2CD7lIMxEiKiYOKhErABEUAjQbeyGEdwJsIAyDIBfioDZSlqAMQyAfgyAmgwl4BAVVTV1DejYuK1tiOU1bQA0MG0A7iCk5Sg9feED8DCjEzPzpUuV1bX1uE1b7YHlAAcAodjgAhCgANxAILaAGEAhcGAgYQARBDlKBIa79eIwQIPcZTOaWOIJQAy5DBAKdygGg5IaACoZAJcM+UA1gyAKwZJoAHBgUgGPIwDmDC9FssPmtvpsWhwbndAPnagBkIwBCZszGSzWVk5kA)

```ts
const headOfHead = (array: string[] /* ✍🏼 この型を修正してください */) => {
  return array[0].charAt(0);
};

// ✅ 想定通りのコード
console.log(headOfHead(["test"])); // t が出力されます
console.log(headOfHead(["hello", "world"])); // h が出力されます
console.log(headOfHead(["Alpha", "Bravo", "Charlie", "Delta"])); // A が出力されます

// ❌ 以下がエラーになれば正解です
console.log(headOfHead([])); // 実行時にエラーになります
```

:::details 解答例

以下のように指定することで、「要素数が 1 以上の配列」を表現できます。

```ts
const headOfHead = (array: [string, ...string[]]) => {
  return array[0].charAt(0);
};
```

:::

### 【レベル 3】判別可能なユニオン型 1

図形の形と大きさを表すオブジェクトを受け取り、その図形の面積を返す関数を考えます。
**`type` が `"circle"`（円）の場合は `radius`（半径）が必須、`type` が `"square"`（正方形）の場合は `side`（辺の長さ）が必須** になるように型を修正してください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/PTAElhyQeDcH-3UZQZB2DIaPVBJDIO-lDG1odQZBmDIeQZADBkFUGQEQYAoAFwE8AHAU1AGUALAQ3tAF5QBvM0UNXoAuUAGcKAJwCWAOwDmAbn6hJrACbSArmID8o2VoC2AIzqTlAsdPV19oQ6fPKAvsrIBjAPayJoeXQUAIKSdKxcoAAUYmwiTLF0AJRcAHy8KmIA7tIUHsxRMex0AHRCSekCAh6sYgwARB7Skh4ANnR1wiqVqoFakrKgALKsFMzFAAoAkqAAVOIJxWqaOrNzAEyWldW1oHViAI5arKEdXZWhFH0DhfTF1raroBsqLmRuZGQgoICg5KCAzwaALO1AFgJgCiGBCAZoZAD8MgEmGQBADIAKhkAlwyQwDWDIArBkAkQxokiACIZAGIMKNwhFInh8Yi8bWKLS88kiAWCoVYkR4glodFEDSarXaABpVBptGJRABmUAuRKJZTeXwUkrU2n0kJhZmsuJ7Q7HXniGzs0AAFjFEvcX0AMuSgQCncoBoOUA9gxI1FE4jkaXkynyumBJVMlllDmNZptOqGyWgL5LQWgQAyDNiEIBzBjthMA+gxOsmyqk090M5Xetkcg5HE5BxQhsD3BhRkix+NYJOkmWu9OKxkqn27P3cup8sM6URrPml0QG8XBr6ATXlABBRaMA6wyAW4ZAIsMgDGGQDFDBHAEIMgGiGSvIxPJutyhsepvZtVSaSsBQBwvF0CADW1ABTqWGxqoYaM39qTQA)

```ts
// ✍🏼 この型を修正してください
type Shape = {
  type: string;
  radius?: number;
  side?: number;
};

const getArea = (shape: Shape) => {
  switch (shape.type) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
  }
};

// ✅ 想定通りのコード。エラーにならないようにしてください
console.log(getArea({ type: "circle", radius: 3 }));
console.log(getArea({ type: "square", side: 4 }));

// ❌ 以下はエラーにしてください
console.log(getArea({ type: "circle" })); // radius がないのでエラーにしたい
console.log(getArea({ type: "square" })); // side がないのでエラーにしたい
console.log(getArea({ type: "circle", radius: 2, side: 4 })); // 余計なプロパティがあるのでエラーにしたい
console.log(getArea({ type: "triangle" })); // 存在しない type なのでエラーにしたい
```

:::details 解答例

```ts
type Shape =
  | { type: "circle"; radius: number }
  | { type: "square"; side: number };
```

:::

### 【レベル 3】判別可能なユニオン型 2

関数の実行結果をオブジェクトにして返す関数を考えます。
**処理が成功した場合は `error: false` と `value` を返し、失敗した場合は `error: true` と `message` を返す** ように型を修正してください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/PTAElhyQeDcH-3UZQZB2DIaPVBJDIO-lDG1odQZBmDIeQZADBkFUGQEQYAoAFwE8AHAU1ACU6BnAVwBsLQBeUAbzKhQdAE6iA9qIBcoAEYSJHOgEMAdgG4hoAG4qObOgH5ZatgFs5YrcPOsWKgObHZLCqICWax1oC+WsgBjCTU3UBYAR1FuPgAKLxo2ClMLK1EASllmdi5eAD4BbQ8AM1B4tUTuAB5QAAZ0wuFhEFBAUHJQQGeDQCztQCwEwCiGBEBmhkAfhkBJhm1hUToKNlE1ARFxKVl3QwAaUDsWB2dZACJAApiEQAdTQHsGQHXlQEUGQA25S8A-BkBtBkBkhj3Qf21fEQ4WBhKyhKSvB4fHqjSaLUAMuS6fSGFCAahVAIEMOBIgCsGEiAfQYEYAKhkAlwzDQDWDLhCKQJqApjM5gsxJIZKBivofm8bG8voy-uVKkC+ABGBqCJqgSGgQCwcoBAyJRgHWGQC3DIBFhkAYwyAYoZ4UiSIBohkxuIJROI5AF5Nm834ixpsnp3zoGz0Bjosm5Gy2OxtoD2gCwibmgU6AQwZAOEMgDEGQCWDNzAOYMgE0GV7vYSfOjmsHNMDtbr9IZjUn6ylG6nLOkMi3Q62yACyKgoAAsAHSRaIcpINCNvMj+IA)

```ts
// ✍🏼 この型を修正してください
type Result = {
  error: boolean;
  value?: number;
  message?: string;
};

const sqrt = (input: number): Result => {
  if (input < 0) {
    // ✅ 想定通りのコード
    return { error: true, message: "負の数は受け付けません" };
  } else if (input === 0) {
    // ❌ valueを含めていないためエラーにしてください
    return { error: false };
  } else if (input === 1) {
    // ❌ 不要なプロパティを含めているためエラーにしてください
    return { error: false, value: 1, message: "√1 はちょうど1です" };
  } else {
    // ✅ 想定通りのコード
    return { error: false, value: Math.sqrt(input) };
  }
};
```

:::details 解答例

```ts
type Result =
  | { error: true; message: string }
  | { error: false; value: number };
```

:::

### 【レベル 3】`switch` 文の網羅性チェック（exhaustiveness check）

信号の色を表す文字列を受け取り、それに応じて行動を返す関数を考えます。
以下のコードでは `"YELLOW"` に対する処理が抜けています。
**`switch` 文で全てのケースを網羅しているかをチェック**して、抜けている場合はエラーにしてください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAhsKBLcMC8MAUAbJBzACygC4YAiAJQFEARMmAH3IE0qAZNgeQHV6myA4tSoA5MgEp0APhgBvAFAwYEAO5IowAllyEokhUqXA4EAKblqdUgcNHwEENlMA6bCDyYygI2tAfgyAYhgkAbkVbGAAjACdTOABrYNsAXxCjE3NBYTFrZMNQSEcXNw8yQCYEwECGIOylSOi47KTbABNTADM4AFdsEjlKmAB6XphAGXIyVg4eekBrBkA-7UBNBkBohkAzxUAwF0AZBkAco0BFBkAzBkARBjnAOwZAcwZACoZAS4ZAH4YJwHUGLcB5BkADBkBVBh2e-phAWHJAHg3AH-2YQGUGfaANYZALcMgGGGQD1DBNAAxKgBUEq6AfQZAJEMZ0ugCsGOaACIZAGIME0Ad-KAY2sbg9nj1qrF4oZ6jAkglgvIEMhwJ5LBUGSgwJ4hFRRKzEOzPKMuLxxIEgA)

```ts
const action = (light: "RED" | "YELLOW" | "GREEN") => {
  switch (light) {
    case "RED": {
      console.log("止まれ");
      break;
    }
    case "GREEN": {
      console.log("進め");
      break;
    }
    default: {
      // ❌"YELLOW" に対する処理が抜けているのでエラーにしてください
      // ✍🏼 このブロックに到達したらエラーになるように修正してください
      break;
    }
  }
};

action("RED");
action("GREEN");
action("YELLOW");
```

:::details 解答例

「どんな値も入らない」ことを表す `never` 型を使うことで、`switch` 文の網羅性をチェックできます。
網羅されていれば、`default` ブロックでは `light` が `never` 型になるはずです。

**例 1: `satisfies never`**
`satisfies` は TS 4.9 で追加された比較的新しい機能で、変数がその型を満たすかチェックできます。

```ts
const getAction = (light: "RED" | "YELLOW" | "GREEN") => {
  switch (light) {
    case "RED": {
      console.log("止まれ");
      break;
    }
    case "GREEN": {
      console.log("進め");
      break;
    }
    default: {
      // "YELLOW" に対する処理が抜けているのでエラーになります
      // case "YELLOW": を追加するとエラーが消えます
      light satisfies never;
      break;
    }
  }
};
```

**例 2: `never` 型に代入する**
TS 4.9 未満ではこちらの方法が使えます。
ただし、使用しない変数が生まれてしまうため、 `satisfies` が使えるならそちらがいいでしょう。

```ts
const getAction = (light: "RED" | "YELLOW" | "GREEN") => {
  switch (light) {
    case "RED": {
      console.log("止まれ");
      break;
    }
    case "GREEN": {
      console.log("進め");
      break;
    }
    default: {
      // "YELLOW" に対する処理が抜けているのでエラーになります
      // case "YELLOW": を追加するとエラーが消えます
      const _exhaustiveCheck: never = light;
      _exhaustiveCheck;
      break;
    }
  }
};
```

（参考）typescript-eslint の `@typescript-eslint/switch-exhaustiveness-check` を活用することもおすすめです。

[switch-exhaustiveness-check | typescript-eslint](https://typescript-eslint.io/rules/switch-exhaustiveness-check/)

:::

### 【レベル 3】不明な返り値の型ガード

JSON 文字列をパースして、パースしたオブジェクトの特定のプロパティにアクセスするコードを考えます。
`JSON.parse()` は `any` 型を返しますが、本来 `unknown` 型を返すべきです（どんな値になるか、実行するまでわからないため）。
`any` にすればコンパイルエラーは回避できますが、実行時にエラーが発生してしまいます。
値の型を絞り込み、エラーを回避してください。

[TS Playground で解く](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAZgVzMGBeGAKAhgJwOYBcM0OAlmHgJRoB8MA3gFAwyiSwAOuEApgCZEkAazAgA7mDQwAUgGUA8gDkAdFxy9s+SgG5mMAPT6YgWHJAPBuAf-ZiAKhkCXDIB+GQNYMgKwZAkQxPAIgyAIhkBiDA8B38oDG1oDqDIBmDIDyDIAGDICqDO56bBAgADY8yokgeBhqvHzKYFgAtilQIACqHBw8OADCWBqUOowAvrqMiMgYAAb0MABEeYU9RD0AgomkwDw9MI0dOgZGIwAyAJJVAKI9rUjAnd19BZNDAEYgR1Mzc4a9AELy15tb7V29-YcwACwADO-Ts9rzMEA+dqAGQjAEJmDlsjicgCiGQB+DIBNBkeO2ePSweDeACZPr9LkYQeDIc44Yi2js+ghEokerigWCIfYiQikRgelAcAhJjT8fSocSgA)

```ts
const func = (arg: string) => {
  const parsed: unknown = JSON.parse(arg);
  // ✍🏼 エラーにならないように修正してください
  console.log(parsed.name.toUpperCase());
};

func(`{ "name": "Alice" }`); // "ALICE"
func(`{ "name": "bob" }`); // "BOB"

func(`{ "name": 404 }`); // 実行時にエラーになります
func(`{ "age": 20 }`); // 実行時にエラーになります
func("null"); // 実行時にエラーになります
func("true"); // 実行時にエラーになります
```

:::details 解答例

```ts
const func = (arg: string) => {
  const parsed: unknown = JSON.parse(arg);
  if (
    typeof parsed === "object" &&
    parsed !== null &&
    "name" in parsed &&
    typeof parsed.name === "string"
  ) {
    console.log(parsed.name.toUpperCase());
  }
};
```

:::

（参考）`JSON.parse()` が返す値を `unknown` 型にする、 `ts-reset` というライブラリがあります。

https://www.totaltypescript.com/ts-reset

## （参考）その他の型の活用

この記事の問題としては取り上げていませんが、他に TypeScript を活用していく上で知っておくと便利なものをいくつか紹介します。

### ジェネリクス

https://typescriptbook.jp/reference/generics

### ユーティリティ型

https://typescriptbook.jp/reference/type-reuse/utility-types

### type-challenges （型パズル）

様々な型の機能を組み合わせて、複雑な型を作る問題集です。
この記事の問題はレベル 1 〜 3 で設定しましたが、type-challenges はレベル 4 ～ 10 くらいに当たるような難易度です。

[type-challenges](https://github.com/type-challenges/type-challenges/blob/main/README.ja.md)

## おわりに

気が向いたら、随時新しい問題を追加したり、問題の内容を修正したりする予定です。

**学習中の方へ**
わかりにくい部分・解説が足りない部分などあればコメントください！

**TypeScript に詳しい方へ**
誤っている箇所や、こういった問題もあるといいのではといった提案などあれば教えてください！
