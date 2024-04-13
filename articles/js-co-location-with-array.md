---
title: "【JS】「離れた行に書かなきゃいけなくて面倒」を、配列で解決する"
emoji: "👥"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript"]
published: true
---

JavaScript の小ネタ紹介です。

## 1つの処理に関する記述が2箇所に分かれてしまうとき

以下のように、イベントリスナーを設定して、停止ボタンを押したときにリスナーを削除する、という処理を考えます。
この場合、`addEventListener` と `removeEventListener` を **別々の箇所に書く必要があり**、ちょっと面倒ですね。

```js:😖Before: 1つの処理に関する記述が2箇所に分かれてしまう
const handleResize = () => {
  console.log("リサイズ時の処理");
}
window.addEventListener("resize", handleResize); // resize の add

const handleScroll = () => {
  console.log("スクロール時の処理");
}
window.addEventListener("scroll", handleScroll);

// 他の処理...

const stopButton = document.querySelector(".stop-button");
stopButton.addEventListener("click", () => {
  // 😖 add と remove を別の箇所に書かないといけない
  window.removeEventListener("resize", handleResize); // resize の remove
  window.removeEventListener("scroll", handleScroll);
});
```

本当ならリサイズに関する記述は 1 か所にまとめたいですよね。
このくらいの行数なら 1 ページに収まるからいいですが、何十行、何百行になってくると、別の箇所に関連する記述があることにすら気付けないこともあるかもしれません。

## 配列で解決する

停止時に実行する関数を格納する配列を用意して、そこに追加していくことにします。
これにより、 **`addEventListener` と `removeEventListener` を近くに書くことができます**。
（このように、関連するものを近くに配置することを「[コロケーション](https://www.mizdra.net/entry/2022/12/11/203940)」と言ったりします）

```diff js:✅️After: 配列で解決
+ /** 停止するときに実行する関数を格納する配列 */
+ const cleanupFunctions = [];
  
  const handleResize = () => {
    console.log("リサイズ時の処理");
  }
  window.addEventListener("resize", handleResize);
+ cleanupFunctions.push(() => {
+   // ✅️ add と remove を近い行に書ける
+   window.removeEventListener("resize", handleResize);
+ });
  
  const handleScroll = () => {
    console.log("スクロール時の処理");
  }
  window.addEventListener("scroll", handleScroll);
+ cleanupFunctions.push(() => {
+   window.removeEventListener("scroll", handleScroll);
+ });
 
  const stopButton = document.querySelector(".stop-button");
  stopButton.addEventListener("click", () => {
-     window.removeEventListener("resize", handleResize);
-     window.removeEventListener("scroll", handleScroll);
+     // cleanupFunctions に格納された関数をまとめて実行するだけで OK
+     cleanupFunctions.forEach(cleanup => cleanup());
    }
  );
```

複数の箇所を編集する必要がなくなってハッピー 🥰

## 他のケース

同様に、作った変数を配列として返したい、みたいなときにも使えます。

```js:😖Before: 2箇所に書かなきゃいけない
const createElements = () => {
  const text1 = document.createElement("p");
  text1.textContent = "Hello";
  text1.classList.add("hello");

  const text2 = document.createElement("p");
  text2.textContent = "World";
  text2.classList.add("world");

  return [
    text1, 
    text2,
  ];
}
```

```diff js:✅️After: 配列で解決
const createElements = () => {
+   const elements = [];

    const text1 = document.createElement("p");
    text1.textContent = "Hello";
    text1.classList.add("hello");
+   elements.push(text1);
  
    const text2 = document.createElement("p");
    text2.textContent = "World";
    text2.classList.add("world");
+   elements.push(text2);

- return [
-   text1, 
-   text2,
- ];
+ return elements;
}
```
