---
paths:
  - "books/**"
---

# 本（book）執筆ルール

このリポジトリで Zenn の「本」を扱うとき（`books/` 配下を編集するとき）に参照するルールです。記事（`articles/`）を扱うときは読む必要はありません。

参考: [Zenn の本の作り方](https://zenn.dev/zenn/books/how-to-create-book/viewer/about) / [Zenn CLI ガイド](https://zenn.dev/zenn/articles/zenn-cli-guide)

## 記事との違い

| | 記事（article） | 本（book） |
| --- | --- | --- |
| 配置 | `articles/<slug>.md` の単一ファイル | `books/<本のslug>/` ディレクトリ |
| 構成 | 1 ファイル完結 | `config.yaml` ＋ 複数のチャプター（章）ファイル |
| メタデータ | 各記事ファイルの front matter（`title` / `emoji` / `type` / `topics` / `published`） | 本全体は `config.yaml`、各章は front matter（`title` のみ） |
| 用途 | 単発のトピック | 体系立てて章分けして解説する長編 |

## 本の構成

```
books/<本のslug>/
├── config.yaml      # 本全体のメタデータ
├── cover.png        # カバー画像
└── NN.<slug>.md     # チャプター（章）ファイル
```

`config.yaml` の主な項目:

```yaml
title: "本のタイトル"
summary: "本の紹介文"
topics: ["アクセシビリティ"] # 最大 5 つ
published: false # 新規作成時は必ず false
price: 0 # 有料の場合 200〜5000（100 円単位）
```

## チャプターの並び順

並び順管理には 2 方式があり、**このリポジトリでは番号方式を採用**しています。

- **番号方式（採用中）**: ファイル名を `01.abstract.md` のように `NN.<slug>.md` とし、番号順に並べる。`config.yaml` の `chapters` は省略する。
- slug 方式: `config.yaml` の `chapters` 配列で順序を指定する。

各チャプターファイルの front matter は `title` のみです（記事と違い `emoji` / `type` / `topics` / `published` は不要）:

```markdown
---
title: "チャプターのタイトル"
---
```

## 公開状態

本でも記事と同様、新規作成時は `config.yaml` の `published` を必ず `false` にしてください。`true` への変更は人間が行います。
