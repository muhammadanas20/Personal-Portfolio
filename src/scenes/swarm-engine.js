import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SHUT = {
  l: "inset(0 100% 0 0)",
  r: "inset(0 0 0 100%)",
  t: "inset(0 0 100% 0)",
};
const OPEN = "inset(0 0% 0% 0%)";
const SCAN = {
  l: ["left", "0%", "100%"],
  r: ["left", "100%", "0%"],
  t: ["top", "0%", "100%"],
};

const ROLE = { frame: "layout", pop: "layout", type: "type", words: "type", img: "media" };
const VERB = {
  frame: "drawing",
  pop: "spawning",
  type: "writing",
  words: "writing",
  img: "placing",
};

const AGENT_SPECS = [
  ["AGENT·01", "layout", "--a1", "#ff5e00"],
  ["AGENT·02", "type", "--a2", "#3be8ff"],
  ["AGENT·03", "media", "--a3", "#c6ff3b"],
];

/**
 * Mounts the full zll.me autonomous cursor-swarm + GSAP ScrollTrigger cinema
 * onto `root`, returning an idempotent teardown function safe under React StrictMode.
 */
export function initSwarmCinema(root) {
  if (!root || typeof window === "undefined") return () => {};

  const html = document.documentElement;
  const $ = (s, r = root) => r.querySelector(s);
  const $$ = (s, r = root) => [...r.querySelectorAll(s)];

  html.classList.add("zll-html");

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const prevThemeColor = metaTheme?.getAttribute("content");
  metaTheme?.setAttribute("content", "#050505");

  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const unlock = () => html.classList.remove("locked");
  const loaderEl = $("#loader");

  if (reduce) {
    html.classList.remove("js", "loading");
    unlock();
    if (loaderEl) loaderEl.style.display = "none";
    $$(".quote").forEach((e) => {
      e.style.opacity = "1";
    });
    return () => {
      html.classList.remove("zll-html", "js", "locked", "loading");
      if (metaTheme && prevThemeColor) metaTheme.setAttribute("content", prevThemeColor);
    };
  }

  html.classList.add("js", "locked", "loading");
  if (loaderEl) loaderEl.style.display = "";

  ScrollTrigger.config({ ignoreMobileResize: true });
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  let disposed = false;
  const restorations = [];
  const remember = (el) => {
    if (!el) return;
    const origHTML = el.innerHTML;
    const origStyle = el.getAttribute("style");
    const wasBuilt = el.classList.contains("built");
    restorations.push(() => {
      el.innerHTML = origHTML;
      if (origStyle === null) el.removeAttribute("style");
      else el.setAttribute("style", origStyle);
      if (!wasBuilt) el.classList.remove("built");
      delete el._p;
      delete el._state;
      delete el._want;
      delete el._queued;
      delete el._active;
    });
  };

  /* ================= text splitting ================= */
  const split = (rootNode, words) => {
    const out = [];
    const walk = (node) =>
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) {
              frag.append(" ");
              return;
            }
            const ws = document.createElement("span");
            ws.className = "w";
            if (words) {
              ws.textContent = w;
              out.push(ws);
            } else {
              [...w].forEach((ch) => {
                const c = document.createElement("span");
                c.className = "c";
                c.textContent = ch;
                ws.append(c);
                out.push(c);
              });
            }
            frag.append(ws);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains("k")) {
          walk(n);
        }
      });
    walk(rootNode);
    return out;
  };

  const letters = (el) => {
    if (!el) return [];
    remember(el);
    return $$(".ln", el).flatMap((ln) => {
      const t = ln.textContent;
      ln.textContent = "";
      return [...t].map((ch) => {
        const s = document.createElement("span");
        s.className = "hc";
        s.textContent = ch;
        ln.append(s);
        return s;
      });
    });
  };

  let tickCounter = null;
  const offListeners = [];
  const addWinListener = (ev, fn, opts) => {
    window.addEventListener(ev, fn, opts);
    offListeners.push(() => window.removeEventListener(ev, fn, opts));
  };

  const ctx = gsap.context(() => {
    /* ================= build targets ================= */
    $$("[data-b]").forEach((el) => {
      remember(el);
      const t = el.dataset.b;
      const P = {};
      if (t === "type") P.parts = split(el, false);
      if (t === "words") P.parts = split(el, true);
      if (t === "frame") {
        const bd = document.createElement("span");
        bd.className = "bd";
        bd.innerHTML =
          '<i class="t"></i><i class="r"></i><i class="b"></i><i class="l"></i><i class="fl"></i>';
        P.kids = [...el.children];
        el.append(bd);
        P.lines = [...bd.children].slice(0, 4);
        P.flash = bd.lastChild;
        gsap.set(P.lines, { scale: 0 });
        gsap.set(P.kids, { opacity: 0, y: 14 });
      }
      if (t === "img") {
        P.dir = el.dataset.dir || "l";
        const s = document.createElement("i");
        s.className = P.dir === "t" ? "scan h" : "scan";
        el.append(s);
        P.scan = s;
        P.img = el.querySelector("img");
        P.cap = el.querySelector("figcaption");
        gsap.set(el, { clipPath: SHUT[P.dir] });
        if (P.cap) gsap.set(P.cap, { opacity: 0, y: 12 });
      }
      if (t === "pop") {
        P.kids = [...el.children];
        gsap.set(P.kids, { opacity: 0, scale: 0.4 });
      }
      el._p = P;
      el.style.visibility = "visible";
    });

    const finish = (el) => {
      const P = el._p;
      if (!P) return;
      el._state = "built";
      if (P.parts) P.parts.forEach((p) => p.classList.add("on"));
      if (P.lines) {
        gsap.set(P.lines, { scale: 1 });
        gsap.set(P.kids, { opacity: 1, y: 0 });
        el.classList.add("built");
      }
      if (P.scan) gsap.set(el, { clipPath: OPEN });
      if (P.cap) gsap.set(P.cap, { opacity: 1, y: 0 });
      if (el.dataset.b === "pop") gsap.set(P.kids, { opacity: 1, scale: 1 });
    };

    const reset = (el) => {
      const P = el._p;
      if (!P) return;
      el._state = "empty";
      if (P.parts) P.parts.forEach((p) => p.classList.remove("on"));
      if (P.lines) {
        gsap.set(P.lines, { scale: 0 });
        gsap.set(P.kids, { opacity: 0, y: 14 });
        el.classList.remove("built");
      }
      if (P.scan) gsap.set(el, { clipPath: SHUT[P.dir || "l"] });
      if (P.cap) gsap.set(P.cap, { opacity: 0, y: 12 });
      if (el.dataset.b === "pop") gsap.set(P.kids, { opacity: 0, scale: 0.4 });
    };

    /* ================= swarm agents ================= */
    const layer = $("#agents");
    layer.innerHTML = "";
    const css = getComputedStyle(html);
    const statusEl = $("#status");
    const dotEl = $(".hud .status i");

    const mk = (cls, inner = "") => {
      const d = document.createElement("div");
      d.className = cls;
      d.innerHTML = inner;
      layer.append(d);
      return d;
    };

    const AG = AGENT_SPECS.map(([name, role, v, fallback], i) => {
      const color = css.getPropertyValue(v).trim() || fallback;
      const a = { name, role, color, q: [], busy: false };
      a.gh = mk("gd h");
      a.gv = mk("gd v");
      a.caret = mk("caret");
      a.mq = mk("mq", "<i></i><i></i><i></i><i></i><b></b>");
      a.lbl = a.mq.querySelector("b");
      a.cur = mk(
        "cur",
        `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 2l7.6 19.2 2.7-8 7.9-2.8z" fill="${color}" stroke="#000" stroke-width="1.3" stroke-linejoin="round"/></svg><span>${name}</span>`,
      );
      [a.gh, a.gv, a.caret, a.mq, a.cur].forEach((e) => e.style.setProperty("--c", color));
      a.x = window.innerWidth / 2 + (i - 1) * Math.min(110, window.innerWidth * 0.22) - 40;
      a.y = window.innerHeight / 2 - 24;
      gsap.set(a.cur, { x: a.x, y: a.y, scale: 0, opacity: 0 });
      return a;
    });

    const maxX = () => window.innerWidth - 96;
    const lerp = (a, b, t) => a + (b - a) * t;
    const place = (a, x, y) => {
      a.x = Math.min(x, maxX());
      a.y = y;
      gsap.set(a.cur, { x: a.x, y: a.y });
    };
    const backlog = () => AG.reduce((n, a) => n + a.q.length, 0);
    const speed = () => Math.min(1 + backlog() * 0.45, 4);

    const drive = (dur, ease, onTick) =>
      new Promise((res) => {
        if (disposed) return res();
        const o = { p: 0 };
        ctx.add(() => {
          gsap.to(o, {
            p: 1,
            duration: Math.max(0.02, dur / speed()),
            ease,
            onUpdate: () => {
              if (!disposed) onTick(o.p);
            },
            onComplete: res,
          });
        });
      });

    const travel = (a, target, dur = 0.5) => {
      const sx = a.x;
      const sy = a.y;
      return drive(dur, "power3.inOut", (p) => {
        const t = target();
        place(a, lerp(sx, t.x, p), lerp(sy, t.y, p));
      });
    };

    const wait = (s) =>
      new Promise((r) => {
        if (disposed) return r();
        ctx.add(() => gsap.delayedCall(s / speed(), r));
      });

    const say = (a, verb, label) => {
      if (statusEl) statusEl.textContent = `${a.name} › ${verb} <${label}/>`;
      if (dotEl) dotEl.style.background = a.color;
    };

    const spark = (R, color) => {
      if (disposed) return;
      [
        [R.left, R.top],
        [R.right, R.top],
        [R.left, R.bottom],
        [R.right, R.bottom],
      ].forEach(([x, y]) => {
        for (let k = 0; k < 3; k++) {
          const s = mk("spark");
          s.style.setProperty("--c", color);
          const ang = Math.random() * Math.PI * 2;
          const dist = 16 + Math.random() * 32;
          ctx.add(() => {
            gsap.fromTo(
              s,
              { x, y, opacity: 1, scale: 1 },
              {
                x: x + Math.cos(ang) * dist,
                y: y + Math.sin(ang) * dist,
                opacity: 0,
                scale: 0,
                rotation: 180,
                duration: 0.7,
                ease: "power3.out",
                onComplete: () => s.remove(),
              },
            );
          });
        }
      });
    };

    const marquee = async (a, el) => {
      const r = () => el.getBoundingClientRect();
      await travel(a, () => ({ x: r().left, y: r().top }));
      if (disposed) return () => {};
      gsap.set(a.mq, { opacity: 1 });
      gsap.set([a.gh, a.gv], { opacity: 0.45 });
      const tick = (p) => {
        const R = r();
        const w = R.width * p;
        const h = R.height * p;
        gsap.set(a.mq, { x: R.left, y: R.top, width: w, height: h });
        gsap.set(a.gh, { y: R.top });
        gsap.set(a.gv, { x: R.left });
        a.lbl.textContent = `${Math.round(w)} × ${Math.round(h)}`;
        place(a, R.left + w, R.top + h);
      };
      await drive(0.45, "power2.out", tick);
      return () => {
        if (disposed) return;
        ctx.add(() => {
          const hold = { p: 0 };
          gsap.to(hold, { p: 1, duration: 0.45, onUpdate: () => tick(1) });
          gsap.to([a.mq, a.gh, a.gv], { opacity: 0, duration: 0.35, delay: 0.2 });
        });
      };
    };

    const JOBS = {
      async frame(a, el) {
        const release = await marquee(a, el);
        if (disposed) return;
        const P = el._p;
        ctx.add(() => {
          gsap.to(P.lines, { scale: 1, duration: 0.45, stagger: 0.06, ease: "power2.inOut" });
          gsap.fromTo(P.flash, { opacity: 0.16 }, { opacity: 0, duration: 0.7 });
          gsap.to(P.kids, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.1,
          });
        });
        el.classList.add("built");
        spark(el.getBoundingClientRect(), a.color);
        release();
        await wait(0.25);
      },
      async img(a, el) {
        const release = await marquee(a, el);
        if (disposed) return;
        const P = el._p;
        const [axis, from, to] = SCAN[P.dir || "l"];
        ctx.add(() => {
          if (!P.keep) {
            gsap.fromTo(
              el,
              { clipPath: SHUT[P.dir || "l"] },
              { clipPath: OPEN, duration: 0.8, ease: "power3.inOut" },
            );
          }
          gsap.fromTo(
            P.scan,
            { [axis]: from, opacity: 1 },
            {
              [axis]: to,
              duration: 0.8,
              ease: "power3.inOut",
              onComplete: () => gsap.set(P.scan, { opacity: 0 }),
            },
          );
          if (!P.keep && P.img) {
            gsap.fromTo(P.img, { scale: 1.3 }, { scale: 1, duration: 1.2, ease: "power2.out" });
          }
          if (P.cap) {
            gsap.to(P.cap, { opacity: 1, y: 0, duration: 0.5, delay: 0.55, ease: "power3.out" });
          }
        });
        spark(el.getBoundingClientRect(), a.color);
        release();
        await wait(0.35);
      },
      async pop(a, el) {
        const kids = el._p.kids;
        if (!kids.length) return;
        await travel(a, () => {
          const R = kids[0].getBoundingClientRect();
          return { x: R.left, y: R.top };
        });
        for (const k of kids) {
          if (disposed) return;
          const R = () => k.getBoundingClientRect();
          await travel(
            a,
            () => ({ x: R().left + R().width * 0.5, y: R().top + R().height * 0.6 }),
            0.14,
          );
          if (disposed) return;
          ctx.add(() =>
            gsap.to(k, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.4)" }),
          );
        }
      },
      async type(a, el) {
        const parts = el._p.parts;
        const n = parts.length;
        if (!n) return;
        const per = el.dataset.b === "words" ? 0.06 : 0.03;
        const at = (i) => parts[Math.max(0, Math.min(i, n - 1))].getBoundingClientRect();
        await travel(
          a,
          () => {
            const R = at(0);
            return { x: R.left, y: R.top + R.height * 0.7 };
          },
          0.45,
        );
        if (disposed) return;
        gsap.set(a.caret, { opacity: 1 });
        let k = 0;
        await drive(n * per, "none", (p) => {
          const target = Math.ceil(p * n);
          while (k < target) parts[k++].classList.add("on");
          const R = at(k - 1);
          gsap.set(a.caret, { x: R.right + 1, y: R.top, height: R.height });
          place(a, lerp(a.x, R.right + 8, 0.35), lerp(a.y, R.top + R.height * 0.7, 0.35));
        });
        if (disposed) return;
        parts.forEach((p) => p.classList.add("on"));
        await wait(0.2);
        if (!disposed) gsap.set(a.caret, { opacity: 0 });
      },
    };
    JOBS.words = JOBS.type;

    const UNJOBS = {
      async frame(a, el) {
        const P = el._p;
        const r = () => el.getBoundingClientRect();
        await travel(a, () => ({ x: r().right, y: r().bottom }), 0.35);
        if (disposed) return;
        el.classList.remove("built");
        ctx.add(() =>
          gsap.to(P.kids, {
            opacity: 0,
            y: 14,
            duration: 0.3,
            stagger: { each: 0.03, from: "end" },
          }),
        );
        await drive(0.35, "power2.in", (p) =>
          place(a, lerp(r().right, r().left, p), lerp(r().bottom, r().top, p)),
        );
        if (disposed) return;
        ctx.add(() =>
          gsap.to(P.lines, {
            scale: 0,
            duration: 0.3,
            stagger: { each: 0.04, from: "end" },
            ease: "power2.in",
          }),
        );
      },
      async img(a, el) {
        const P = el._p;
        const r = () => el.getBoundingClientRect();
        const [axis, from, to] = SCAN[P.dir || "l"];
        await travel(a, () => ({ x: r().right, y: r().top + r().height * 0.5 }), 0.35);
        if (disposed) return;
        ctx.add(() => {
          if (P.cap) gsap.to(P.cap, { opacity: 0, y: 12, duration: 0.2 });
          gsap.fromTo(
            P.scan,
            { [axis]: to, opacity: 1 },
            {
              [axis]: from,
              duration: 0.5,
              ease: "power2.in",
              onComplete: () => gsap.set(P.scan, { opacity: 0 }),
            },
          );
          gsap.to(el, { clipPath: SHUT[P.dir || "l"], duration: 0.5, ease: "power2.in" });
        });
        await drive(0.5, "power2.in", (p) =>
          place(a, lerp(r().right, r().left, p), r().top + r().height * 0.5),
        );
      },
      async pop(a, el) {
        for (const k of [...el._p.kids].reverse()) {
          if (disposed) return;
          const R = () => k.getBoundingClientRect();
          await travel(
            a,
            () => ({ x: R().left + R().width * 0.5, y: R().top + R().height * 0.6 }),
            0.09,
          );
          if (disposed) return;
          ctx.add(() => gsap.to(k, { opacity: 0, scale: 0.4, duration: 0.2, ease: "power2.in" }));
        }
      },
      async type(a, el) {
        const parts = el._p.parts;
        const n = parts.length;
        if (!n) return;
        const per = el.dataset.b === "words" ? 0.025 : 0.012;
        const at = (i) => parts[Math.max(0, Math.min(i, n - 1))].getBoundingClientRect();
        await travel(
          a,
          () => {
            const R = at(n - 1);
            return { x: R.right + 8, y: R.top + R.height * 0.7 };
          },
          0.35,
        );
        if (disposed) return;
        gsap.set(a.caret, { opacity: 1 });
        let k = n;
        await drive(n * per, "none", (p) => {
          const target = n - Math.ceil(p * n);
          while (k > target) parts[--k].classList.remove("on");
          const R = at(k - 1);
          const x = k ? R.right + 1 : at(0).left;
          gsap.set(a.caret, { x, y: R.top, height: R.height });
          place(a, lerp(a.x, x + 8, 0.35), lerp(a.y, R.top + R.height * 0.7, 0.35));
        });
        if (disposed) return;
        parts.forEach((p) => p.classList.remove("on"));
        gsap.set(a.caret, { opacity: 0 });
      },
    };
    UNJOBS.words = UNJOBS.type;

    const idle = (a, on) => a.cur.classList.toggle("idle", on);

    const pump = async (a) => {
      if (a.busy || disposed) return;
      a.busy = true;
      idle(a, false);
      while (a.q.length && !disposed) {
        const el = a.q.shift();
        const want = el._want;
        const type = el.dataset.b;
        el._queued = false;
        if ((el._state || "empty") === want) continue;
        const R = el.getBoundingClientRect();
        const slide = el.closest(".kn-slide");
        if (
          R.bottom < -40 ||
          R.top > window.innerHeight + 40 ||
          R.right < 0 ||
          R.left > window.innerWidth ||
          (slide && gsap.getProperty(slide, "opacity") < 0.3)
        ) {
          want === "built" ? finish(el) : reset(el);
          continue;
        }
        say(a, want === "built" ? VERB[type] : "removing", el.dataset.l || el.tagName.toLowerCase());
        el._active = true;
        await (want === "built" ? JOBS : UNJOBS)[type](a, el);
        el._active = false;
        if (disposed) break;
        el._state = want;
        if (el._want !== want) {
          el._queued = true;
          a.q.push(el);
        }
      }
      a.busy = false;
      if (!disposed) idle(a, true);
    };

    const dispatch = (el, build = true) => {
      if (!el || disposed || !el._p) return;
      el._want = build ? "built" : "empty";
      if (el._queued || el._active || (el._state || "empty") === el._want) return;
      el._queued = true;
      const pref = AG.find((a) => a.role === ROLE[el.dataset.b]) || AG[0];
      const a =
        pref.q.length + (pref.busy ? 1 : 0) < 2
          ? pref
          : AG.reduce((m, x) => (x.q.length + x.busy < m.q.length + m.busy ? x : m));
      a.q.push(el);
      pump(a);
    };

    const watch = (el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        onEnter: () => dispatch(el),
        onLeaveBack: () => dispatch(el, false),
      });

    /* ================= opening ================= */
    const nameChars = letters($("#heroName"));
    const endChars = letters($("#theEnd"));
    gsap.set(nameChars, { yPercent: 115 });
    gsap.set(endChars, { yPercent: 115 });

    const opening = gsap.timeline({ paused: true });
    opening
      .to(".grid-bg", { opacity: 1, duration: 1.4 }, 0.2)
      .to(nameChars, { yPercent: 0, duration: 0.8, stagger: 0.06, ease: "power4.out" }, 0.3)
      .addLabel("photo", "<1.3")
      .fromTo(
        ".hero-photo .ph",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.8, ease: "power2.out", force3D: true },
        "photo",
      )
      .from(".hero-side", { opacity: 0, duration: 1 }, "photo+=.6")
      .fromTo(".hero-tag", { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, "photo+=1.1")
      .call(
        () => {
          dispatch($(".hero-tag"));
          gsap.delayedCall(0.5, () => dispatch($(".hero-bottom .desc")));
          gsap.delayedCall(0.8, () => dispatch($(".ctas")));
        },
        null,
        "photo+=1.5",
      )
      .call(unlock, null, "photo+=1.7");

    const heroPhoto = $("#heroPhoto");
    if (heroPhoto) {
      remember(heroPhoto);
      const scanEl = document.createElement("i");
      scanEl.className = "scan";
      heroPhoto._p = { scan: scanEl, img: $("#heroPhoto img"), keep: true };
      heroPhoto.append(scanEl);
    }

    const ff = () => {
      if (opening.isActive()) opening.timeScale(4);
    };
    ["wheel", "touchstart", "keydown"].forEach((ev) =>
      addWinListener(ev, ff, { passive: true, once: true }),
    );

    /* ================= scroll cinema ================= */
    const pinnedTriggers = new Map();

    const scenes = () => {
      const mid = (nameChars.length - 1) / 2;
      const homeTl = gsap
        .timeline({
          scrollTrigger: { trigger: "#home", start: "top top", end: "+=110%", pin: true, scrub: 1 },
        })
        .to(".hero-photo", { opacity: 0, yPercent: -6, ease: "power1.in" }, 0)
        .to(
          nameChars,
          { x: (i) => (i - mid) * window.innerWidth * 0.025, opacity: 0, ease: "power2.in" },
          0,
        )
        .to(".hero-fade", { opacity: 1, duration: 0.35 }, 0.65)
        .to(".hero", { opacity: 0, duration: 0.35 }, 0.65 + 0.35);
      pinnedTriggers.set("#home", homeTl.scrollTrigger);

      // Ghost words parallax
      $$(".ghost").forEach((g) =>
        gsap.fromTo(
          g,
          { xPercent: 8 },
          {
            xPercent: -16,
            ease: "none",
            scrollTrigger: {
              trigger: g.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        ),
      );

      // Ticker band driven by scroll
      gsap.fromTo(
        "#trk1",
        { xPercent: 0 },
        {
          xPercent: -33.3,
          ease: "none",
          scrollTrigger: { trigger: ".ticker", start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        "#trk2",
        { xPercent: -33.3 },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: ".ticker", start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      // Scene 03 — Knowledge 3D perspective slides
      const slides = $$(".kn-slide");
      const n = slides.length;
      gsap.set(slides, { opacity: 0, z: -700, rotationX: 28, yPercent: 14 });
      const knNow = $("#knNow");
      const kn = gsap.timeline({
        scrollTrigger: {
          trigger: "#knowledge",
          start: "top top",
          end: () => "+=" + window.innerHeight * n * 0.85,
          pin: true,
          scrub: 1,
          onUpdate: (s) => {
            if (knNow) knNow.textContent = "0" + Math.min(n, Math.floor(s.progress * n) + 1);
          },
        },
      });
      pinnedTriggers.set("#knowledge", kn.scrollTrigger);

      slides.forEach((s, i) => {
        kn.to(s, { opacity: 1, z: 0, rotationX: 0, yPercent: 0, duration: 1, ease: "power3.out" }, i * 2)
          .to(".kn-bar i", { scaleY: (i + 1) / n, duration: 1, ease: "none" }, i * 2)
          .call(() => dispatch($("p", s), kn.scrollTrigger.direction > 0), null, i * 2 + 0.6);
        if (i < n - 1) {
          kn.to(
            s,
            { opacity: 0, z: 380, rotationX: -18, yPercent: -12, duration: 0.5, ease: "power2.in" },
            i * 2 + 1.45,
          );
        }
      });
      kn.to({}, { duration: 0.6 });

      // Scene 04 — Projects horizontal scroll track
      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px)", () => {
        const track = $("#pjTrack");
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const h = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: "#projects",
            start: "top top",
            end: () => "+=" + dist(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        pinnedTriggers.set("#projects", h.scrollTrigger);
        gsap.to(".pj-progress i", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "#projects",
            start: "top top",
            end: () => "+=" + dist(),
            scrub: true,
          },
        });
        $$(".pj").forEach((card) =>
          ScrollTrigger.create({
            trigger: card,
            containerAnimation: h,
            start: "left 88%",
            onEnter: () => dispatch(card),
            onLeaveBack: () => dispatch(card, false),
          }),
        );
      });
      mm.add("(max-width: 900px)", () => {
        $$(".pj").forEach((card) => watch(card));
      });

      // Scene 05 — Philosophy pinned quote
      const quoteEl = $("#quote");
      if (quoteEl) {
        remember(quoteEl);
        const qw = split(quoteEl, true);
        qw.forEach((w) => w.classList.add("qw"));
        const phil = gsap.timeline({
          scrollTrigger: { trigger: "#philosophy", start: "top top", end: "+=140%", pin: true, scrub: 1 },
        });
        pinnedTriggers.set("#philosophy", phil.scrollTrigger);
        const down = () => phil.scrollTrigger.direction > 0;
        phil
          .to(qw, { opacity: 1, stagger: 0.1, ease: "none", duration: 0.3 })
          .call(() => dispatch($(".phil-p"), down()))
          .call(() => dispatch($("#philosophy .chips"), down()), null, "+=.4")
          .to({}, { duration: 0.8 });
      }

      // Scene 07 — Life columns counter-parallax
      $$(".life .col").forEach((c, i) =>
        gsap.fromTo(
          c,
          { y: [60, -30, 110][i % 3] },
          {
            y: [-60, 40, -110][i % 3],
            ease: "none",
            scrollTrigger: {
              trigger: "#life-grid",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        ),
      );

      // End Credits — "THE END" rise
      ScrollTrigger.create({
        trigger: "#theEnd",
        start: "top 85%",
        onEnter: () =>
          gsap.to(endChars, {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.07,
            ease: "power4.out",
            overwrite: true,
          }),
        onLeaveBack: () =>
          gsap.to(endChars, {
            yPercent: 115,
            duration: 0.5,
            stagger: 0.04,
            ease: "power2.in",
            overwrite: true,
          }),
      });

      $$("[data-b]:not([data-manual])").forEach((el) => watch(el));

      // HUD progress + percentage readout
      const pctEl = $("#pct");
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (s) => {
          gsap.set(".progress", { scaleX: s.progress });
          if (pctEl) {
            pctEl.textContent =
              s.progress > 0.995 ? "BUILT ✓" : Math.round(s.progress * 100) + "%";
          }
        },
      });
    };

    // Smooth anchor navigation compatible with pinned ScrollTrigger sections
    $$('.hud a[href^="#"]').forEach((link) => {
      const onClick = (e) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const target = $(href);
        if (!target) return;
        e.preventDefault();
        if (href === "#home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        const st = pinnedTriggers.get(href);
        const y = st ? st.start : target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y, behavior: "smooth" });
      };
      link.addEventListener("click", onClick);
      offListeners.push(() => link.removeEventListener("click", onClick));
    });

    /* ================= loader ================= */
    const spawn = gsap.timeline();
    AG.forEach((a, i) => {
      const box = { p: 0 };
      spawn
        .set(a.mq, { x: a.x - 14, y: a.y - 14, width: 0, height: 0, opacity: 1 }, 0.3 + i * 0.45)
        .to(
          box,
          {
            p: 1,
            duration: 0.35,
            ease: "power2.out",
            onUpdate: () => {
              const s = 44 * box.p;
              gsap.set(a.mq, { width: s, height: s });
              a.lbl.textContent = `${Math.round(s)} × ${Math.round(s)}`;
            },
          },
          "<",
        )
        .to(
          a.cur,
          { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.6)", clearProps: "opacity" },
          ">-.05",
        )
        .to(a.mq, { opacity: 0, duration: 0.3 }, "<.15");
    });

    const eager = $$("img").filter((img) => img.loading !== "lazy");
    let fontsDone = false;
    const fontsReady = Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((r) => setTimeout(r, 2000)),
    ]).then(() => {
      fontsDone = true;
    });
    const pageLoaded = new Promise((r) =>
      document.readyState === "complete"
        ? r()
        : window.addEventListener("load", r, { once: true }),
    );
    const shown = { v: 0 };
    const counter = $("#loader .ld-n");
    tickCounter = () => {
      if (disposed || !counter) return;
      const doneCount = eager.filter((img) => img.complete).length + (fontsDone ? 1 : 0);
      const real = doneCount / (eager.length + 1);
      shown.v = Math.max(shown.v, shown.v + (real - shown.v) * 0.08);
      counter.textContent = String(Math.round(shown.v * 100)).padStart(3, "0");
    };
    gsap.ticker.add(tickCounter);

    Promise.all([fontsReady, pageLoaded, spawn.then()]).then(() => {
      if (disposed) return;
      gsap.ticker.remove(tickCounter);
      tickCounter = null;

      ctx.add(() => {
        scenes();
        ScrollTrigger.refresh();
        gsap
          .timeline()
          .to(shown, {
            v: 1,
            duration: 0.4,
            ease: "power1.out",
            onUpdate: () => {
              if (counter) counter.textContent = String(Math.round(shown.v * 100)).padStart(3, "0");
            },
          })
          .to(counter, { opacity: 0, duration: 0.25 }, "+=.15")
          .to("#loader .l", { xPercent: -101, duration: 1.2, ease: "expo.inOut", force3D: true })
          .to("#loader .r", { xPercent: 101, duration: 1.2, ease: "expo.inOut", force3D: true }, "<")
          .call(
            () => {
              html.classList.remove("loading");
              AG.forEach((a) => idle(a, true));
            },
            null,
            "-=.3",
          )
          .call(() => {
            if (loaderEl) loaderEl.style.display = "none";
            opening.play();
          });
      });
    });
  }, root);

  return () => {
    disposed = true;
    if (tickCounter) gsap.ticker.remove(tickCounter);
    offListeners.forEach((fn) => fn());
    ctx.revert();
    restorations.reverse().forEach((fn) => fn());
    const layer = $("#agents");
    if (layer) layer.innerHTML = "";
    html.classList.remove("zll-html", "js", "locked", "loading");
    if (metaTheme && prevThemeColor) metaTheme.setAttribute("content", prevThemeColor);
  };
}
