import React, { useState } from "react";
import { TiltedCard } from "./tilted-card";

export const ProfileCard = () => {
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [isFilterOn, setIsFilterOn] = useState(false);

  return (
    <TiltedCard className="w-full max-w-[310px] sm:max-w-[360px] lg:max-w-[380px] xl:max-w-[420px] mx-auto">
      {/* Outer physical console chassis */}
      <div className="relative p-6 bg-gradient-to-br from-[#24293f] to-[#121422] rounded-3xl border border-[#3b4260] shadow-2xl">
        {/* Beveled Top Inset */}
        <div className="absolute inset-x-6 top-1.5 h-[1.5px] bg-white/10 rounded-full" />
        
        {/* Metal corner screws */}
        <div className="absolute top-3 left-3"><div className="screw-head" /></div>
        <div className="absolute top-3 right-3"><div className="screw-head" /></div>
        <div className="absolute bottom-3 left-3"><div className="screw-head" /></div>
        <div className="absolute bottom-3 right-3"><div className="screw-head" /></div>

        {/* Display screen bezel */}
        <div className="relative p-4 rounded-2xl bg-gradient-to-b from-[#090b12] to-[#151829] border border-[#1b1f36] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)]">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-3 px-1 text-[10px] font-mono tracking-widest text-[#7b68be]">
            <div className="flex items-center gap-2">
              <span className={`led-indicator led-cyan ${isPoweredOn ? "active" : ""}`} />
              <span>SYS_STATUS: {isPoweredOn ? "ONLINE" : "OFFLINE"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`led-indicator led-purple ${isPoweredOn && isFilterOn ? "active" : ""}`} />
              <span>FX: {isFilterOn ? "RETRO" : "RAW"}</span>
            </div>
          </div>

          {/* CRT Screen window */}
          <div className="relative aspect-square rounded-xl bg-[#060810] overflow-hidden border-2 border-[#161a2c] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] group">
            {/* Screen overlay lines */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)] z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] z-10 pointer-events-none" />

            {/* Profile Image */}
            <img
              src="/profile.png"
              alt="Muhammad Anas"
              className={`w-full h-full object-cover transition-all duration-500 select-none ${
                isPoweredOn 
                  ? isFilterOn 
                    ? "brightness-[0.9] contrast-[1.1] saturate-[1.2] hue-rotate-15 filter sepia-[0.25]" 
                    : "brightness-[1.0] contrast-[1.0]"
                  : "opacity-5 brightness-0"
              }`}
            />

            {/* Glass reflection overlay */}
            <div className="glare-overlay" />
            
            {/* Static scan glow when power on */}
            {isPoweredOn && (
              <div className="absolute inset-0 bg-[#9d4edd]/5 mix-blend-color-dodge animate-pulse z-10 pointer-events-none" />
            )}
          </div>
        </div>

        {/* Console Controls panel */}
        <div className="mt-5 flex items-center justify-between px-2 py-3 bg-[#0d0f1a] rounded-xl border border-[#1b1f32] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono font-bold text-[#7b68be] tracking-wider">UNIT: PORTRAIT_MDL</span>
            <span className="text-[8px] font-mono text-[#4e4085]">REV_2.02</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Toggle Filter Lever */}
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-mono text-[#7b68be] mb-1">FILTER</span>
              <button
                type="button"
                onClick={() => isPoweredOn && setIsFilterOn(!isFilterOn)}
                disabled={!isPoweredOn}
                className={`w-8 h-4 rounded-full p-[2px] transition-colors duration-200 focus:outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] ${
                  !isPoweredOn ? "bg-[#181a28] cursor-not-allowed" : isFilterOn ? "bg-[#9d4edd]" : "bg-[#25283c]"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 shadow-md ${
                    isFilterOn ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Power Toggle Button */}
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-mono text-[#7b68be] mb-1">POWER</span>
              <button
                type="button"
                onClick={() => {
                  setIsPoweredOn(!isPoweredOn);
                  if (isPoweredOn) setIsFilterOn(false);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-150 ${
                  isPoweredOn
                    ? "bg-gradient-to-b from-[#2e624c] to-[#123625] border-[#4e9f7b] text-[#86f0bd] shadow-[0_2px_4px_rgba(0,0,0,0.3)] active:translate-y-[1px] active:shadow-inner"
                    : "bg-gradient-to-b from-[#3a1d1d] to-[#200d0d] border-[#6b2525] text-[#b85454] shadow-[0_2px_4px_rgba(0,0,0,0.3)] active:translate-y-[1px] active:shadow-inner"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </TiltedCard>
  );
};
