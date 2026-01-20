import { Button } from "@/components/button";
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
  "Competitive pograming",
  "Vercel",
  "Tailwind CSS",
  "Figma",
  "Git",
  "GitHub Actions",
];

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Container */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.png"
          alt="Hero image"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background"></div>
      </div>

      {/* Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-sm rotate-45 animate-pulse opacity-60"
            style={{
              backgroundColor:
                i % 3 === 0 ? "#9d4edd" : i % 3 === 1 ? "#00d9ff" : "#b5a7ff",
              boxShadow: `0 0 10px ${
                i % 3 === 0 ? "#9d4edd" : i % 3 === 1 ? "#00d9ff" : "#b5a7ff"
              }`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `slow-drift ${
                15 + Math.random() * 20
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in animation-delay-100">
              MUHAMMAD <span className="text-primary glow-text">ANAS</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg animate-fade-in animation-delay-200">
              A web developer specializing in React, JavaScript, and Tailwind
              CSS. I build responsive, user-friendly applications like utility
              tools and portfolio finders that solve real-world problems
            </p>

            {/* CTA Button */}
            <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-300">
              <Button
                size="lg"
                href="/cv.png"
                download
                target="_blank"
                rel="noreferrer"
              >
                Download CV <Download className="w-5 h-5" />
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 animate-fade-in animation-delay-400">
              <span className="text-sm text-muted-foreground">Follow me: </span>
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
                  className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  {<social.icon className="w-5 h-5" />}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Profile Image */}
          <div className="animate-fade-in animation-delay-300 flex justify-center lg:justify-end">
            <div className="relative w-[240px] h-[300px] sm:w-[280px] sm:h-[340px] md:w-[320px] md:h-[400px] lg:w-[360px] lg:h-[460px]">
              <div className="relative inset-[-14px] bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 blur-3xl opacity-60 rounded-3xl"></div>
              <div className="relative glass rounded-3xl p-2 glow-border">
                <img
                  src="/profile.png"
                  alt="M.Anas"
                  className="relative w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute bottom-0 left-0 w-full h-[120px] pointer-events-none">
                  <div
                    className="absolute bottom-0 left-[-20%] w-[140%] h-[2px]
    bg-gradient-to-r from-transparent via-purple-500 to-cyan-400
    shadow-[0_0_25px_#a855f7]
    rotate-[-3deg]"
                  ></div>
                </div>

                {/* Stats Badge */}
                <div className="absolute -top-4 -left-4 glass rounded-xl px-4 py-3 animate-float animation-delay-500">
                  <div className="text-2xl font-bold text-primary">AI</div>
                  <div className="text-xs text-muted-foreground">
                    Enthusiast
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section - Tags */}
        <div className="mt-20 animate-fade-in animation-delay-600">
          <p className="text-sm text-muted-foreground mb-12 text-center">
            Technologies I work with
          </p>
          <div className="relative overflow-hidden"></div>
          <div className="flex animate-marquee">
            {[...skills, ...skills].map((skill, idx) => (
              <div key={idx} className="flex-shrink-0 px-8 py-4">
                <span className="text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in animation-delay-800">
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
