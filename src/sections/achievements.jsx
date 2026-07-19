import React, { useEffect, useState } from "react";
import { Award, Trophy, Calendar, Eye, X, ExternalLink } from "lucide-react";
import { TiltedCard } from "@/components/tilted-card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const achievements = [
  {
    title: "Dean's List of Honors",
    issuer: "National University of Computer & Emerging Sciences",
    date: "Fall 2025",
    description:
      "Inscribed in the Dean's List of Honors in recognition of outstanding academic achievements and GPA excellence during the Fall 2025 semester at FAST-NU.",
    image: "/achievements/deans_list_2025.jpg",
    tags: ["Academic Excellence", "FAST-NU", "GPA Honor"],
    color: "#00d9ff", // cyan
    badgeText: "DEAN'S LIST",
    icon: Award,
  },
  {
    title: "ACM Coders Cup 2025",
    issuer: "ACM NUCES Karachi Chapter",
    date: "Jan 2026",
    description:
      "Successfully navigated the initial rounds to reach the Final Round representing team 'Furious 3' in the ACM Coders Cup 2025, a premier competitive programming event.",
    image: "/achievements/coders_cup_2025.jpg",
    tags: ["Competitive Programming", "C++", "Teamwork"],
    color: "#9d4edd", // purple
    badgeText: "FINALIST",
    icon: Trophy,
  },
  {
    title: "Developers' Day 2026",
    issuer: "ACM NUCES Karachi Chapter",
    date: "May 2026",
    description:
      "Competed in the competitive programming track, solving complex algorithmic problems using C++, Data Structures, and logic optimization under tight time constraints.",
    image: "/achievements/dev_day_2026.png",
    tags: ["Data Structures", "Algorithms", "Problem Solving"],
    color: "#00d9ff", // cyan
    badgeText: "PARTICIPANT",
    icon: Trophy,
  },
];

export const Achievements = () => {
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(".achievements-header", {
        scrollTrigger: {
          trigger: ".achievements-section",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Cards stagger animation
      gsap.from(".achievements-card-wrapper", {
        scrollTrigger: {
          trigger: ".achievements-grid",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="achievements" className="achievements-section py-20 md:py-24 relative overflow-hidden bg-[#070911]">
      {/* Glow backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#070911_100%)] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#9d4edd]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#00d9ff]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="achievements-header text-center mx-auto max-w-3xl mb-20">
          <span className="text-[#00d9ff] text-xs font-mono tracking-widest uppercase bg-[#00d9ff]/10 border border-[#00d9ff]/30 px-3 py-1 rounded-md">
            HALL_OF_FAME //
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 text-white">
            Honors & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d4edd] to-[#00d9ff]">
              Achievements.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#8f9bb3] leading-relaxed">
            Key milestones, competitive programming successes, and academic awards representing dedication, problem-solving, and continuous learning.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="achievements-grid grid md:grid-cols-3 gap-8">
          {achievements.map((ach, idx) => {
            const Icon = ach.icon;
            return (
              <TiltedCard key={idx} className="achievements-card-wrapper w-full h-full">
                <div className="skeuo-panel border border-[#2e344e] flex flex-col h-full group p-6 justify-between relative">
                  
                  {/* Metal screws on top corner */}
                  <div className="absolute top-3 left-3"><div className="screw-head" /></div>
                  <div className="absolute top-3 right-3"><div className="screw-head" /></div>

                  <div className="space-y-6">
                    {/* Header: Icon & LED */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Beveled Icon Slot */}
                      <div className="w-12 h-12 rounded-xl bg-[#0c0d18] border border-[#20253d] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center">
                        <Icon className="w-5 h-5" style={{ color: ach.color }} />
                      </div>
                      
                      {/* Interactive status LED */}
                      <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded-md border border-[#1b1f32]">
                        <span className={`led-indicator active ${ach.color === "#9d4edd" ? "led-purple" : "led-cyan"}`} />
                        <span className="text-[9px] font-mono text-white/80 tracking-wider font-bold">
                          {ach.badgeText}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-[#00d9ff] transition-colors duration-200">
                          {ach.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs text-[#7b68be] font-mono font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{ach.date}</span>
                      </div>

                      <p className="text-xs font-mono text-[#8f9bb3] leading-relaxed border-l-2 border-[#1b1f32] pl-3 py-1">
                        {ach.issuer}
                      </p>

                      <p className="text-xs sm:text-sm text-[#8f9bb3]/90 leading-relaxed pt-2">
                        {ach.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1b1f32]">
                      {ach.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2.5 py-1 bg-[#121424] border border-[#232946] rounded-md text-[9px] font-mono font-bold text-[#8f9bb3] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:text-[#00d9ff] transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Interactive Button */}
                    <button
                      onClick={() => setSelectedCert(ach)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white tactile-button-3d mt-2 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Certificate</span>
                    </button>
                  </div>

                  {/* Corner screws bottom */}
                  <div className="absolute bottom-2 left-3"><div className="screw-head" /></div>
                  <div className="absolute bottom-2 right-3"><div className="screw-head" /></div>
                </div>
              </TiltedCard>
            );
          })}
        </div>
      </div>

      {/* CRT Diagnostic Screen Lightbox Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          {/* Outer Console Shell */}
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col skeuo-panel-glow border border-[#9d4edd]/40 p-5 md:p-6 bg-[#0c0e18] shadow-[0_0_50px_rgba(157,78,221,0.2)] overflow-y-auto">
            
            {/* Console Frame detailing */}
            <div className="absolute top-3 left-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_#ef4444]" />
              <span className="text-[9px] font-mono text-[#9d4edd] tracking-widest font-bold">SYSTEM_PREVIEW_ON_CRT</span>
            </div>

            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-3 right-4 text-[#8f9bb3] hover:text-white transition-colors p-1 bg-[#1a1c2e] hover:bg-[#9d4edd]/20 border border-[#2e344e] rounded-md active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* CRT monitor bezel & inner display screen */}
            <div className="mt-4 skeuo-inset-screen border-4 border-[#1c2035] rounded-xl overflow-hidden aspect-[4/3] md:aspect-video flex items-center justify-center bg-[#03050a] shadow-[inset_0_0_40px_rgba(0,0,0,1)] max-h-[52vh] w-full flex-shrink-0">
              {/* Bezel glare effect */}
              <div className="glare-overlay opacity-50 pointer-events-none" />
              
              {/* Scanlines / CRT details */}
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="max-w-full max-h-full object-contain p-2 md:p-4 z-10 select-none pointer-events-none relative"
              />
            </div>

            {/* CRT Screen Metadata panel footer */}
            <div className="mt-6 border-t border-[#1c2035] pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d9ff] led-indicator active" />
                  {selectedCert.title}
                </h4>
                <p className="text-xs font-mono text-[#8f9bb3] mt-1">{selectedCert.issuer} // {selectedCert.date}</p>
              </div>

              <a
                href={selectedCert.image}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#121424] border border-[#232946] text-xs font-mono font-bold text-[#00d9ff] hover:text-white hover:border-[#00d9ff] rounded-md transition-colors shadow-inner self-stretch md:self-auto text-center justify-center cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Raw Image</span>
              </a>
            </div>

            {/* Screws bottom corners */}
            <div className="absolute bottom-2 left-4"><div className="screw-head" /></div>
            <div className="absolute bottom-2 right-4"><div className="screw-head" /></div>
          </div>
        </div>
      )}
    </section>
  );
};
