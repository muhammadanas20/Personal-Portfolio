import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const education = [
  {
    period: "2025 — Present",
    Degree: "BS Computer Science",
    college: "FAST NUCES",
    description:
      "Undergraduate Computer Science student deeply involved in full-stack development and competitive programming. Learning to build scalable software in a highly competitive academic environment.",
    technologies: ["HTML", "CSS", "JS", "C", "C++", "OOP", "SQL", "LaTeX"],
    current: true,
  },
  {
    period: "2023 — 2025",
    Degree: "Pre-Engineering",
    college: "Bahria College Karsaz",
    description:
      "Built a solid academic foundation in mathematics and logic, graduating with a focus on analytical problem-solving.",
    technologies: ["Calculus", "Analytical Logic", "Physics"],
    current: false,
  },
];

export const Education = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Header entry
      gsap.from(".education-header", {
        scrollTrigger: {
          trigger: ".education-section",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Slider cards slide-in
      gsap.utils.toArray(".education-card-wrapper").forEach((card, idx) => {
        const xVal = idx % 2 === 0 ? -50 : 50;
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          x: xVal,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="education" className="education-section py-20 md:py-24 relative overflow-hidden bg-[#070911]">
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#9d4edd]/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="education-header max-w-3xl mb-24">
          <span className="text-[#00d9ff] text-xs font-mono tracking-widest uppercase bg-[#00d9ff]/10 border border-[#00d9ff]/30 px-3 py-1 rounded-md">
            MY_TRAJECTORY //
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 text-white">
            Education that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d4edd] to-[#00d9ff]">
              builds a foundation.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#8f9bb3] leading-relaxed">
            A timeline of my academic growth, from building discipline and analytical logic at Bahria College to mastering computational structures at FAST NUCES.
          </p>
        </div>

        {/* Timeline Slider Track */}
        <div className="timeline-container relative">
          
          {/* Physical Slot Slider Track */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[8px] bg-[#0c0d18] border border-[#1b1f32] rounded-full md:-translate-x-1/2 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)]">
            {/* Glowing cable inside track */}
            <div className="absolute inset-x-0.5 top-0 bottom-0 bg-gradient-to-b from-[#9d4edd]/80 via-[#00d9ff]/45 to-transparent shadow-[0_0_12px_rgba(157,78,221,0.5)]" />
          </div>

          {/* Experience Items */}
          <div className="space-y-16">
            {education.map((exp, idx) => (
              <div
                key={idx}
                className="relative grid md:grid-cols-2 gap-8 items-center"
              >
                {/* Timeline Slider Peg */}
                <div className="absolute left-[4px] md:left-1/2 top-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-[#2a2d42] to-[#121422] border-2 border-[#414a6e] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center shadow-lg shadow-black/50">
                  {/* Glowing core LED */}
                  <span className={`w-2 h-2 rounded-full led-indicator active ${exp.current ? "led-cyan" : "led-purple"}`} />
                  {exp.current && (
                    <span className="absolute inset-0 rounded-full bg-[#00d9ff] animate-ping opacity-30" />
                  )}
                </div>

                {/* Content Panel Card */}
                <div
                  className={`education-card-wrapper pl-8 md:pl-0 ${
                    idx % 2 === 0
                      ? "md:pr-16 md:text-right"
                      : "md:col-start-2 md:pl-16"
                  }`}
                >
                  {/* Skeuomorphic console panel */}
                  <div className="skeuo-panel p-6 border border-[#2e344e] relative group">
                    {/* Metal corner screws */}
                    <div className="absolute top-2.5 left-2.5"><div className="screw-head" /></div>
                    <div className="absolute top-2.5 right-2.5"><div className="screw-head" /></div>
                    
                    {/* Glass glare effect */}
                    <div className="glare-overlay" />

                    <span className="text-xs font-mono font-bold tracking-widest text-[#00d9ff]">
                      [ {exp.period} ]
                    </span>
                    
                    <h3 className="text-xl font-bold text-white mt-2 group-hover:text-[#9d4edd] transition-colors">
                      {exp.Degree}
                    </h3>
                    
                    <p className="text-sm font-mono text-[#7b68be] font-semibold mt-1">
                      {exp.college}
                    </p>
                    
                    <p className="text-xs sm:text-sm text-[#8f9bb3] mt-4 leading-relaxed">
                      {exp.description}
                    </p>
                    
                    {/* Tags */}
                    <div
                      className={`flex flex-wrap gap-2 mt-5 ${
                        idx % 2 === 0 ? "md:justify-end" : ""
                      }`}
                    >
                      {exp.technologies.map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="px-2.5 py-1 bg-[#090a12] border border-[#1b1f32] text-[10px] font-mono text-[#8f9bb3] rounded-md shadow-inner"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Screws bottom */}
                    <div className="absolute bottom-2 left-2.5"><div className="screw-head" /></div>
                    <div className="absolute bottom-2 right-2.5"><div className="screw-head" /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};