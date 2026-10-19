import { useRef } from "react";

/**
 * Magnetic wrapper — children follow the pointer up to `strength` px
 * and spring back on leave. No-op on touch & reduced motion.
 */
export const Magnetic = ({ children, strength = 0.28, className = "" }) => {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] will-change-transform ${className}`}
    >
      {children}
    </span>
  );
};
