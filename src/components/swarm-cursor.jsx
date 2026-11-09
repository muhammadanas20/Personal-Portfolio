import { useEffect, useRef, useState } from "react";

/**
 * Swarm cursor — a small flock of collaborator pointers that trail the
 * editorial dot cursor, in the spirit of multiplayer/Figma cursors.
 *
 * Behaviour:
 * - every agent is a spring-damper follower with its own lateral slot and
 *   trail depth, so the flock fans out into a loose formation behind the
 *   pointer and stretches with pointer speed (fast move = longer tail)
 * - when the pointer rests, the agents keep drifting on a slow wobble
 *   instead of freezing — it stays a swarm, not a stack of stickers
 * - a click scatters them for a beat, then the springs pull them home
 * - the two lead agents carry hairline mono name tags; the rest stay bare
 *   arrows so the flock never turns into a stack of labels
 * - tones (ink / vermilion / soft) resolve from the theme's custom
 *   properties, so the flock re-inks itself with the same attribute write
 *   as the rest of the site
 * - steps aside over text fields, hides when the pointer leaves, and is
 *   not mounted at all on touch or reduced-motion setups
 *
 * The dot cursor remains the precise pointer (z-90); the swarm floats just
 * under it (z-86) so accuracy is never traded for spectacle.
 */

const supportsSwarm = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TEXT_FIELD = "input, textarea, select, [contenteditable='true']";
const LIGHT_SURFACE = "[data-cursor-light]";

// lateral = offset across the direction of travel (px)
// depth    = distance behind the pointer (px, stretched by speed)
// stiffness/damping = spring feel (looser for the far agents, so they arrive late)
const CREW = [
  { name: "Ayesha", tone: "ink", tag: true, lateral: -6, depth: 16, stiffness: 208, damping: 16, wobble: 5, rate: 0.9, phase: 0.0, base: 0.92 },
  { name: "Bilal", tone: "vermilion", tag: true, lateral: 30, depth: 34, stiffness: 172, damping: 14, wobble: 7, rate: 1.15, phase: 1.7, base: 0.82 },
  { name: "Zara", tone: "ink", tag: false, lateral: -36, depth: 54, stiffness: 146, damping: 13, wobble: 8, rate: 1.4, phase: 3.1, base: 0.7 },
  { name: "Hamza", tone: "soft", tag: false, lateral: 56, depth: 76, stiffness: 124, damping: 12, wobble: 9, rate: 0.8, phase: 4.4, base: 0.58 },
  { name: "Sana", tone: "ink", tag: false, lateral: -70, depth: 98, stiffness: 108, damping: 11, wobble: 10, rate: 1.6, phase: 2.2, base: 0.48 },
];

const ARROW = "M5.5 2.8 5.5 19.4 9.6 15.3 12.4 21.2 15.4 19.8 12.6 14.1 18.3 13.4Z";

const shortestAngle = (from, to) => Math.atan2(Math.sin(to - from), Math.cos(to - from));

