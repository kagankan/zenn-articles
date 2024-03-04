# Zenn CLI

* [📘 How to use](https://zenn.dev/zenn/articles/zenn-cli-guide)

<div lang="ja">

## 記事ネタメモ

- Astroおすすめディレクトリ構成
- Astroで og image

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

</div>

### meterのスタイリング

https://css-tricks.com/html5-meter-element/
https://stackoverflow.com/questions/38622911/styling-meter-bar-for-mozilla-and-safari
https://developer.mozilla.org/ja/docs/Web/HTML/Element/meter

