// accordion.js の縦書き対応バリエーション。
// 横書きだけで使うならオーバースペックなので、縦書き (writing-mode: vertical-*) も
// 想定する場合のサブ実装として分離しています。記事本文には載せていません。
//
// accordion.js との違いは click ハンドラ内の以下だけです。
// - 書字方向を見て、伸縮させる軸 (height / width) を切り替える
// - サイズ取得を scrollHeight / scrollWidth で切り替える
//   （scrollHeight は書字方向に関係なく常に垂直方向を返すため、
//     縦書きでは横方向の scrollWidth が必要になる）

const SELECTOR_DETAILS = "details";
const SELECTOR_SUMMARY = "summary";
const SELECTOR_CONTENT = "[data-details-content]";
const CLASS_BEFORE_CLOSE = "is-closing";

const DURATION = 300;
const EASING = "ease";

const allDetails = document.querySelectorAll(SELECTOR_DETAILS);
allDetails.forEach((details) => {
  const summary = details.querySelector(SELECTOR_SUMMARY);
  const content = details.querySelector(SELECTOR_CONTENT);

  if (!summary || !content) return;

  content.style.overflow = "hidden";

  summary.addEventListener("click", (event) => {
    // ユーザーがアニメーションを無効にしていない場合のみアニメーションを行う
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      return;
    }

    // 縦書き (writing-mode: vertical-*) では伸縮する軸が横方向になるため、
    // 書字方向に応じてアニメーションさせる軸とサイズの取得方法を切り替える
    const isHorizontal = getComputedStyle(content).writingMode.startsWith("horizontal");
    const sizeProperty = isHorizontal ? "height" : "width";
    const fullSize = isHorizontal ? content.scrollHeight : content.scrollWidth;

    if (details.open) {
      // 閉じる
      event.preventDefault();
      details.classList.add(CLASS_BEFORE_CLOSE);

      const animation = content.animate(
        { [sizeProperty]: [`${fullSize}px`, "0px"] },
        { duration: DURATION, easing: EASING }
      );

      animation.onfinish = () => {
        details.open = false;
        details.classList.remove(CLASS_BEFORE_CLOSE);
      };
    } else {
      // 開く（details.open = true は click のデフォルト動作で行われる）
      content.animate(
        { [sizeProperty]: ["0px", `${fullSize}px`] },
        { duration: DURATION, easing: EASING }
      );
    }
  });
});
