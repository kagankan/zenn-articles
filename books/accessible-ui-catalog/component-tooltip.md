---
title: "ツールチップ"
---

ツールチップは、ある要素（ボタンやアイコンなど）にマウスを乗せたりフォーカスしたりしたときに、その要素を補足する短い説明を浮かべて表示する UI パターンです。アイコンだけのボタンの意味を補ったり、用語の補足を添えたりする場合に使用されます。

## 使用の前に✋

- **ツールチップで情報を隠すことは適切でしょうか？**
  - ツールチップの中身は、ホバーやフォーカスをしないと表示されません。流し見るユーザーには、そこに情報があること自体が伝わらない可能性があります。
  - タッチデバイスにはホバーがありません。タップで開く実装にしない限り、スマートフォンのユーザーには中身が表示されないことがあります。
  - **操作に必須の情報や、なくては困る情報をツールチップだけに入れてはいけません**。あくまで「補足」にとどめ、本当に必要な情報はその場に常に見える形で書きましょう。
- **「ツールチップ」と「トグルチップ」を取り違えていないでしょうか？**
  - ツールチップ（tooltip）は、ボタンなどの**操作要素の説明**を補うものです。ホバー／フォーカスで表示し、`role="tooltip"` を使います。中に**リンクやボタンなどの操作可能な要素を入れてはいけません**（ツールチップ内の要素にはフォーカスを移動できないため）。
  - トグルチップ（toggletip）は、「ⓘ」ボタンなどを**クリックして補足情報を開く**ものです。操作要素の名前ではなく独立した情報を見せたい場合や、中に少しリッチな内容を入れたい場合はこちらが向きます。実装の考え方が異なるため、目的に合うほうを選んでください。

## 実装するときに気をつけること

### アクセシビリティの考慮事項

