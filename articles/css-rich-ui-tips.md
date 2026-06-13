---
title: "【CSS】画像もSVGも使いたくない僕らのための、ゲームっぽいリッチなUIテクニック集"
emoji: "🎮"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["css"]
published: false
---

## こういうのを作ります

## 基本的な考え方

- ゲーム（コンシューマー、ソシャゲ）で使われるような表現
- YouTube 動画のサムネイル・テロップでも使われる
- 情報量を増やす
  - グラデ、影、枠線、動き

## テクニック集

### 枠線 border, text-stroke, paint-order

### 影 box-shadow, text-shadow, filter: drop-shadow

- グロー的な表現。真ん中透過なら filter: drop-shadow

### 背景グラデーション background-image: linear-gradient, radial-gradient, conic-gradient

- しましまとか、チェックとか、ドットとか
- https://ics.media/entry/250829/
- すりガラス的な表現とか
  - filter: backdrop-filter: blur(10px);

### 文字グラデーション background-clip: text

- 文字グラデーションと paint-order の縁取りは重ねられない。

### 動き animation, transition, transform

- きらりん　みたいな

### 擬似要素 ::before, ::after

### 形を変える mask, clip-path

### アイコン
