import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";

const VARIANTS = {
  /* on the paper chapters */
  paper: "border-line text-ink-soft hover:border-ink hover:text-ink",
  /* on the ink chapters */
  ink: "border-line-dark text-cream-soft hover:border-cream hover:text-cream",
};

/**
 * Theme switch — a hairline plate that flips the whole surface between
 * printed paper and warm charcoal. The icon shown is the one you would
 * land on, so the button always tells the truth about what it does.
 */
export const ThemeToggle = ({ variant = "paper", className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
      aria-pressed={isDark}
      className={`group relative grid h-10 w-10 shrink-0 place-items-center border transition-colors duration-300 ${VARIANTS[variant] ?? VARIANTS.paper} ${className}`}
    >
      <span className="relative block h-[18px] w-[18px]">
        <Sun
          aria-hidden="true"
          className={`absolute inset-0 h-[18px] w-[18px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          aria-hidden="true"
          className={`absolute inset-0 h-[18px] w-[18px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </span>
    </button>
  );
};
