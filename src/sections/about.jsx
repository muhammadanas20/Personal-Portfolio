import React, { useEffect } from "react";
import { Code2, Lightbulb, Rocket, Users } from "lucide-react";
import { TiltedCard } from "@/components/tilted-card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const highlights = [
  {
    icon: Code2,
    title: "Clean Code",
    description:
      "Writing maintainable, scalable code that stands the test of time.",
    color: "#9d4edd",
  },
  {
    icon: Rocket,
    title: "Performance",
    description:
      "Optimizing for speed and delivering lightning-fast user experiences.",
    color: "#00d9ff",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Working closely with teams to bring ideas to life.",
    color: "#9d4edd",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Staying ahead with the latest technologies and best practices.",
    color: "#00d9ff",
  },
];

export const About = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.from(".about-header", {
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".about-para", {
        scrollTrigger: {
          trigger: ".about-text-container",
          start: "top 85%",
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      gsap.from(".about-card", {
        scrollTrigger: {
          trigger: ".highlights-grid",
          start: "top 90%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.4)",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="about-section py-32 relative overflow-hidden bg-[#070911]">
      {/* Grid lines and background detailing */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#070911_100%)] pointer-events-none" />
      <div className="absolute -top-1/4 right-0 w-[450px] h-[450px] bg-[#9d4edd]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <div className="space-y-8">
            <div className="about-header space-y-3">
              <span className="text-[#00d9ff] text-xs font-mono tracking-widest uppercase bg-[#00d9ff]/10 border border-[#00d9ff]/30 px-3 py-1 rounded-md">
                GET_TO_KNOW_ME //
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
                Crafting web experiences <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d4edd] to-[#00d9ff]">
                  with purpose.
                </span>
              </h2>
            </div>

            <div className="about-text-container space-y-5 text-[#8f9bb3] text-sm sm:text-base leading-relaxed">
              <p className="about-para">
                I’m a passionate Computer Science student at FAST NUCES with a drive for crafting digital products that solve real problems. My journey started with a curiosity for logic and C programming, and it has quickly evolved into a focus on modern web development.
              </p>
              <p className="about-para">
                I specialize in HTML, CSS, JavaScript, and React, building everything from student utility applications to online election systems. My approach combines strong programming fundamentals with a creative eye for design, ensuring the user interface is as sharp as the code behind it.
              </p>
              <p className="about-para">
                When I'm not coding, you'll find me sharpening my problem-solving skills on LeetCode, diving into Object-Oriented Programming, or collaborating with teammates to build impactful projects.
              </p>
            </div>

            {/* Skeuomorphic Quote Panel */}
            <div className="about-para skeuo-inset p-6 border border-[#1b1f32]">
              <p className="text-sm italic font-medium text-white leading-relaxed font-sans">
                "My mission is to create digital experiences that are not just functional, but truly helpful — products that simplify lives and look good doing it."
              </p>
            </div>
          </div>

          {/* Right Column - Highlights */}
          <div className="highlights-grid grid sm:grid-cols-2 gap-6">
            {highlights.map((item, idx) => (
              <TiltedCard key={idx} className="about-card w-full">
                {/* Physical plastic widget shell */}
                <div className="skeuo-panel p-6 border border-[#2e344e] h-full flex flex-col justify-between">
                  {/* Glowing Indicator LED on top right */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <span className={`led-indicator active ${item.color === "#9d4edd" ? "led-purple" : "led-cyan"}`} />
                  </div>

                  <div>
                    {/* Beveled Icon Slot */}
                    <div className="w-12 h-12 rounded-xl bg-[#0c0d18] border border-[#20253d] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center mb-6">
                      <item.icon className="w-5 h-5 text-white" style={{ color: item.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-[#8f9bb3] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Corner screws decorative detailing */}
                  <div className="absolute bottom-2 right-2"><div className="screw-head" /></div>
                </div>
              </TiltedCard>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};