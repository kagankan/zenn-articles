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

    if (details.open) {
      // 閉じる
      event.preventDefault();
      details.classList.add(CLASS_BEFORE_CLOSE);

      const animation = content.animate(
        { height: [`${content.scrollHeight}px`, "0px"] },
        { duration: DURATION, easing: EASING }
      );

      animation.onfinish = () => {
        details.open = false;
        details.classList.remove(CLASS_BEFORE_CLOSE);
      };
    } else {
      // 開く（details.open = true は click のデフォルト動作で行われる）
      content.animate(
        { height: ["0px", `${content.scrollHeight}px`] },
        { duration: DURATION, easing: EASING }
      );
    }
  });
});
