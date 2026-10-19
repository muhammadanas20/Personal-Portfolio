import { useEffect, useRef, useState } from "react";

/**
 * Editorial dot cursor — 6px dot + trailing 34px ring.
 *
 * Behaviour:
 * - rests as ink on paper chapters, flips to cream over dark ones
 *   (marked with `data-cursor-light` on the section/footer)
 * - over links & buttons the dot collapses and the ring blooms vermilion
 * - over text fields the custom cursor steps aside so the native I-beam works
 * - disappears when the pointer leaves the window, disabled on touch or
 *   reduced motion, and restores the native cursor on unmount
 */
const supportsCursor = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const INTERACTIVE = "a, button, [role='button'], [data-cursor='link'], summary";
const TEXT_FIELD = "input, textarea, select, [contenteditable='true']";
const LIGHT_SURFACE = "[data-cursor-light]";

const INK = "#1a1610";
const CREAM = "#ede7db";
const VERMILION = "#ef4b22";
const RING_INK = "rgba(26, 22, 16, 0.5)";
const RING_CREAM = "rgba(237, 231, 219, 0.7)";

export const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled] = useState(supportsCursor);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("cursor-on");

    const pos = { x: -100, y: -100 };
    const trail = { x: -100, y: -100 };

    let shown = false;
    let overLink = false;
    let overField = false;
    let onLight = false;
    let pressed = false;

    let raf = 0;
    let last = 0;

    const paint = () => {
      const visible = shown && !overField;
      dot.style.opacity = visible ? "1" : "0";
      ring.style.opacity = visible ? "1" : "0";

      dot.style.backgroundColor = onLight ? CREAM : INK;
      if (overLink) {
        ring.style.borderColor = VERMILION;
      } else {
        ring.style.borderColor = onLight ? RING_CREAM : RING_INK;
      }
    };

    const render = (time) => {
      const delta = last ? Math.min(time - last, 48) : 16.7;
      last = time;

      // frame-rate independent smoothing, so the trail feels the same on 60/120Hz
      const ease = 1 - Math.pow(1 - 0.24, delta / 16.7);
      trail.x += (pos.x - trail.x) * ease;
      trail.y += (pos.y - trail.y) * ease;

      const dotScale = overLink || overField ? 0 : 1;
      const ringScale = pressed ? 0.82 : overLink ? 1.55 : 1;

      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;

      raf = requestAnimationFrame(render);
    };

    const readTarget = (target) => {
      if (!(target instanceof Element)) return;
      overField = !!target.closest(TEXT_FIELD);
      overLink = !overField && !!target.closest(INTERACTIVE);
      onLight = !!target.closest(LIGHT_SURFACE);
      paint();
    };

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!shown) {
        shown = true;
        trail.x = pos.x;
        trail.y = pos.y;
      }
      // `e.target` is already the topmost element under the pointer — no
      // extra hit-testing needed, so the trail stays perfectly smooth.
      readTarget(e.target);
    };

    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };
    const hide = () => {
      shown = false;
      paint();
    };
    const onVisibility = () => {
      if (document.hidden) hide();
    };

    paint();
    raf = requestAnimationFrame(render);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", onVisibility);
      document.body.classList.remove("cursor-on");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <span
        ref={dotRef}
        aria-hidden="true"
        data-cursor-dot=""
        className="pointer-events-none fixed left-0 top-0 z-[90] h-[6px] w-[6px] rounded-full opacity-0"
        style={{ transition: "opacity .25s ease, background-color .25s ease", willChange: "transform" }}
      />
      <span
        ref={ringRef}
        aria-hidden="true"
        data-cursor-ring=""
        className="pointer-events-none fixed left-0 top-0 z-[90] h-[34px] w-[34px] rounded-full border opacity-0"
        style={{
          transition: "opacity .25s ease, border-color .25s ease",
          willChange: "transform",
        }}
      />
    </>
  );
};
