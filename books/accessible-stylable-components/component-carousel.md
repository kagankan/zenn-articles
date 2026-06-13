---
title: "カルーセル（スライダー）"
---

カルーセルは、複数のコンテンツを切り替えて表示する UI パターンです。並列する多数の要素を見せたい場合に使用されます。

## 使用の前に✋

- カルーセルを使用するのが適切でしょうか？
  - 隠れている要素はユーザーにとって見つけにくい可能性があります。
  - 流し見るユーザーには、切り替えできること自体が伝わらないかもしれません。
- 【自動再生を加えようとしている場合】

## アクセシビリティ上の考慮事項

- [ ] キーボードでも操作できることを確認してください（[達成基準 2.1.1 キーボード (レベル A)](https://waic.jp/translations/WCAG21/Understanding/keyboard.html)）。
  - →Splideの場合はデフォルトでキーボード操作可能です。
- [ ] インジケータのカレント表示が色のみの表現ではなく、形状の変化でも伝わることを確認してください（[達成基準 1.4.1 色の使用 (レベル A)](https://waic.jp/translations/WCAG21/Understanding/use-of-color.html)）。
- [ ] 自動再生を使用する場合、**必ず**一時停止の機能を提供してください（[達成基準 2.2.2 一時停止、停止、非表示 (レベル A)](https://waic.jp/translations/WCAG21/Understanding/pause-stop-hide.html)）。
  - →Splideの場合は一時停止の機能が提供されています。 `splide__toggle`のクラスを付与したDOMを追加してください。([Splideの自動再生について](https://ja.splidejs.com/guides/autoplay/))
- [ ] モーションアニメーションを停止できるようにしてください（[達成基準 2.3.3 インタラクションによるアニメーション (レベル AAA](https://waic.jp/translations/WCAG21/Understanding/animation-from-interactions.html)）
  - →Splideの場合、`prefers-reduced-motion: reduce` を検知した場合はアニメーションを停止してスライドが瞬時に表示されるようになります。
  - ただしこの場合無効化されるのはcssでのtransitionのみです。独自にアニメーションを作成する場合でもcssのtransitionで対応可能な範囲で実装してください。


## 実装

- スライダーライブラリとして [Splide](https://ja.splidejs.com/) を使用することを推奨します。
  - Splide は、アクセシビリティに配慮されたカルーセルライブラリです。
  - `autoWidth` を指定し、大きさはCSSで指定することを推奨します。JSが読み込まれるまで大きさが確保されず、レイアウトシフトが発生してしまうためです。
  - 自動再生時にスライドをホバー、フォーカスをした場合にスライドが一時停止します。一時停止をやめる場合はオプションに `pauseOnFocus: false` と `pauseOnHover: false` の記述を追加してください。


## 関連リンク

https://developers.cyberagent.co.jp/blog/archives/32842/

## 各種デザインシステムへのリンク


https://component.gallery/components/carousel/
