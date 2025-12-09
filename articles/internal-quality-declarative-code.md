---
title: "【内部品質向上シリーズ】宣言的なコード編──意図の伝わる、読みやすいコードを書こう"
emoji: "💡"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "リファクタリング", "可読性", "関数型プログラミング"]
published: false
---

他の人（未来の自分を含む）が読んで意味のわからないコードは修正が難しくなる。

読み手に「意図」が伝わる、読みやすいコードを心がけよう！

その手段の一つである宣言的プログラミングを紹介します。

# 元ネタ・参考資料

https://zenn.dev/miyamonz/articles/3318bc87cf14cb

https://zenn.dev/mo_ri_regen/articles/declared-vs-imperative

https://speakerdeck.com/uenitty/why-declarative-ui-is-less-fragile

https://ja.wikipedia.org/wiki/%E5%AE%A3%E8%A8%80%E5%9E%8B%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0

https://gakuzzzz.github.io/slides/for_loop_to_higher_order_functions/

https://xtech.nikkei.com/atcl/nxt/column/18/02319/010500003/

# 命令的プログラミングと宣言的プログラミング

これらは**プログラミングのスタイルの分類**です。

- **命令的プログラミング**…**「どうやって」実行するか（How、手段）**を記述するスタイル。
- **宣言的プログラミング**…**「何を」達成したいか（What、目的）**を記述するスタイル。

言語によっては宣言的プログラミングだけができる言語、みたいなものもあったりする。例えば関数型プログラミング言語はその例。だが、JavaScript (TypeScript) はマルチパラダイムなので、どちらの書き方もできるケースがほとんど。

<aside>
ℹ️

手段を記述するのが命令的プログラミング、目的を記述するのが宣言的プログラミング

</aside>

ここでは、宣言的プログラミングにフォーカスして、こちらの書き方のほうが可読性が高く堅牢性も高いということを説明していきます。

## 具体例

例えば、命令的な記述で「配列の要素を2倍にする」というコードを書いてみます。

```tsx
const numbers = [1, 2, 3, 4, 5];
const doubled: number[] = [];
for (let i = 0; i < numbers.length; i++) {
  const num = numbers[i]
  doubled.push(num * 2);
}
console.log(doubled);  // [2, 4, 6, 8, 10]
```

一方、宣言的な記述で書いてみると、こうなります。

```tsx
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]
```

コード量が減ってすっきりしましたね。

コード量が減った、というのは単に楽できるということだけではなく、**「目的のみを記述し、本質でない手段の部分を隠蔽できている」**と言い換えられます。意図が明確なのです。

以下丸ごとスクショで引用：

