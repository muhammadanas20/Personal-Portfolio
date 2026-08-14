import { useEffect, useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const phases = [
  { threshold: 0, label: "Initializing", detail: "Setting the stage" },
  { threshold: 32, label: "Composing", detail: "Arranging selected work" },
  { threshold: 68, label: "Polishing", detail: "Refining every detail" },
  { threshold: 92, label: "Ready", detail: "Welcome to the portfolio" },
];

export const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let animationFrame;
    let finishTimer;
    const duration = shouldReduceMotion ? 400 : 1900;
    const startedAt = performance.now();
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const updateProgress = (time) => {
      const elapsed = Math.min((time - startedAt) / duration, 1);
      // A subtle ease-out keeps the final polish visible without making the loader feel slow.
      const eased = 1 - Math.pow(1 - elapsed, 1.35);
      const nextProgress = Math.min(100, Math.round(eased * 100));

      setProgress((current) =>
        current === nextProgress ? current : nextProgress,
      );

      if (elapsed < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        finishTimer = window.setTimeout(onComplete, shouldReduceMotion ? 80 : 320);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(finishTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete, shouldReduceMotion]);

  const currentPhase = phases.reduce(
    (activePhase, phase) =>
      progress >= phase.threshold ? phase : activePhase,
    phases[0],
  );

  return (
    <Motion.div
      initial={{ opacity: 1 }}
      exit={
        shouldReduceMotion
          ? { opacity: 0, transition: { duration: 0.2 } }
          : {
              opacity: 0,
              scale: 1.025,
              filter: "blur(8px)",
              transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
            }
      }
      className="portfolio-loader fixed inset-0 z-[99999] overflow-hidden text-white"
      aria-busy="true"
      aria-label="Loading Muhammad Anas's portfolio"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div className="loader-grid absolute inset-0" />
        <div className="loader-aurora loader-aurora-purple" />
        <div className="loader-aurora loader-aurora-cyan" />
        <div className="loader-vignette absolute inset-0" />
        <div className="loader-wordmark absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
          ANASTRIX
        </div>
      </div>

      <div className="relative z-10 flex min-h-full flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <header className="flex items-center justify-between">
          <Motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <div className="loader-mini-mark grid h-10 w-10 place-items-center rounded-xl font-serif text-lg font-semibold">
              A
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-white">
                ANASTRIX
              </p>
              <p className="mt-0.5 text-[9px] uppercase tracking-[0.28em] text-white/40">
                Creative developer
              </p>
            </div>
          </Motion.div>

          <Motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            className="hidden text-[10px] uppercase tracking-[0.28em] text-white/40 sm:block"
          >
            Portfolio · {new Date().getFullYear()}
          </Motion.p>
        </header>

        <main className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-xl text-center">
            <Motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, scale: 0.72, rotate: -8 }
              }
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="loader-orbit relative mx-auto mb-8 grid h-28 w-28 place-items-center sm:h-32 sm:w-32"
              aria-hidden="true"
            >
              <div className="loader-orbit-line loader-orbit-line-one absolute inset-0 rounded-full" />
              <div className="loader-orbit-line loader-orbit-line-two absolute inset-3 rounded-full" />
              <div className="loader-orbit-sweep absolute inset-0 rounded-full" />
              <div className="loader-core relative grid h-16 w-16 place-items-center rounded-2xl sm:h-[4.5rem] sm:w-[4.5rem]">
                <span className="font-serif text-3xl font-semibold sm:text-4xl">A</span>
                <span className="loader-core-glint absolute inset-0 rounded-2xl" />
              </div>
            </Motion.div>

            <Motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="mb-3 text-[10px] font-medium uppercase tracking-[0.38em] text-[#66e6ff] sm:text-xs"
            >
              Muhammad Anas · Full-stack developer
            </Motion.p>

            <Motion.h1
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="font-serif text-4xl leading-tight tracking-[-0.035em] text-white sm:text-5xl"
            >
              Ideas, engineered.
            </Motion.h1>

            <Motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/45"
            >
              Preparing a collection of thoughtful interfaces, code, and digital
              experiences.
            </Motion.p>

            <Motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4 }}
              className="loader-progress-panel mx-auto mt-8 max-w-md rounded-2xl p-4 text-left sm:p-5"
            >
              <div className="mb-3 flex items-end justify-between gap-4">
                <div aria-live="polite">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/35">
                    {currentPhase.detail}
                  </p>
                  <p className="mt-1 text-sm font-medium tracking-wide text-white/85">
                    {currentPhase.label}
                    <span className="loader-ellipsis" aria-hidden="true">
                      ...
                    </span>
                  </p>
                </div>
                <p className="font-mono text-xl font-medium tabular-nums text-white">
                  {String(progress).padStart(2, "0")}
                  <span className="ml-0.5 text-xs text-[#66e6ff]">%</span>
                </p>
              </div>

              <div
                className="loader-progress-track relative h-1.5 overflow-hidden rounded-full"
                role="progressbar"
                aria-label="Portfolio loading progress"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={progress}
              >
                <div
                  className="loader-progress-fill absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-3 flex justify-between px-0.5" aria-hidden="true">
                {phases.map((phase) => (
                  <span
                    key={phase.label}
                    className={`loader-phase-dot h-1 w-1 rounded-full ${
                      progress >= phase.threshold ? "is-active" : ""
                    }`}
                  />
                ))}
              </div>
            </Motion.div>
          </div>
        </main>

        <footer className="flex items-end justify-between gap-4">
          <Motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="hidden sm:block"
          >
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
              Based in Karachi, Pakistan
            </p>
            <p className="mt-1.5 text-[10px] tracking-[0.12em] text-white/55">
              DESIGN · DEVELOPMENT · AI
            </p>
          </Motion.div>

          <Motion.button
            type="button"
            onClick={onComplete}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.48 }}
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            className="loader-enter-button group ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66e6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070912]"
            aria-label="Skip loading animation and enter portfolio"
          >
            Enter now
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Motion.button>
        </footer>
      </div>
    </Motion.div>
  );
};
