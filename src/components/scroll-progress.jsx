import { motion, useScroll, useSpring } from "framer-motion";

/** 2px vermilion reading-progress rule pinned to the viewport top. */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-vermilion origin-left z-[85]"
    />
  );
};
