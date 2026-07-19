import { Button } from "../components/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#achievements", label: "Achievements" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#111422] border-b border-[#2e344e] shadow-[0_4px_20px_rgba(0,0,0,0.6)]" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center relative">
        {/* Rack shelf indicators */}
        {isScrolled && (
          <>
            <div className="absolute top-2 left-4"><div className="screw-head" /></div>
            <div className="absolute top-2 right-4"><div className="screw-head" /></div>
          </>
        )}

        <a
          href="#"
          className="text-xl font-bold tracking-tight hover:text-[#9d4edd] transition-colors select-none flex items-center gap-2"
        >
          <span className={`w-2.5 h-2.5 rounded-full led-indicator led-purple ${isScrolled ? "active" : ""}`} />
          ANAS<span className="text-[#9d4edd]">_</span>
        </a>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          <div className="skeuo-inset flex items-center gap-1 p-[3px] bg-[#090a12] border border-[#1b1f32]">
            {navLinks.map((link, index) => (
              <a
                href={link.href}
                key={index}
                className="px-5 py-1.5 text-xs font-mono font-bold tracking-wide uppercase text-muted-foreground hover:text-white rounded-lg hover:bg-gradient-to-b hover:from-[#2e3450] hover:to-[#1b1e32] hover:border hover:border-[#414a6e] hover:shadow-md transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <Button size="sm" href="#contact">Contact Me</Button>
        </div>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 text-foreground focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#111422] border-b border-[#2e344e] shadow-lg animate-fade-in">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link, index) => (
              <a
                onClick={() => setIsMobileMenuOpen(false)}
                href={link.href}
                key={index}
                className="p-2 text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-white hover:bg-[#1a1d2e] rounded border border-transparent hover:border-[#2e344e] transition-all"
              >
                {link.label}
              </a>
            ))}
            <Button className="flex items-center justify-center mt-2" size="sm" onClick={() => setIsMobileMenuOpen(false)} href="#contact">Contact Me</Button>
          </div>
        </div>
      )}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#9d4edd]/50 to-transparent shadow-[0_0_8px_#9d4edd]"></div>
    </header>
  );
};
