import { ArrowUpRight, Github } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, MaskLines } from "@/components/reveal";

const projects = [
  {
    title: "Election Voting System",
    meta: "Semester build · C",
    year: "2025",
    description:
      "A complete digital election simulation: candidate administration, secure voter authentication and automated vote counting over persistent file storage — integrity first, edge cases included.",
    image: "/projects/election_system.jpg",
    alt: "Risograph illustration of a ballot box with a verification stamp",
    tags: ["C", "File I/O", "Logic Building"],
    github: "https://github.com/muhammadanas20/pf-project-election-system",
  },
  {
    title: "Military Base Management",
    meta: "Semester build · C++",
    year: "2025",
    description:
      "Command & control simulation for military bases, modeled end-to-end with OOP: personnel, logistics, weapons inventory, operations and tamper-evident audit logs with custom exception handling.",
    image: "/projects/military_command.jpg",
    alt: "Risograph illustration of a radar command screen and insignia",
    tags: ["C++", "OOP", "File Handling", "System Design"],
    github: "https://github.com/muhammadanas20/Millitary-Base-Managment-System",
  },
  {
    title: "AI Image Detector",
    meta: "Semester build · C++",
    year: "2026",
    description:
      "Five heuristic engines — metadata, artifacts, frequency, watermark and hybrid-deep — score an image, then a weighted verdict returns an authenticity confidence with search, filtering and report export.",
    image: "/projects/ai_detector.jpg",
    alt: "Risograph illustration of a magnifying glass scanning a pixelating photo",
    tags: ["C++", "Heuristics", "CLI", "System Design"],
    github: "https://github.com/muhammadanas20/AI-Image-Detector",
  },
  {
    title: "LuminaDocs AI",
    meta: "AI automation · Python",
    year: "2026",
    description:
      "A WhatsApp study assistant: /quiz triggers a RAG backend that indexes your own course PDFs and slides with BM25, Groq drafts an exam-focused .docx from only those sources, and the bot replies in chat.",
    image: "/projects/luminadocs.jpg",
    alt: "Risograph illustration of an open book flowing into chat bubbles",
    tags: ["Python", "RAG", "WhatsApp", "BM25", "Groq"],
    github: "https://github.com/muhammadanas20/LuminaDocs-AI",
  },
  {
    title: "Quizly Bot",
    meta: "AI automation · Node.js",
    year: "2026",
    description:
      "A WhatsApp group bot that wakes only when a message pairs the word “quiz” with a photo — downloads it, runs Groq vision reasoning, answers step-by-step in chat, and rate-limits itself to stay polite.",
    image: "/projects/quizly.jpg",
    alt: "Risograph illustration of a chat bubble with an eye examining a photo",
    tags: ["Node.js", "WhatsApp API", "Groq Vision"],
    github: "https://github.com/muhammadanas20/Quizly-Bot",
  },
  {
    title: "SolveSphere AI",
    meta: "AI automation · Python",
    year: "2026",
    description:
      "A Google Classroom watcher that polls new assignments, extracts text from attached PDFs, Docs and Word files, solves them with Groq, emails back finished PDF + DOCX — and never solves the same task twice.",
    image: "/projects/solvesphere.jpg",
    alt: "Risograph illustration of documents flowing through an automation funnel",
    tags: ["Python", "Classroom API", "Gmail API", "Automation"],
    github: "https://github.com/muhammadanas20/SolveSphere-AI",
  },
];

export const Projects = () => (
  <section
    id="projects"
    data-cursor-light
    className="relative bg-ink text-cream py-24 sm:py-36 overflow-hidden"
  >
    {/* quiet ghost index */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-10 right-4 font-display display-wonk text-[clamp(5rem,14vw,12rem)] leading-none text-cream/[0.05]"
    >
      works
    </span>

    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 sm:mb-24">
        <SectionHeading
          dark
          index="03"
          kicker="Selected work"
          lines={
            <MaskLines
              lines={[
                "Things I built",
                <span key="2">
                  &amp; would{" "}
                  <span className="display-wonk text-vermilion">build again.</span>
                </span>,
              ]}
            />
          }
        />
        <Reveal delay={0.15}>
          <p className="text-sm sm:text-base text-cream-soft max-w-xs leading-relaxed md:text-right">
            Semester foundations and live AI automations — each one shipped, documented
            and open-sourced.
          </p>
        </Reveal>
      </div>

      <div className="space-y-20 sm:space-y-28">
        {projects.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={p.title} y={40}>
              <a
                href={p.github}
                target="_blank"
                rel="noreferrer"
                className="group grid lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                aria-label={`${p.title} — view on GitHub`}
              >
                {/* Art */}
                <div
                  className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
                >
                  <div className="relative">
                    <span className="absolute -top-7 -left-1 sm:-top-9 sm:-left-3 font-display display-wonk text-5xl sm:text-7xl text-vermilion/90 select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="art-frame border border-line-dark aspect-[4/3] sm:aspect-[16/10]">
                      <img
                        src={p.image}
                        alt={p.alt}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Copy */}
                <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-3 meta-label text-cream-soft mb-4">
                    <span className="text-vermilion">{p.meta}</span>
                    <span aria-hidden="true">·</span>
                    <span>{p.year}</span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-cream group-hover:text-vermilion transition-colors duration-300">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-cream-soft">
                    {p.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="px-2.5 py-1 border border-line-dark rounded-full text-[11px] font-mono tracking-wide text-cream-soft"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-2 meta-label text-cream group-hover:text-vermilion transition-colors">
                    <Github className="w-4 h-4" aria-hidden="true" />
                    <span className="link-draw">source & notes</span>
                    <ArrowUpRight
                      className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5 group-hover:-translate-y-1.5"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </a>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-20 sm:mt-28 text-center">
        <p className="meta-label text-cream-soft mb-6">more experiments live on the profile</p>
        <a
          href="https://github.com/muhammadanas20?tab=repositories"
          target="_blank"
          rel="noreferrer"
          className="btn-ink btn-on-ink inline-flex"
        >
          Browse all repositories
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </Reveal>
    </div>
  </section>
);
