/**
 * Headless smoke test for the theme engine + hero portrait.
 * Runs the real React app inside jsdom via Vite's SSR loader.
 */
import { JSDOM } from "jsdom";
import { createServer } from "vite";

const dom = new JSDOM(`<!doctype html><html><head>
  <meta name="theme-color" content="#f2eee7" />
</head><body><div id="root"></div></body></html>`, {
  url: "https://anastrix.live/",
  pretendToBeVisual: true,
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Element = dom.window.Element;
globalThis.Node = dom.window.Node;
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.MutationObserver = dom.window.MutationObserver;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom has no IntersectionObserver — framer-motion needs one
class IO {
  constructor(cb) {
    this.cb = cb;
  }
  observe(el) {
    this.cb([{ target: el, isIntersecting: true, intersectionRatio: 1 }], this);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.IntersectionObserver = IO;
dom.window.IntersectionObserver = IO;

const store = new Map();
Object.defineProperty(dom.window, "localStorage", {
  configurable: true,
  value: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  },
});

let darkQuery = false;
dom.window.matchMedia = (query) => ({
  matches: query.includes("dark") ? darkQuery : false,
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
const AppMod = await server.ssrLoadModule("/src/App.jsx");
const App = AppMod.default;

const root = ReactDOM.createRoot(document.getElementById("root"));
await act(async () => {
  root.render(React.createElement(App));
});

const results = [];
const check = (name, ok, extra = "") =>
  results.push(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`);

// 1 — the app rendered
check("app renders", document.querySelector("h1")?.textContent?.includes("MUHAMMAD"));

// 2 — the toggle exists and is labelled
const toggle = document.querySelector('button[aria-label*="theme"]');
check("theme toggle present", !!toggle, toggle?.getAttribute("aria-label"));

// 3 — default theme follows the system (light)
check(
  "default theme = light",
  document.documentElement.dataset.theme === "light",
  document.documentElement.dataset.theme
);

// 4 — toggling flips the theme + writes the attribute + persists
await act(async () => {
  toggle.click();
});
check(
  "toggle → dark",
  document.documentElement.dataset.theme === "dark",
  document.documentElement.dataset.theme
);
check("toggle persists", store.get("anastrix-theme") === "dark", String(store.get("anastrix-theme")));
check(
  "theme-color meta follows",
  document.querySelector('meta[name="theme-color"]')?.content === "#131110",
  document.querySelector('meta[name="theme-color"]')?.content
);
check("color-scheme set", document.documentElement.style.colorScheme === "dark");

// 5 — toggling back
await act(async () => {
  toggle.click();
});
check("toggle → light", document.documentElement.dataset.theme === "light");

// 6 — the portrait uses the cut-out asset
const portrait = document.querySelector('.portrait-plate img');
check("portrait asset", portrait?.getAttribute("src") === "/portrait.png", portrait?.getAttribute("src"));

// 7 — ink chapters use the dedicated surface token
const inkChapter = document.querySelector("#projects");
check("projects on ink-surface", inkChapter?.className.includes("bg-ink-surface"), inkChapter?.className);

// 8 — the stamp in the hero margin is not inside the plate
const seal = document.querySelector("#top .portrait-plate ~ span span[data-seal]");
check("margin seal present", !!seal);

// 9 — system preference wins when nothing is stored
store.clear();
darkQuery = true;
const holder = document.createElement("div");
document.body.appendChild(holder);
const root2 = ReactDOM.createRoot(holder);
await act(async () => {
  root2.render(React.createElement(App));
});
check(
  "system dark honoured",
  document.documentElement.dataset.theme === "dark",
  document.documentElement.dataset.theme
);
await act(async () => {
  root2.unmount();
});

console.log(results.join("\n"));
await server.close();
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);
