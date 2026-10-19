import { motion } from "framer-motion";
import { ArrowDown, Download, ArrowUpRight } from "lucide-react";
import { MaskLines, Reveal } from "@/components/reveal";
import { Scramble } from "@/components/scramble";
import { Seal } from "@/components/seal";
import { Magnetic } from "@/components/magnetic";
import { scrollToId } from "@/lib/scroll";

const EASE = [0.16, 1, 0.3, 1];

const roles = [
  "Full-Stack Developer",
  "AI Automation Engineer",
  "Competitive Programmer",
  "CS @ FAST NUCES",
];

export const Hero = () => (
  <section id="top" className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
      {/* Top meta strip */}
      <Reveal className="flex items-center justify-between meta-label text-ink-soft mb-10 sm:mb-16">
        <span className="flex items-center gap-2.5">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-vermilion animate-ping opacity-60" />
            <span className="relative w-2 h-2 rounded-full bg-vermilion" />
          </span>
          Open to internships — 2026
        </span>
        <span className="hidden sm:inline">Portfolio — Vol. 03</span>
        <span className="hidden md:inline">Karachi, PK · 24.86° N</span>
      </Reveal>

      {/* The name — viewport-scaled kinetic type */}
      <h1 className="font-display font-medium tracking-[-0.025em] leading-[0.86] text-[clamp(3.4rem,11.5vw,10.5rem)]">
        <MaskLines lines={["MUHAMMAD"]} />
        <MaskLines
          delay={0.12}
          lines={[
            <span key="l2" className="inline-flex items-end gap-4 sm:gap-8 flex-wrap">
              <span className="display-wonk text-vermilion">ANAS</span>
              <span className="hidden lg:inline-block align-middle mb-4">
                <Seal size={104} />
              </span>
            </span>,
          ]}
        />
      </h1>

      {/* Under the name: role / intro / portrait */}
      <div className="mt-12 sm:mt-16 grid lg:grid-cols-12 gap-12 lg:gap-10 items-end">
        <div className="lg:col-span-7 space-y-7">
          <Reveal delay={0.1}>
            <p className="meta-label text-ink-soft">
              <span className="text-vermilion mr-2">//</span>
              <Scramble words={roles} className="text-ink" />
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg sm:text-xl leading-relaxed text-ink-soft max-w-xl">
              I build <span className="text-ink font-medium">intelligent automations</span> and{" "}
              <span className="text-ink font-medium">editorial-grade interfaces</span> — RAG
              pipelines, WhatsApp agents and web experiences where logic, data and craft
              share one surface.
            </p>
          </Reveal>

          <Reveal delay={0.3} className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <button onClick={() => scrollToId("#projects")} className="btn-ink">
                View selected work
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </Magnetic>
            <Magnetic>
              <a href="/Muhammad_Anas_Resume.pdf" target="_blank" rel="noreferrer" className="btn-paper">
                Résumé
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </Magnetic>
            <a
              href="https://github.com/muhammadanas20"
              target="_blank"
              rel="noreferrer"
              className="meta-label text-ink-soft hover:text-ink link-draw transition-colors ml-1"
            >
              github ↗
            </a>
          </Reveal>
        </div>

        {/* Portrait — arch frame, editorial caption */}
        <div className="lg:col-span-5 lg:justify-self-end w-full max-w-[340px] sm:max-w-[380px] mx-auto lg:mx-0">
          <motion.figure
            initial={{ opacity: 0, y: 40, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            className="relative"
          >
            <div className="arch-frame border border-line bg-paper-2 aspect-[4/5]">
              <img
                src="/profile.png"
                alt="Portrait of Muhammad Anas"
                className="w-full h-full object-cover object-top"
                width={1024}
                height={1024}
              />
            </div>
            <figcaption className="mt-3 flex items-center justify-between meta-label text-ink-soft">
              <span>FIG. 01 — the developer</span>
              <span className="text-vermilion">est. 2006</span>
            </figcaption>
            <span className="absolute -left-6 sm:-left-10 top-8 hidden sm:block">
              <Seal size={86} text="· PRINTED IN KARACHI · SHIPPED WORLDWIDE " />
            </span>
          </motion.figure>
        </div>
      </div>

      {/* Scroll hint */}
      <Reveal delay={0.5} className="mt-16 sm:mt-24 flex items-center gap-4 meta-label text-ink-soft">
        <span className="relative block w-px h-12 bg-line overflow-hidden">
          <motion.span
            className="absolute top-0 left-0 w-px h-4 bg-vermilion"
            animate={{ y: [-16, 48] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        Scroll — the story continues
      </Reveal>
    </div>

    {/* Oversized ghost word, quietly */}
    <span
      aria-hidden="true"
      className="pointer-events-none select-none absolute -bottom-6 right-0 font-display display-wonk text-[clamp(6rem,18vw,16rem)] leading-none text-ink/[0.045]"
    >
      anastrix
    </span>
  </section>
);
