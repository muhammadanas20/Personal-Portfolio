import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/button";
import { ProfileCard } from "@/components/profile-card";
import {
  ChevronDown,
  Github,
  Linkedin,
  Instagram,
  Download,
} from "lucide-react";

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "OOP",
  "Competitive programming",
  "Vercel",
  "Tailwind CSS",
  "Figma",
  "Git",
  "GitHub Actions",
];

export const Hero = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animations
      gsap.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.15,
      });

      gsap.from(".hero-desc", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.4,
      });

      gsap.from(".hero-cta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.6,
      });

      gsap.from(".hero-social", {
        scale: 0.5,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(2)",
        delay: 0.8,
        stagger: 0.1,
      });

      gsap.from(".hero-portrait", {
        x: 60,
        opacity: 0,
        duration: 1.4,
        ease: "elastic.out(1, 0.8)",
        delay: 0.5,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0c16] pt-24">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#16192b_1px,transparent_1px),linear-gradient(to_bottom,#16192b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0a0c16_100%)] pointer-events-none" />
      
      {/* Ambient glowing pools */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#9d4edd]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00d9ff]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <span className="hero-title inline-block px-3 py-1 text-xs font-mono tracking-widest text-[#00d9ff] uppercase bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-md">
                DEVELOPER_PORTFOLIO //
              </span>
              
              <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none tracking-tight text-white">
                MUHAMMAD <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d4edd] to-[#00d9ff] drop-shadow-[0_0_15px_rgba(157,78,221,0.3)]">
                  ANAS
                </span>
              </h1>
              
              <p className="hero-desc text-base sm:text-lg text-[#8f9bb3] max-w-lg leading-relaxed font-sans">
                A Computer Science student at FAST NUCES specializing in React, 
                JavaScript, and competitive programming. I build highly interactive, 
                responsive, and tactile applications that merge logical code with premium UI.
              </p>
            </div>

            {/* CTA Button */}
            <div className="hero-cta flex flex-wrap gap-4">
              <Button
                size="lg"
                href="/Muhammad_Anas_Resume.pdf"
                download
                target="_blank"
                rel="noreferrer"
                className="group"
              >
                Download CV 
                <Download className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="hero-desc text-xs font-mono text-[#7b68be]">CONNECT_WITH_ME:</span>
              <div className="flex items-center gap-3">
                {[
                  { icon: Github, href: "https://github.com/muhammadanas20" },
                  {
                    icon: Linkedin,
                    href: "https://www.linkedin.com/in/muhammadanas20/",
                  },
                  {
                    icon: Instagram,
                    href: "https://www.instagram.com/anastrix.20/?hl=en",
                  },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hero-social w-10 h-10 rounded-xl bg-gradient-to-b from-[#25283c] to-[#151726] border border-[#3b4260] flex items-center justify-center text-[#8f9bb3] hover:text-white hover:border-[#9d4edd] hover:shadow-[0_0_15px_rgba(157,78,221,0.4)] transition-all duration-300 active:translate-y-[2px]"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Image */}
          <div className="hero-portrait order-1 lg:order-2 flex justify-center lg:justify-end">
            <ProfileCard />
          </div>
          
        </div>

        {/* Skills Section - Tags */}
        <div className="mt-24 pt-8 border-t border-[#1f233a]/50">
          <p className="text-xs font-mono text-center tracking-widest text-[#7b68be] uppercase mb-8">
            // Core Technical Stack
          </p>
          <div className="w-full overflow-hidden relative">
            {/* Soft fade gradients on edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0c16] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0c16] to-transparent z-10 pointer-events-none" />
            
            <div className="flex animate-marquee whitespace-nowrap">
              {[...skills, ...skills].map((skill, idx) => (
                <div key={idx} className="inline-block px-8 py-3 mx-2 bg-[#121424] border border-[#232946] rounded-xl shadow-md">
                  <span className="text-xs font-mono font-bold tracking-wider text-[#8f9bb3] hover:text-[#00d9ff] transition-colors select-none">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <a
            href="#about"
            className="flex flex-col items-center gap-1.5 text-[#5e6988] hover:text-[#00d9ff] transition-colors group font-mono text-[10px] tracking-widest"
          >
            <span>SCROLL_DOWN</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#00d9ff]" />
          </a>
        </div>
      </div>
    </section>
  );
};
