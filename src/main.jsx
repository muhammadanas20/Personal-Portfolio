import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/jetbrains-mono";

// Two editions, code-split cleanly:
// - /           -> Swarm Cinema portfolio (zll.me autonomous cursor-swarm + GSAP ScrollTrigger)
// - /atelier    -> Quiet Paper / Atelier editorial edition (also aliased at /paper)
const isAtelier = /^\/(atelier|paper)\/?$/.test(window.location.pathname);
const root = ReactDOM.createRoot(document.getElementById("root"));

if (isAtelier) {
  Promise.all([
    import("@fontsource-variable/fraunces/full.css"),
    import("@fontsource-variable/space-grotesk"),
    import("./index.css"),
    import("./lib/scroll"),
    import("./App.jsx"),
  ]).then(([, , , scrollMod, appMod]) => {
    scrollMod.initSmoothScroll();
    const PaperApp = appMod.default;
    root.render(
      <React.StrictMode>
        <PaperApp />
      </React.StrictMode>,
    );
  });
} else {
  Promise.all([
    import("@fontsource/anton"),
    import("@fontsource-variable/inter-tight"),
    import("./scenes/ScenesApp.jsx"),
  ]).then(([, , scenesMod]) => {
    const SwarmApp = scenesMod.default;
    root.render(
      <React.StrictMode>
        <SwarmApp />
      </React.StrictMode>,
    );
  });
}
