import Lenis from "lenis";

let lenis = null;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Weighted smooth scroll — the "continuous surface" feel of award sites. */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis;

  lenis = new Lenis({
    lerp: 0.09,
    duration: 1.15,
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  const raf = (time) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  let rafId = requestAnimationFrame(raf);

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(rafId);
    lenis?.destroy();
    lenis = null;
  });

  return lenis;
}

export const getLenis = () => lenis;

/** Smoothly travel to an in-page anchor, honoring the fixed nav offset. */
export function scrollToId(href) {
  if (!href || !href.startsWith("#")) return false;
  const target = href === "#" ? 0 : document.querySelector(href);
  if (target === null && href !== "#") return false;

  if (lenis) {
    lenis.scrollTo(target === 0 ? 0 : target, { offset: -72, duration: 1.2 });
  } else {
    const top = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  return true;
}
