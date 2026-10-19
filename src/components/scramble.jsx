import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#░▒▓01";

/**
 * Scramble-decode rotating text: words dissolve into glyph noise and
 * resolve letter by letter. Reduced-motion friendly (plain crossfade).
 */
export const Scramble = ({ words = [], interval = 2600, className = "" }) => {
  const [display, setDisplay] = useState(words[0] ?? "");
  const idx = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const timer = setInterval(() => {
      idx.current = (idx.current + 1) % words.length;
      const next = words[idx.current];

      if (reduced) {
        setDisplay(next);
        return;
      }

      let frame = 0;
      const total = 22;
      const tick = setInterval(() => {
        frame++;
        const progress = frame / total;
        const revealed = Math.floor(next.length * progress);
        let out = next.slice(0, revealed);
        for (let i = revealed; i < next.length; i++) {
          out += next[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setDisplay(out);
        if (frame >= total) {
          setDisplay(next);
          clearInterval(tick);
        }
      }, 34);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <span className={className} aria-live="polite">
      {display}
    </span>
  );
};
