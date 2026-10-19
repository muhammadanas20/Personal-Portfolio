import React from "react";
import ReactDOM from "react-dom/client";

// Self-hosted variable fonts (bundled — no external font CDN round-trips)
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";

import "./index.css";
import App from "./App.jsx";
import { initSmoothScroll } from "./lib/scroll";

initSmoothScroll();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
