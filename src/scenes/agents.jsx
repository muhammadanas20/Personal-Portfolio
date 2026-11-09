import { useEffect, useRef, useState } from "react";

/**
 * AGENT cursors — three instrumented pointers that orbit the mouse.
 *
 * The real pointer stays exact (a 7px dot); the agents are annotation:
 * each one springs toward a point on a slowly rotating ring around the
 * cursor, so they fan, drift and re-gather instead of stacking. Clicking
 * collapses the ring for a beat — the agents snap in, then let go.
 *
 * Not mounted on touch or reduced motion. Over text fields the whole
 * system steps aside so the native I-beam can work.
 */

const supportsAgents = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TEXT_FIELD = "input, textarea, select, [contenteditable='true']";

const AGENTS = [
  { id: "01", angle: -1.9, radius: 34, spin: 0.00009, stiffness: 190, damping: 17, tone: "ink" },
  { id: "02", angle: 0.2, radius: 46, spin: -0.00007, stiffness: 150, damping: 15, tone: "accent" },
  { id: "03", angle: 2.4, radius: 30, spin: 0.00011, stiffness: 118, damping: 13, tone: "ink" },
];

const ARROW = "M5.5 2.8 5.5 19.4 9.6 15.3 12.4 21.2 15.4 19.8 12.6 14.1 18.3 13.4Z";

export const AgentCursors = () => {
  const [enabled] = useState(supportsAgents);
  const refs = useRef([]);
  const dotRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const nodes = AGENTS.map((_, i) => refs.current[i]).filter(Boolean);
    if (nodes.length !== AGENTS.length) return;

    document.body.classList.add("zll-cursor-on");

    const agents = AGENTS.map((a, i) => ({
      ...a,
      el: nodes[i],
      x: -200,
      y: -200,
      vx: 0,
      vy: 0,
      opacity: 0,
    }));

    const pointer = { x: -200, y: -200 };
    const dot = dotRef.current;

    let shown = false;
    let overField = false;
    let alpha = 0;
    let pressAt = -1;
    let raf = 0;
    let last = 0;
    let seeded = false;

    const place = (t) => {
      for (const a of agents) {
        const ang = a.angle + t * a.spin;
        a.x = pointer.x + Math.cos(ang) * a.radius;
        a.y = pointer.y + Math.sin(ang) * a.radius;
        a.vx = 0;
        a.vy = 0;
      }
    };

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;

      if (!shown) {
        shown = true;
        if (!seeded) {
          seeded = true;
          place(performance.now());
        }
      }

      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }

      overField =
        e.target instanceof Element ? !!e.target.closest(TEXT_FIELD) : false;
    };

    const onDown = () => {
      pressAt = performance.now();
    };

    const hide = () => {
      shown = false;
    };

    const onVisibility = () => {
      if (document.hidden) hide();
    };

    const tick = (time) => {
      const dt = last ? Math.min(time - last, 50) / 1000 : 1 / 60;
      last = time;

      alpha += ((shown && !overField ? 1 : 0) - alpha) * Math.min(1, dt * 8);

      if (!shown && alpha < 0.004) {
        raf = 0;
        return;
      }

      const sincePress = pressAt > 0 ? time - pressAt : Infinity;
      const collapse = sincePress < 240 ? 0.45 : 1;

      if (dot) {
        dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
        dot.style.opacity = alpha.toFixed(3);
      }

      for (const a of agents) {
        const ang = a.angle + time * a.spin;
        const tx = pointer.x + Math.cos(ang) * a.radius * collapse;
        const ty = pointer.y + Math.sin(ang) * a.radius * collapse;

        a.vx += (tx - a.x) * a.stiffness * dt;
        a.vy += (ty - a.y) * a.stiffness * dt;

        const damp = Math.exp(-a.damping * dt);
        a.vx *= damp;
        a.vy *= damp;

        a.x += a.vx * dt;
        a.y += a.vy * dt;

        a.el.style.transform = `translate3d(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0)`;
        const opacity = alpha.toFixed(3);
        if (a.el.style.opacity !== opacity) a.el.style.opacity = opacity;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", onVisibility);
      document.body.classList.remove("zll-cursor-on");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <span ref={dotRef} aria-hidden="true" className="zll-pointer" style={{ opacity: 0 }} />
      {AGENTS.map((a, i) => (
        <span
          key={a.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          aria-hidden="true"
          data-agent={a.id}
          data-tone={a.tone}
          className={`agent${a.tone === "accent" ? " agent--accent" : ""}`}
          style={{ opacity: 0, transform: "translate3d(-200px, -200px, 0)" }}
        >
          <svg className="agent__arrow" width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d={ARROW} />
          </svg>
          <span className="agent__tag">
            <i />
            AGENT·{a.id}
          </span>
        </span>
      ))}
    </>
  );
};
