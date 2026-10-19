import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.16, 1, 0.3, 1];

/** Fade + rise reveal, fires once when scrolled into view. */
export const Reveal = ({
  children,
  delay = 0,
  y = 28,
  duration = 0.8,
  className = "",
  as = "div",
}) => {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
};

/**
 * Line-mask reveal: each line rises out of an overflow-hidden clip,
 * the signature heading motion of editorial award sites.
 *
 * The visibility trigger lives on the *unclipped* wrapper on purpose: a line
 * parked at y:110% sits entirely outside its `overflow-hidden` clip, so an
 * IntersectionObserver aimed at the line itself would never see it — the
 * heading would stay invisible forever. Observing the wrapper and driving the
 * child with `animate` fixes that for every masked heading on the page.
 */
export const MaskLines = ({ lines = [], className = "", lineClassName = "", stagger = 0.09, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 0.95, delay: delay + i * stagger, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

/** Draws the highlighter sweep under a keyword when it enters view. */
export const Sweep = ({ children, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <span ref={ref} className={`marker-sweep ${inView ? "is-lit" : ""} ${className}`}>
      {children}
    </span>
  );
};
