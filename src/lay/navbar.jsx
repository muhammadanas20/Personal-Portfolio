import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { scrollToId } from "@/lib/scroll";
import { Magnetic } from "@/components/magnetic";

const navLinks = [
  { href: "#about", label: "About", index: "01" },
  { href: "#toolkit", label: "Toolkit", index: "02" },
  { href: "#projects", label: "Work", index: "03" },
  { href: "#education", label: "Education", index: "04" },
  { href: "#honors", label: "Honors", index: "05" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    // let the menu close before travelling
    setTimeout(() => scrollToId(href), open ? 220 : 0);
  };

  return (
    <>
      <a
        href="#main"
        onClick={(e) => go(e, "#main")}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink focus:text-paper focus:px-4 focus:py-2 meta-label"
      >
        Skip to content
      </a>

      <header
        className={`fixed top-0 inset-x-0 z-[70] transition-all duration-500 ${
          scrolled
            ? "bg-paper/85 backdrop-blur-md border-b border-line"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto max-w-[1200px] px-5 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between">
          {/* Wordmark */}
          <a
            href="#"
            onClick={(e) => go(e, "#")}
            className="group flex items-center gap-3 select-none"
            aria-label="Muhammad Anas — home"
          >
            <img
              src="/icon.png"
              alt=""
              width={30}
              height={30}
              className="w-[30px] h-[30px] rounded-[4px] transition-transform duration-500 group-hover:rotate-[8deg]"
            />
            <span className="font-display text-lg font-semibold tracking-tight leading-none">
              Muhammad&nbsp;Anas
            </span>
            <span className="hidden lg:inline meta-label text-ink-soft group-hover:text-vermilion transition-colors">
              — portfolio ’26
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => go(e, link.href)}
                className="meta-label text-ink-soft hover:text-ink link-draw transition-colors"
              >
                <span className="text-vermilion mr-1.5">{link.index}</span>
                {link.label}
              </a>
            ))}
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => go(e, "#contact")}
                className="btn-ink py-2.5 px-5"
              >
                Contact
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </Magnetic>
          </div>

          {/* Mobile trigger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden relative z-[96] w-11 h-11 -mr-2 grid place-items-center"
          >
            <span
              className={`absolute w-6 h-[1.5px] bg-current transition-transform duration-300 ${
                open ? "rotate-45 text-cream" : "-translate-y-[5px] text-ink"
              }`}
            />
            <span
              className={`absolute w-6 h-[1.5px] bg-current transition-transform duration-300 ${
                open ? "-rotate-45 text-cream" : "translate-y-[5px] text-ink"
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Full-screen ink menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[95] bg-ink text-cream md:hidden flex flex-col justify-between px-6 pt-24 pb-10"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => go(e, link.href)}
                  initial={{ y: 34, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.18 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-4 py-2.5 border-b border-line-dark"
                >
                  <span className="meta-label text-vermilion">{link.index}</span>
                  <span className="font-display text-4xl font-medium tracking-tight">
                    {link.label}
                  </span>
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={(e) => go(e, "#contact")}
                initial={{ y: 34, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.18 + navLinks.length * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-baseline gap-4 py-2.5"
              >
                <span className="meta-label text-vermilion">06</span>
                <span className="font-display text-4xl font-medium tracking-tight display-wonk">
                  Contact
                </span>
              </motion.a>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-end justify-between"
            >
              <div className="meta-label text-cream-soft leading-loose">
                Karachi, PK
                <br />
                open for internships
              </div>
              <div className="flex gap-5 meta-label">
                <a href="https://github.com/muhammadanas20" target="_blank" rel="noreferrer" className="link-draw">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/muhammadanas20/" target="_blank" rel="noreferrer" className="link-draw">
                  LinkedIn
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
