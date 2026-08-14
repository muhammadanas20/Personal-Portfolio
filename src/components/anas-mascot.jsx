import { useEffect, useRef } from "react";

const POSES = {
  idle: "/mascot-idle.png",
  dodge: "/mascot-dodge.png",
  shoot: "/mascot-shoot.png",
  jump: "/mascot-jump.png",
};

const SIZE = 92;
const GROUND_PAD = 18;

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
      return;
    }

    Object.values(POSES).forEach((src) => {
      const preload = new Image();
      preload.src = src;
    });

    const ctx = canvas.getContext("2d");
    const mouse = { x: -9999, y: -9999 };
    const state = {
      x: window.innerWidth - 120,
      y: window.innerHeight - SIZE - GROUND_PAD,
      vx: 0,
      vy: 0,
      facing: -1,
      pose: "idle",
      grounded: true,
      web: null,
      lastClick: 0,
      nextWander: performance.now() + 2400,
      lastDodge: 0,
      squash: 1,
    };

    const groundY = () => window.innerHeight - SIZE - GROUND_PAD;
    const clampX = (x) => Math.max(8, Math.min(window.innerWidth - SIZE - 8, x));

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
      const cx = state.x + SIZE / 2;
      const cy = state.y + 28;
      const dx = tx - cx;
      const dy = ty - cy;
      const len = Math.hypot(dx, dy) || 1;
      state.web = {
        ax: tx,
        ay: Math.max(8, ty),
        rest: Math.min(len, 280),
        life: swing ? 2200 : 700,
        swing,
        born: performance.now(),
      };
      setPose("shoot");
      state.facing = dx >= 0 ? 1 : -1;
      if (swing) {
        state.grounded = false;
        state.vy = -7.2;
        state.vx += Math.sign(dx) * 3.4;
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
      const cx = state.x + SIZE / 2;
      const cy = state.y + SIZE * 0.42;
      const mdx = mouse.x - cx;
      const mdy = mouse.y - cy;
      const mdist = Math.hypot(mdx, mdy);

      if (mdist < 88 && now - state.lastDodge > 420) {
        state.vx += (mdx === 0 ? (Math.random() > 0.5 ? 1 : -1) : -Math.sign(mdx)) * 6.4;
        state.vy = state.grounded ? -5.6 : state.vy - 1.4;
        state.grounded = false;
        state.lastDodge = now;
        setPose("dodge");
        state.facing = mdx > 0 ? -1 : 1;
        state.squash = 0.88;
      }

      if (state.web) {
        const age = now - state.web.born;
        if (age > state.web.life) {
          state.web = null;
        } else {
          const wx = state.web.ax - cx;
          const wy = state.web.ay - cy;
          const dist = Math.hypot(wx, wy) || 1;
          const nx = wx / dist;
          const ny = wy / dist;
          const stretch = dist - state.web.rest;
          const pull = stretch * (state.web.swing ? 0.045 : 0.02);
          state.vx += nx * pull * dt;
          state.vy += ny * pull * dt;
          if (state.web.swing) {
            state.grounded = false;
            // pendulum damping
            state.vx *= 0.992;
            state.vy *= 0.992;
          }
        }
      }

      if (!state.web && state.grounded && now > state.nextWander) {
        state.vx += (Math.random() * 2 - 1) * 2.4;
        state.nextWander = now + 1800 + Math.random() * 2600;
        if (Math.random() < 0.28) {
          state.vy = -6.2;
          state.grounded = false;
          setPose("jump");
        }
      }

      if (!state.grounded) {
        state.vy += 0.38 * dt;
      } else if (!state.web) {
        state.vx *= 0.86;
        // idle bob
        state.y = gx + Math.sin(now / 280) * 1.6;
      }

      state.x += state.vx * dt;
      state.y += state.vy * dt;

      if (state.x < 8) {
        state.x = 8;
        state.vx *= -0.45;
      }
      if (state.x > window.innerWidth - SIZE - 8) {
        state.x = window.innerWidth - SIZE - 8;
        state.vx *= -0.45;
      }

      if (state.y >= gx) {
        if (!state.grounded) {
          state.squash = 0.82;
          if (!state.web) setPose("idle");
        }
        state.y = gx;
        state.vy = 0;
        state.grounded = true;
      }

      if (Math.abs(state.vx) > 0.4) state.facing = state.vx >= 0 ? 1 : -1;

      if (state.grounded && !state.web && now - state.lastDodge > 500) {
        if (Math.abs(state.vx) < 0.2) setPose("idle");
      }

      state.squash += (1 - state.squash) * 0.18;

      img.style.transform = `scaleX(${state.facing}) scale(${state.squash}, ${2 - state.squash})`;
      root.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (state.web) {
        const handX = state.x + SIZE / 2 + state.facing * 18;
        const handY = state.y + 30;
        const t = 1 - (now - state.web.born) / state.web.life;
        ctx.save();
        ctx.strokeStyle = `rgba(200, 245, 255, ${0.25 + t * 0.65})`;
        ctx.lineWidth = 1.4;
        ctx.shadowColor = "rgba(102, 230, 255, 0.55)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        const midX = (handX + state.web.ax) / 2;
        const midY = (handY + state.web.ay) / 2 + Math.sin(now / 90) * 6;
        ctx.quadraticCurveTo(midX, midY, state.web.ax, state.web.ay);
        ctx.stroke();
        ctx.fillStyle = "rgba(200,245,255,0.9)";
        ctx.beginPath();
        ctx.arc(state.web.ax, state.web.ay, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      hint.style.opacity = mdist < 160 ? "1" : "0.35";

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
        className="pointer-events-none fixed inset-0 z-[70]"
        aria-hidden
      />
      <div
        ref={rootRef}
        className="pointer-events-none fixed top-0 left-0 z-[71] will-change-transform"
        style={{ width: SIZE, height: SIZE }}
        aria-hidden
      >
        <img
          ref={imgRef}
          src={POSES.idle}
          alt=""
          draggable={false}
          className="h-full w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
        />
      </div>
      <p
        ref={hintRef}
        className="pointer-events-none fixed bottom-2 left-1/2 z-[71] hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-mono tracking-wide text-[#8f9bb3] backdrop-blur-sm transition-opacity md:block"
      >
        hover to dodge · click to web · double-click to swing
      </p>
    </>
  );
};