![[https://zenn.dev/miyamonz/articles/3318bc87cf14cb#目的と記述で色分けをする](https://zenn.dev/miyamonz/articles/3318bc87cf14cb#%E7%9B%AE%E7%9A%84%E3%81%A8%E8%A8%98%E8%BF%B0%E3%81%A7%E8%89%B2%E5%88%86%E3%81%91%E3%82%92%E3%81%99%E3%82%8B)](https://prod-files-secure.s3.us-west-2.amazonaws.com/53c545b9-40b0-40d4-b82f-86ff1afd44dd/d46d3a8f-1e8c-4ab4-ad74-369cd74e7f8e/image.png)

[https://zenn.dev/miyamonz/articles/3318bc87cf14cb#目的と記述で色分けをする](https://zenn.dev/miyamonz/articles/3318bc87cf14cb#%E7%9B%AE%E7%9A%84%E3%81%A8%E8%A8%98%E8%BF%B0%E3%81%A7%E8%89%B2%E5%88%86%E3%81%91%E3%82%92%E3%81%99%E3%82%8B)

## （参考）宣言的UI

この宣言的という考え方をUIの実装に用いたのが宣言的UIと呼ばれます。

Reactは宣言的UIの代表例です。

### 命令的UI

「こう変えます」を記述する。

```tsx
<p id="status-open" style="display: none;">Open</p>
<p id="status-closed" style="display: block;">Closed</p>
<button id="toggleButton">Open</button>

<script>
  let isOpen = false;

  const statusOpen = document.getElementById('status-open');
  const statusClosed = document.getElementById('status-closed');
  const button = document.getElementById('toggleButton');

  button.addEventListener('click', () => {
    isOpen = !isOpen;

    // 状態に応じて表示を切り替え
    if (isOpen) {
      statusOpen.style.display = 'block';  // "Open" を表示
      statusClosed.style.display = 'none'; // "Closed" を非表示
      button.textContent = 'Close';
    } else {
      statusOpen.style.display = 'none';  // "Open" を非表示
      statusClosed.style.display = 'block'; // "Closed" を表示
      button.textContent = 'Open';
    }
  });
</script>
```

### 宣言的UI

「こう表示します」を記述している（具体的な操作はReactによって隠蔽されている）。

```tsx
function App() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <p>{isOpen ? 'Open' : 'Closed'}</p>
      <button onClick={handleClick}>
        {isOpen ? 'Close' : 'Open'}
      </button>
    </>
  );
}
```

# 宣言的なコードのメリット

## 可読性

多くのケースで、命令的なコードよりも、宣言的なコードのほうが可読性が高いです。

命令的なコードは、すべての行を読むまで最終結果がわかりません。

```tsx
const numbers = [1, 2, 3, 4, 5];
const doubled: number[] = [];
for (let i = 0; i < numbers.length; i++) {
  const num = numbers[i]
  doubled.push(num * 2);
}
console.log(doubled);  // [2, 4, 6, 8, 10]
```

先程のコードを例に読んでみます。

- 「最初は空の配列を用意して、まずiが0になって、0番目が取り出されて、その値が2倍されて追加されて、その次に…」と、手順を脳内でシミュレーションする必要があり、読み手の負担が大きい。
- 本当に「すべての要素を変換する」のか、確認のコストがかかる
    - `i` も可変な変数なので、変わる可能性がある。`i = 0` が `i = 1` になっていたら最初がスキップされてしまうし、 `i++` が `i += 2` だったら1個飛ばしになる。
- `for` 文はなんでも屋さんなので、ループしている以上の情報が読み取れない。

一方、宣言的なコードなら、 `map` が「配列のすべての要素を変換して新しい配列を作る」という特定の手段を提供しています。
よって `array.map` まで読んだ時点で、「 `array` のすべての要素を変換したいのね」ということがわかり、「で、どう変換したいの？」と思うと、その次の `num => num * 2` を読むことで「2倍にしたいのね」とわかります。

```tsx
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]
```

- 結論から書く
- 目的（したいこと、意図）を表現する

ということが実現されているため、わかりやすくなっています。

<aside>
ℹ️

宣言的なコードは読みやすい！

</aside>

## 堅牢性

宣言的なコードは堅牢性も高いです。

というのは、命令的なコードは状態を持ち、宣言的なコードは状態を持たないからです。

命令的なコード（状態を持つ）：

```tsx
const user = { name: "山田", age: 25, address: "東京" };

// 状態を直接変更する
user.age = 26;
user.address = "大阪";
```

宣言的なコード（状態を持たない）：

```tsx
const user = { name: "山田", age: 25, address: "東京" };

// 新しいオブジェクトを生成する
const updatedUser = {
  ...user,
  age: 26,
  address: "大阪",
};
```

命令的なコードでは状態（変数）を直接変更するため、どこで値が変更されたのか追跡が難しく、バグが発生しやすくなります。一方、宣言的なコードでは新しいオブジェクトを生成するため、元のデータは不変で、変更の追跡が容易になります。

<aside>
ℹ️

宣言的なコードは間違えにくい！

</aside>

# コラム：きっと命令的だったから？　ポケモンBDSPのバグの例

2021年に発売されたポケットモンスターブリリアントダイヤモンド・シャイニングパール（以下BDSP）にはバグが大量にあることがネットで話題になりました。

その一つが「謝罪バグ」。これは、ある施設に入ろうとすると、「今は入れないですよ」とゲーム内のキャラクターから謝罪されて、1マス押し戻される、というイベントがきっかけとなるもの。

参考： https://www.gamespark.jp/article/2022/06/20/119651.html#:~:text=GMS%E3%81%AB%E5%90%91%E3%81%8B%E3%81%84%E3%80%81-,%E3%80%8C%E8%AC%9D%E7%BD%AA%E3%80%8D%E3%82%92%E3%82%B9%E3%83%88%E3%83%AC%E3%83%BC%E3%82%B8%E3%81%97%E3%81%BE%E3%81%99%E3%80%82,-%E3%81%93%E3%81%93%E3%81%A7%E8%A8%80%E3%81%86

普通なら、

1. 施設に入ろうとする（1マス進む）
2. 謝罪される
3. 1マス戻される

という流れになるはずですが、

1. 施設に入ろうとする（1マス進む）
2. メニューを開くことで、謝罪を中断させる
3. 別の場所に移動する
4. メニューを閉じることで中断を解除し、謝罪させる
5. 1マス戻される
6. 想定しているのとは別の場所で1マス動いてしまうため、本来行けない場所に行けてしまう

というバグです。

これも、命令的プログラミングに基づくバグの結果と言えます（※プログラムの中身を見たわけではないので推測に過ぎませんが）。

この処理はプレイヤーの現在地という「状態」に依存しており、現在地が施設の入口であることを前提として、1マス戻すという処理が定義されていました。しかしその前提が変わってしまったことにより、バグが生まれてしまいました。

これを宣言的プログラミングで書くとすると、「謝罪が終わった後は施設の外にいる」という宣言になりそうです。こういう宣言であれば、前の状態がどうであれ、同じ場所に動いてくれたかもしれません。

# 具体的な変換例

## 要素をマッピングするforループをmapに

### 命令的

```tsx
const source = [1, 2, 3];
const mapped: string[] = [];
for (const num of source) {
    if (num === 1) {
        mapped.push('one');
    } else if (num === 2) {
        mapped.push('two');
    } else if (num === 3) {
        mapped.push('three');
    }
}
```

GitHub Copilotに「宣言的に書いて」とお願いするだけで意外と書き直してくれたりします。不慣れな人は試してみましょう。

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/53c545b9-40b0-40d4-b82f-86ff1afd44dd/58c21273-be9c-4c72-a00a-9da2b71dd989/image.png)

### 宣言的

```tsx
const source = [1, 2, 3];
const mapped = source.map(num => {
  switch (num) {
    case 1:
      return "one";
    case 2:
      return "two";
    case 3:
      return "three";
    default:
      return "";
  }
});
```

`if` を `switch` に変えていますが、これはどちらでもそんなに関係ありません。ポイントは `map`
です。

`defalut: return "";` を追加していますが、もしこれを入れなければ `undefined` が入ることになります。
このように、分岐を忘れた場合にも配列の要素数が一致することが確約されているのもポイントです。

命令的なコード（`for` ループで実装する例）の場合、条件分岐を間違えてどこかでpushを忘れたり、逆に2回pushしたりしてしまうと、要素数が一致しない危険性があります。

## 個数をカウントするforループをfilter/lengthに

### 命令的

```tsx
const source = [1, 2, 3];
let count = 0;
for (const num of source) {
  if (num % 2 === 0) {
    count = count + 1;
  }
}
```

### 宣言的

```tsx
const source = [1, 2, 3];
const count = source.filter(num => num % 2 === 0).length;
```

`filter` には「配列内の特定の条件に当てはまる要素に絞り込む」、 `length`には「要素数を数える」という目的があるので、この2箇所を読むだけで何をしたいかの概要が把握できる。

さらにこの例では、 `let` だったのを `const`に置き換えることができた。 `let` だといつどこで書き換えられるかわからないため、読み手の負荷を上げるキーワードである。できるだけ使わず、 `const` にできるとよい。

## 値の代入

### 命令的

```tsx
let operation: string;
if (exists) {
  operation = "update";
} else {
  operation = "create";
}
```

### 宣言的

```tsx
const operation = exists ? "update" : "create";
```

## 配列の判定

### 命令的

```tsx
const array = ['a', 'b', 'c', 0];
let result: "YES" | "NO" = "NO";
for (const item of array) {
  if (result !== "YES") {
    result = typeof item === "number" ? "YES" : "NO";
  }
}
```

### 宣言的

```tsx
const array = ['a', 'b', 'c', 0];
const result = array.some(item => typeof item === "number") ? "YES" : "NO";
```

someの機能は、「どれかが」と読み替えられるので、
「array のどれかが、numberなら」、みたいな感じで自然言語的に理解しやすい。

# 「for文のほうが読みやすい」？

[map / filter などの高階関数よりも古典的な for文の方が読みやすいと感じるあなたへ](https://gakuzzzz.github.io/slides/for_loop_to_higher_order_functions/)

Whatを表現するのが大事だという話。

（後半で紹介した具体例はかなりシンプルな例にしてしまったのでWhatが出るような例ではなかったかも）
