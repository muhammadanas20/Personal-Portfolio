import { Reveal } from "@/components/reveal";

/**
 * Chapter header — mono index + hairline + oversized serif title.
 * `dark` switches tokens for ink chapters.
 */
export const SectionHeading = ({
  index,
  kicker,
  lines = [],
  lead,
  dark = false,
  align = "left",
  className = "",
}) => (
  <div className={`${align === "center" ? "text-center mx-auto" : ""} ${className}`}>
    <Reveal>
      <div
        className={`flex items-center gap-4 ${align === "center" ? "justify-center" : ""} mb-6 sm:mb-8`}
      >
        <span className={`meta-label ${dark ? "text-vermilion" : "text-vermilion"}`}>
          {index} /
        </span>
        <span className={`meta-label ${dark ? "text-cream-soft" : "text-ink-soft"}`}>
          {kicker}
        </span>
        <span
          aria-hidden="true"
          className={`hidden sm:block h-px flex-1 max-w-40 ${dark ? "bg-line-dark" : "bg-line"}`}
        />
      </div>
    </Reveal>

    <h2
      className={`font-display font-medium leading-[0.95] tracking-[-0.02em] text-[clamp(2.4rem,6vw,5rem)] ${
        dark ? "text-cream" : "text-ink"
      }`}
    >
      {lines}
    </h2>

    {lead && (
      <Reveal delay={0.15}>
        <p
          className={`mt-6 max-w-xl text-base sm:text-lg leading-relaxed ${
            align === "center" ? "mx-auto" : ""
          } ${dark ? "text-cream-soft" : "text-ink-soft"}`}
        >
          {lead}
        </p>
      </Reveal>
    )}
  </div>
);
