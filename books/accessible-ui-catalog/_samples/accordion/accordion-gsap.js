import gsap from "https://esm.sh/gsap";

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
