import React, { useEffect } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { Button } from "@/components/button";
import { TiltedCard } from "@/components/tilted-card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = [
  {
    title: "Election System",
    description:
      "A robust digital voting simulation designed to manage the entire election process securely. It features a comprehensive admin panel for candidate management, a secure voter authentication system, and automated vote counting using persistent file handling to ensure data integrity.",
    image: "/projects/project1.gif",
    tags: ["C", "File I/O", "Logic Building"],
    link: "https://github.com/muhammadanas20/pf-project-election-system",
    github: "https://github.com/muhammadanas20/pf-project-election-system",
    color: "#9d4edd",
  },
  {
    title: "GitHub Profile Finder",
    description:
      "An interactive web application that allows users to search for any GitHub developer and instantly view their profile stats. It integrates with the public GitHub API to fetch real-time data—including repositories, followers, and bio information—presented in a clean, responsive interface.",
    image: "/projects/project2.png",
    tags: ["JavaScript", "HTML/CSS", "API Integration"],
    link: "https://muhammadanas20.github.io/GITHUB-Profile-Finder/",
    github: "https://github.com/muhammadanas20/GITHUB-Profile-Finder",
    color: "#00d9ff",
  },
];

export const Projects = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.from(".projects-header", {
        scrollTrigger: {
          trigger: ".projects-section",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".project-card-wrapper", {
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 80%",
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
    <section id="projects" className="projects-section py-32 relative overflow-hidden bg-[#0a0c16]">
      {/* Background glow and details */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0a0c16_100%)] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#00d9ff]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="projects-header text-center mx-auto max-w-3xl mb-20">
          <span className="text-[#00d9ff] text-xs font-mono tracking-widest uppercase bg-[#00d9ff]/10 border border-[#00d9ff]/30 px-3 py-1 rounded-md">
            MY_WORKS //
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 text-white">
            Projects that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d4edd] to-[#00d9ff]">
              make an impact.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#8f9bb3] leading-relaxed">
            A selection of my recent academic projects, ranging from low-level logic structures to frontend web applications integrated with live public APIs.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid grid md:grid-cols-2 gap-10">
          {projects.map((project, idx) => (
            <TiltedCard key={idx} className="project-card-wrapper w-full h-full">
              {/* Outer Skeuomorphic Panel */}
              <div className="skeuo-panel border border-[#2e344e] flex flex-col h-full group">
                
                {/* Physical Screws on top corner */}
                <div className="absolute top-3 left-3"><div className="screw-head" /></div>
                <div className="absolute top-3 right-3"><div className="screw-head" /></div>

                {/* Beveled Image Window */}
                <div className="relative mx-5 mt-8 mb-5 overflow-hidden aspect-video rounded-xl bg-[#060810] border-2 border-[#161a2c] shadow-[inset_0_0_12px_rgba(0,0,0,0.9)]">
                  {/* CRT Glass reflection */}
                  <div className="glare-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
                  
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Live Status LED */}
                  <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md border border-white/5">
                    <span className={`led-indicator active ${project.color === "#9d4edd" ? "led-purple" : "led-cyan"}`} />
                    <span className="text-[8px] font-mono text-white tracking-widest uppercase">ACTIVE</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-6 pb-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#00d9ff] transition-colors duration-200">
                        {project.title}
                      </h3>
                      
                      <div className="flex items-center gap-2">
                        {/* Interactive tactile project links */}
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-lg bg-[#0c0d18] border border-[#20253d] flex items-center justify-center text-[#8f9bb3] hover:text-white hover:border-[#9d4edd] shadow-inner transition-all active:translate-y-[2px]"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-lg bg-[#0c0d18] border border-[#20253d] flex items-center justify-center text-[#8f9bb3] hover:text-white hover:border-[#00d9ff] shadow-inner transition-all active:translate-y-[2px]"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#8f9bb3] leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tactile plastic labels/tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="px-3 py-1 bg-[#121424] border border-[#232946] rounded-md text-[10px] font-mono font-bold text-[#7b68be] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_1px_2px_rgba(0,0,0,0.3)] hover:text-[#00d9ff] transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Corner screws bottom */}
                <div className="absolute bottom-2 left-3"><div className="screw-head" /></div>
                <div className="absolute bottom-2 right-3"><div className="screw-head" /></div>
              </div>
            </TiltedCard>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16">
          <Button size="lg" href="#projects">
            <span>View All Projects</span>
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </section>
  );
};