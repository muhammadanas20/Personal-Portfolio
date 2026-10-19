import { useEffect, useRef, useState } from "react";

/**
 * Editorial dot cursor — 6px ink dot + trailing 34px ring.
 * Grows over interactive targets. Disabled on touch / reduced motion.
 */
const cursorSupported = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(cursorSupported);

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add("cursor-on");
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    let hovered = false;
    let visible = false;
    let raf;

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        dotRef.current.style.opacity = "1";
        ringRef.current.style.opacity = "1";
      }
    };

    const onOver = (e) => {
      // Hide custom cursor when hovering over project images or other interactive elements
      hovered =
        !e.target.closest(
          ".art-frame, .art-frame img, .project-image, [data-cursor-img]"
        ) && !e.target.closest("a, button, [role='button'], input, textarea, [data-cursor]");
    };

    const loop = () => {
      // Increased smoothing factor from 0.16 to 0.25 for reduced lag
      ring.x += (pos.x - ring.x) * 0.25;
      ring.y += (pos.y - ring.y) * 0.25;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${hovered ? 0 : 1})`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${hovered ? 1.55 : 1})`;
        ringRef.current.style.borderColor = hovered ? "#ef4b22" : "rgba(26,22,16,0.5)";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.classList.remove("cursor-on");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="hidden md:block">
      <span
        ref={dotRef}
        className="fixed top-0 left-0 z-[90] w-[6px] h-[6px] rounded-full bg-ink opacity-0 pointer-events-none"
        style={{ transition: "opacity .3s ease" }}
      />
      <span
        ref={ringRef}
        className="fixed top-0 left-0 z-[90] w-[34px] h-[34px] rounded-full border border-ink/50 opacity-0 pointer-events-none"
        style={{ transition: "opacity .3s ease, border-color .3s ease" }}
      />
    </div>
  );
};
