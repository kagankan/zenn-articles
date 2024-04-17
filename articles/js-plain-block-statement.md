---
title: "【JS】「ただの {}（ブロック文）」を使うと嬉しいこと" # 即時関数の感覚で使うブロック文 スコープだけじゃない
emoji: "📦"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript"]
published: true
---

JavaScript の **「ブロック文」** をご存知でしょうか。
波括弧（ブレース）で囲む、コレです。

```js:ブロック文
{
  // statement
}
```

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/block

if ブロック `if () {}` や、for ブロック `for () {}` として目にすることが多いですが、 `{}` 単体でもブロック文になります。
これだけだとオブジェクトと思ってしまうかもしれませんが、ブロック文になります。
（オブジェクトとブロック文の解釈については [javascriptのオブジェクトリテラルは評価されるまでは、あくまでブロック文でしかない - メモを揉め](https://memowomome.hatenablog.com/entry/2014/01/18/142100) が詳しいです）

なんの意味もないように見える「ただの `{}`（ブロック文）」ですが、意外と便利なことがあるのでこの記事ではそれを紹介します！

:::message

紹介はするのですが、むやみに使うことはおすすめしません。
あまり一般的な用途ではないため、用法用量を守ってお使いください。
特に複数人で編集する環境では、他のメンバーと相談の上で、使い所を決めることをおすすめします。

:::

## 1. スコープを制限できる

たとえば、処理の前にバリデーションを行い、問題がなければそれ以降の処理に進む関数があるとします。
このとき、 **「処理の冒頭だけ使い、それ以降使わない変数」** が生まれてしまいます。

```js:😖Before
// お酒を提供するよ
const serveAlcohol = (customer, drinkName) => {
  // お酒が飲める年齢かチェック
  const result1 = checkAge(customer);
  if (!result1.ok) {
    throw new Error(result1.message);
  }

  // 運転してないかチェック
  const result2 = checkDriving(customer);
  if (!result2.ok) {
    throw new Error(result2.message);
  }

  // この後処理が続く...
  // 😖 result1, result2 は以降も使えてしまう
}
```

`result1`, `result2` はそれ以降の処理では使う予定がないのですが、コード上は参照できてしまいます。
もし似た名前の変数名が出てきた場合、使うつもりがなくても間違えてしまうかもしれません。

これをブロックで囲むことによってスコープを短くしてみましょう。

```diff js:✅️After: ブロックで囲むことでスコープを制限
  const serveAlcohol = (customer, drinkName) => {
+   {
      // ✅️ ブロックスコープで宣言されるので、スコープの外から参照できない
      const result = checkAge(customer);
      if (!result.ok) {
        throw new Error(result.message);
      }
+   }
  
+   {
      // ✅️ 同じ変数名を使っても OK
      const result = checkDriving(customer);
      if (!result.ok) {
        throw new Error(result.message);
      }
+   }
  
    // ✅️ result はここでは使えない
  }
```

スコープを制限することによって、**使う意図のない範囲では使えないように**できました！

また、スコープを短くできるということは、 **同じ変数名を何回も使える** ということでもあります。
修正前のコードでは同じ名前を使うことができず、区別した名前にする必要がありましたが、スコープを短くしたことで、同じ変数名を使うことができるようになりました。
（これに関しては可読性の問題もあるので、わかりやすさのためにあえて違う名前にするという選択肢も全然あります）

[即時実行関数式 (IIFE) ](https://developer.mozilla.org/ja/docs/Glossary/IIFE#%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%90%E3%83%AB%E5%90%8D%E5%89%8D%E7%A9%BA%E9%96%93%E3%81%AE%E6%B1%9A%E6%9F%93%E3%82%92%E9%81%BF%E3%81%91%E3%82%8B)でも同じことができますが、ブロック文のほうがシンプルです。

:::message

この方法を使う前に、**処理を関数に切り出す**ことも検討するといいでしょう。
適切に関数の分割をした上で、それでも分割するほどでもない場合に使うといいかもしれません。

:::

### `switch` `case` で使用する

`switch` 文の各 `case` でスコープを制限するために使うのも有用です。
`eslint-plugin-unicorn` には `switch-case-braces` というルールがあり、 各 `case` の中身をブロックで囲んでいないことを検出・自動修正できます。

```js eslint-plugin-unicorn/switch-case-braces で検出されるコード例
switch (foo) {
  case 1: // ❌️ Error
    const bar = 1;
    doSomething();
    break;
  case 2: { // ✅️ OK
    const bar = 1;
    doSomething();
    break;
  }
}
```

https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/switch-case-braces.md

## 2. コロケーションを意識したコードが書ける

機能の面では変わらないものの、意識の面で変わることです。
**「ブロック文でまとめられるように」を意識することで、コロケーションを意識できます。**
（コロケーション：関連するものを近くに置く、という考え方。参考： [Web フロントエンドにおけるコロケーション (co-location) という考え方について - mizdra's blog](https://www.mizdra.net/entry/2022/12/11/203940)）

[別の記事](https://zenn.dev/kagan/articles/js-co-location-with-array
) で、配列によってコロケーションを意識したコードが書けるというテクニックを紹介しました。
詳しくはその記事に書いていますが、ざっくり説明すると、
`addEventListener` と `removeEventListener` が別々の行に書かれている Before のコードに対して、配列を使うことで関連する処理を近くの行に書ける After のコードを紹介しました。

この After のコードでは、**それぞれの関連する処理をブロック文でまとめることができるようになっています。**

```diff js:✅️ コロケーションが実現されたコードはブロック文でまとめられる
  /** 停止するときに実行する関数を格納する配列 */
  const cleanupFunctions = [];
  
+ {
    const handleResize = () => {
      console.log("リサイズ時の処理");
    }
    window.addEventListener("resize", handleResize);
    cleanupFunctions.push(() => {
      window.removeEventListener("resize", handleResize);
    });
+ }
  
+ {
    const handleScroll = () => {
      console.log("スクロール時の処理");
    }
    window.addEventListener("scroll", handleScroll);
    cleanupFunctions.push(() => {
      window.removeEventListener("scroll", handleScroll);
    });
+ }

  const stopButton = document.querySelector(".stop-button");
  stopButton.addEventListener("click", () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    }
  );
```

削除するときはブロックの範囲を削除すればいいことがわかりやすいですし、
追加するときも同様にブロックを丸ごとコピペすれば OK です。

上記で紹介したのは「関連する処理を近くに書いたからブロック文で囲めるようになった」という例ですが、
裏を返せば **「ブロック文で囲むような書き方を目指すことで、関連する処理を近くに書くようになる」** ということでもあります。

## 3. VSCodeで折りたたみができる

エディタ上での見やすさ・操作性の面でのメリットもあります。

ブロックスコープは、VSCode で折りたたみができます。
折りたたみができると、今は関係ないコードを隠すことができるので、読みやすくなったり、
範囲選択が楽にできるのでコピーや削除がやりやすくなったりします。

![VSCodeのスクリーンショット。{}（波括弧）で囲まれた範囲が折りたたまれている](/images/js-plain-block-statement/2024-04-14-05-01-12.png)


## 4. VSCode で sticky scrollに対応したコメントが書ける

VSCode の sticky scroll 機能、便利です。
今どこのブロックの中にいるかが確認しやすいです。

https://coliss.com/articles/build-websites/operation/work/sticky-scroll-for-vs-code-171.html#google_vignette


sticky scroll ではブロックの開始行が追従するため、 **開始波括弧の前にコメントを入れておくと追従し、どのブロックにいるかがわかりやすくなります。**
（見出しをつけるようなイメージです）

```js
/* スクロール追従するコメント */ {
  // 処理
}
```

![VSCodeのスクリーンショット。開始波括弧の前に書かれたコメントが追従している](/images/js-plain-block-statement/2024-04-14-06-24-38.png)


このような可読性の上でのメリットがあるので、スコープを制限する目的がなくても、まとまりを意識するためにブロックで囲むというのもありです。
例えば、フロントエンドのテストを書くとき、ブロックを使って見出しをつけるような感じで整理するのもいいでしょう。

```js
/* ログインする */ {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "メールアドレス" }).fill(email);
  await page.getByRole("textbox", { name: "パスワード" }).fill(password);
  await page.getByRole("button", { name: "ログイン" }).click();
}

/* 記事を編集する */ {
  await page.goto("/edit");
  await page.getByRole("textbox", { name: "タイトル" }).fill(title);
  await page.getByRole("textbox", { name: "本文" }).fill(body);
  await page.getByRole("button", { name: "保存" }).click();
}
```

## （追記）`#region` コメント

この記事を引用したコメントの中で `#region` について触れている方がいて、この存在を初めて知りました…！

```js
// #region ログインする
await page.goto("/login");
await page.getByRole("textbox", { name: "メールアドレス" }).fill(email);
await page.getByRole("textbox", { name: "パスワード" }).fill(password);
await page.getByRole("button", { name: "ログイン" }).click();
// #endregion

// #region 記事を編集する
await page.goto("/edit");
await page.getByRole("textbox", { name: "タイトル" }).fill(title);
await page.getByRole("textbox", { name: "本文" }).fill(body);
await page.getByRole("button", { name: "保存" }).click();
// #endregion
```

VSCode では `#region` `#endregion` というコメントによって、その範囲の折りたたみもでき、開始行は sticky scroll で追従します。
単に特定の範囲に対してコメントをつけたいだけであればこちらを使うのもよさそうです。

![VSCodeのスクリーンショット。#regionコメントによってsticky scrollと範囲の折りたたみができている。](/images/js-plain-block-statement/2024-04-17-01-38-35.png)


https://kakkoyakakko2.hatenablog.com/entry/2018/06/01/003000


## おわりに

「ただの `{}`（ブロック文）」のメリットを紹介しました。よければ使ってみてください。

ただし、冒頭にも書いた通り、あまり一般的な記法ではないため、使い所にはご注意ください！
不必要にインデントを増やしてしまうことにもなるので、使いすぎにはご注意ください。

## 参考

http://var.blog.jp/archives/78869523.html

スコープを絞るためにただのブロック文を使うというアイデアが紹介されています。
なお、上記記事で紹介されている [`with` 文は現在非推奨](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/with)です。


