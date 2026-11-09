import React from "react";
import ReactDOM from "react-dom/client";

// Self-hosted variable fonts (bundled — no external font CDN round-trips)
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";

import "./index.css";
import App from "./App.jsx";
import ScenesApp from "./scenes/ScenesApp.jsx";
import { initSmoothScroll } from "./lib/scroll";

initSmoothScroll();

// Two editions, one bundle: the Scene portfolio is the front door,
// the Atelier editorial edition lives at /atelier.
const isAtelier = /^\/atelier\/?$/.test(window.location.pathname);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{isAtelier ? <App /> : <ScenesApp />}</React.StrictMode>
);
