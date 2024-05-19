---
title: "HTMLをMarkdownに復元するスタイルシート"
emoji: "😸"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["html", "markdown", "css"]
published: false
---

Zenn の記事や GitHub での表示など、「Markdown ファイルを HTML に変換する」場面は多いですよね。

じゃあやっぱり、逆に「HTML を Markdown に変換」したいですよね？
なんのためにとかじゃなくて、やりたいから。

というわけで、Markdown 文法で表現できる主要な HTML 要素を CSS でスタイリングして、HTML を Markdown に変換するスタイルシートを作ります。


## 基本方針

`::before`, `::after` 疑似要素を使って、記号を追加します。


https://www.markdownguide.org/basic-syntax/

## 見出し

| HTML | Markdown | CSS |
| --- | --- | --- |
| `<h1>見出し</h1>` | `# 見出し` | `h1::before { content: "# "; }` |
| `<h2>見出し</h2>` | `## 見出し` | `h2::before { content: "## "; }` |
| `<h3>見出し</h3>` | `### 見出し` | `h3::before { content: "### "; }` |
| `<h4>見出し</h4>` | `#### 見出し` | `h4::before { content: "#### "; }` |
| `<h5>見出し</h5>` | `##### 見出し` | `h5::before { content: "##### "; }` |
| `<h6>見出し</h6>` | `###### 見出し` | `h6::before { content: "###### "; }` |


## 段落

| HTML | Markdown | CSS |
| --- | --- | --- |
| `<p>段落</p>` | `段落` | 特になし |

## 改行

```html
<p>テキスト<br>テキスト</p>
```

スペース2つです。

```md
テキスト  
テキスト
```

```css
br::before { 
  content: "  \A"; white-space: pre;
}
```

https://www.markdownguide.org/extended-syntax/#fenced-code-blocks

https://www.markdownguide.org/extended-syntax/#strikethrough
