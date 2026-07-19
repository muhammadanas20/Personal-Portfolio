import React, { useEffect, useState } from "react";
import { Code2, Lightbulb, Rocket, Users, Brain } from "lucide-react";
import { TiltedCard } from "@/components/tilted-card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const highlights = [
  {
    icon: Brain,
    title: "AI & ML Integration",
    description:
      "Integrating intelligent LLM pipelines, RAG, and automation agents into applications.",
    color: "#00d9ff",
  },
  {
    icon: Code2,
    title: "Full-Stack Dev",
    description:
      "Building modern responsive frontends coupled with scalable backend APIs.",
    color: "#9d4edd",
  },
  {
    icon: Rocket,
    title: "Performance",
    description:
      "Optimizing database queries and model latency for lightning-fast speeds.",
    color: "#00d9ff",
  },
  {
    icon: Lightbulb,
    title: "Tactile Interfaces",
    description:
      "Designing creative, physics-based, and highly interactive user experiences.",
    color: "#9d4edd",
  },
];

export const About = () => {
  const [pipelineActive, setPipelineActive] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState([
    { label: "1. KNOWLEDGE_INGEST (RAG)", status: "WAITING", led: "" },
    { label: "2. VECTOR_INDEXING (LangChain)", status: "WAITING", led: "" },
    { label: "3. MODEL_ALIGNMENT (OpenCV)", status: "WAITING", led: "" },
    { label: "4. AGENTIC_EXECUTION", status: "WAITING", led: "" },
  ]);

  const runPipelineDemo = () => {
    if (pipelineActive) return;
    setPipelineActive(true);
    
    setPipelineSteps([
      { label: "1. KNOWLEDGE_INGEST (RAG)", status: "PENDING", led: "active led-orange" },
      { label: "2. VECTOR_INDEXING (LangChain)", status: "WAITING", led: "" },
      { label: "3. MODEL_ALIGNMENT (OpenCV)", status: "WAITING", led: "" },
      { label: "4. AGENTIC_EXECUTION", status: "WAITING", led: "" },
    ]);

    setTimeout(() => {
      setPipelineSteps(prev => [
        { ...prev[0], status: "SUCCESS", led: "active led-green" },
        { ...prev[1], status: "PENDING", led: "active led-orange" },
        prev[2],
        prev[3]
      ]);
    }, 1000);

    setTimeout(() => {
      setPipelineSteps(prev => [
        prev[0],
        { ...prev[1], status: "SUCCESS", led: "active led-green" },
        { ...prev[2], status: "PENDING", led: "active led-orange" },
        prev[3]
      ]);
    }, 2000);

    setTimeout(() => {
      setPipelineSteps(prev => [
        prev[0],
        prev[1],
        { ...prev[2], status: "SUCCESS", led: "active led-green" },
        { ...prev[3], status: "PENDING", led: "active led-orange" }
      ]);
    }, 3000);

    setTimeout(() => {
      setPipelineSteps(prev => [
        prev[0],
        prev[1],
        prev[2],
        { ...prev[3], status: "COMPLETE", led: "active led-green" }
      ]);
      setPipelineActive(false);
    }, 4200);
  };

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
    <section id="about" className="about-section py-20 md:py-24 relative overflow-hidden bg-[#070911]">
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
                Designing systems <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d4edd] to-[#00d9ff]">
                  that think and adapt.
                </span>
              </h2>
            </div>

            <div className="about-text-container space-y-5 text-[#8f9bb3] text-sm sm:text-base leading-relaxed">
              <p className="about-para">
                I am a second-year Computer Science student at FAST NUCES, working at the intersection of full-stack web development, AI, and Machine Learning. I specialize in building intelligent automations and interactive digital solutions that bridge logic, data, and user experience.
              </p>
              <p className="about-para">
                My current stack includes React, Node.js, Python, and LangChain. I'm actively developing RAG (Retrieval-Augmented Generation) applications, conversational AI agents, and custom classroom automations, focusing on robust backend pipelines coupled with sleek, responsive interfaces.
              </p>
              <p className="about-para">
                When I'm not coding, you'll find me sharpening my algorithmic skills on LeetCode, exploring modern AI agent frameworks, or designing tactile console interfaces.
              </p>
            </div>

            {/* Interactive Automation Pipeline Panel */}
            <div className="about-para skeuo-panel p-5 border border-[#2e344e] space-y-4">
              <div className="flex items-center justify-between border-b border-[#2e344e] pb-2">
                <span className="text-[10px] font-mono tracking-widest text-[#00d9ff] font-bold">
                  AI_PIPELINE_INGESTER //
                </span>
                <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-0.5 rounded border border-[#1b1f32] text-[8px] font-mono text-white/80">
                  <span className={`w-1.5 h-1.5 rounded-full led-indicator ${pipelineActive ? "active led-orange" : "active led-green"}`} />
                  {pipelineActive ? "PROCESSING" : "STANDBY"}
                </span>
              </div>
              
              <div className="space-y-2.5 font-mono text-[10px]">
                {pipelineSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-[#8f9bb3]">{step.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{step.status}</span>
                      <span className={`w-2 h-2 rounded-full border border-black/40 led-indicator ${step.led}`} />
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={runPipelineDemo}
                disabled={pipelineActive}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-white tactile-button-3d cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pipelineActive ? "Running Diagnostics..." : "Run AI Pipeline Demo"}
              </button>
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