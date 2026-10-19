/**
 * Infinite ticker strip. Pass `items` (strings or nodes); the row is
 * duplicated for a seamless -50% loop. Pause on hover, static on reduced motion.
 */
export const Marquee = ({ items = [], dark = true, separator = "✳" }) => {
  const row = (key) => (
    <div className="flex items-center shrink-0" key={key} aria-hidden={key === "b"}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-5 sm:px-7 py-3 sm:py-3.5 whitespace-nowrap meta-label">
            {item}
          </span>
          <span
            className={`font-display display-wonk text-xl sm:text-2xl ${
              dark ? "text-vermilion" : "text-vermilion"
            }`}
            aria-hidden="true"
          >
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`marquee-mask overflow-hidden border-y select-none ${
        dark ? "bg-ink text-cream border-ink" : "bg-paper text-ink border-line"
      }`}
    >
      <div className="marquee-track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
};
