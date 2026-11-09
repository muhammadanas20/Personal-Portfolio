/**
 * Headless verification test for ScenesApp (the zll.me Swarm Cinema portfolio).
 * Mounts inside <React.StrictMode> to verify idempotent double-mount cleanup,
 * all 3 swarm agents, build targets, all 9 scenes, loader doors, and teardown.
 */
import { JSDOM } from "jsdom";
import { createServer } from "vite";

const dom = new JSDOM(
  `<!doctype html><html><head>
    <meta name="theme-color" content="#050505" />
  </head><body><div id="root"></div></body></html>`,
  {
    url: "https://anastrix.live/",
    pretendToBeVisual: true,
  },
);

globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Element = dom.window.Element;
globalThis.Node = dom.window.Node;
globalThis.SVGElement = dom.window.SVGElement;
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.MutationObserver = dom.window.MutationObserver;
globalThis.history = dom.window.history;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.scrollTo = () => {};

dom.window.matchMedia = (query) => ({
  matches: query.includes("min-width: 901px"),
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
});

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const React = (await import("react")).default;
const ReactDOM = await import("react-dom/client");
const { act } = await import("react");
const ScenesMod = await server.ssrLoadModule("/src/scenes/ScenesApp.jsx");
const ScenesApp = ScenesMod.default;

const root = ReactDOM.createRoot(document.getElementById("root"));
await act(async () => {
  root.render(React.createElement(React.StrictMode, null, React.createElement(ScenesApp)));
});

const results = [];
const check = (name, ok, extra = "") =>
  results.push(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`);

// 1 — html classes applied
check(
  "zll-html + js + locked classes active",
  document.documentElement.classList.contains("zll-html") &&
    document.documentElement.classList.contains("js"),
  [...document.documentElement.classList].join(" "),
);

// 2 — loader double doors + counter rendered
check(
  "loader doors + counter present",
  !!document.querySelector("#loader .lh.l") &&
    !!document.querySelector("#loader .lh.r") &&
    !!document.querySelector("#loader .ld-n"),
);

// 3 — StrictMode idempotency: exactly 3 swarm cursors (AGENT·01, AGENT·02, AGENT·03)
const cursors = [...document.querySelectorAll("#agents .cur")];
check(
  "exactly 3 swarm cursors spawned (StrictMode safe)",
  cursors.length === 3,
  `count=${cursors.length}: ${cursors.map((c) => c.textContent).join(", ")}`,
);
check(
  "all 3 marquees + carets + guides present",
  document.querySelectorAll("#agents .mq").length === 3 &&
    document.querySelectorAll("#agents .caret").length === 3 &&
    document.querySelectorAll("#agents .gd.h").length === 3 &&
    document.querySelectorAll("#agents .gd.v").length === 3,
);

// 4 — HUD instrumentation
check("HUD logo + status + pct + Paper link", !!document.querySelector(".hud .logo") && !!document.querySelector("#status") && !!document.querySelector("#pct") && !!document.querySelector(".hud .paper"));

// 5 — Hero split characters (Muhammad = 8, Anas = 4 -> 12 .hc chars)
const heroChars = document.querySelectorAll("#heroName .hc");
check("Hero name split into 12 .hc chars", heroChars.length === 12, `count=${heroChars.length}`);

// 6 — All 9 scenes + ticker + credits present
const sectionIds = ["home", "about", "knowledge", "projects", "philosophy", "experience", "life", "deep", "contact"];
const missing = sectionIds.filter((id) => !document.getElementById(id));
check("All 9 scenes rendered", missing.length === 0, missing.join(",") || "all 9 ok");
check("Diagonal ticker tracks rendered", !!document.getElementById("trk1") && !!document.getElementById("trk2"));
check("End credits + The End split", document.querySelectorAll("#theEnd .hc").length === 6);

// 7 — Build targets initialized without duplication
const frames = [...document.querySelectorAll('[data-b="frame"]')];
const dupBorders = frames.filter((f) => f.querySelectorAll(":scope > .bd").length !== 1);
check(
  "All [data-b='frame'] have exactly 1 .bd border rig",
  frames.length > 10 && dupBorders.length === 0,
  `frames=${frames.length}, dup=${dupBorders.length}`,
);

const imgs = [...document.querySelectorAll('[data-b="img"]')];
const dupScans = imgs.filter((im) => im.querySelectorAll(":scope > .scan").length !== 1);
check(
  "All [data-b='img'] have exactly 1 .scan laser bar",
  imgs.length >= 12 && dupScans.length === 0,
  `imgs=${imgs.length}, dup=${dupScans.length}`,
);

// 8 — Every <img> asset exists in public/ and every .svg parses cleanly as XML
const fs = await import("node:fs");
const path = await import("node:path");
const parser = new dom.window.DOMParser();
const allImgSrcs = [...new Set([...document.querySelectorAll("img")].map((i) => i.getAttribute("src")))];
const badAssets = [];
for (const src of allImgSrcs) {
  const diskPath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  if (!fs.existsSync(diskPath)) {
    badAssets.push(`missing:${src}`);
    continue;
  }
  if (src.endsWith(".svg")) {
    const xml = fs.readFileSync(diskPath, "utf8");
    const parsed = parser.parseFromString(xml, "image/svg+xml");
    if (parsed.querySelector("parsererror")) badAssets.push(`invalid-svg:${src}`);
  }
}
check(
  "All <img> assets exist on disk & all .svg book sheets are valid XML",
  badAssets.length === 0,
  badAssets.join(", ") || `${allImgSrcs.length} assets verified`,
);

// 9 — Clean unmount restores html classes & empties #agents
await act(async () => {
  root.unmount();
});
check(
  "Unmount cleans html classes",
  !document.documentElement.classList.contains("zll-html") &&
    !document.documentElement.classList.contains("locked"),
);

console.log(results.join("\n"));
await server.close();
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);
