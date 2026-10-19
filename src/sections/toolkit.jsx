import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, MaskLines } from "@/components/reveal";

const cells = [
  {
    label: "Frontend",
    span: "lg:col-span-5",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Figma"],
  },
  {
    label: "Backend & AI",
    span: "lg:col-span-4",
    items: ["Node.js", "Python", "LangChain", "RAG / BM25", "Groq LLMs", "MongoDB", "SQL"],
  },
  {
    label: "Languages",
    span: "lg:col-span-3",
    items: ["C", "C++ / OOP", "JavaScript", "Python"],
  },
  {
    label: "Tools & Cloud",
    span: "lg:col-span-4",
    items: ["Git", "GitHub Actions", "Vercel", "Docker basics", "REST APIs", "EmailJS"],
  },
  {
    label: "Currently exploring",
    span: "lg:col-span-5",
    explore: true,
    items: ["Agentic workflows (MCP)", "Vector DB internals", "WebGL / shaders", "System design"],
  },
  {
    label: "Foundations",
    span: "lg:col-span-3",
    items: ["DSA", "OOP", "DB design", "Competitive programming"],
  },
];

export const Toolkit = () => (
  <section id="toolkit" className="py-24 sm:py-32 border-t border-line">
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 sm:mb-20">
        <SectionHeading
          index="02"
          kicker="Toolkit"
          lines={
            <MaskLines
              lines={[
                "Instruments of",
                <span key="2" className="display-wonk text-vermilion">the trade.</span>,
              ]}
            />
          }
        />
        <Reveal delay={0.15}>
          <p className="meta-label text-ink-soft max-w-[240px] leading-loose md:text-right">
            chosen for clarity & speed —
            <br className="hidden md:block" /> updated every semester
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        {cells.map((cell, i) => (
          <Reveal key={cell.label} delay={i * 0.05} className={cell.span}>
            <div className="bento-cell h-full p-6 sm:p-7 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="meta-label text-ink">{cell.label}</span>
                <span className="meta-label text-ink-soft/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {cell.explore ? (
                <ul className="space-y-2.5">
                  {cell.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm sm:text-base text-ink-soft">
                      <ArrowUpRight className="w-4 h-4 text-vermilion shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {cell.items.map((item) => (
                    <li
                      key={item}
                      className="px-3 py-1.5 border border-line rounded-full text-xs sm:text-[13px] font-medium text-ink-soft transition-colors duration-300 hover:bg-ink hover:text-paper hover:border-ink cursor-default"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
