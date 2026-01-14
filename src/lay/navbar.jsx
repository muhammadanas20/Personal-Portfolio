import { Button } from "../components/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Education" },
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
      className={`fixed top-0 left-0 right-0 z-50 py-5 transition-all duration-300 ${
        isScrolled ? "glass backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <a
          href="#"
          className="text-xl font-bold tracking-tight hover:text-primary"
        >
          ANAS<span>.</span>
        </a>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          <div className="glass rounded-full px-2 py-1 flex items-center gap-1">
            {navLinks.map((link, index) => (
              <a
                href={link.href}
                key={index}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-full hover:bg-surface"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <Button size="sm">Contact Me</Button>
        </div>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 text-foreground"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-strong animate-fade-in">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <a
                href={link.href}
                key={index}
                className="p-2 text-lg text-muted-foreground hover:text-foreground hover:bg-surface rounded"
              >
                {link.label}
              </a>
            ))}
            <Button size="sm">Contact Me</Button>
          </div>
        </div>
      )}
    </header>
  );
};
