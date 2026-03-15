import React, { useRef, useEffect, useState } from "react";

export const ParticlePortrait = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const linesRef = useRef([]);
  const themeColorsRef = useRef({
    primary: "#9d4edd",
    highlight: "#00d9ff",
    background: "#0a0e1a",
    surface: "#16213e",
  });
  const imageLoadedRef = useRef(false);
  const startTimeRef = useRef(null);
  const [size, setSize] = useState(480);

  // Responsive sizing matches your Hero layout breakpoints
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width <= 480) setSize(280);
      else if (width <= 768) setSize(340);
      else if (width <= 1024) setSize(400);
      else setSize(480);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;

    const updateThemeColors = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const primary = rootStyles.getPropertyValue("--color-primary").trim();
      const highlight = rootStyles.getPropertyValue("--color-highlight").trim();
      const background = rootStyles.getPropertyValue("--color-background").trim();
      const surface = rootStyles.getPropertyValue("--color-surface").trim();
      themeColorsRef.current = {
        primary: primary || "#9d4edd",
        highlight: highlight || primary || "#00d9ff",
        background: background || "#0a0e1a",
        surface: surface || "#16213e",
      };
    };

    updateThemeColors();
    const themeObserver = new MutationObserver(updateThemeColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    const img = new Image();
    img.src = "/profile.png";

    img.onload = () => {
      const offCtx = document.createElement("canvas").getContext("2d");
      offCtx.canvas.width = size;
      offCtx.canvas.height = size;
      offCtx.drawImage(img, 0, 0, size, size);
      const pixels = offCtx.getImageData(0, 0, size, size).data;

      const lines = [];
      const rowGap = size <= 340 ? 5 : 6;
      const centerX = size / 2;
      const centerY = size / 2;

      for (let y = 0; y < size; y += rowGap) {
        for (let x = 0; x < size; x += 3) {
          const i = (y * size + x) * 4;
          if (pixels[i + 3] > 95) {
            const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 765;
            const length = Math.floor(4 + brightness * (size <= 340 ? 10 : 18));
            const angle = Math.random() * Math.PI * 2;
            const radius = size * 0.65 + Math.random() * size * 0.55;
            lines.push({
              x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 30,
              y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 30,
              targetX: x,
              targetY: y,
              vx: 0, vy: 0,
              length,
              baseAlpha: 0.5 + brightness * 0.5,
              currentAlpha: 0,
              delay: Math.random() * 0.8,
            });
            x += length + 3;
          }
        }
      }
      linesRef.current = lines;
      imageLoadedRef.current = true;
      startTimeRef.current = performance.now();
    };

    img.onerror = () => {
      imageLoadedRef.current = false;
      linesRef.current = [];
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      const bgGradient = ctx.createLinearGradient(0, 0, 0, size);
      bgGradient.addColorStop(0, themeColorsRef.current.surface);
      bgGradient.addColorStop(1, themeColorsRef.current.background);
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, size, size);

      const vignette = ctx.createRadialGradient(
        size * 0.5,
        size * 0.45,
        size * 0.12,
        size * 0.5,
        size * 0.5,
        size * 0.82
      );
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.45)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, size, size);

      if (imageLoadedRef.current && startTimeRef.current !== null) {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;

        linesRef.current.forEach((p) => {
          const pTime = elapsed - p.delay;
          if (pTime < 0) return;
          p.currentAlpha = p.baseAlpha * Math.min(pTime / 1.5, 1);

          if (mouseRef.current.active) {
            const dx = p.x - mouseRef.current.x, dy = p.y - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0 && dist < 70) {
              p.vx += (dx / dist) * (1 - dist / 60) * 2;
              p.vy += (dy / dist) * (1 - dist / 60) * 2;
            }
          }

          p.vx += (p.targetX - p.x) * 0.06; p.vy += (p.targetY - p.y) * 0.06;
          p.vx *= 0.88; p.vy *= 0.88;
          p.x += p.vx; p.y += p.vy;

          ctx.strokeStyle = themeColorsRef.current.primary;
          ctx.globalAlpha = p.currentAlpha;
          ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.length, p.y); ctx.stroke();
          ctx.globalAlpha = 1;
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    let animationFrameId = null;
    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const handleLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseleave", handleLeave);
    draw();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      themeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, [size]);

  return (
    <div
      className="relative z-20 mx-auto w-full rounded-3xl glass-strong glow-border p-3"
      style={{ maxWidth: `${size}px` }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-2xl"
        style={{ cursor: "crosshair" }}
      />
    </div>
  );
};