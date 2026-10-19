import { ArrowUp, Github, Linkedin, Instagram } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { scrollToId } from "@/lib/scroll";
import { Magnetic } from "@/components/magnetic";

const socialLinks = [
  { icon: Github, href: "https://github.com/muhammadanas20", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/muhammadanas20/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/_m._.anas_/", label: "Instagram" },
];

const footerLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Work" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer data-cursor-light className="bg-ink text-cream border-t border-line-dark">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 pt-16 sm:pt-20 pb-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="font-display font-medium tracking-[-0.02em] leading-[0.9] text-[clamp(2.6rem,8vw,6rem)]">
              Muhammad&nbsp;Anas
              <span className="display-wonk text-vermilion">.</span>
            </h2>
            <Magnetic>
              <button
                onClick={() => scrollToId("#")}
                className="btn-on-ink btn-ink"
                aria-label="Back to top"
              >
                Back to top
                <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </Magnetic>
          </div>
        </Reveal>

        <div className="mt-12 sm:mt-16 pt-6 border-t border-line-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <nav className="flex flex-wrap gap-x-7 gap-y-3">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(link.href);
                }}
                className="meta-label text-cream-soft hover:text-cream link-draw transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="w-10 h-10 grid place-items-center border border-line-dark rounded-full text-cream-soft hover:text-ink hover:bg-cream hover:border-cream transition-colors duration-300"
              >
                <s.icon className="w-4 h-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-2 meta-label text-cream-soft/70">
          <span>© {year} Muhammad Anas — printed on recycled pixels</span>
          <span>
            set in <span className="text-cream">Fraunces</span> &{" "}
            <span className="text-cream">Space Grotesk</span> — Karachi, PK
          </span>
        </div>
      </div>
    </footer>
  );
};
