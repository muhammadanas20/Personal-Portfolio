import { useEffect, useRef } from "react";

const HOVER_SEL =
  "a, button, [role='button'], input, select, textarea, .tactile-button-3d, .cursor-pointer, [data-cursor-hover]";

export const CreativeCursor = () => {
  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!root || !ring || !dot) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) {
      root.style.display = "none";
      return;
    }

    document.body.classList.add("custom-cursor-active");

    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let visible = false;
    let hover = "";
    let clicked = false;
    let raf = 0;

    const applyMode = () => {
      const isBtn = hover === "button";
      const isInput = hover === "input";
      const isLink = hover === "link";

      root.style.opacity = visible ? "1" : "0";

      if (isInput) {
        dot.style.width = "2px";
        dot.style.height = "18px";
        dot.style.borderRadius = "1px";
        dot.style.background = "#66e6ff";
        ring.style.width = "0px";
        ring.style.height = "0px";
        ring.style.opacity = "0";
        return;
      }

      dot.style.width = clicked ? "6px" : hover ? "8px" : "6px";
      dot.style.height = clicked ? "6px" : hover ? "8px" : "6px";
      dot.style.borderRadius = "50%";
      dot.style.background = isBtn ? "#c084fc" : "#66e6ff";

      const size = clicked ? 18 : isBtn ? 52 : isLink ? 40 : 28;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.opacity = "1";
      ring.style.borderColor = isBtn
        ? "rgba(192, 132, 252, 0.85)"
        : isLink
          ? "rgba(102, 230, 255, 0.7)"
          : "rgba(232, 234, 246, 0.35)";
      ring.style.background = isBtn
        ? "rgba(157, 78, 221, 0.08)"
        : "transparent";
    };

    const tick = () => {
      rx += (x - rx) * 0.35;
      ry += (y - ry) * 0.35;
      // Dot is locked to the pointer (no lag)
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      // Ring eases slightly behind for a modern trailing ring
      ring.style.transform = `translate3d(${rx - x}px, ${ry - y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const classify = (el) => {
      if (!el || el === document.body || el === document.documentElement) return "";
      if (el.matches?.("input, textarea, select, [contenteditable='true']")) return "input";
      if (el.matches?.("button, [role='button'], .tactile-button-3d")) return "button";
      if (el.matches?.(HOVER_SEL)) return "link";
      return classify(el.parentElement);
    };

    const onMove = (e) => {
      if (e.pointerType === "touch") {
        root.style.display = "none";
        document.body.classList.remove("custom-cursor-active");
        return;
      }
      root.style.display = "";
      document.body.classList.add("custom-cursor-active");
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        applyMode();
      }
    };

    const onOver = (e) => {
      const next = classify(e.target);
      if (next !== hover) {
        hover = next;
        applyMode();
      }
    };

    const onDown = (e) => {
      if (e.pointerType === "touch") return;
      clicked = true;
      applyMode();
    };

    const onUp = () => {
      clicked = false;
      applyMode();
    };

    const onLeave = () => {
      visible = false;
      applyMode();
    };

    const onEnter = () => {
      visible = true;
      applyMode();
    };

    applyMode();
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[99999] mix-blend-difference"
      style={{
        opacity: 0,
        transform: "translate3d(-100px,-100px,0)",
        willChange: "transform",
      }}
    >
      <div
        ref={ringRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{
          width: 28,
          height: 28,
          borderColor: "rgba(232, 234, 246, 0.35)",
          transition:
            "width 160ms cubic-bezier(.2,.8,.2,1), height 160ms cubic-bezier(.2,.8,.2,1), border-color 160ms ease, background-color 160ms ease, opacity 160ms ease",
          willChange: "transform, width, height",
        }}
      />
      <div
        ref={dotRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 6,
          height: 6,
          background: "#66e6ff",
          boxShadow: "0 0 10px rgba(102, 230, 255, 0.7)",
          transition: "width 120ms ease, height 120ms ease, background-color 120ms ease",
        }}
      />
    </div>
  );
};
