import { useEffect, useRef, useState } from "react";
import { IDENTITY, SCENES } from "./data";

/**
 * Fixed instrumentation: mark, status, clock, scene rail, and the bottom
 * HUD with live pointer coordinates, scroll percentage and build stamp.
 */

const pad = (n) => String(n).padStart(2, "0");

const karachiTime = () =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

export const Chrome = ({ active = 0 }) => {
  const [clock, setClock] = useState(karachiTime);
  const coordsRef = useRef(null);
  const barRef = useRef(null);
  const pctRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setClock(karachiTime()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let raf = 0;
    let pointer = { x: 0, y: 0 };
    let dirty = false;

    const paint = () => {
      raf = 0;
      if (dirty && coordsRef.current) {
        coordsRef.current.textContent = `X ${pad(Math.round(pointer.x))} / Y ${pad(
          Math.round(pointer.y),
        )}`;
        dirty = false;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      if (barRef.current) barRef.current.style.width = `${pct}%`;
      if (pctRef.current) pctRef.current.textContent = `${String(Math.round(pct)).padStart(3, "0")}%`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onMove = (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      dirty = true;
      schedule();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    paint();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <>
      <div className="zll-lines" aria-hidden="true" />

      <header className="zll-topbar">
        <div className="zll-wrap zll-topbar__inner">
          <a href="#scene-01" className="zll-mark" aria-label="Muhammad Anas — back to top">
            <span className="zll-mark__tile">MA</span>
            <span className="zll-mark__name">
              Muhammad Anas <span>/ PORTFOLIO 2026</span>
            </span>
          </a>

          <span className="zll-mono zll-mono--xs zll-status">
            <span className="zll-status__dot" />
            {IDENTITY.status}
          </span>

          <nav className="zll-topnav zll-mono zll-mono--xs" aria-label="Scenes">
            {SCENES.slice(0, 5).map((s, i) => (
              <a key={s.key} href={`#scene-${s.n}`} className={i === active ? "is-active" : ""}>
                {s.n} {s.name}
              </a>
            ))}
          </nav>

          <span className="zll-clock zll-mono zll-mono--xs">
            <span>PKT</span> {clock}
          </span>
        </div>
      </header>

      <div className="zll-rail zll-mono zll-mono--xs" aria-hidden="true">
        <span className="zll-rail__scene">
          SCENE {SCENES[active]?.n ?? "01"} — {SCENES[active]?.name ?? "ORIGIN"}
        </span>
        <span className="zll-rail__rule" />
        <span>{SCENES.length} SCENES / ONE SURFACE</span>
      </div>

      <div className="zll-hud zll-mono zll-mono--xs" aria-hidden="true">
        <div className="zll-wrap zll-hud__inner">
          <span ref={coordsRef} className="zll-hud__coords">
            X 000 / Y 000
          </span>
          <span className="zll-hud__right">
            <span className="hidden sm:inline">LAT 24.86 N · LON 67.00 E</span>
            <span ref={pctRef}>000%</span>
            <span className="zll-hud__bar">
              <i ref={barRef} style={{ width: "0%" }} />
            </span>
            <span>BUILD v3.1 / SCENES</span>
          </span>
        </div>
      </div>
    </>
  );
};
