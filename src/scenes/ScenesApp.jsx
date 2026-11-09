import { useEffect, useState } from "react";
import "./scenes.css";
import { AgentCursors } from "./agents";
import { Chrome } from "./chrome";
import { About, Hero, Skills } from "./part-one";
import { Statement, Track, Works } from "./part-two";
import { Connect, DeepDive, Footer, Life } from "./part-three";
import { Marquee } from "./shared";
import { MARQUEE_A, MARQUEE_B } from "./data";

/**
 * The scene portfolio: nine numbered chapters on one continuous surface,
 * with fixed instrumentation and three agent cursors.
 */
const ScenesApp = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    document.body.classList.add("zll-body");

    const meta = document.querySelector('meta[name="theme-color"]');
    const previous = meta?.getAttribute("content");
    meta?.setAttribute("content", "#0a0a0a");

    const sections = Array.from(document.querySelectorAll("[data-scene]"));
    let raf = 0;

    const paint = () => {
      raf = 0;
      const line = window.innerHeight * 0.42;
      let next = 0;
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
        if (top <= line) next = Number(section.dataset.scene) || 0;
      });
      setActive((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.body.classList.remove("zll-body");
      if (meta && previous) meta.setAttribute("content", previous);
    };
  }, []);

  return (
    <div className="zll">
      <a className="zll-skip zll-mono zll-mono--xs" href="#main">
        SKIP TO CONTENT
      </a>
      <AgentCursors />
      <Chrome active={active} />

      <main id="main">
        <Hero />
        <Marquee items={MARQUEE_A} />
        <About />
        <Skills />
        <Works />
        <Statement />
        <Track />
        <Life />
        <Marquee items={MARQUEE_B} speed={52} />
        <DeepDive />
        <Connect />
      </main>

      <Footer />
    </div>
  );
};

export default ScenesApp;
