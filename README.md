# Zenn CLI

* [📘 How to use](https://zenn.dev/zenn/articles/zenn-cli-guide)

## 記事ネタメモ

- Astroおすすめディレクトリ構成
- Astroで og image
- Astroでidつける uuid Astroでコンポーネントごとに固有のID取得したいとき、Nodeのcrypto使うのが便利そう
https://zenn.dev/takepepe/articles/useid-for-a11y

```astro
---
import {randomUUID} from 'crypto';
const uuid =randomUUID();
---
<select id={`${uuid}-tab1`}>
</select>
```

- CSS三角形令和最新版

```
mask-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 2 1" preserveAspectRatio="none"><path d="M0,0 L1,1 L2,0 Z"/></svg>');
background-color: #000;
```

- クリック可能な要素だけにスタイルをつける
  - →focusable-elementをちゃんと調べておく

:not(:disabled) ：divタグなど、disabledの概念が存在しないタグに適用される
:enabled button（などdisabledの概念があるもの）のみ
クリック可能要素か判定したいときは
&:enabled,
&[href]
でよさそう