import { Button } from "../components/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Education" },
];

export const Navbar = () => {
    const [isMobileMenuOpen,setIsMobileMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 bg-transparent py-5">
      <nav className="conatiner mx-auto px-6 flex justify-between">
        <a
          href="#"
          className="text-xl font-bold tracking-tight hover:text-primary"
        >
          ANAS<span>.</span>
        </a>
        {/* // for dekstop */}
        <div className="hidden md:flex items-center gap-1">
          <div className="glass rounded-full px-2 py-1 flex items-center gap-1">
            {navLinks.map((link, index) => (
              <a
                href={link.href}
                key={index}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-b-full hover:bg-surface"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <Button size="sm">Contact Me</Button>
        </div>
        {/* mobile menu button */}
      <button onClick={()=>
        setIsMobileMenuOpen((prev) => !prev)
      } className="md:hidden p-2 text-foreground">
          {isMobileMenuOpen ? <X size={24} />: <Menu size={24} />}
        </button>
      </nav>

       {isMobileMenuOpen && ( <div className="md:hidden glass-strong animate-fade-in">
        <div className="container mx-auto px-6 py6 flex flex-col gap-4">
          {navLinks.map((link, index) => (
            <a
              href={link.href}
              key={index}
              className="p-2 text-lg text-muted-foreground hover:text-foreground hover:bg-surface"
            >
              {link.label}
            </a>
          ))}
          <Button size="sm">Contact Me</Button>
        </div>    
      </div>)}
    </header>
  );
};
