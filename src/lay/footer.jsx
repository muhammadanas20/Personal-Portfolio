import React from "react";
import { Github, Linkedin, Instagram } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com/muhammadanas20", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/muhammadanas20/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/_m._.anas_/", label: "Instagram" },
];

const footerLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-[#070911] border-t border-[#1b1f32] relative">
      {/* Decorative screws on footer deck */}
      <div className="absolute top-4 left-6"><div className="screw-head" /></div>
      <div className="absolute top-4 right-6"><div className="screw-head" /></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <a href="#" className="text-xl font-bold tracking-tight text-white hover:text-[#9d4edd] transition-colors">
              ANAS<span className="text-[#9d4edd]">_</span>
            </a>
            <p className="text-[11px] font-mono text-[#5e6988] mt-2">
              © {currentYear} MUHAMMAD ANAS. STABLE_BUILD v2.0
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-mono uppercase tracking-wider text-[#8f9bb3] hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#0c0d18] border border-[#1c2035] flex items-center justify-center text-[#8f9bb3] hover:text-white hover:border-[#9d4edd] shadow-inner transition-all active:translate-y-[2px]"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};