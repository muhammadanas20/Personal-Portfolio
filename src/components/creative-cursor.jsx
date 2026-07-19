import { useEffect, useRef, useState } from "react";

export const CreativeCursor = () => {
  const cursorRef = useRef(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverType, setHoverType] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [isTouch, setIsTouch] = useState(true); // Default to true (hidden) until mouse/pointer activity is detected

  // Position tracker
  const mouse = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e) => {
      // Disable custom cursor for touch inputs
      if (e.pointerType === "touch") {
        setIsTouch(true);
        document.body.classList.remove("custom-cursor-active");
        return;
      }

      // Enable custom cursor for mouse or stylus
      setIsTouch(false);
      document.body.classList.add("custom-cursor-active");

      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handlePointerDown = (e) => {
      if (e.pointerType === "touch") return;
      setIsClicked(true);
    };

    const handlePointerUp = () => {
      setIsClicked(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Use PointerEvents to support hybrid desktop/touch environments
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    let animationFrameId;
    // Fast lerp speed (0.6) for snappy, lightweight response
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    const updatePosition = () => {
      cursorPos.current.x = lerp(cursorPos.current.x, mouse.current.x, 0.6);
      cursorPos.current.y = lerp(cursorPos.current.y, mouse.current.y, 0.6);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    // Initialize positions to avoid jumping from top-left (0,0)
    const initPositions = (e) => {
      if (e.pointerType === "touch") return;
      cursorPos.current.x = e.clientX;
      cursorPos.current.y = e.clientY;
      window.removeEventListener("pointermove", initPositions);
    };
    window.addEventListener("pointermove", initPositions);

    updatePosition();

    // Hover event listeners
    const handleElementMouseEnter = (e) => {
      setIsHovered(true);
      const target = e.currentTarget;
      if (
        target.classList.contains("tactile-button-3d") || 
        target.tagName === "BUTTON" || 
        target.getAttribute("role") === "button"
      ) {
        setHoverType("button");
      } else if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
        setHoverType("input");
      } else {
        setHoverType("link");
      }
    };

    const handleElementMouseLeave = () => {
      setIsHovered(false);
      setHoverType("");
    };

    const attachHoverListeners = () => {
      const clickables = document.querySelectorAll(
        "a, button, [role='button'], input, select, textarea, .tactile-button-3d, .cursor-pointer, [data-cursor-hover]"
      );
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", handleElementMouseEnter);
        el.addEventListener("mouseleave", handleElementMouseLeave);
      });
    };

    attachHoverListeners();

    // MutationObserver handles binding newly rendered DOM elements
    const observer = new MutationObserver(() => attachHoverListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointermove", initPositions);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      document.body.classList.remove("custom-cursor-active");
      
      const clickables = document.querySelectorAll(
        "a, button, [role='button'], input, select, textarea, .tactile-button-3d, .cursor-pointer, [data-cursor-hover]"
      );
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementMouseEnter);
        el.removeEventListener("mouseleave", handleElementMouseLeave);
      });
    };
  }, [isVisible]);

  if (isTouch) return null;

  // Offsets for ticks to slide outward dynamically on hover
  // Normal state: 6px
  // Hover states: 14px (button/tactile-control) or 10px (normal links)
  // Click state: 2px (tight contraction)
  let tickOffset = 6;
  if (isClicked) {
    tickOffset = 2;
  } else if (isHovered) {
    tickOffset = hoverType === "button" ? 14 : 10;
  }

  // Aesthetic values matching the cyberpunk color themes
  const tickColor = isHovered 
    ? hoverType === "button" 
      ? "bg-[#9d4edd]" 
      : "bg-[#00d9ff]" 
    : "bg-[#00d9ff]";

  const glowShadow = isHovered
    ? hoverType === "button"
      ? "shadow-[0_0_8px_#9d4edd]"
      : "shadow-[0_0_6px_#00d9ff]"
    : "shadow-[0_0_6px_#00d9ff]";

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: "translate3d(-100px, -100px, 0)",
        width: "60px",
        height: "60px",
      }}
    >
      {/* 1. Center Dot/Reticle Core (Becomes a vertical cursor bar on text inputs) */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${tickColor} ${glowShadow} ${
          isClicked ? "scale-50" : "scale-100"
        }`} 
        style={{
          width: hoverType === "input" ? "2px" : "4px",
          height: hoverType === "input" ? "14px" : "4px",
          borderRadius: hoverType === "input" ? "1px" : "50%",
        }}
      />

      {/* 2. Four Crosshair Ticks (hidden during text input hovers) */}
      {hoverType !== "input" && (
        <>
          {/* Top Tick */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-[1px] h-[5px] transition-all duration-300 ${tickColor} ${glowShadow}`}
            style={{
              top: `calc(50% - ${tickOffset}px - 5px)`,
            }}
          />
          {/* Bottom Tick */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-[1px] h-[5px] transition-all duration-300 ${tickColor} ${glowShadow}`}
            style={{
              bottom: `calc(50% - ${tickOffset}px - 5px)`,
            }}
          />
          {/* Left Tick */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 h-[1px] w-[5px] transition-all duration-300 ${tickColor} ${glowShadow}`}
            style={{
              left: `calc(50% - ${tickOffset}px - 5px)`,
            }}
          />
          {/* Right Tick */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 h-[1px] w-[5px] transition-all duration-300 ${tickColor} ${glowShadow}`}
            style={{
              right: `calc(50% - ${tickOffset}px - 5px)`,
            }}
          />
        </>
      )}

      {/* 3. Outer Rotating Scanner Circle (Fades in on hover) */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transition-all duration-300 ease-out ${
          isHovered
            ? hoverType === "button"
              ? "w-[44px] h-[44px] border-[#00d9ff] opacity-100 scale-100 animate-[spin_10s_linear_infinite] bg-[#00d9ff]/5"
              : "w-[36px] h-[36px] border-[#9d4edd] opacity-80 scale-100 animate-[spin_15s_linear_infinite]"
            : "w-[20px] h-[20px] border-transparent opacity-0 scale-50"
        } ${isClicked ? "scale-75 border-solid border-[#00d9ff]" : ""}`}
      />
      
      {/* 4. Sub-circle for Target-Lock (Visible on button hover) */}
      {isHovered && hoverType === "button" && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dotted border-[#9d4edd] w-[32px] h-[32px] animate-[spin_6s_linear_infinite_reverse]"
        />
      )}
    </div>
  );
};
