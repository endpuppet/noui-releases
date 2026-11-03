// Page chrome: the nav gets a backdrop once you scroll, and sections fade in as they arrive.
let reveals = null;

/** Fade `.reveal` elements in when they scroll into view. Safe to call again for elements added later. */
export function observeReveals(root = document) {
  const nodes = root.querySelectorAll(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) {
    nodes.forEach((n) => n.classList.add("in"));
    return;
  }
  reveals ??= new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        en.target.classList.add("in");
        reveals.unobserve(en.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
  );
  nodes.forEach((n) => reveals.observe(n));
}

export function initPage() {
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  observeReveals();
}
