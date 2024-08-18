---
title: "アコーディオン"
---

アコーディオンは、開閉することでコンテンツを表示・非表示にする UI パターンです。最初に表示する要素を減らし、ユーザーが必要に応じて表示できるようにできます。

## 使用の前に✋

- アコーディオンで非表示にすることが適切でしょうか？
  - 流し見るユーザーには、開閉できること自体が伝わらないかもしれません。

## 実装上の考慮事項

- `details`, `summary` 要素を使用します。
- アニメーションのためには JS が必要になります（アニメーションが不要な場合は JS は不要です）。
- アニメーションを設定する際、高さを変化させる要素と`padding`をつける要素はそれぞれ別になるように注意してください。高さの計算時に`padding`が考慮されません。
- `details` 要素内のテキストは、`display: none;`で非表示にされた要素とは異なり、ページ内検索の対象となります。
  - これは [`hidden="until-found"`](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/hidden#hidden_until_found_%E7%8A%B6%E6%85%8B) と同様の挙動です。

## アクセシビリティ上の考慮事項

- キーボードで操作できることを確認してください（[達成基準 2.1.1 キーボード (レベル A)](https://waic.jp/translations/WCAG21/Understanding/keyboard.html)）。
  - `Tab` でフォーカスできる
  - `Enter`または`Space`で開閉できる
- フォーカスインジケータが正しく表示されることを確認してください（[達成基準 2.4.7 フォーカスの可視化 (レベル AA)](https://waic.jp/translations/WCAG21/Understanding/focus-visible.html)）。
  - （特に `overflow: hidden;`を使用している場合、フォーカスインジケータが隠れてしまうことがあります）
- スクリーンリーダーで、ボタンであることが伝わること、および開閉状態が伝わることを確認してください
  - [達成基準 4.1.2 名前 (name)・役割 (role) 及び値 (value) (レベル A)](https://waic.jp/translations/WCAG21/Understanding/name-role-value.html)
- ユーザーがアニメーションを無効にできるようにしてください（[達成基準 2.3.3 インタラクションによるアニメーション (レベル AAA)](https://waic.jp/translations/WCAG21/Understanding/animation-from-interactions.html)）。
  - この例では`prefers-reduced-motion`を参照することで実現しています。
- 2行になった場合に崩れないように（日本語で入るとしても、翻訳したときに変わる可能性がある）

## 実装例

```html:HTML
<details class="details">
  <summary class="details__summary">
    開閉時アニメーション付きアコーディオン
  </summary>
  <div data-details-content>
    <div class="details__content">
      <p>
        ダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキスト
      </p>
    </div>
  </div>
</details>
```

```scss:SCSS
// reset
summary {
  cursor: pointer;
}

.details {
  overflow: hidden;
  border: 2px solid rgba(#000, 0.1);
  border-radius: 0.5rem;
}

.details__summary {
  display: grid;
  column-gap: 0.5rem;
  justify-content: space-between;
  padding: 1rem;
  font-weight: 700;
  background-color: rgba(#000, 0.1);
  &:focus-visible {
    // フォーカスリングがoverflow: hidden; で隠れてしまう問題の対策
    outline-offset: -4px;
  }
  @media (hover: hover) {
    &:where(summary):hover {
      background-color: rgba(#000, 0.2);
    }
  }
  &::before,
  &::after {
    display: block;
    grid-area: 1 / 2;
    width: 1em;
    height: 2px;
    margin-block: auto;
    content: "";
    background-color: currentColor;
    transition: transform 0.2s;
  }
  &::after {
    transform: rotate(90deg);
  }
  &:is(details[open]:not(.is-closing) *) {
    &::after {
      transform: rotate(0deg);
    }
  }
}

.details__content {
  padding: 2rem;
}
```

アニメーションを必要とする場合のみ JavaScript が必要です。
height 0→auto のアニメーションを行うため、`gsap` を採用しています。

```ts:JavaScript
import { gsap } from "gsap";

const SELECTOR_DETAILS = "details";
const SELECTOR_SUMMARY = "summary";
const SELECTOR_CONTENT = "[data-details-content]";
const CLASS_BEFORE_CLOSE = "is-closing";

const allDetails = document.querySelectorAll(SELECTOR_DETAILS);
allDetails.forEach((details) => {
  const summary = details.querySelector(SELECTOR_SUMMARY);
  const content = details.querySelector(SELECTOR_CONTENT);

  if (!summary || !content) return;

  // details/summary の開閉アニメーション
  gsap.set(content, { overflow: "hidden" });
  summary.addEventListener("click", (event) => {
    // ユーザーがアニメーションを無効にしていない場合のみアニメーションを行う
    if (window.matchMedia(`(prefers-reduced-motion: no-preference)`).matches) {
      if (details.open) {
        // 閉じる
        event.preventDefault();
        details.classList.add(CLASS_BEFORE_CLOSE);
        gsap.to(content, {
          height: 0,
          clearProps: "height",
          onComplete: () => {
            details.open = false;
            details.classList.remove(CLASS_BEFORE_CLOSE);
          },
        });
      } else {
        // 開く
        gsap.fromTo(content, { height: 0 }, { height: "auto" });
      }
    }
  });
});
```

## ありがちな失敗例

### 開閉ボタンがボタンでない

### overflow: hidden; でフォーカスリングが隠れてしまう

### アニメーションが無効にできない

### ページ内検索で非表示になっているテキストが検索されない

## 関連リンク

https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
