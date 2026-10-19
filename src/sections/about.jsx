import { SectionHeading } from "@/components/section-heading";
import { Reveal, MaskLines, Sweep } from "@/components/reveal";

const chapters = [
  {
    n: "i.",
    title: "AI & ML Integration",
    body: "Wiring LLM pipelines, RAG retrieval and autonomous agents into products that actually ship — not just demo well.",
  },
  {
    n: "ii.",
    title: "Full-Stack Craft",
    body: "Responsive, accessible frontends in React married to scalable Node.js & Python services with clean contracts.",
  },
  {
    n: "iii.",
    title: "Performance Discipline",
    body: "Query tuning, latency budgets and lean bundles — speed is a feature I refuse to negotiate on.",
  },
  {
    n: "iv.",
    title: "Tactile Interfaces",
    body: "Motion with intent: physics, micro-interactions and type that responds. Decoration never, feedback always.",
  },
];

const facts = [
  ["Name", "Muhammad Anas"],
  ["Based in", "Karachi, Pakistan"],
  ["Studying", "BS CS — FAST NUCES, 2nd year"],
  ["Focus", "AI automation · full-stack web"],
  ["Off-keyboard", "LeetCode · chess · chai"],
];

const stats = [
  ["6+", "projects shipped"],
  ["3", "honors & finals"],
  ["4", "automations live"],
  ["∞", "cups of chai"],
];

export const About = () => (
  <section id="about" className="relative py-24 sm:py-32 border-t border-line">
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 grid lg:grid-cols-12 gap-14 lg:gap-16">
      {/* Sticky left rail */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28 space-y-10">
          <SectionHeading
            index="01"
            kicker="About"
            lines={
              <MaskLines
                lines={[
                  "Systems that",
                  <span key="w" className="display-wonk text-vermilion">think,</span>,
                  "adapt & ship.",
                ]}
              />
            }
          />

          <Reveal delay={0.1}>
            <dl className="divide-y divide-line border-y border-line">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-3">
                  <dt className="meta-label text-ink-soft">{k}</dt>
                  <dd className="text-sm sm:text-base text-ink text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      {/* Narrative + chapters */}
      <div className="lg:col-span-7">
        <Reveal>
          <p className="font-display text-[clamp(1.35rem,2.6vw,1.9rem)] leading-[1.35] tracking-[-0.01em] text-ink">
            Second-year computer science student at{" "}
            <Sweep>FAST NUCES</Sweep>, working where full-stack engineering meets machine
            intelligence. I care about the whole arc of a product —{" "}
            <Sweep>the data model, the latency budget, the last pixel</Sweep> — and about
            writing it down clearly enough that the next engineer smiles.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-ink-soft max-w-2xl">
            My current stack lives in React, Node.js, Python and LangChain: retrieval-augmented
            generation apps, conversational agents and classroom automations with robust
            backend pipelines behind sleek, responsive interfaces. When I'm not shipping,
            I'm sharpening algorithms on LeetCode or sketching interfaces in Figma.
          </p>
        </Reveal>

        <div className="mt-14 border-t border-line">
          {chapters.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.06}>
              <div className="group grid grid-cols-[auto_1fr] sm:grid-cols-[64px_1fr] gap-5 sm:gap-8 py-7 border-b border-line transition-colors duration-300 hover:bg-paper-2">
                <span className="font-display display-wonk text-2xl text-vermilion pt-1">
                  {c.n}
                </span>
                <div>
                  <h3 className="font-display text-2xl sm:text-[1.75rem] font-medium tracking-tight text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-ink-soft max-w-xl">
                    {c.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Stats strip */}
        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line">
            {stats.map(([num, label]) => (
              <div key={label} className="bg-paper-2 px-5 py-6 text-center">
                <div className="font-display text-4xl sm:text-5xl font-medium text-ink">
                  {num}
                </div>
                <div className="mt-1 meta-label text-ink-soft">{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
