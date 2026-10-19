import { useId } from "react";

/**
 * Rotating circular text seal — the "ink stamp" of the site.
 * Pure SVG, spins 360° over 22s, static under reduced motion.
 *
 * The type is painted with `currentColor`, so a seal inherits the colour
 * of whatever it sits in: ink on paper, cream on the ink chapters. The
 * theme follows automatically.
 */
export const Seal = ({
  text = "· MUHAMMAD ANAS · FULL-STACK DEVELOPER ",
  size = 116,
  className = "",
  dark = false,
}) => {
  const pathId = `seal-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <span
      data-seal
      aria-hidden="true"
      className={`relative block ${dark ? "text-cream" : ""} ${className}`}
      style={{ width: size, height: size, animation: "seal-spin 22s linear infinite" }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <path id={pathId} d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
        </defs>
        <text
          fill="currentColor"
          style={{ fontSize: "8.2px", letterSpacing: "0.14em", fontFamily: "var(--font-mono)" }}
        >
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full bg-vermilion" />
    </span>
  );
};
