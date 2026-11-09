import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { GALLERY, HOBBIES, IDENTITY, PROJECTS, SCENES } from "./data";
import { Reveal, SceneHead } from "./shared";

export const Life = () => {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (open === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section id="scene-07" data-scene="6" className="zll-scene">
      <div className="zll-wrap">
        <SceneHead n="07" name="OFF-SCREEN" end="06 / 12 FILES" />

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
              OFF-SCREEN<span className="slash">/</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="zll-lead" style={{ maxWidth: "34ch" }}>
              Certificates, contest floors and the risograph artwork series built for this
              portfolio. Click any frame to open it.
            </p>
          </Reveal>
        </div>

        <div className="zll-gallery" style={{ marginTop: "clamp(26px, 3.4vw, 44px)" }}>
          {GALLERY.map((g, i) => (
            <motion.button
              key={`${g.src}-${i}`}
              type="button"
              className={`zll-tile${g.span === "wide" ? " zll-tile--wide" : ""}${
                g.span === "tall" ? " zll-tile--tall" : ""
              }${g.doc ? " zll-tile--doc" : ""}`}
              onClick={() => setOpen(i)}
              aria-label={`Open ${g.title}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: Math.min(i * 0.02, 0.18) }}
            >
              <img src={g.src} alt={g.title} loading="lazy" />
              <span className="zll-tile__cap">
                <span className="zll-tile__title">{g.title}</span>
                <span className="zll-tile__meta zll-mono zll-mono--xs">{g.meta}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {open !== null && (
        <div className="zll-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <button
            type="button"
            className="zll-lightbox__close zll-mono zll-mono--xs"
            onClick={() => setOpen(null)}
            aria-label="Close"
          >
            <X size={14} strokeWidth={1.6} />
          </button>
          <figure onClick={(e) => e.stopPropagation()} style={{ margin: 0 }}>
            <img src={GALLERY[open].src} alt={GALLERY[open].title} />
            <figcaption className="zll-mono zll-mono--xs">
              <b>{GALLERY[open].title}</b>
              <span>{GALLERY[open].meta}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
};

const REPORTS = [
  {
    kind: "PDF v2026",
    title: "Résumé — the one-pager",
    body: "Everything above, condensed: education, automation work, contest record, toolkit. The version that goes to recruiters.",
    meta: "PDF / 01 PAGE / A4",
    coverType: "resume",
    href: IDENTITY.cv,
    cta: "OPEN PDF",
  },
  {
    kind: "CASE FILE",
    title: "LuminaDocs — grounded retrieval",
    body: "How the WhatsApp study assistant indexes course material with BST/BM25-style ranking, keeps Groq inside the source set, and returns a .docx instead of a chat bubble.",
    meta: "PYTHON / RAG / WHATSAPP",
    cover: PROJECTS[0].image,
    href: PROJECTS[0].href,
    cta: "READ THE CODE",
  },
];

export const DeepDive = () => (
  <section id="scene-08" data-scene="7" className="zll-scene">
    <div className="zll-wrap">
      <SceneHead n="08" name="DEEP DIVE" end="DOCS / SOURCE" />

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
            DOCUMENTS<span className="slash">/</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="zll-lead" style={{ maxWidth: "34ch" }}>
            The written side of the work — a résumé you can forward, and a case file for the
            retrieval pipeline behind LuminaDocs.
          </p>
        </Reveal>
      </div>

      <div className="zll-reports" style={{ marginTop: "clamp(28px, 3.6vw, 48px)" }}>
        {REPORTS.map((r, i) => (
          <Reveal key={r.title} delay={i * 0.08}>
            <a className="zll-report" href={r.href} target="_blank" rel="noreferrer">
              <div className="zll-book">
                {r.coverType === "resume" ? (
                  <div className="zll-cover">
                    <div className="zll-cover__top">
                      <span>PDF / 01</span>
                      <span>2026</span>
                    </div>
                    <div>
                      <div className="zll-cover__name">
                        Muhammad
                        <br />
                        Anas
                      </div>
                      <div className="zll-cover__rule" />
                      <div className="zll-cover__meta">RÉSUMÉ — FULL-STACK &amp; AI</div>
                    </div>
                    <div className="zll-cover__meta">KARACHI, PK · A4</div>
                  </div>
                ) : (
                  <img src={r.cover} alt="" loading="lazy" />
                )}
                <span className="zll-book__stamp">{r.kind}</span>
              </div>
              <div>
                <div className="zll-mono zll-mono--xs zll-dim">{r.meta}</div>
                <h3 className="zll-report__title">{r.title}</h3>
                <p className="zll-report__body">{r.body}</p>
                <span className="zll-work__cta" style={{ marginTop: 14 }}>
                  {r.cta} <ArrowUpRight size={12} strokeWidth={1.6} />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const SOCIALS = [
  ["GitHub", "@muhammadanas20", IDENTITY.github],
  ["LinkedIn", "in/muhammadanas20", IDENTITY.linkedin],
  ["Instagram", "@_m._.anas_", IDENTITY.instagram],
  ["Email", IDENTITY.email, `mailto:${IDENTITY.email}`],
  ["Phone", IDENTITY.phone, `tel:${IDENTITY.phone.replace(/\s/g, "")}`],
];

export const Connect = () => (
  <section id="scene-09" data-scene="8" className="zll-scene">
    <div className="zll-wrap">
      <SceneHead n="09" name="CONNECT" end="09 / 09 — END OF SURFACE" />

      <div className="zll-connect">
        <div>
          <Reveal>
            <h2 className="zll-title" style={{ marginBottom: "clamp(22px, 3vw, 36px)" }}>
              LET'S CONNECT<span className="slash">/</span>
            </h2>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="zll-lead" style={{ marginBottom: 26 }}>
              Open to internships for 2026, freelance builds and collaborations that need both the
              interface and the pipeline. Fastest route is email.
            </p>
            <a className="zll-mail" href={`mailto:${IDENTITY.email}`}>
              {IDENTITY.email}
            </a>
          </Reveal>

          <Reveal delay={0.12}>
            <div style={{ marginTop: "clamp(30px, 4vw, 52px)" }}>
              <div className="zll-mono zll-mono--xs zll-dim" style={{ marginBottom: 12 }}>
                /HOBBIES
              </div>
              <div className="zll-chips">
                {HOBBIES.map((h) => (
                  <span className="zll-chip" key={h}>{h}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="zll-socials">
            {SOCIALS.map(([name, handle, href]) => (
              <a
                className="zll-social zll-mono zll-mono--xs"
                key={name}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                <span>
                  <b>{name}</b> {handle}
                </span>
                <ArrowUpRight size={13} strokeWidth={1.6} />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="zll-footer">
    <div className="zll-wrap zll-footer__inner zll-mono zll-mono--xs">
      <span>© 2026 MUHAMMAD ANAS — BUILT IN KARACHI, PK</span>
      <span>
        SCENE {SCENES.length} / {SCENES.length} — SURFACE COMPLETE
      </span>
      <span style={{ display: "inline-flex", gap: 18 }}>
        <a href={IDENTITY.atelier}>ATELIER EDITION ↗</a>
        <a href="#scene-01">BACK TO TOP ↑</a>
      </span>
    </div>
  </footer>
);
