import React, { useEffect } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { Button } from "@/components/button";
import { TiltedCard } from "@/components/tilted-card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = [
  {
    title: "PF - Election Voting System",
    category: "semester",
    description:
      "A robust digital voting simulation designed to manage the entire election process securely. It features a comprehensive admin panel for candidate management, a secure voter authentication system, and automated vote counting using persistent file handling to ensure data integrity.",
    image: "/projects/project1.gif",
    tags: ["C", "File I/O", "Logic Building"],
    link: "https://github.com/muhammadanas20/pf-project-election-system",
    github: "https://github.com/muhammadanas20/pf-project-election-system",
    color: "#9d4edd",
    ledColor: "purple",
  },
  {
    title: "OOP - Military Base Management",
    category: "semester",
    description:
      "A comprehensive Command & Control simulation for military bases implemented in C++ following OOP principles. Manages personnel, logistics, weapons inventory, operations, and generates secure audit logs with custom exception handling.",
    video: "/projects/military_simulation.mp4",
    isVideo: true,
    tags: ["C++", "OOP", "File Handling", "System Design"],
    link: "https://github.com/muhammadanas20/Millitary-Base-Managment-System",
    github: "https://github.com/muhammadanas20/Millitary-Base-Managment-System",
    color: "#e63946",
    ledColor: "red",
  },
  {
    title: "OOP - AI Image Detector Simulation",
    category: "semester",
    description:
      "A C++ menu-driven OOP simulation that flags AI-generated images using five heuristic engines — Metadata, Artifacts, Frequency, Watermark, and Hybrid Deep. Each analyzer returns a score, then the system combines them into an authenticity verdict with a confidence percentage, plus search, filtering, and report export.",
    image: "/projects/ai_image_detector.jpg",
    tags: ["C++", "OOP", "Heuristics", "CLI", "System Design"],
    link: "https://github.com/muhammadanas20/AI-Image-Detector",
    github: "https://github.com/muhammadanas20/AI-Image-Detector",
    color: "#ffd166",
    ledColor: "yellow",
  },
  {
    title: "LuminaDocs AI",
    category: "ai-automation",
    description:
      "A WhatsApp study assistant that turns a /quiz command into a formatted .docx study guide. The Python RAG backend indexes your own course PDFs, slides, and notes with BM25, Groq writes an exam-focused document from only those sources, and the bot sends the file back in chat.",
    image: "/projects/rag_wa_ai.jpg",
    tags: ["Python", "RAG", "WhatsApp", "BM25", "Groq"],
    link: "https://github.com/muhammadanas20/LuminaDocs-AI",
    github: "https://github.com/muhammadanas20/LuminaDocs-AI",
    color: "#00d9ff",
    ledColor: "cyan",
  },
  {
    title: "Quizly Bot",
    category: "ai-automation",
    description:
      "A WhatsApp group bot that triggers only when a message contains the word quiz and an attached image. It downloads the photo, runs Groq Llama Vision, and replies in-chat with step-by-step reasoning first, then numbered answers — with rate limiting so the group is not flooded.",
    image: "/projects/quiz_wa_bot.jpg",
    tags: ["Node.js", "WhatsApp API", "Groq Vision", "AI Reasoning"],
    link: "https://github.com/muhammadanas20/Quizly-Bot",
    github: "https://github.com/muhammadanas20/Quizly-Bot",
    color: "#25d366",
    ledColor: "green",
  },
  {
    title: "SolveSphere AI",
    category: "ai-automation",
    description:
      "A Google Classroom watcher that polls for new assignments and lab tasks, extracts text from attached PDFs, Word files, and Google Docs, solves them with Groq, then emails you a completed PDF and DOCX. Remembers seen tasks so the same work is never solved twice.",
    image: "/projects/gcr_assignment_bot.jpg",
    tags: ["Python", "Classroom API", "Groq", "Gmail API", "Automation"],
    link: "https://github.com/muhammadanas20/SolveSphere-AI",
    github: "https://github.com/muhammadanas20/SolveSphere-AI",
    color: "#f4a261",
    ledColor: "orange",
  },
];

export const Projects = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [filteredProjects, setFilteredProjects] = React.useState(projects);

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

  const handleCategoryChange = (category) => {
    if (category === selectedCategory) return;
    
    // Fade out current cards
    gsap.to(".project-card-wrapper", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => {
        setSelectedCategory(category);
        const filtered = category === "all" 
          ? projects 
          : projects.filter(p => p.category === category);
        setFilteredProjects(filtered);
        
        // Wait a tiny bit for DOM to update, then animate in
        setTimeout(() => {
          gsap.fromTo(".project-card-wrapper", 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
          );
        }, 30);
      }
    });
  };

  return (
    <section id="projects" className="projects-section py-20 md:py-24 relative overflow-hidden bg-[#0a0c16]">
      {/* Background glow and details */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0a0c16_100%)] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#00d9ff]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="projects-header text-center mx-auto max-w-3xl mb-16">
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
            A selection of my recent works, categorized into semester projects showing core concepts and personal growth in AI automation.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {[
            { id: "all", label: "ALL_PROJECTS" },
            { id: "semester", label: "SEMESTER_PROJECTS" },
            { id: "ai-automation", label: "AI_&_AUTOMATION" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleCategoryChange(tab.id)}
              className={`px-5 py-2.5 rounded-lg border text-xs font-mono font-bold tracking-wider transition-all duration-300 relative overflow-hidden active:translate-y-[2px] ${
                selectedCategory === tab.id
                  ? "bg-[#00d9ff]/10 border-[#00d9ff] text-[#00d9ff] shadow-[0_0_15px_rgba(0,217,255,0.15)]"
                  : "bg-[#0c0d18] border-[#2e344e] text-[#8f9bb3] hover:text-white hover:border-[#9d4edd]/50 hover:bg-[#9d4edd]/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid grid md:grid-cols-2 gap-10">
          {filteredProjects.map((project, idx) => (
            <TiltedCard key={`${selectedCategory}-${idx}`} className="project-card-wrapper w-full h-full">
              {/* Outer Skeuomorphic Panel */}
              <div className="skeuo-panel border border-[#2e344e] flex flex-col h-full group">
                
                {/* Physical Screws on top corner */}
                <div className="absolute top-3 left-3"><div className="screw-head" /></div>
                <div className="absolute top-3 right-3"><div className="screw-head" /></div>

                {/* Beveled Image/Video Window */}
                <div className="relative mx-5 mt-8 mb-5 overflow-hidden aspect-video rounded-xl bg-[#060810] border-2 border-[#161a2c] shadow-[inset_0_0_12px_rgba(0,0,0,0.9)]">
                  {/* CRT Glass reflection */}
                  <div className="glare-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
                  
                  {project.isVideo ? (
                    <video
                      src={project.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      ref={(el) => {
                        if (el) el.playbackRate = 2.0;
                      }}
                    />
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  
                  {/* Live Status LED */}
                  <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md border border-white/5">
                    <span className={`led-indicator active led-${project.ledColor}`} />
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