- [ ] **キーボード（フォーカス）でもツールチップを表示できる**ようにする
  - **なぜ**: マウスを使えない人（手の運動が難しい人、スクリーンリーダー利用者など）はキーボードで操作します。ホバーでしか表示されないと、その人たちは補足説明にたどり着けません。
  - **確認方法**: マウスを使わず、`Tab` でトリガー要素にフォーカスしたときにツールチップが表示されるか。トリガーは `button` や `a` などフォーカス可能な要素にし、`:hover` だけでなく `:focus-visible`（やフォーカスイベント）でも表示されるようにします。
  - **該当する達成基準**: [達成基準 2.1.1 キーボード (レベル A)](https://waic.jp/translations/WCAG21/Understanding/keyboard.html)
- [ ] **表示したツールチップが「消せる」「ホバーし続けられる」「勝手に消えない」**ようにする
  - **なぜ**: ロービジョンで拡大して使う人は、浮き出たツールチップが下の文章を覆って読めなくなることがあります。また、手が震える人はポインタを動かす途中でツールチップ上を通ることもあります。表示中のコンテンツには次の 3 つが必要です。
    - **消去可能（Dismissible）**: マウスやフォーカスを移動せずに、`Esc` キーで閉じられる。
    - **ホバー可能（Hoverable）**: ツールチップの上にポインタを移動しても消えない（読んでいる途中で消えない）。
    - **持続性（Persistent）**: ホバー／フォーカスが外れるか、`Esc` を押すか、情報が無効になるまで表示され続け、時間経過などで勝手に消えない。
  - **確認方法**: ツールチップを表示した状態で、（1）`Esc` で閉じられるか、（2）ツールチップ自体の上にポインタを乗せても消えないか、（3）放っておいても勝手に消えないか。
  - **該当する達成基準**: [達成基準 1.4.13 ホバー又はフォーカスで表示されるコンテンツ (レベル AA)](https://waic.jp/translations/WCAG21/Understanding/content-on-hover-or-focus.html)
- [ ] **ツールチップの内容がスクリーンリーダーに伝わる**ようにする
  - **なぜ**: 画面を見ないユーザーには、視覚的に浮き出たツールチップは見えません。トリガーと内容が関連付けられていないと、補足説明が読み上げられません。
  - **確認方法**: トリガー要素に `aria-describedby` でツールチップの `id` を指定し、ツールチップ側に `role="tooltip"` を付けます。スクリーンリーダーでトリガーにフォーカスしたとき、名前に続けてツールチップの内容が「説明」として読み上げられるか。
  - **該当する達成基準**: [達成基準 4.1.2 名前 (name)・役割 (role) 及び値 (value) (レベル A)](https://waic.jp/translations/WCAG21/Understanding/name-role-value.html)
- [ ] **トリガー自体にアクセシブルな名前がある**ようにする（アイコンのみのボタンの場合）
  - **なぜ**: ツールチップは「補足（description）」であり、要素そのものの「名前（name）」ではありません。アイコンだけのボタンにツールチップで意味を持たせても、スクリーンリーダーでは名前のないボタンとして読み上げられてしまいます。
  - **確認方法**: アイコンボタンに、ラベルテキスト（視覚的に隠す場合は後述の手法で）や `aria-label` で名前を付けます。スクリーンリーダーで「○○ ボタン」と名前が読み上げられるか。
  - **該当する達成基準**: [達成基準 4.1.2 名前 (name)・役割 (role) 及び値 (value) (レベル A)](https://waic.jp/translations/WCAG21/Understanding/name-role-value.html)
- [ ] **ツールチップの文字と背景に十分なコントラストがある**ようにする
  - **なぜ**: ツールチップは背景に濃い色を敷くデザインが多く、文字色とのコントラストが不足しがちです。コントラストが低いとロービジョンのユーザーは読めません。
  - **確認方法**: 文字色と背景色のコントラスト比が 4.5:1 以上（大きい文字は 3:1 以上）あるか。
  - **該当する達成基準**: [達成基準 1.4.3 コントラスト (最低限) (レベル AA)](https://waic.jp/translations/WCAG21/Understanding/contrast-minimum.html)
- [ ] **文字の拡大・行間の変更でも、ツールチップの中身が切れたり重ならない**ようにする
  - **なぜ**: ロービジョンのユーザーはブラウザのズームや文字サイズの拡大で読み、行間や文字間隔を広げて読む人もいます。固定の幅・高さや 1 行前提でツールチップを作っていると、文字が増えたり拡大されたときにはみ出して読めなくなります。
  - **確認方法**: 次のいずれの状況でも、テキストが切れず・重ならず読めるか（固定の `height` を避け、`white-space: nowrap` で折り返しを止めず、`max-width` で幅を制限して折り返すのがポイント）。
    - ブラウザのズームで文字を 200% に拡大したとき
    - 行間をフォントサイズの 1.5 倍に広げたとき (`line-height: 1.5;` を設定する)
  - **該当する達成基準**: [達成基準 1.4.4 文字サイズの変更 (レベル AA)](https://waic.jp/translations/WCAG21/Understanding/resize-text.html) ／ [達成基準 1.4.12 テキストの間隔 (レベル AA)](https://waic.jp/translations/WCAG21/Understanding/text-spacing.html)

### ユーザビリティの考慮事項

WCAG の適合要件ではありませんが、より使いやすくするために考慮するとよい観点です。

- [ ] **画面の端でもツールチップがはみ出さず読める**ようにする
  - **なぜ**: トリガーが画面の端にあると、固定方向（例: 常に上）に出すツールチップは画面外にはみ出して読めなくなることがあります。
  - **確認方法**: トリガーが画面の上下左右の端にあるときでも、ツールチップが画面内に収まって表示されるか。CSS の Anchor Positioning（`position-try`）や Popover API を使うと、はみ出しを自動で回避できます。
  - **該当する達成基準**: なし（適合要件ではなく、使いやすさの観点です）。

## 実装例

@[codepen](https://codepen.io/kagankan/pen/XXXXXXX)

:::details HTML コード

```html:HTML
<span class="tooltip-wrapper">
  <button type="button" class="tooltip-trigger" aria-describedby="tooltip-1">
    <!-- アイコンのみのボタンには、視覚的に隠したラベルで名前を付ける -->
    <span class="visually-hidden">設定</span>
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
      <!-- アイコン形状（省略） -->
    </svg>
  </button>
  <span role="tooltip" id="tooltip-1" class="tooltip">
    アプリの設定を開きます
  </span>
</span>
```

:::

:::details CSS コード

```css:CSS
/* 視覚的に隠すが、スクリーンリーダーには読み上げられるテキスト */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  /* 1.4.4 / 1.4.12 対策: 固定の高さを持たせず、max-width で折り返す */
  max-width: 16rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #fff;
  /* 1.4.3 対策: 文字色と十分なコントラストを確保する */
  background-color: #333;
  border-radius: 0.25rem;
  translate: -50% 0;
  /* 初期状態は非表示。表示の切り替えは JS で data 属性を付与して行う */
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.tooltip-wrapper[data-tooltip-visible] .tooltip {
  visibility: visible;
  opacity: 1;
}

/* アニメーションを無効にしたいユーザーには動きを止める */
@media (prefers-reduced-motion: reduce) {
  .tooltip {
    transition: none;
  }
}
```

:::

:::details JavaScript コード

```ts:JavaScript
const SELECTOR_WRAPPER = ".tooltip-wrapper";
const SELECTOR_TRIGGER = ".tooltip-trigger";
const ATTR_VISIBLE = "data-tooltip-visible";

document.querySelectorAll<HTMLElement>(SELECTOR_WRAPPER).forEach((wrapper) => {
  const trigger = wrapper.querySelector<HTMLElement>(SELECTOR_TRIGGER);
  if (!trigger) return;

  const show = () => wrapper.setAttribute(ATTR_VISIBLE, "");
  const hide = () => wrapper.removeAttribute(ATTR_VISIBLE);

  // フォーカスでもホバーでも表示する（2.1.1）
  trigger.addEventListener("focus", show);
  trigger.addEventListener("blur", hide);

  // ホバー可能（Hoverable）: トリガーとツールチップを含む wrapper 全体で
  // 出入りを判定するので、ツールチップ上にポインタを乗せても消えない（1.4.13）
  wrapper.addEventListener("mouseenter", show);
  wrapper.addEventListener("mouseleave", hide);

  // 消去可能（Dismissible）: フォーカスやポインタを動かさずに Esc で閉じる（1.4.13）
  wrapper.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && wrapper.hasAttribute(ATTR_VISIBLE)) {
      hide();
    }
  });
});
```

:::

### 実装例の補足

- ツールチップ本体には `role="tooltip"` を付け、トリガー側の `aria-describedby` でその `id` を参照しています。これにより、トリガーにフォーカスしたとき、スクリーンリーダーで名前に続けてツールチップの内容が「説明」として読み上げられます。
- ツールチップは要素の**名前（name）**ではなく**補足（description）**です。アイコンのみのボタンには、別途 `.visually-hidden` のラベルで名前を付けています。ツールチップだけに頼ると名前のないボタンになってしまうためです。
- 表示の切り替えに JavaScript を使っているのは、`Esc` での消去（1.4.13 の Dismissible）を CSS の `:hover` / `:focus-visible` だけでは実現できないためです。ホバー／フォーカスのみで消去要件を満たせない点に注意してください。
- ツールチップの中には、リンクやボタンなどの操作可能な要素を入れていません。`role="tooltip"` のコンテンツにはフォーカスを移動できないため、操作要素を入れると到達できなくなります。操作要素を入れたい場合はトグルチップやポップオーバーなど別のパターンを検討してください。

### ビジュアルデザインのための考慮事項

- 吹き出しの三角形（しっぽ）を付けたい
  - `::before` / `::after` 疑似要素に `border` で三角形を作り、ツールチップの縁に重ねて配置します。三角形は装飾なので、読み上げや折り返しに影響しません。
- 画面端でのはみ出しを自動で避けたい
  - 表示位置をブラウザに自動調整させたい場合は、Popover API（`popover` 属性）と CSS Anchor Positioning（`anchor-name` / `position-anchor` / `position-area` / `position-try`）を使うと、画面端で上下左右に自動でフリップできます。

:::message
CSS Anchor Positioning は 2025 年 12 月時点で Chromium 系ブラウザのみ対応です。最新の対応状況は [caniuse](https://caniuse.com/) で `css-anchor-positioning` を確認してください。対応していないブラウザでは、上の実装例のように `position: absolute;` で固定方向に表示するフォールバックを用意してください。
:::

## ありがちな失敗例

### ホバーでしか表示できない（キーボードで出せない）

トリガーを `div` や `span` にして `:hover` だけで表示すると、キーボード利用者はツールチップを出せません。トリガーを `button` / `a` などフォーカス可能な要素にし、フォーカスでも表示します。

### Esc で閉じられない・ツールチップ上にポインタを乗せると消える

`:hover` / `:focus-visible` だけの CSS 実装では、1.4.13 の「消去可能」「ホバー可能」を満たせません。`Esc` での消去と、ツールチップ自体の上にポインタを乗せても消えない作りが必要です。

### ツールチップを要素の「名前」代わりにしている

アイコンのみのボタンに `aria-describedby` のツールチップだけを付けると、名前のないボタンになってしまいます。名前（`aria-label` や視覚的に隠したラベル）と補足（ツールチップ）は別物として両方を用意します。

### 必須の情報・操作要素をツールチップに入れている

ツールチップは流し見やタッチでは表示されないことがあり、中の操作要素にはフォーカスできません。必須情報や操作要素はツールチップに入れないでください。

### 固定サイズで文字がはみ出す

固定の `width` / `height` や `white-space: nowrap` で組むと、文字の拡大・行間変更・翻訳で中身がはみ出します。`max-width` で折り返す作りにします。

## 関連リンク

https://inclusive-components.design/tooltips-toggletips/

### 各種デザインシステム

https://component.gallery/components/tooltip/

https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
