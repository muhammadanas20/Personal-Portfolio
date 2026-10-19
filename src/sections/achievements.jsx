import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowUpRight, ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, MaskLines } from "@/components/reveal";

const achievements = [
  {
    title: "Dean's List of Honors",
    issuer: "FAST NUCES",
    date: "Fall 2025",
    badge: "Honor",
    description:
      "Inscribed in the Dean's List of Honors for GPA excellence and outstanding academic standing during the Fall 2025 semester.",
    image: "/achievements/deans_list_2025.jpg",
    tags: ["Academic Excellence", "GPA Honor"],
  },
  {
    title: "ACM Coders Cup 2025",
    issuer: "ACM NUCES Karachi",
    date: "Jan 2026",
    badge: "Finalist",
    description:
      "Cleared the preliminary rounds and reached the final round representing team “Furious 3” in the chapter's premier competitive-programming contest.",
    image: "/achievements/coders_cup_2025.jpg",
    tags: ["Competitive Programming", "C++", "Teamwork"],
  },
  {
    title: "Developers' Day 2026",
    issuer: "ACM NUCES Karachi",
    date: "May 2026",
    badge: "Contestant",
    description:
      "Competed in the competitive-programming track — algorithms, data structures and logic optimization under a hard clock.",
    image: "/achievements/dev_day_2026.jpg",
    tags: ["Data Structures", "Algorithms"],
  },
];

export const Achievements = () => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  return (
    <section id="honors" className="py-24 sm:py-32 border-t border-line bg-paper-2/60">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 sm:mb-20">
          <SectionHeading
            index="05"
            kicker="Honors"
            lines={
              <MaskLines
                lines={[
                  "Stamps in",
                  <span key="2">
                    the <span className="display-wonk text-vermilion">margin.</span>
                  </span>,
                ]}
              />
            }
          />
          <Reveal delay={0.15}>
            <p className="text-sm sm:text-base text-ink-soft max-w-xs leading-relaxed md:text-right">
              Academic honors and contest finals — small proofs that the late nights
              compiled.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {achievements.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08} y={32}>
              <article className="group h-full border border-line bg-paper-2 flex flex-col">
                {/* certificate plate */}
                <button
                  onClick={() => setSelected(a)}
                  className="relative block text-left art-frame aspect-[4/3] border-b border-line w-full"
                  aria-label={`View certificate: ${a.title}`}
                >
                  <img
                    src={a.image}
                    alt={`Certificate — ${a.title}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="stamp-tilt absolute top-3 right-3 w-16 h-16 rounded-full bg-vermilion text-paper grid place-items-center text-center font-mono uppercase tracking-[0.14em] text-[8px] font-semibold leading-tight rotate-6">
                    {a.badge}
                  </span>
                </button>

                <div className="p-6 flex flex-col grow">
                  <p className="meta-label text-ink-soft">
                    {a.issuer} · {a.date}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft grow">
                    {a.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {a.tags.map((t) => (
                      <li
                        key={t}
                        className="px-2.5 py-1 border border-line rounded-full text-[11px] font-mono tracking-wide text-ink-soft"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setSelected(a)}
                    className="mt-6 self-start meta-label text-ink link-draw flex items-center gap-2"
                  >
                    view certificate
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelected(null)}
            data-cursor-light
            className="fixed inset-0 z-[98] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
          >
            <motion.div
              initial={{ y: 34, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-paper border border-line p-4 sm:p-6 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="meta-label text-ink-soft">
                    {selected.issuer} · {selected.date}
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                    {selected.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close certificate viewer"
                  className="w-10 h-10 shrink-0 grid place-items-center border border-line text-ink hover:bg-ink hover:text-paper transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <img
                src={selected.image}
                alt={`Certificate — ${selected.title}`}
                className="w-full border border-line bg-paper-2"
              />

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-ink-soft max-w-md">{selected.description}</p>
                <a
                  href={selected.image}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-paper py-2.5 px-4 self-start sm:self-auto"
                >
                  open original
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
