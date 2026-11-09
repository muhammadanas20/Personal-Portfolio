import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { HOBBIES, PROJECTS, TRACK } from "./data";
import { Reveal, SceneHead } from "./shared";

export const Works = () => {
  const [hover, setHover] = useState(null);
  const previewRef = useRef(null);

  useEffect(() => {
    if (!hover) return;
    const onMove = (e) => {
      const el = previewRef.current;
      if (!el) return;
      const x = Math.min(e.clientX + 20, window.innerWidth - 280);
      const y = Math.min(e.clientY + 20, window.innerHeight - 220);
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [hover]);

  return (
    <section id="scene-04" data-scene="3" className="zll-scene">
      <div className="zll-wrap">
        <SceneHead n="04" name="SELECTED WORKS" end="MORE ON GITHUB ↗" />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <Reveal>
            <h2 className="zll-title">
              SELECTED WORKS<span className="slash">/</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="zll-lead" style={{ maxWidth: "34ch" }}>
              Six builds — two AI automations running unattended, two systems in C/C++, two
              semester projects that started as exercises and ended as tools.
            </p>
          </Reveal>
        </div>

        <div className="zll-works" style={{ marginTop: "clamp(30px, 4vw, 54px)" }}>
          {PROJECTS.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i * 0.03, 0.15)} y={12}>
              <a
                className="zll-work"
                href={p.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={(e) => {
                  setHover(i);
                  const el = previewRef.current;
                  if (el) el.style.transform = `translate3d(${e.clientX + 20}px, ${e.clientY + 20}px, 0)`;
                }}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
              >
                <span className="zll-work__id zll-mono zll-mono--xs">
                  {p.n} <ArrowUpRight size={12} strokeWidth={1.6} />
                </span>

                <div>
                  <div className="zll-work__head">
                    <h3 className="zll-work__title">{p.title}</h3>
                    <span className="zll-work__kind zll-mono zll-mono--xs">({p.kind})</span>
                  </div>
                  <p className="zll-work__body">{p.body}</p>
                  <div className="zll-work__tags">
                    {p.tags.map((t) => (
                      <span className="zll-chip" key={t}>{t}</span>
                    ))}
                  </div>
                </div>

                <div className="zll-work__aside">
                  <span className="zll-work__year zll-mono zll-mono--xs">{p.year}</span>
                  <span className="zll-work__id zll-mono zll-mono--xs">{p.id}</span>
                  <span className="zll-work__cta">
                    OPEN <ArrowUpRight size={12} strokeWidth={1.6} />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="zll-section-foot zll-mono zll-mono--xs">
          <span>PRJ_001 — PRJ_006</span>
          <a href="https://github.com/muhammadanas20" target="_blank" rel="noreferrer">
            FULL ARCHIVE ON GITHUB ↗
          </a>
        </div>
      </div>

      <div ref={previewRef} className={`zll-preview${hover !== null ? " is-on" : ""}`} aria-hidden="true">
        <img src={hover !== null ? PROJECTS[hover].image : PROJECTS[0].image} alt="" />
      </div>
    </section>
  );
};

export const Statement = () => (
  <section id="scene-05" data-scene="4" className="zll-scene">
    <div className="zll-wrap">
      <SceneHead n="05" name="INTENT" end="05 / 09" />

      <Reveal>
        <p className="zll-statement" style={{ margin: 0 }}>
          Build with intent. Ship with care. <span className="zll-accent">Iterate in public.</span>
        </p>
      </Reveal>

      <div className="zll-statement__foot">
        <Reveal delay={0.06}>
          <p className="zll-statement__note" style={{ margin: 0 }}>
            Every interface and every pipeline is a communication problem before it is a technical
            one. Clarity over complexity, purpose over trends — and a working link over a promise.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="zll-statement__note" style={{ margin: 0 }}>
            Currently working — retrieval evaluation, agent tooling, and the long tail of making
            the small projects feel finished.
          </p>
        </Reveal>
        <div>
          <div className="zll-mono zll-mono--xs zll-dim" style={{ marginBottom: 10 }}>
            ON THE BENCH
          </div>
          <div className="zll-chips">
            {["Agentic workflows (MCP)", "Vector DB internals", "WebGL / shaders", "System design"].map(
              (t) => (
                <span className="zll-chip" key={t}>{t}</span>
              ),
            )}
          </div>
        </div>
        <div>
          <div className="zll-mono zll-mono--xs zll-dim" style={{ marginBottom: 10 }}>
            OFF-KEYBOARD
          </div>
          <div className="zll-chips">
            {HOBBIES.slice(0, 4).map((t) => (
              <span className="zll-chip" key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TrackColumn = ({ label, count, children }) => (
  <div>
    <div className="zll-track__head zll-mono zll-mono--xs">
      <b>{label}</b>
      <span>{count}</span>
    </div>
    {children}
  </div>
);

export const Track = () => (
  <section id="scene-06" data-scene="5" className="zll-scene">
    <div className="zll-wrap">
      <SceneHead n="06" name="TRACK RECORD" end="06 / 09" />

      <Reveal>
        <h2 className="zll-title">
          TRACK RECORD<span className="slash">/</span>
        </h2>
      </Reveal>

      <div className="zll-track" style={{ marginTop: "clamp(30px, 4vw, 54px)" }}>
        <Reveal delay={0.04}>
          <TrackColumn label="/WORK" count={`${TRACK.work.length} ENTRIES`}>
            {TRACK.work.map((w) => (
              <article className="zll-entry" key={w.role}>
                <span className="zll-entry__period zll-mono zll-mono--xs">{w.period}</span>
                <h3 className="zll-entry__role">{w.role}</h3>
                <div className="zll-entry__org zll-mono zll-mono--xs">
                  {w.org} — {w.kind}
                </div>
                <p className="zll-entry__body">{w.body}</p>
              </article>
            ))}
          </TrackColumn>
        </Reveal>

        <Reveal delay={0.1}>
          <TrackColumn label="/EDUCATION" count={`${TRACK.education.length} ENTRIES`}>
            {TRACK.education.map((e) => (
              <article className="zll-entry" key={e.degree}>
                <span className="zll-entry__period zll-mono zll-mono--xs">{e.period}</span>
                <h3 className="zll-entry__role">{e.degree}</h3>
                <div className="zll-entry__org zll-mono zll-mono--xs">{e.school}</div>
                <p className="zll-entry__body">{e.body}</p>
              </article>
            ))}
          </TrackColumn>
        </Reveal>

        <Reveal delay={0.16}>
          <TrackColumn label="/HONORS" count={`${TRACK.honors.length} ENTRIES`}>
            {TRACK.honors.map((h) => (
              <article className="zll-honor" key={h.title}>
                <img src={h.image} alt="" loading="lazy" />
                <div>
                  <div className="zll-honor__title">{h.title}</div>
                  <div className="zll-honor__meta zll-mono zll-mono--xs">
                    {h.badge} · {h.org} · {h.when}
                  </div>
                </div>
              </article>
            ))}
          </TrackColumn>
        </Reveal>
      </div>
    </div>
  </section>
);