export const SwarmCursor = () => {
  const [enabled] = useState(supportsSwarm);
  const [crew] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 1024 ? CREW.slice(0, 3) : CREW,
  );
  const refs = useRef([]);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const nodes = crew.map((_, i) => refs.current[i]).filter(Boolean);
    if (nodes.length !== crew.length) return;

    const agents = crew.map((a, i) => ({
      ...a,
      el: nodes[i],
      x: -300,
      y: -300,
      vx: 0,
      vy: 0,
    }));

    const pointer = { x: -300, y: -300 };
    const prev = { x: -300, y: -300, t: 0 };

    let angle = Math.PI * 0.5; // direction of travel, smoothed
    let speed = 0; // smoothed pointer speed, px/s
    let alpha = 0; // global fade
    let overField = false;
    let shown = false;
    let overLight = false;
    let pressedAt = -1;
    let raf = 0;
    let last = 0;

    const place = () => {
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      for (const a of agents) {
        a.x = pointer.x - dx * a.depth - dy * a.lateral;
        a.y = pointer.y - dy * a.depth + dx * a.lateral;
        a.vx = 0;
        a.vy = 0;
      }
    };

    const onMove = (e) => {
      const now = performance.now();
      pointer.x = e.clientX;
      pointer.y = e.clientY;

      // the loop parks itself once the flock has faded out — wake it up
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }

      if (!shown) {
        shown = true;
        // (re)enter the window behind the pointer instead of flying across it
        place();
        prev.x = pointer.x;
        prev.y = pointer.y;
        prev.t = now;
      } else if (prev.t) {
        const dt = Math.max(8, now - prev.t);
        const mx = pointer.x - prev.x;
        const my = pointer.y - prev.y;
        const dist = Math.hypot(mx, my);
        if (dist > 0.6) {
          angle += shortestAngle(angle, Math.atan2(my, mx)) * 0.22;
          const instant = (dist / dt) * 1000;
          speed = Math.min(speed + (instant - speed) * 0.25, 2600);
          prev.x = pointer.x;
          prev.y = pointer.y;
          prev.t = now;
        }
      }

      if (e.target instanceof Element) {
        overField = !!e.target.closest(TEXT_FIELD);
        const light = !!e.target.closest(LIGHT_SURFACE);
        if (light !== overLight) {
          overLight = light;
          layerRef.current?.classList.toggle("is-light", light);
        }
      }
    };

    const onDown = () => {
      pressedAt = performance.now();
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      // a soft outward kick: the flock scatters, then the springs recover
      for (const a of agents) {
        const side = Math.sign(a.lateral) || 1;
        a.vx += (-dy * side + dx * 0.6) * 90;
        a.vy += (dx * side + dy * 0.6) * 90;
      }
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

      // decay the speed reading so a resting pointer settles the tail
      speed *= Math.exp(-dt * 2.4);
      alpha += ((shown && !overField ? 1 : 0) - alpha) * Math.min(1, dt * 7);

      // nothing on screen: park the loop instead of burning frames
      if (!shown && alpha < 0.003) {
        raf = 0;
        return;
      }

      const sincePress = pressedAt > 0 ? time - pressedAt : Infinity;
      const kick = sincePress < 260 ? 1 + (1 - sincePress / 260) * 0.5 : 1;

      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const stretch = 1 + Math.min(speed, 1400) / 1400; // up to 2× depth

      for (const a of agents) {
        const wob = time * 0.001 * a.rate + a.phase;
        const tx =
          pointer.x - dx * a.depth * stretch * kick - dy * a.lateral + Math.cos(wob) * a.wobble;
        const ty =
          pointer.y - dy * a.depth * stretch * kick + dx * a.lateral + Math.sin(wob * 1.13) * a.wobble;

        a.vx += (tx - a.x) * a.stiffness * dt;
        a.vy += (ty - a.y) * a.stiffness * dt;

        const damp = Math.exp(-a.damping * dt);
        a.vx *= damp;
        a.vy *= damp;

        a.x += a.vx * dt;
        a.y += a.vy * dt;

        a.el.style.transform = `translate3d(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0)`;

        const opacity = (alpha * a.base).toFixed(3);
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
    };
  }, [enabled, crew]);

  if (!enabled) return null;

  return (
    <div ref={layerRef} aria-hidden="true" className="swarm-layer">
      {crew.map((a, i) => (
        <span
          key={a.name}
          ref={(el) => {
            refs.current[i] = el;
          }}
          data-swarm=""
          data-tone={a.tone}
          className="swarm-cursor"
          style={{ opacity: 0, transform: "translate3d(-300px, -300px, 0)" }}
        >
          <svg
            className="swarm-cursor__arrow"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d={ARROW} />
          </svg>
          {a.tag ? <span className="swarm-cursor__tag">{a.name}</span> : null}
        </span>
      ))}
    </div>
  );
};
