import { SectionHeading } from "@/components/section-heading";
import { Reveal, MaskLines } from "@/components/reveal";

const education = [
  {
    period: "2025 — present",
    degree: "BS Computer Science",
    school: "FAST NUCES, Karachi",
    body: "Undergraduate computer science in one of the country's most competitive rooms — full-stack development, systems thinking and competitive programming as a sport.",
    tags: ["C", "C++", "OOP", "SQL", "DSA", "LaTeX"],
    current: true,
  },
  {
    period: "2023 — 2025",
    degree: "Pre-Engineering",
    school: "Bahria College Karsaz",
    body: "The mathematical backbone: calculus, physics and analytical logic — where disciplined problem-solving stopped being a technique and became a habit.",
    tags: ["Calculus", "Physics", "Analytical Logic"],
    current: false,
  },
];

export const Education = () => (
  <section id="education" className="py-24 sm:py-32 border-t border-line">
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
      <SectionHeading
        index="04"
        kicker="Education"
        className="mb-16 sm:mb-24"
        lines={
          <MaskLines
            lines={[
              "A trajectory,",
              <span key="2">
                not a <span className="display-wonk text-vermilion">timeline.</span>
              </span>,
            ]}
          />
        }
        lead="Two chapters so far — one that taught me how to think, one that teaches me how to build."
      />

      <div className="relative">
        {/* vertical hairline */}
        <span
          aria-hidden="true"
          className="absolute left-[7px] sm:left-1/2 top-2 bottom-2 w-px bg-line sm:-translate-x-1/2"
        />

        <div className="space-y-16 sm:space-y-24">
          {education.map((e, i) => (
            <Reveal key={e.degree} y={36}>
              <div className="relative grid sm:grid-cols-2 gap-6 sm:gap-16 pl-8 sm:pl-0">
                {/* node */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 sm:left-1/2 top-2 w-[15px] h-[15px] rounded-full border-2 sm:-translate-x-1/2 ${
                    e.current ? "border-vermilion bg-paper" : "border-ink bg-paper"
                  }`}
                >
                  {e.current && (
                    <span className="absolute inset-0 rounded-full bg-vermilion animate-ping opacity-50" />
                  )}
                </span>

                {/* period side */}
                <div className={`${i % 2 === 1 ? "sm:order-2 sm:text-right" : ""}`}>
                  <p className="font-display display-wonk text-3xl sm:text-4xl text-vermilion">
                    {e.period}
                  </p>
                  <p className="mt-2 meta-label text-ink-soft">
                    {e.current ? "in progress" : "completed"}
                  </p>
                </div>

                {/* content side */}
                <div className={`${i % 2 === 1 ? "sm:order-1" : ""}`}>
                  <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                    {e.degree}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-ink">{e.school}</p>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-soft max-w-md">
                    {e.body}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {e.tags.map((t) => (
                      <li
                        key={t}
                        className="px-2.5 py-1 border border-line rounded-full text-[11px] font-mono tracking-wide text-ink-soft"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
