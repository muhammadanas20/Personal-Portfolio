import React, { useEffect, useRef, useState } from "react";
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
  const [terminalHistory, setTerminalHistory] = useState([
    { type: "system", text: "SYSTEM DIAGNOSTICS: ONLINE" },
    { type: "system", text: "Type a command or click options below." },
  ]);
  const [terminalInput, setTerminalInput] = useState("");

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    runCommand(terminalInput);
    setTerminalInput("");
  };

  const runCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    let response = "";
    
    if (trimmed === "help") {
      response = "Available calls: ml_status | core_stack | ping | clear";
    } else if (trimmed === "ml_status") {
      response = "Neural Pipeline: 2nd Year FAST CS. Active automations: 4. RAG latency: 24ms. Vibe: Focused.";
    } else if (trimmed === "core_stack") {
      response = "Loaded: [React, Node.js, Python, OpenCV, LangChain, vector-DBs]";
    } else if (trimmed === "ping") {
      response = "Pong! Core latency: 12ms. Core status: STABLE.";
    } else if (trimmed === "clear") {
      setTerminalHistory([]);
      return;
    } else {
      response = `Command not recognized: '${cmd}'. Type 'help' for options.`;
    }

    setTerminalHistory((prev) => [
      ...prev,
      { type: "input", text: `anas_bot // ${cmd}` },
      { type: "output", text: response }
    ]);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animations - using fromTo to avoid StrictMode double-run opacity bugs
      gsap.fromTo(".hero-title", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", stagger: 0.15 }
      );

      gsap.fromTo(".hero-desc", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4 }
      );

      gsap.fromTo(".hero-cta", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.6 }
      );

      gsap.fromTo(".hero-social", 
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)", delay: 0.8, stagger: 0.1 }
      );

      gsap.fromTo(".hero-portrait", 
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.4, ease: "elastic.out(1, 0.8)", delay: 0.5 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="hero-section relative min-h-screen flex items-center overflow-hidden bg-[#0a0c16] pt-12 sm:pt-16 pb-20 sm:pb-24">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#16192b_1px,transparent_1px),linear-gradient(to_bottom,#16192b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0a0c16_100%)] pointer-events-none" />
      
      {/* Ambient glowing pools */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#9d4edd]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00d9ff]/5 rounded-full blur-[100px] pointer-events-none" />
 
      {/* Content */}
      <div className="container mx-auto px-6 py-6 sm:py-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start pt-4">
          
          {/* Left Column */}
          <div className="space-y-5 lg:space-y-6 order-2 lg:order-1">
            <div className="space-y-3">
              <span className="hero-title inline-block px-3 py-1 text-xs font-mono tracking-widest text-[#00d9ff] uppercase bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-md">
                DEVELOPER_PORTFOLIO //
              </span>
              
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-none tracking-tight text-white">
                MUHAMMAD <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d4edd] to-[#00d9ff] drop-shadow-[0_0_15px_rgba(157,78,221,0.3)]">
                  ANAS
                </span>
              </h1>
              
              <p className="hero-desc text-sm sm:text-base text-[#8f9bb3] max-w-md leading-relaxed font-sans">
                Second-year Computer Science student at FAST NUCES. Bridging full-stack web development with AI, Machine Learning, and intelligent automation. I design and build highly interactive, responsive, and tactile systems.
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

            {/* Interactive CLI Terminal Panel */}
            <div className="hero-cta skeuo-panel p-4 border border-[#2e344e] w-full max-w-lg mt-4 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-[#2e344e] pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] animate-pulse shadow-[0_0_6px_#00d9ff]" />
                  <span className="text-[9px] font-mono tracking-widest text-[#00d9ff] font-bold">
                    INTELLIGENT_COMMAND_CLI //
                  </span>
                </div>
                <span className="text-[8px] font-mono text-[#7b68be]">v1.0.2</span>
              </div>

              {/* CRT Scanlines Display screen */}
              <div className="relative h-24 overflow-y-auto overflow-x-hidden bg-[#03050a] border border-[#1b1f32] rounded-md p-3 font-mono text-[10px] text-[#00d9ff] shadow-[inset_0_0_10px_rgba(0,0,0,0.85)] leading-normal space-y-1 break-all">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)] z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] z-10 pointer-events-none" />
                
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className={line.type === "system" ? "text-[#7b68be]" : line.type === "input" ? "text-white" : "text-[#00d9ff]"}>
                    {line.text}
                  </div>
                ))}
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 mt-3 text-[9px] font-mono">
                {["help", "ml_status", "core_stack", "ping", "clear"].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => runCommand(cmd)}
                    className="px-2 py-1 bg-[#121424] border border-[#232946] rounded text-[#8f9bb3] hover:text-[#00d9ff] hover:border-[#00d9ff] transition-colors cursor-pointer"
                  >
                    .{cmd}()
                  </button>
                ))}
              </div>

              {/* Text Input form */}
              <form onSubmit={handleCommandSubmit} className="mt-3 flex gap-2">
                <span className="text-white font-mono text-xs flex items-center">&gt;</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type command here..."
                  className="flex-grow bg-[#0c0d18] border border-[#20253d] rounded-md px-2.5 py-1 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#00d9ff] shadow-inner"
                />
              </form>
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
                    href: "https://www.instagram.com/_m._.anas_/",
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
          <div className="hero-portrait order-1 lg:order-2 flex justify-center lg:justify-end lg:pt-4">
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
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <a
          href="#about"
          className="flex flex-col items-center gap-1.5 text-[#5e6988] hover:text-[#00d9ff] transition-colors group font-mono text-[10px] tracking-widest"
        >
          <span>SCROLL_DOWN</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#00d9ff]" />
        </a>
      </div>
    </section>
  );
};

