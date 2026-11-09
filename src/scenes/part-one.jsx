import { ArrowUpRight } from "lucide-react";
import { DISCIPLINES, FACTS, IDENTITY, SKILLS } from "./data";
import { Frame, Reveal, SceneHead } from "./shared";

export const Hero = () => (
  <section id="scene-01" data-scene="0" className="zll-scene zll-hero">
    <div className="zll-wrap">
      <div className="zll-hero__meta zll-mono zll-mono--xs">
        <span className="zll-scene__tag">
          <span className="zll-scene__tick" />
          SCENE 01 — <span className="zll-scene__name">ORIGIN</span>
        </span>
        <span>{IDENTITY.location} · {IDENTITY.coords}</span>
        <span>PORTFOLIO / 2026</span>
      </div>

      <div className="zll-hero__grid">
        <div>
          <h1 className="zll-hero__name">
            <span>{IDENTITY.first}</span>
            <span className="zll-hero__last">
              {IDENTITY.last}
              <span className="zll-hero__sup">/ 06 PROJECTS</span>
            </span>
          </h1>
        </div>

        <div className="zll-portrait">
          <Frame
            src="/portrait.png"
            alt="Portrait of Muhammad Anas"
            ratio="4 / 5"
            caption="FIG. 01 — PORTRAIT"
            note="KARACHI, PK"
          />
        </div>
      </div>

      <div className="zll-hero__below">
        <div>
          <p className="zll-hero__role">
            Full-stack developer &amp; AI automation engineer — building interfaces and systems
            where logic, data and craft share one surface.
          </p>
          <p className="zll-hero__bio">
            Second-year computer science at FAST NUCES. I write the frontend, wire the retrieval
            pipeline and ship the automation that picks the work up after the tab is closed.
          </p>

          <div className="zll-links zll-mono zll-mono--xs">
            <a className="zll-link zll-link--solid" href={IDENTITY.cv} target="_blank" rel="noreferrer">
              GET CV <ArrowUpRight size={12} strokeWidth={1.6} />
            </a>
            <a className="zll-link" href={IDENTITY.github} target="_blank" rel="noreferrer">
              GITHUB <ArrowUpRight size={12} strokeWidth={1.6} />
            </a>
            <a className="zll-link" href={IDENTITY.linkedin} target="_blank" rel="noreferrer">
              LINKEDIN <ArrowUpRight size={12} strokeWidth={1.6} />
            </a>
            <a className="zll-link" href={`mailto:${IDENTITY.email}`}>
              MAIL <ArrowUpRight size={12} strokeWidth={1.6} />
            </a>
          </div>
        </div>

        <div>
          <dl className="zll-facts zll-mono zll-mono--xs">
            {[
              ["PROJECTS", "06 SHIPPED"],
              ["HONORS", "03 RECORDED"],
              ["STUDYING", "BS CS / 02 YR"],
              ["STATUS", "OPEN 2026"],
            ].map(([k, v]) => (
              <div className="zll-facts__row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  </section>
);

export const About = () => (
  <section id="scene-02" data-scene="1" className="zll-scene">
    <div className="zll-wrap">
      <SceneHead n="02" name="ABOUT" end="02 / 09" />

      <Reveal>
        <h2 className="zll-title">
          WHO AM I<span className="slash">/</span>
        </h2>
      </Reveal>

      <div className="zll-about__grid" style={{ marginTop: "clamp(30px, 4vw, 56px)" }}>
        <Reveal delay={0.05}>
          <div className="zll-about__copy">
            <p>
              <strong>(me)</strong> — Computer science undergraduate in Karachi, working the seam
              between design and infrastructure. Graduated school in 2025, started shipping
              software in the same year and never waited for the syllabus to catch up.
            </p>
            <p>
              <strong>(about)</strong> — I build in two directions at once: interfaces with real
              typographic and motion craft, and the retrieval, automation and data layers that
              make them useful. Whether it is a WhatsApp agent reading a course PDF or a CLI that
              scores image authenticity, the standard is the same — clear logic, honest output,
              no dead ends.
            </p>
            <p>
              <strong>(now)</strong> — Open to internships for 2026, freelance builds, and any
              problem that needs someone comfortable on both sides of the API boundary.
            </p>
          </div>

          <div className="zll-disc">
            <div className="zll-disc__row zll-mono zll-mono--xs" style={{ color: "var(--dim-2)" }}>
              <span>Nº</span>
              <span>FIELD</span>
              <span>APPROACH</span>
              <span>NOTE</span>
            </div>
            {DISCIPLINES.map((d) => (
              <div className="zll-disc__row" key={d.n}>
                <span className="zll-disc__n zll-mono zll-mono--xs">{d.n}</span>
                <span className="zll-disc__tag zll-mono zll-mono--xs">{d.tag}</span>
                <h3 className="zll-disc__title" style={{ margin: 0 }}>{d.title}</h3>
                <p className="zll-disc__body" style={{ margin: 0 }}>{d.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="zll-about__media">
          <Frame
            src="/achievements/deans_list_2025.jpg"
            alt="Dean's List of Honors certificate"
            ratio="4 / 3"
            caption="FIG. 02 — DEAN'S LIST"
            note="FALL 2025"
          />

          <dl className="zll-facts zll-mono zll-mono--xs" style={{ marginTop: 26 }}>
            {FACTS.map(([k, v]) => (
              <div className="zll-facts__row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <div style={{ marginTop: 26 }}>
            <div className="zll-mono zll-mono--xs zll-dim" style={{ marginBottom: 10 }}>
              (SPOKEN)
            </div>
            <dl className="zll-facts zll-mono zll-mono--xs">
              {[
                ["URDU", "NATIVE — 01"],
                ["ENGLISH", "PROFESSIONAL — 02"],
              ].map(([k, v]) => (
                <div className="zll-facts__row" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export const Skills = () => (
  <section id="scene-03" data-scene="2" className="zll-scene">
    <div className="zll-wrap">
      <SceneHead n="03" name="SKILLS" end="03 / 09" />

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
            KNOWLEDGE<span className="slash">/</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="zll-lead" style={{ maxWidth: "34ch" }}>
            Seven areas, one working method: choose the smallest tool that solves the problem,
            then make it fast.
          </p>
        </Reveal>
      </div>

      <div className="zll-skills" style={{ marginTop: "clamp(30px, 4vw, 54px)" }}>
        {SKILLS.map((s, i) => (
          <Reveal key={s.n} delay={Math.min(i * 0.04, 0.2)} y={14}>
            <article className="zll-skill">
              <span className="zll-skill__n zll-mono zll-mono--xs">{s.n}</span>
              <div>
                <span className="zll-skill__tag zll-mono zll-mono--xs">({s.tag})</span>
                <h3 className="zll-skill__title">{s.title}</h3>
              </div>
              <div className="zll-skill__col--copy">
                <p className="zll-skill__body" style={{ margin: 0 }}>{s.body}</p>
                <div className="zll-chips">
                  {s.items.map((item) => (
                    <span className="zll-chip" key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="zll-section-foot zll-mono zll-mono--xs">
        <span>01 / 07 — UPDATED EVERY SEMESTER</span>
        <span>CHOOSEN FOR CLARITY &amp; SPEED</span>
      </div>
    </div>
  </section>
);
