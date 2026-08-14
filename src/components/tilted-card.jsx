import React, { useState } from "react";
import { motion as Motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const TiltedCard = ({ children, className = "", style = {} }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the motion using spring physics
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { damping: 25, stiffness: 220 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { damping: 25, stiffness: 220 });

  // Dynamic glare transforms
  const glareX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Normalize coordinates to range [-0.5, 0.5]
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <Motion.div
      className={`relative select-none ${className}`}
      style={{
        ...style,
        transformStyle: "preserve-3d",
        rotateX: rotateX,
        rotateY: rotateY,
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glare effect */}
      <Motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-20 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.12 : 0,
          background: `radial-gradient(circle 250px at ${glareX} ${glareY}, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`,
        }}
      />
      
      {/* Main card content */}
      <div 
        className={`w-full ${className.includes("h-full") ? "h-full" : ""}`}
        style={{ 
          transform: "translateZ(15px)", 
          transformStyle: "preserve-3d",
          width: "100%",
          height: className.includes("h-full") ? "100%" : "auto"
        }}
      >
        {children}
      </div>
    </Motion.div>
  );
};
