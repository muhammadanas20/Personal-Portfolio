import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Shield, Cpu, Play } from "lucide-react";

export const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const consoleRef = useRef(null);

  const logEvents = [
    { threshold: 2, text: "SYSBOOT: Initializing Muhammad Anas core protocols..." },
    { threshold: 12, text: "SYSBOOT: Loading Tailwind components..." },
    { threshold: 22, text: "SYSBOOT: Compiling Three.js 3D rendering pipeline..." },
    { threshold: 32, text: "DECRYPT: Accessing secure database nodes..." },
    { threshold: 45, text: "DECRYPT: Project repositories decrypted successfully." },
    { threshold: 58, text: "COMPILE: Bundling styling variables and components..." },
    { threshold: 72, text: "COMPILE: Resolving layout assets and widgets..." },
    { threshold: 85, text: "OPTIMIZE: Adjusting memory allocations and frames..." },
    { threshold: 95, text: "READY: All system elements are fully operational." },
    { threshold: 100, text: "SUCCESS: Boot sequence complete. Redirecting..." }
  ];

  // Auto-scroll logs container only (prevents full window scrolling)
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Fast start, slight slow down near end
      const step = currentProgress < 30 ? 2.5 : currentProgress < 75 ? 1.8 : 1.2;
      currentProgress = Math.min(100, currentProgress + step);
      setProgress(Math.floor(currentProgress));

      // Trigger logs
      logEvents.forEach((event) => {
        if (currentProgress >= event.threshold) {
          setLogs((prev) => {
            if (!prev.includes(event.text)) {
              return [...prev, event.text];
            }
            return prev;
          });
        }
      });

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Determine current loader style class and title
  let loaderClass = "loader-scramble-booting";
  let phaseIcon = <Terminal className="w-5 h-5 text-cyan-400 animate-pulse" />;
  
  if (progress > 25 && progress <= 50) {
    loaderClass = "loader-scramble-decrypting";
    phaseIcon = <Shield className="w-5 h-5 text-purple-400 animate-pulse" />;
  } else if (progress > 50 && progress <= 75) {
    loaderClass = "loader-scramble-compiling";
    phaseIcon = <Cpu className="w-5 h-5 text-green-400 animate-pulse" />;
  } else if (progress > 75) {
    loaderClass = "loader-scramble-launching";
    phaseIcon = <Play className="w-5 h-5 text-orange-400 animate-pulse" />;
  }

  // Draw ASCII style terminal progress bar
  const totalBlocks = 20;
  const filledBlocks = Math.round((progress / 100) * totalBlocks);
  const progressBarText = 
    "[" + 
    "█".repeat(filledBlocks) + 
    "░".repeat(totalBlocks - filledBlocks) + 
    `] ${progress}%`;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: "easeInOut" } }}
      className="fixed inset-0 z-[99999] bg-[#05070f] flex items-center justify-center p-4 crt-screen crt-flicker scanline-move"
    >
      {/* Outer Console Shell */}
      <div className="w-full max-w-2xl bg-[#090d16] border-2 border-[#1e2d4a] rounded-lg shadow-2xl overflow-hidden flex flex-col skeuo-panel-glow">
        
        {/* Terminal Title Bar */}
        <div className="flex justify-between items-center bg-[#101726] px-4 py-2.5 border-b border-[#1e2d4a]">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            <span className="text-xs font-mono text-gray-400 ml-2">Console@anas-portfolio: ~</span>
          </div>
          <div className="text-[10px] font-mono text-[#00d9ff]/70 tracking-widest uppercase">
            System Boot v1.2.0
          </div>
        </div>

        {/* Console Screen */}
        <div 
          ref={consoleRef}
          className="p-5 font-mono text-sm h-64 overflow-y-auto bg-[#05070c] border border-inner border-[#141b2d] m-3 rounded flex flex-col space-y-1.5 scrollbar-none"
        >
          <div className="text-gray-500 text-xs border-b border-gray-800/50 pb-2 mb-2">
            MUHAMMAD ANAS SECURE WORKSPACE TERMINAL<br/>
            DATE: {new Date().toLocaleDateString()}<br/>
            STATUS: SECURE BOOT ENABLED
          </div>
          
          {logs.map((log, index) => (
            <div key={index} className="text-left leading-relaxed">
              <span className="text-[#00d9ff]/70">{">"}</span>{" "}
              <span className={log.startsWith("SUCCESS") ? "text-green-400" : log.startsWith("DECRYPT") ? "text-purple-400" : log.startsWith("COMPILE") ? "text-yellow-400" : "text-gray-300"}>
                {log}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Panel (Loader & Progress) */}
        <div className="px-6 py-4 bg-[#0a0f1c] border-t border-[#1e2d4a] flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Scramble Loader and Phase Indicator */}
          <div className="flex items-center space-x-3 bg-[#0d1527] px-4 py-2 border border-[#1b2a47] rounded-md min-w-[220px]">
            {phaseIcon}
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Current Phase</span>
              <div className={loaderClass}></div>
            </div>
          </div>

          {/* Progress Bar & Details */}
          <div className="flex-1 w-full flex flex-col items-center md:items-end justify-center">
            <span className="text-xs font-mono text-gray-400 mb-1 block">
              Booting system components...
            </span>
            <span className="text-xs font-mono text-[#00d9ff] font-bold block mb-1">
              {progressBarText}
            </span>
            <div className="w-full bg-[#05080f] rounded-full h-2.5 overflow-hidden border border-[#1d2b45]">
              <motion.div
                className="bg-gradient-to-r from-[#9d4edd] to-[#00d9ff] h-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </div>

        {/* Skip button at very bottom */}
        <div className="pb-4 px-6 flex justify-center">
          <button
            onClick={onComplete}
            className="tactile-button-3d text-xs font-mono py-1.5 px-4 text-gray-300 hover:text-white flex items-center space-x-1.5"
          >
            <span>Skip System Boot</span>
            <span className="text-[10px] text-[#00d9ff]/80">➔</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
