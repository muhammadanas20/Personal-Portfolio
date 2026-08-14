import { useEffect, useRef } from "react";

const V = "2";
const POSES = {
  idle: `/mascot-idle.png?v=${V}`,
  dodge: `/mascot-dodge.png?v=${V}`,
  shoot: `/mascot-shoot.png?v=${V}`,
  jump: `/mascot-jump.png?v=${V}`,
  walk: `/mascot-walk.png?v=${V}`,
  wave: `/mascot-wave.png?v=${V}`,
};

const W = 118;
const H = 168;
const GROUND_PAD = 10;

export const AnasMascot = () => {
  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const hintRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const hint = hintRef.current;
    if (!root || !img || !canvas || !hint) return;

    if (!window.matchMedia("(pointer: fine)").matches) {
      root.style.display = "none";
      hint.style.display = "none";
      return;
    }

    Object.values(POSES).forEach((src) => {
      const preload = new Image();
      preload.src = src;
    });

    const ctx = canvas.getContext("2d");
    const mouse = { x: -9999, y: -9999 };
    const state = {
      x: window.innerWidth - W - 28,
      y: window.innerHeight - H - GROUND_PAD,
      vx: 0,
      vy: 0,
      facing: -1,
      pose: "idle",
      grounded: true,
      web: null,
      lastClick: 0,
      nextWander: performance.now() + 1600,
      lastDodge: 0,
      lastWave: 0,
      squash: 1,
    };

    const groundY = () => window.innerHeight - H - GROUND_PAD;
    const clampX = (x) => Math.max(6, Math.min(window.innerWidth - W - 6, x));

    const setPose = (pose) => {
      if (state.pose === pose) return;
      state.pose = pose;
      img.src = POSES[pose] || POSES.idle;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      state.x = clampX(state.x);
      if (state.grounded) state.y = groundY();
    };
    resize();

    const shootWeb = (tx, ty, swing) => {
      const cx = state.x + W / 2;
      const cy = state.y + 36;
      const dx = tx - cx;
      const dy = ty - cy;
      const len = Math.hypot(dx, dy) || 1;
      state.web = {
        ax: tx,
        ay: Math.max(8, ty),
        rest: Math.min(Math.max(len * 0.72, 90), 340),
        life: swing ? 2400 : 780,
        swing,
        born: performance.now(),
      };
      state.facing = dx >= 0 ? 1 : -1;
      setPose("shoot");
      if (swing) {
        state.grounded = false;
        state.vy = -8.1;
        state.vx += Math.sign(dx) * 4.1;
        setPose("jump");
      }
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onClick = (e) => {
      if (e.target.closest("a, button, input, textarea, select, [role='button']")) return;
      const now = performance.now();
      const dbl = now - state.lastClick < 280;
      state.lastClick = now;
      shootWeb(e.clientX, e.clientY, dbl);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(32, now - last) / 16.67;
      last = now;

      const gx = groundY();
      const cx = state.x + W / 2;
      const cy = state.y + H * 0.38;
      const mdx = mouse.x - cx;
      const mdy = mouse.y - cy;
      const mdist = Math.hypot(mdx, mdy);

      if (mdist < 96 && now - state.lastDodge > 480) {
        state.vx += (mdx === 0 ? (Math.random() > 0.5 ? 1 : -1) : -Math.sign(mdx)) * 5.6;
        state.vy = state.grounded ? -5.2 : state.vy - 1.1;
        state.grounded = false;
        state.lastDodge = now;
        setPose("dodge");
        state.facing = mdx > 0 ? -1 : 1;
        state.squash = 0.9;
      }

      if (state.web) {
        if (now - state.web.born > state.web.life) {
          state.web = null;
        } else {
          const wx = state.web.ax - cx;
          const wy = state.web.ay - cy;
          const dist = Math.hypot(wx, wy) || 1;
          const stretch = dist - state.web.rest;
          const pull = stretch * (state.web.swing ? 0.038 : 0.016);
          state.vx += (wx / dist) * pull * dt;
          state.vy += (wy / dist) * pull * dt;
          if (state.web.swing) {
            state.grounded = false;
            state.vx *= 0.994;
            state.vy *= 0.994;
          }
        }
      }

      if (!state.web && state.grounded && now > state.nextWander) {
        const roll = Math.random();
        if (roll < 0.22 && now - state.lastWave > 4000) {
          setPose("wave");
          state.lastWave = now;
          state.vx *= 0.2;
          state.nextWander = now + 1400;
        } else if (roll < 0.42) {
          state.vy = -6.4;
          state.grounded = false;
          setPose("jump");
          state.nextWander = now + 2200 + Math.random() * 1800;
        } else {
          state.vx += (Math.random() * 2 - 1) * 2.8;
          state.nextWander = now + 1400 + Math.random() * 2200;
        }
      }

      if (!state.grounded) {
        state.vy += 0.34 * dt;
      } else if (!state.web) {
        state.vx *= 0.9;
        state.y = gx + Math.sin(now / 320) * 1.2;
      }

      state.x += state.vx * dt;
      state.y += state.vy * dt;

      if (state.x < 6) {
        state.x = 6;
        state.vx *= -0.4;
      }
      if (state.x > window.innerWidth - W - 6) {
        state.x = window.innerWidth - W - 6;
        state.vx *= -0.4;
      }

      if (state.y >= gx) {
        if (!state.grounded) {
          state.squash = 0.86;
          if (!state.web) setPose(Math.abs(state.vx) > 0.55 ? "walk" : "idle");
        }
        state.y = gx;
        state.vy = 0;
        state.grounded = true;
      }

      if (Math.abs(state.vx) > 0.35) state.facing = state.vx >= 0 ? 1 : -1;

      if (state.grounded && !state.web && now - state.lastDodge > 420 && now - state.lastWave > 900) {
        if (Math.abs(state.vx) > 0.55) setPose("walk");
        else if (state.pose !== "wave") setPose("idle");
      }

      state.squash += (1 - state.squash) * 0.16;

      img.style.transform = `scaleX(${state.facing}) scale(${state.squash}, ${2 - state.squash})`;
      root.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (state.web) {
        const handX = state.x + W / 2 + state.facing * 22;
        const handY = state.y + 44;
        const t = 1 - (now - state.web.born) / state.web.life;
        ctx.save();
        ctx.strokeStyle = `rgba(200, 245, 255, ${0.2 + t * 0.7})`;
        ctx.lineWidth = 1.35;
        ctx.shadowColor = "rgba(102, 230, 255, 0.5)";
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.quadraticCurveTo(
          (handX + state.web.ax) / 2,
          (handY + state.web.ay) / 2 + Math.sin(now / 85) * 7,
          state.web.ax,
          state.web.ay,
        );
        ctx.stroke();
        ctx.fillStyle = "rgba(200,245,255,0.9)";
        ctx.beginPath();
        ctx.arc(state.web.ax, state.web.ay, 2.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      hint.style.opacity = mdist < 170 ? "0.9" : "0";

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[70] bg-transparent"
        aria-hidden
      />
      <div
        ref={rootRef}
        className="pointer-events-none fixed top-0 left-0 z-[71] bg-transparent will-change-transform"
        style={{ width: W, height: H, background: "transparent" }}
        aria-hidden
      >
        <img
          ref={imgRef}
          src={POSES.idle}
          alt=""
          draggable={false}
          className="h-full w-full bg-transparent object-contain object-bottom"
          style={{ background: "transparent" }}
        />
      </div>
      <p
        ref={hintRef}
        className="pointer-events-none fixed bottom-3 left-1/2 z-[71] hidden -translate-x-1/2 rounded-full border border-white/10 bg-[#070911]/70 px-3 py-1 text-[10px] font-mono tracking-wide text-[#8f9bb3] opacity-0 transition-opacity duration-300 md:block"
      >
        hover to dodge · click to web · double-click to swing
      </p>
    </>
  );
};
