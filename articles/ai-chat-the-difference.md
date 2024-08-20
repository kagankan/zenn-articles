---
title: "AIと遊ぶ「見えない間違い探しゲーム」を作った！　そして代替テキスト(alt)におけるAIの活躍を考える"
emoji: "🙈"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["ai", "chatgpt", "openai", "openaiapi", "アクセシビリティ"]
published: true
---

ふとした思いつきから、「**見えない間違い探し**」という ChatGPT の API を使ったゲームを作ってみました。
以下で公開しているので、よければ遊んでみてください。

https://nextjs-playground-app--nextjs-playground-b1ad1.us-central1.hosted.app/chat-the-difference


:::message

有料の API を使っているため、設定している上限に達すると止まります。ご了承ください 🙇

:::



どんなゲームなのか以降で説明します。

## 使用技術など

この記事では実装面ではなくゲームの内容を主題としています。そのため使用した技術についてはさらっと触れておきます。
（App Router の Server Actions を初めてまともに活用したのでそのあたりも記事にしたい… [スクラップ](https://zenn.dev/kagan/scraps/578782de53ddf3) には書いています）

- フレームワーク: Next.js (App Router)
- ホスティング: Firebase App Hosting
- コア機能: OpenAI API (GPT-4o)
- お題画像: [いらすとや](https://www.irasutoya.com/)（一部加工して間違いを作成）

GPT-4o（ChatGPT の課金プランで使えるモデルです）は画像ファイルの読み込みに対応しており、この API を使って画像の説明をしてもらっています。

[GitHub リポジトリ](https://github.com/kagankan/nextjs-playground/tree/main/src/app/chat-the-difference)も公開しています（これ専用のリポジトリではないのですが、ディレクトリはまとまっています）。



## どんなゲーム？

問題番号を選択するとゲームスタート。間違い探しが出題されます。
間違い探しといえば 2 枚のイラストを見比べて違うところを見つけるものですが、このゲームでは **イラストは表示されません！**

![スクリーンショット。2体のロボットがそれぞれ赤と青の四角形の前に立っている。四角形には大きなクエスチョンマークが描かれている。](/images/ai-chat-the-difference/2024-07-16-02-48-01.png)
*2体のAIが問題を出題してくれています*


ではどうやって間違いを見つけるかというと、**チャットで AI に質問をする**ことで画像にどんなものが描写されているかを聞き出していきます。それぞれの AI には画像のデータを渡しているので、質問した内容に基づいて画像を説明してくれます。

![チャットのスクリーンショット。3件のメッセージがある。1つ目:「Q.どんな画像ですか？」。2つ目:「赤い結晶が描かれたイラストです。結晶は地面から生えているように見えます。」。3つ目:「黄色い結晶が描かれたイラストです。結晶は地面から生えているように見えます。」](/images/ai-chat-the-difference/2024-07-16-02-55-00.png)
*質問に対して、それぞれ別々に AI が回答してくれます*

どこが違うかわかったら、解答を送信します。これもまた AI が正解かどうか判定してくれるので、全文一致せずともニュアンスが合っていれば正解にしてくれます。
正解の場合は、実際の画像が表示されます。

![チャットのスクリーンショット。2件のメッセージと、その後に画像がある。1つ目:「A. 結晶の色が違います」。2つ目:「正解です！」。赤色の結晶と黄色の結晶の画像が横に並んでおり、下部には「想定解答：鉱石の色が違う」というテキストがある。](/images/ai-chat-the-difference/2024-07-16-02-59-50.png)
*正誤判定も AI がしてくれます*

上記の例題は見るからに色が異なるという例ですが、もう少し複雑なお題も用意しています。
（とはいえ、一般的な目で見て答える間違い探しよりはよほど簡単なお題です）


## 作ろうと思ったきっかけ

以前、（視覚障害者の方の話で）「最近は生成 AI が性能向上していて、**AI が画像を説明してくれるから、視覚障害があってもほぼ画像が見えているようなものだ**」という話を聞いたことがきっかけです。
（具体的にどこで聞いたかは失念してしまいました…。おそらくアクセシビリティ関連のオンラインイベント、GAAD JAPAN かアクセシビリティの祭典だった気がします。）

晴眼者である私もこの感覚を理解したいと思いました。しかし、通常の状況ではいかんせん画像が見えてしまっているので、**「見えないけど見える（画像の内容がわかる）」という感覚を掴むため**、このゲームを作ってみました。あえて画像が見えない状況を作り出し、チャットによってのみ情報を聞き出すことをゲームという形に落とし込んでみました。質問と回答には画像情報は一切不要なので、**視覚障害のある方でも同じように遊べるゲームシステム**になっています（と言いつつライブリージョンの対応などが不十分なため、実際にスクリーンリーダーのみで操作するのは難しいと思います…今後の課題です🙏）。

## AI (GPT-4o) の認識力・説明力

実際、AI（今回使用したモデルは GPT-4o）はどの程度画像を説明してくれるのでしょうか。
今回作成した問題のイラストを題材に紹介します。

:::message

このセクションでは、お題の画像を上げながら説明するため、**間違い探しゲームのネタバレ**を含みます。

:::


:::details 今回与えたプロンプト

関係ない質問に答えたりしないよう以下のようなプロンプトを与えています。

```md
これから与えられる画像についての質問に答えてください。

## 必須条件
- 100文字以内で簡潔に説明します。
- 画像に関係ない質問など、回答できない内容の場合には「回答できません」と返してください。
- 画像から読み取れる情報のみを正確に説明します。
```

:::

### 大まかな説明はうまくできる ✅

AI は画像の全体像を把握し、概観を簡潔に説明してくれます。

たとえばこんなお題を作りました。^[（余談）この定食のお題イラストは全く加工しておらず、いらすとやに「冷奴付き」と「冷奴なし」があったのでありがたく使わせていただきました https://www.irasutoya.com/2015/02/blog-post_17.html]

![間違い探しのお題](/images/ai-chat-the-difference/2024-07-17-02-57-10.png)
*ともに定食のイラスト。どちらもご飯、味噌汁、焼き魚、ほうれん草のおひたしが並んでおり、一方にのみ豆腐（冷奴）が乗っている。*



これを説明してもらうと、以下のように説明してくれます。

![チャットのスクリーンショット](/images/ai-chat-the-difference/2024-07-17-02-57-51.png)


:::details 書き起こし

ユーザーの質問:
Q. どんな画像ですか？

赤い AI の回答:
焼き魚定食のイラストです。ご飯、味噌汁、焼き魚、ほうれん草のおひたしがトレイに載っています。

青い AI の回答:
和食の定食のイラストです。焼き魚、ご飯、味噌汁、冷奴、ほうれん草のおひたしがトレイに載っています。

:::

（※ 返答を 100 文字以内で返すように指示しているため、短めの説明になっています）

「焼き魚定食のイラストです」という全体を説明する文から始まり、その後具体的なおかずを説明しています。**全体像を示してからだんだんと詳細を説明する**という流れが自然にできており、理解しやすい表現です。

すでに冷奴の有無が見つかったので間違い探しの目的は果たされましたが、より詳しい情報を得たい場合には、「焼き魚の様子を詳しく説明してください」のように質問を続けることができます。

![チャットのスクリーンショット](/images/ai-chat-the-difference/2024-07-17-03-54-24.png)

:::details 書き起こし

ユーザーの質問:
Q. 焼き魚の様子を詳しく説明してください

赤い AI の回答:
焼き魚は、魚全体が焼かれており、皿の上に乗っています。魚の横にはレモンのくし切りと大根おろしが添えられています。魚の表面には焼き目がついており、美味しそうに見えます。

青い AI の回答:
焼き魚は、魚が丸ごと一匹焼かれた状態で、尾から頭までが見えます。魚の横にはレモンのくし切りと大根おろしが添えられています。魚の表面には焼き目がついており、美味しそうに見えます。

:::

味覚を持たない AI が「美味しそうに見えます」という表現を使うのはなんだか面白いですね。
こういった**感覚的な表現**も使ってくれるので、直感的な理解を助けてくれます。


### 文字を書き起こしてくれる ✅

イラストの中に文字が入っているお題も用意しました。これも説明してもらいます。

![間違い探しのイラスト](/images/ai-chat-the-difference/2024-07-17-03-08-16.png)
*ともに、緑色の本を読んでいる男の子のイラスト。ただし、一方にのみ本の表紙に「English」と書かれている。*

![チャットのスクリーンショット](/images/ai-chat-the-difference/2024-07-17-03-07-46.png)

:::details 書き起こし

ユーザーの質問:
Q. どんな画像ですか？

赤い AI の回答:
男の子が「English」と書かれた緑色の本を読んでいるイラストです。

青い AI の回答:
男の子が緑色の本を読んでいるイラストです。男の子は笑顔で、青い服を着ています。

:::

単に文字があるということだけでなく、**その文字まで書き起こしてくれます**。
イラスト中の文字であり、機械にとって読みやすいとも言えないような文字ですが、正しく書き起こしてくれています。


### 細かい部分で嘘をつくことがある ❌

今回作成した問題の中で、1 問だけ難易度「IMPOSSIBLE」（不可能）に分類した問題があります。これは、私がデバッグプレイをする中で**どんなに質問をしても正解にたどり着くことができなかった**問題です。

以下のような 2 枚の画像を用意しました。

![間違い探しのイラスト](/images/ai-chat-the-difference/2024-07-17-02-33-00.png)
*ともにリビングのイラスト。背景にはテレビとカーテンがある。テーブルの上にはマグカップが4つ置かれている。そのうち、緑色のマグカップの取っ手の向きが左右異なる*

さあ、これも説明してもらいましょう。

![チャットのスクリーンショット](/images/ai-chat-the-difference/2024-07-17-02-44-05.png)

:::details 書き起こし

ユーザーの質問:
Q. どんな画像ですか？

赤い AI の回答:
リビングルームのイラストです。テーブルの上にカラフルなマグカップが 4 つ置かれており、背景にはテレビとカーテンが見えます。

青い AI の回答:
テレビとカーテンのある部屋で、テーブルの上に色とりどりのマグカップが置かれています。

:::

概要の説明には成功していますね！
では、間違いの部分である「緑色のマグカップ」について質問してみましょう。

![チャットのスクリーンショット](/images/ai-chat-the-difference/2024-07-16-04-37-36.png)
*どちらのAIも「左側を向いている」と答える*

:::details 書き起こし

ユーザーの質問:
Q. 緑色のコップの向きを教えてください

赤い AI の回答:
緑色のコップは取っ手が左側を向いています。

青い AI の回答:
緑色のコップは、取っ手が左側を向いています。

:::

うーん、**どちらも左側を向いていると言ってしまっています**。
しかし**実際には、一方の画像では右側を向いている**ので、事実とは異なります。嘘をつかれてしまったので、正解にたどり着くことができませんでした（このように AI が誤った情報を生成することを**ハルシネーション**といいます）。

なぜこんなにあからさまに間違った説明をしてしまうのかはよくわかりませんでした…。細かい部分については正しい説明が難しいのかもしれません。

### 同じ質問でも異なる回答が返ってくる 🤔

生成 AI を使う以上当たり前とも言えるのですが、**同じ画像に対して同じ質問をしても、異なる回答が返ってきます**。特に今回の間違い探しでは、ほぼ同じイラストに対して同時に質問しているので、その様子がわかりやすいです。
今回のケースでは、同じ部分に対しても異なる説明の仕方をしてしまうため、内容を理解しないと違う箇所なのかと混乱してしまうかもしれません。また、同じ内容を繰り返し確認したい場合にも、別の回答が返ってきてしまうと困ります（内容が同じで表現が違うだけだとしても、判断が難しくなります）。

一方でゲームとしては、それぞれ別の AI（人格）と会話しているような感覚になれる、というポジティブな捉え方もできるかもしれません 🤖🤖

ちなみに今回 `temperature`（回答のランダム性を調整するパラメータ）は 0.0 に設定したのですが、それでも差分が発生してしまうようでした 🤔


## AI時代の代替テキストについて考える


### AIは閲覧者（特に視覚障害者）にとっての目になる

ここまでで見てきたように、細かい箇所を除いては AI が画像を説明してくれました。
「見えない間違い探し」を通じて、**「AI を活用すれば、画像が見えなくても見えているようなもの」という感覚を体感できました**。
仮に代替テキストがない、もしくは不十分な画像があったとしても、（画像の存在さえわかれば、）知りたい情報を聞き出すことができそうです。単に説明させるだけでなく、対話的に情報を引き出すこともできるのは大きなメリットです。

必ずしも視覚障害というケースに限らずとも、知らない場所の写真や、見たことのないものの写真などの情報を知りたい場合にも活用できそうです。

### でもやっぱり代替テキストは必要

先述の内容は、あくまで閲覧者側の視点での話です。
コンテンツの制作者の視点では、代替テキストを書く必要がなくなるかというと、そんなことはありません。
主に以下の理由が挙げられます。

- まだまだ AI の利用が一般的でないから
- AI が嘘をつくことがあるから
- 制作者（著者）の意図を伝える必要があるから
- 代替テキストは、画像が読み込めない場合に情報を提供する目的もあるから


#### まだまだ AI 機能の利用が一般的でないから

今回は GPT の API を使って画像の説明を得ましたが、このような機能が Web ブラウザーに実装されているわけではないため、誰でも使えるわけではありません。
ChatGPT においても、画像の読み込みができる機能  (GPT-4o) は課金プランでのみ利用できる機能です。

今後 Web ブラウザーなどにもデフォルトで AI が搭載され、画像の説明なども標準になればもう少し状況は変わるかもしれませんが、2024 年 7 月現在は、まだまだそんな状況ではありません。

#### AIが嘘をつくことがあるから

先ほどの例で見たように、AI は細かい部分で嘘をついてしまうことがあります（今回の例では、マグカップの取っ手の向きを誤って説明してしまいました）。
このような問題があると、誰もが同じ情報を得られているとは言い難いです。

AI のモデルの性能向上で改善する部分ではあると思いますが、現時点では完璧ではありません。

#### 制作者（著者）の意図を伝える必要があるから

代替テキストは、単に画像の内容を詳しく説明すればいいものではなく、**コンテンツ制作者の意図**を示す必要があります。

たとえば、（画像データとして見れば）全く同じ人物の写真だとしても、代替テキストの書かれ方はその写真で何を伝えたいかによって変わります。もっといえば、単に装飾の目的であれば、代替テキストを空にすることが適切な場合もあります。

#### 代替テキストは、画像が読み込めない場合に情報を提供する目的もあるから

今回の記事では、主に視覚障害を持つ方がどう情報を得られるかという視点で話を進めてきましたが、代替テキストの役割はそれだけではありません。
代替テキストがあることで、**画像が読み込めない環境**（ネットワークの問題など）や、**画像のリンクが切れてしまった場合**にも情報を提供できます。
この目的においては、そもそも画像データが利用できないため、AI うんぬんに関わらず代替テキストが必要です。

### AIは代替テキストを書く上で強力なツールになる！

代替テキストを書かなくていい、とまでは残念ながらなりませんが、執筆の過程で AI は十分に活用できます。

**ChatGPT に代替テキストを書かせる**のはすでに実用的なユースケースです。
イラストの描写はこれまでに説明した通りですが、私が特に利便性を感じているのは、**文字を書き起こすような必要があるケース**や、**複雑な関係性のあるグラフや図表**です。

グラフの代替テキストを ChatGPT に書いてもらった例を以下に示します。

![ChatGPTとの会話のスクリーンショット。グラフ画像を添付し、「この画像のaltテキストを書いてください」と依頼している。](/images/ai-chat-the-difference/2024-07-17-03-34-26.png)

:::details 書き起こし

> alt="1日の気温の変化を示すグラフ。7時の気温は13.7℃、8時は15.3℃、9時は17.1℃、10時は18.7℃、11時は20.8℃、12時は22.0℃、13時は22.5℃、14時は23.1℃、15時は22.2℃、16時は22.5℃、17時は17.2℃、18時は14.6℃、19時は13.8℃。気温は14時に23.1℃で最高となり、その後徐々に低下している。"

:::

（グラフ画像の引用元: [折れ線グラフ（おれせんグラフ） - 埼玉県](https://www.pref.saitama.lg.jp/a0206/kodomo/graph04_oresen.html)）

嬉しいポイントは以下のようなところです。

- 文字を認識できるので**書き起こし**してくれる
  - （特にラスタライズする前のデータが用意できなかったりする状況だと、とっても助かる）
- どの位置が 7 時のデータか、などの**視覚的な関係性も読み取ってくれる**
- 「1 日の」のような、**図に明示的には書いていないがラベルから読み取れる情報**を入れてくれる
- 「その後徐々に低下している」のような**概観を理解するのに役立つ情報**を入れてくれる

代替テキストを書くことに慣れていない人の場合、近くにあるテキストを無意味に使ってしまったり、画像からは読み取れないようなことを書いてしまったりすることがあります。そうでなくても、このような情報の多い図表の場合、どこから書いていいのか迷ってしまうこともあるかと思います。
**AI の力を借りることで、代替テキストの執筆コストを下げることができます**。


このように代替テキストの執筆を補助する機能が搭載されたアプリケーションの例もあり、例えば Gyazo では AI による代替テキストの生成機能が搭載されています。

https://x.com/gyazo_ja/status/1696043174287049070


その他にも AI が代替テキストに活用されている事例を ymrl さんが紹介されていたのでそのツイートも紹介します。

https://x.com/ymrl/status/1771203402753614018


### 最後は人の手で

前述の AI の活用はあくまで「補助」としての活用です。
まだまだ精度には限界があり、マグカップの取っ手の向きの例で見たように、ハルシネーションを起こし嘘をついてしまうこともあるため、人間の確認も必要です。

普段 GitHub Copilot を使っている方にとってはおなじみの感覚かもしれませんが、AI の提案はベースとして使うには有用な一方で、細かい部分で調整が必要になります。代替テキストの執筆も同様で、AI にベースを書いてもらいつつ、最終的には人の手で調整することが重要です。


## 感想

「見えない間違い探し」をデバッグとして自分でも遊んでいましたが、画像が見えないということはかくももどかしいものかと思いました。
自分で用意した画像ですらこう感じるのですから、普段から見えない画像や、あるのかないのかもわからない情報がある状況にいる方々にとっては Web の閲覧にどれだけストレスがあるのかと考えることができました。

それと同時に、AI が画像を説明してくれることで、視覚障害者の方にとっても画像の情報が得られる状況になりつつあることを感じられました。技術によって、より情報にアクセスしやすい世の中になるというのは嬉しく思います。


## まとめ

- GPT-4o を使って「見えない間違い探しゲーム」を作りました。画像が見えない状況で、画像を AI に説明してもらいながら間違いを探すゲームです。
- AI の画像認識能力を体感でき、以前聞いた「視覚障害があっても、AI による画像の説明で画像が見えているようなもの」という感覚を理解できました。
- 閲覧者が画像の情報を得るために AI が強力なツールになる一方で、コンテンツ制作者が代替テキストを書く重要性は変わりません。
- 代替テキストの執筆においては、 AI を活用することで効率化できます。ただし、AI の提案はベースとして使い、最終的には人の手で調整する必要があります。