import { useEffect, useRef, useState } from "react";
import "./scenes.css";
import {
  BACKGROUND,
  BOOKS,
  CERTIFICATIONS,
  CONTACT_LINKS,
  CURRENTLY_WORKING,
  EXPERIENCE_JOBS,
  HOBBIES,
  IDENTITY,
  KNOWLEDGE_SLIDES,
  LANGUAGES_AND_STACK,
  LIFE_ITEMS,
  PROJECTS,
  SOFT_SKILLS,
  TICKER_CRAFT,
  TICKER_STACK,
} from "./data";
import { initSwarmCinema } from "./swarm-engine";

const triple = (list) => [...list, ...list, ...list];

const getInitialCols = () =>
  typeof window !== "undefined" && window.innerWidth < 700 ? 2 : 3;

const ScenesApp = () => {
  const rootRef = useRef(null);
  const [lifeCols] = useState(getInitialCols);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const cleanup = initSwarmCinema(rootRef.current);
    return cleanup;
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <div ref={rootRef} className="zll-root">
      {/* Double-door white sheet loader where the 3 swarm agents spawn */}
      <div id="loader" aria-hidden="true">
        <i className="lh l" />
        <i className="lh r" />
        <span className="ld-n mono">000</span>
      </div>

      <div className="grid-bg" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <div className="progress" aria-hidden="true" />

      <header className="hud">
        <a href="#home" className="logo">
          {IDENTITY.logo}
        </a>
        <div className="status">
          <i />
          <span id="status">standby</span>
        </div>
        <nav aria-label="Portfolio scenes">
          <a href="#about">About</a>
          <a href="#knowledge">Knowledge</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#life">Life</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="pct" id="pct">
          0%
        </span>
        <a href={IDENTITY.paperHref} className="paper">
          Paper ↗
        </a>
      </header>

      <div id="agents" aria-hidden="true" />

      <main>
        {/* ===== SCENE 01 - HERO ===== */}
        <section id="home">
          <div className="hero">
            <figure className="hero-photo" id="heroPhoto">
              <div className="ph">
                <img src="/portrait.webp" alt="Muhammad Anas" />
              </div>
            </figure>

            <p className="hero-tag mono" data-b="type" data-l="Tagline" data-manual>
              {IDENTITY.tagline}
            </p>

            <h1 className="hero-name" id="heroName" aria-label="Muhammad Anas">
              <span className="ln">{IDENTITY.first}</span>
              <span className="ln">{IDENTITY.last}</span>
            </h1>

            <div className="hero-bottom">
              <p className="desc" data-b="words" data-l="Intro" data-manual>
                {IDENTITY.intro}
              </p>
              <div className="ctas" data-b="pop" data-l="Actions" data-manual>
                <a href={IDENTITY.cv} className="btn solid" target="_blank" rel="noopener noreferrer">
                  Get CV →
                </a>
                <a
                  href={IDENTITY.linkedin}
                  className="btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <a href={IDENTITY.github} className="btn" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a
                  href={IDENTITY.instagram}
                  className="btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </div>
            </div>

            <span className="hero-side l mono">Scene 01 — Origin</span>
            <span className="hero-side r mono">{IDENTITY.locationSide}</span>
            <div className="hero-fade" />
          </div>
        </section>

        {/* ===== SCENE 02 - ABOUT ===== */}
        <section id="about" className="scene">
          <div className="ghost" aria-hidden="true">
            {IDENTITY.ghostAbout}
          </div>
          <div className="wrap">
            <div className="s-head">
              <span className="mono" data-b="type" data-l="Scene">
                <b>Scene 02</b> — About
              </span>
              <h2 className="s-title" data-b="type" data-l="Heading">
                Who am I <span className="sl">/</span>
              </h2>
            </div>

            <div className="about">
              <div>
                <figure className="media" data-b="img" data-l="Photo">
                  <img
                    src={IDENTITY.aboutPhoto}
                    alt="Muhammad Anas — AI & Full-Stack Engineering Studio"
                    loading="lazy"
                  />
                </figure>
                <div className="cap mono">
                  <span>Fig. 01</span>
                  <span>{IDENTITY.aboutPhotoCaption}</span>
                </div>
              </div>

              <div className="bio">
                <p data-b="words" data-l="Bio">
                  <span className="k">(me)</span>
                  Studying Computer Science at FAST NUCES in Karachi. Passionate about full-stack
                  engineering, autonomous AI systems, and competitive problem solving.
                </p>
                <p data-b="words" data-l="Bio">
                  <span className="k">(about)</span>
                  Experienced in React interfaces, grounded RAG pipelines, and unattended WhatsApp
                  &amp; Classroom automations. Thrive under pressure and ship tools people actually
                  use.
                </p>
              </div>
            </div>

            <div className="cols2">
              <div>
                <h3 className="h3m mono" data-b="type" data-l="Label">
                  / Languages &amp; Core
                </h3>
                {LANGUAGES_AND_STACK.map(([name, num, level]) => (
                  <div className="row" key={name} data-b="frame" data-l={name}>
                    <span>{name}</span>
                    <span className="mono">
                      <b>{num}</b>
                      {level}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="h3m mono" data-b="type" data-l="Label">
                  / Background
                </h3>
                {BACKGROUND.map((b) => (
                  <div className="uni" key={b.label} data-b="frame" data-l={b.label}>
                    <img src={b.emblem} alt={b.alt} loading="lazy" />
                    <div>
                      <span className="mono">{b.tag}</span>
                      <div className="t">{b.title}</div>
                      <div className="s">{b.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== DIAGONAL SCROLL TICKER ===== */}
        <div className="ticker" aria-hidden="true">
          <div className="trk" id="trk1">
            {triple(TICKER_STACK).map((item, idx) => (
              <span key={`s-${idx}`}>{item} </span>
            ))}
          </div>
          <div className="trk" id="trk2">
            {triple(TICKER_CRAFT).map((item, idx) => (
              <span key={`c-${idx}`}>{item} </span>
            ))}
          </div>
        </div>

        {/* ===== SCENE 03 - KNOWLEDGE ===== */}
        <section id="knowledge">
          <div className="kn-stage">
            <div className="kn-head wrap">
              <div className="s-head">
                <span className="mono" data-b="type" data-l="Scene">
                  <b>Scene 03</b> — Skills
                </span>
                <h2 className="s-title" data-b="type" data-l="Heading">
                  Knowledge <span className="sl">/</span>
                </h2>
              </div>
            </div>

            <div id="knSlides">
              {KNOWLEDGE_SLIDES.map(([tag, title, desc], i) => {
                const num = `0${i + 1}`;
                return (
                  <article className="kn-slide" key={tag}>
                    <div className="kn-num" aria-hidden="true">
                      {num}
                    </div>
                    <div className="mono">
                      ({num}) {tag}
                    </div>
                    <h3>{title}</h3>
                    <p data-b="words" data-l={tag} data-manual>
                      {desc}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="kn-count">
              <span id="knNow">01</span>
              <small> / 0{KNOWLEDGE_SLIDES.length}</small>
            </div>
            <div className="kn-bar">
              <i />
            </div>
          </div>
        </section>

        {/* ===== SCENE 04 - PROJECTS ===== */}
        <section id="projects">
          <div className="pj-stage">
            <div className="wrap">
              <div className="s-head">
                <span className="mono" data-b="type" data-l="Scene">
                  <b>Scene 04</b> — Selected works - more on GitHub
                </span>
                <h2 className="s-title" data-b="type" data-l="Heading">
                  Self-projects <span className="sl">/</span>
                </h2>
              </div>
            </div>

            <div className="pj-track" id="pjTrack">
              {PROJECTS.map(([key, href, title, desc, tags], i) => (
                <a
                  key={key}
                  className="pj"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-b="frame"
                  data-l={title}
                  data-manual
                >
                  <div className="id mono">
                    <span>PRJ_00{i + 1}</span>
                    <span>↗</span>
                  </div>
                  <div className="big" aria-hidden="true">
                    0{i + 1}
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <div className="tags">
                    {tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>

            <div className="pj-progress">
              <i />
            </div>
          </div>
        </section>

        {/* ===== SCENE 05 - PHILOSOPHY (pinned) ===== */}
        <section id="philosophy">
          <div className="ghost light" aria-hidden="true">
            I&apos;M THE
          </div>
          <div className="wrap">
            <div className="s-head" style={{ marginBottom: 28 }}>
              <span className="mono" data-b="type" data-l="Scene">
                <b>Scene 05</b> — Today and tomorrow
              </span>
            </div>
            <h2 className="quote" id="quote">
              Build with intention, <span className="q2">ship with clarity,</span> iterate with
              curiosity.
            </h2>
            <p className="phil-p" data-b="words" data-l="Manifesto" data-manual>
              Every interface, every retrieval pipeline, every line of code — is a tool for human
              leverage. I believe in grounded intelligence over hype, and working software over
              promises.
            </p>
            <div className="now">
              <div className="mono">Currently working</div>
              <div className="chips hot" data-b="pop" data-l="Now" data-manual>
                {CURRENTLY_WORKING.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== SCENE 06 - EXPERIENCE ===== */}
        <section id="experience" className="scene">
          <div className="ghost" aria-hidden="true">
            TRY
          </div>
          <div className="wrap">
            <div className="s-head">
              <span className="mono" data-b="type" data-l="Scene">
                <b>Scene 06</b> — Track record
              </span>
              <h2 className="s-title" data-b="type" data-l="Heading">
                Experience <span className="sl">/</span>
              </h2>
            </div>

            <div className="exp">
              <div>
                <h3 className="h3m mono" data-b="type" data-l="Label">
                  / Work
                </h3>
                {EXPERIENCE_JOBS.map((j) => (
                  <div className="job" key={j.role} data-b="frame" data-l={j.label}>
                    <div>
                      <div className="r">{j.role}</div>
                      <div className="o">{j.org}</div>
                    </div>
                    <span className={`mono${j.self ? " self" : ""}`}>{j.kind}</span>
                  </div>
                ))}
              </div>

              <div className="side">
                <div>
                  <h3 className="h3m mono" data-b="type" data-l="Label">
                    / Soft skills
                  </h3>
                  <div className="chips" data-b="pop" data-l="Skills">
                    {SOFT_SKILLS.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="h3m mono" data-b="type" data-l="Label">
                    / Honors &amp; Contests
                  </h3>
                  <div className="chips hot" data-b="pop" data-l="Honors">
                    {CERTIFICATIONS.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SCENE 07 - LIFE ===== */}
        <section id="life" className="scene">
          <div className="ghost" aria-hidden="true">
            LIFE
          </div>
          <div className="wrap">
            <div className="s-head">
              <span className="mono" data-b="type" data-l="Scene">
                <b>Scene 07</b> — Code, contests, artwork &amp; archive
              </span>
              <h2 className="s-title" data-b="type" data-l="Heading">
                My life <span className="sl">/</span>
              </h2>
            </div>

            <div className="life" id="life-grid" style={{ "--cols": lifeCols }}>
              {Array.from({ length: lifeCols }, (_, c) => (
                <div className="col" key={c}>
                  {LIFE_ITEMS.filter((_, i) => i % lifeCols === c).map(([src, title, cat, ar], k) => {
                    const dir = "ltr"[(c + k) % 3];
                    const shortLabel = src.split("/").pop();
                    return (
                      <figure
                        key={src}
                        className="media"
                        data-b="img"
                        data-l={shortLabel}
                        data-dir={dir}
                        style={{ "--ar": ar }}
                        onClick={() => setLightbox({ src, title, cat })}
                      >
                        <img src={src} alt={title} loading="lazy" />
                        <figcaption>
                          <b>{title}</b>
                          <span>{cat}</span>
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SCENE 08 - DEEP DIVE ===== */}
        <section id="deep" className="scene">
          <div className="ghost" aria-hidden="true">
            PDF
          </div>
          <div className="wrap">
            <div className="s-head">
              <span className="mono" data-b="type" data-l="Scene">
                <b>Scene 08</b> — Technical documents
              </span>
              <h2 className="s-title" data-b="type" data-l="Heading">
                Deep dive <span className="sl">/</span>
              </h2>
            </div>

            <div className="books">
              {BOOKS.map((b) => (
                <article className="book" key={b.label} data-b="frame" data-l={b.label}>
                  <div className="stack">
                    <img className="p3" src={b.p3} alt="" decoding="async" />
                    <img className="p2" src={b.p2} alt="" decoding="async" />
                    <img className="p1" src={b.p1} alt="" decoding="async" />
                    <img className="cv" src={b.cover} alt={`${b.title} cover`} decoding="async" />
                  </div>
                  <div>
                    <div className="mono">
                      <span>{b.kicker}</span>
                      <span>{b.version}</span>
                    </div>
                    <h3>{b.title}</h3>
                    <p>{b.desc}</p>
                    <div className="tags">
                      {b.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <a
                      href={b.href}
                      className="btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {b.cta}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SCENE 09 - CONTACT ===== */}
        <section id="contact" className="scene">
          <div className="ghost" aria-hidden="true">
            ME
          </div>
          <div className="wrap">
            <div className="s-head">
              <span className="mono" data-b="type" data-l="Scene">
                <b>Scene 09</b> — Open to opportunities worldwide
              </span>
              <h2 className="s-title" data-b="type" data-l="Heading">
                Let&apos;s connect <span className="sl">/</span>
              </h2>
            </div>

            <a className="big-mail" href={`mailto:${IDENTITY.email}`} data-b="type" data-l="Email">
              {IDENTITY.email}
            </a>

            <div className="links">
              <div>
                {CONTACT_LINKS.map(([label, handle, href]) => (
                  <a
                    key={label}
                    className="lnk"
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    data-b="frame"
                    data-l={label}
                  >
                    <span>{label}</span>
                    <span className="mono">{handle}</span>
                  </a>
                ))}
              </div>

              <div>
                <h3 className="h3m mono" data-b="type" data-l="Label">
                  / Hobbies
                </h3>
                <div className="chips" data-b="pop" data-l="Hobbies">
                  {HOBBIES.map((h) => (
                    <span key={h}>{h}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== END CREDITS ===== */}
        <footer className="credits" id="credits">
          <p className="mono acc" style={{ marginBottom: 20 }}>
            ● Build complete
          </p>
          <p className="mono" style={{ marginBottom: 50 }}>
            Powered by{" "}
            <a
              href="https://github.com/ZhengLinLei/cursor-swarm.js"
              className="acc"
              target="_blank"
              rel="noopener noreferrer"
            >
              cursor-swarm.js
            </a>
          </p>
          <div className="the-end" id="theEnd" aria-label="The End">
            <span className="ln">The</span> <span className="ln o">End</span>
          </div>
          <dl>
            <div>
              <dt>Directed &amp; engineered by</dt>
              <dd>Muhammad Anas</dd>
            </div>
            <div>
              <dt>Built live by</dt>
              <dd>
                <span style={{ color: "var(--a1)" }}>Agent-01</span> layout -{" "}
                <span style={{ color: "var(--a2)" }}>Agent-02</span> type -{" "}
                <span style={{ color: "var(--a3)" }}>Agent-03</span> media
              </dd>
            </div>
            <div>
              <dt>Shot on location</dt>
              <dd>Karachi, Pakistan</dd>
            </div>
            <div>
              <dt>Prefer it quiet?</dt>
              <dd>
                <a href={IDENTITY.paperHref} className="acc">
                  Paper mode ↗
                </a>
              </dd>
            </div>
          </dl>
          <div className="wrap">
            <div className="copy mono">
              <span>© 2026 Muhammad Anas — All rights reserved</span>
              <span>Full-Stack &amp; AI Engineer / Karachi, Pakistan</span>
            </div>
          </div>
        </footer>
      </main>

      {lightbox && (
        <div
          className="zll-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <div className="zll-lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.title} />
            <div className="zll-lightbox__bar">
              <div>
                <strong>{lightbox.title}</strong>
                <div className="mono acc" style={{ marginTop: 4 }}>
                  {lightbox.cat}
                </div>
              </div>
              <button
                type="button"
                className="zll-lightbox__close"
                onClick={() => setLightbox(null)}
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenesApp;
