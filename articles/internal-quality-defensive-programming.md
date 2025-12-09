---
title: "【内部品質向上シリーズ】防御的プログラミング編"
emoji: "🐷"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: []
published: false
---

[PHPerKaigi 2022: 予防に勝る防御なし - 堅牢なコードを導く様々… / 和田卓人](https://www.youtube.com/watch?v=uVsN_uJNSuY)

https://speakerdeck.com/twada/growing-reliable-code-phperkaigi-2022

PHPの講演なのですが、考え方としての部分が大きいので参考になります。

最初にこの講演の冒頭部分の話を紹介します。

# 「予防に勝る防御なし - 堅牢なコードを導く様々な設計のヒント」から、防御的プログラミングという考え方

不具合の発見が遅れれば遅れるほど傷は深くなる

→できるだけ型チェック（＝コーディング中）で問題が見つかるようにしたい

![PHPerKaigi 2022_ 予防に勝る防御なし - 堅牢なコードを導く様々… _ 和田卓人 2-44 screenshot.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/53c545b9-40b0-40d4-b82f-86ff1afd44dd/4d25d8c7-8504-4889-9847-2cd2838e2a51/PHPerKaigi_2022__%E4%BA%88%E9%98%B2%E3%81%AB%E5%8B%9D%E3%82%8B%E9%98%B2%E5%BE%A1%E3%81%AA%E3%81%97_-_%E5%A0%85%E7%89%A2%E3%81%AA%E3%82%B3%E3%83%BC%E3%83%88%E3%82%99%E3%82%92%E5%B0%8E%E3%81%8F%E6%A7%98%E3%80%85___%E5%92%8C%E7%94%B0%E5%8D%93%E4%BA%BA_2-44_screenshot.png)

「動くプログラム」と「正しい・適切なプログラム」は違う。

（動くプログラムを書けるだけではいけない）

![PHPerKaigi 2022_ 予防に勝る防御なし - 堅牢なコードを導く様々… _ 和田卓人 2-46 screenshot.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/53c545b9-40b0-40d4-b82f-86ff1afd44dd/86b26fad-1f46-428a-8ad0-4e38b476185b/PHPerKaigi_2022__%E4%BA%88%E9%98%B2%E3%81%AB%E5%8B%9D%E3%82%8B%E9%98%B2%E5%BE%A1%E3%81%AA%E3%81%97_-_%E5%A0%85%E7%89%A2%E3%81%AA%E3%82%B3%E3%83%BC%E3%83%88%E3%82%99%E3%82%92%E5%B0%8E%E3%81%8F%E6%A7%98%E3%80%85___%E5%92%8C%E7%94%B0%E5%8D%93%E4%BA%BA_2-46_screenshot.png)

「防御的プログラミング」という考え方。問題発生を事前に防ごうというコーディングスタイル。

![PHPerKaigi 2022_ 予防に勝る防御なし - 堅牢なコードを導く様々… _ 和田卓人 4-9 screenshot.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/53c545b9-40b0-40d4-b82f-86ff1afd44dd/fde4d979-3e5e-43be-a3d1-8ecb3fa30bdc/PHPerKaigi_2022__%E4%BA%88%E9%98%B2%E3%81%AB%E5%8B%9D%E3%82%8B%E9%98%B2%E5%BE%A1%E3%81%AA%E3%81%97_-_%E5%A0%85%E7%89%A2%E3%81%AA%E3%82%B3%E3%83%BC%E3%83%88%E3%82%99%E3%82%92%E5%B0%8E%E3%81%8F%E6%A7%98%E3%80%85___%E5%92%8C%E7%94%B0%E5%8D%93%E4%BA%BA_4-9_screenshot.png)

防御の悪い実践例：

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/53c545b9-40b0-40d4-b82f-86ff1afd44dd/38406ae3-97cd-42ca-8604-1f5b8e1d9b83/image.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/53c545b9-40b0-40d4-b82f-86ff1afd44dd/59a6cae4-323c-4a1c-a9a6-c52684e19292/image.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/53c545b9-40b0-40d4-b82f-86ff1afd44dd/01c44cee-0510-4819-85fe-dd824a0ab20d/image.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/53c545b9-40b0-40d4-b82f-86ff1afd44dd/ec00b8af-1524-4dc9-b1fe-7a3e65c41c4c/image.png)

![PHPerKaigi 2022_ 予防に勝る防御なし - 堅牢なコードを導く様々… _ 和田卓人 4-47 screenshot.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/53c545b9-40b0-40d4-b82f-86ff1afd44dd/5154ac1e-ece1-4bfd-9ee0-edd0c4e02a4a/PHPerKaigi_2022__%E4%BA%88%E9%98%B2%E3%81%AB%E5%8B%9D%E3%82%8B%E9%98%B2%E5%BE%A1%E3%81%AA%E3%81%97_-_%E5%A0%85%E7%89%A2%E3%81%AA%E3%82%B3%E3%83%BC%E3%83%88%E3%82%99%E3%82%92%E5%B0%8E%E3%81%8F%E6%A7%98%E3%80%85___%E5%92%8C%E7%94%B0%E5%8D%93%E4%BA%BA_4-47_screenshot.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/53c545b9-40b0-40d4-b82f-86ff1afd44dd/3abdb6aa-015a-42d8-86c0-a02a87c3d40f/image.png)

さらに、取りうる可能性をできるだけ減らすことで、想定外を考えることが減り、問題が起こりにくくなる。

![PHPerKaigi 2022_ 予防に勝る防御なし - 堅牢なコードを導く様々… _ 和田卓人 5-45 screenshot (1).png](https://prod-files-secure.s3.us-west-2.amazonaws.com/53c545b9-40b0-40d4-b82f-86ff1afd44dd/7080a9f8-ef01-49e7-88c4-e00caa081b65/PHPerKaigi_2022__%E4%BA%88%E9%98%B2%E3%81%AB%E5%8B%9D%E3%82%8B%E9%98%B2%E5%BE%A1%E3%81%AA%E3%81%97_-_%E5%A0%85%E7%89%A2%E3%81%AA%E3%82%B3%E3%83%BC%E3%83%88%E3%82%99%E3%82%92%E5%B0%8E%E3%81%8F%E6%A7%98%E3%80%85___%E5%92%8C%E7%94%B0%E5%8D%93%E4%BA%BA_5-45_screenshot_(1).png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/53c545b9-40b0-40d4-b82f-86ff1afd44dd/caadd985-1d95-4ed9-95a8-6c52e8d5af49/image.png)

（この講演では型の話だけをしていたわけではないのですが、ここでは型の話だけ紹介して終わりにします。）
