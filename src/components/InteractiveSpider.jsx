// src/components/InteractiveSpider.jsx
// ═══════════════════════════════════════════════════════════════════════
// Procedural Webhead Character — a Spider-Man-style humanoid that walks,
// swings, hangs, crawls walls, reacts to the cursor, and shows moods.
// Adapted from HyperTab's architecture into a single self-contained
// React component. Pure HTML5 Canvas 2D — zero external dependencies.
// ═══════════════════════════════════════════════════════════════════════

import { useEffect, useRef } from "react";

// ─── Math helpers ────────────────────────────────────────────────────
const TAU = Math.PI * 2;
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a, b, t) => a + (b - a) * t;
/** Framerate-independent exponential smoothing (Freya Holmér style). */
const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));
const rand = (lo, hi) => (hi === undefined ? Math.random() * lo : lo + Math.random() * (hi - lo));
const chance = (p) => Math.random() < p;

function pickWeighted(entries) {
  let total = 0;
  for (const [, w] of entries) total += w;
  let r = Math.random() * total;
  for (const [item, w] of entries) {
    r -= w;
    if (r <= 0) return item;
  }
  return entries[entries.length - 1][0];
}

function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [137, 180, 250];
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * k);
  const g = Math.round(((n >> 8) & 255) * k);
  const b = Math.round((n & 255) * k);
  return `rgb(${r},${g},${b})`;
}

// ─── Brain (Mood + Behavior) ─────────────────────────────────────────
const MOOD_TABLES = {
  chill: [
    ["climbString", 30], ["swing", 22], ["walk", 16], ["hop", 14], ["hang", 12],
    ["crawlWall", 12], ["run", 10], ["peek", 8], ["wave", 6],
  ],
  playful: [
    ["climbString", 36], ["swing", 28], ["run", 20], ["hop", 20], ["crawlWall", 12],
    ["hang", 10], ["peek", 8], ["wave", 6], ["walk", 6],
  ],
  sleepy: [
    ["climbString", 20], ["walk", 18], ["swing", 16], ["hang", 14], ["crawlWall", 10],
    ["hop", 8], ["crouch", 8], ["idle", 8], ["peek", 6],
  ],
  alert: [
    ["climbString", 34], ["swing", 24], ["run", 20], ["hop", 16], ["crouch", 12],
    ["crawlWall", 14], ["peek", 10], ["walk", 8],
  ],
};

const MOOD_NEXT = {
  chill: [["playful", 5], ["alert", 3], ["chill", 2], ["sleepy", 1]],
  playful: [["playful", 4], ["alert", 3], ["chill", 2], ["sleepy", 1]],
  sleepy: [["playful", 4], ["chill", 3], ["alert", 2], ["sleepy", 1]],
  alert: [["playful", 4], ["alert", 3], ["chill", 2], ["sleepy", 1]],
};

class Brain {
  constructor() {
    this.mood = "playful";
    this.moodTimer = 0;
    this.moodDuration = rand(15, 35);
    this.recent = [];
  }
  tick(dt) {
    this.moodTimer += dt;
    if (this.moodTimer >= this.moodDuration) {
      this.moodTimer = 0;
      this.moodDuration = rand(15, 35);
      this.mood = pickWeighted(MOOD_NEXT[this.mood]);
    }
  }
  pick() {
    let table = MOOD_TABLES[this.mood].filter(([k]) => !this.recent.includes(k));
    if (!table.length) table = MOOD_TABLES[this.mood].slice();
    let kind = pickWeighted(table);
    if ((kind === "sleep") && this.recent.at(-1) === kind) kind = "walk";
    this.recent.push(kind);
    if (this.recent.length > 4) this.recent.shift();
    return kind;
  }
}

// ─── Pose Library ────────────────────────────────────────────────────
const POSES = {
  stand: {
    pelvis: [0, 0.52], chest: [0.02, 0.30], head: [0.06, 0.16],
    handL: [-0.15, 0.56], handR: [0.17, 0.57],
    footL: [-0.07, 0.985], footR: [0.11, 0.99],
    kneeBend: 1, elbowBend: -1,
  },
  crouch: {
    pelvis: [0, 0.66], chest: [0.08, 0.48], head: [0.13, 0.36],
    handL: [-0.12, 0.62], handR: [0.24, 0.88],
    footL: [-0.16, 0.985], footR: [0.17, 0.99],
    kneeBend: 1, elbowBend: -1, tension: 1,
  },
  sit: {
    pelvis: [0, 0.78], chest: [0.0, 0.56], head: [0.04, 0.43],
    handL: [-0.1, 0.82], handR: [0.13, 0.83],
    footL: [0.19, 0.965], footR: [0.12, 0.99],
    kneeBend: 1, elbowBend: -1,
  },
  hang: {
    pelvis: [0, 0.42], chest: [-0.02, 0.24], head: [-0.03, 0.11],
    handL: [-0.13, 0.42], handR: [0.12, 0.44],
    footL: [-0.04, 0.03], footR: [0.05, 0.035],
    kneeBend: 1, elbowBend: -1,
  },
  swing: {
    pelvis: [0, 0.5], chest: [-0.07, 0.31], head: [-0.06, 0.17],
    handL: [0.02, 0.03], handR: [0.16, 0.015],
    footL: [-0.26, 0.72], footR: [-0.1, 0.86],
    kneeBend: -1, elbowBend: 1,
  },
  crawl: {
    pelvis: [0, 0.5], chest: [0.02, 0.3], head: [0.05, 0.17],
    handL: [-0.22, 0.3], handR: [0.26, 0.34],
    footL: [-0.2, 0.86], footR: [0.2, 0.9],
    kneeBend: -1, elbowBend: 1, tension: 0.6,
  },
  sleep: {
    pelvis: [0, 0.8], chest: [0.1, 0.72], head: [0.17, 0.66],
    handL: [0.16, 0.86], handR: [0.04, 0.9],
    footL: [-0.1, 0.99], footR: [0.06, 0.995],
    kneeBend: 1, elbowBend: -1,
  },
  watch: {
    pelvis: [0, 0.52], chest: [0.02, 0.3], head: [0.08, 0.17],
    handL: [0.12, 0.38], handR: [0.15, 0.55],
    footL: [-0.07, 0.985], footR: [0.11, 0.99],
    kneeBend: 1, elbowBend: -1,
  },
  wave: {
    pelvis: [0, 0.52], chest: [0.02, 0.3], head: [0.06, 0.16],
    handL: [-0.15, 0.56], handR: [0.22, 0.28],
    footL: [-0.07, 0.985], footR: [0.11, 0.99],
    kneeBend: 1, elbowBend: -1,
  },
  curious: {
    pelvis: [0, 0.55], chest: [0.08, 0.33], head: [0.14, 0.21],
    handL: [-0.13, 0.58], handR: [0.14, 0.38],
    footL: [-0.08, 0.985], footR: [0.12, 0.99],
    kneeBend: 1, elbowBend: -1,
  },
  airborne: {
    pelvis: [0, 0.5], chest: [0, 0.29], head: [0.04, 0.15],
    handL: [-0.24, 0.2], handR: [0.26, 0.18],
    footL: [-0.13, 0.8], footR: [0.13, 0.85],
    kneeBend: 1, elbowBend: -1,
  },
  land: {
    pelvis: [0, 0.7], chest: [0.09, 0.52], head: [0.13, 0.4],
    handL: [-0.14, 0.66], handR: [0.22, 0.94],
    footL: [-0.18, 0.985], footR: [0.18, 0.99],
    kneeBend: 1, elbowBend: -1, tension: 1,
  },
  dodge: {
    pelvis: [0, 0.56], chest: [-0.06, 0.34], head: [-0.1, 0.2],
    handL: [-0.28, 0.4], handR: [0.2, 0.5],
    footL: [-0.14, 0.985], footR: [0.14, 0.99],
    kneeBend: 1, elbowBend: -1, tension: 0.8,
  },
  point: {
    pelvis: [0, 0.52], chest: [0.02, 0.3], head: [0.06, 0.16],
    handL: [-0.15, 0.56], handR: [0.34, 0.3],
    footL: [-0.07, 0.985], footR: [0.11, 0.99],
    kneeBend: 1, elbowBend: -1, tension: 0.4,
  },
};

function blendPose(a, b, t) {
  const P = (ka, kb) => [lerp(ka[0], kb[0], t), lerp(ka[1], kb[1], t)];
  return {
    pelvis: P(a.pelvis, b.pelvis),
    chest: P(a.chest, b.chest),
    head: P(a.head, b.head),
    handL: P(a.handL, b.handL),
    handR: P(a.handR, b.handR),
    footL: P(a.footL, b.footL),
    footR: P(a.footR, b.footR),
    kneeBend: t < 0.5 ? a.kneeBend : b.kneeBend,
    elbowBend: t < 0.5 ? a.elbowBend : b.elbowBend,
    tension: lerp(a.tension ?? 0, b.tension ?? 0, t),
  };
}

// ─── Two-Bone IK ─────────────────────────────────────────────────────
const UPPER_ARM = 0.17;
const FOREARM = 0.17;
const THIGH = 0.21;
const SHIN = 0.22;

function twoBone(ax, ay, tx, ty, l1, l2, bend) {
  let dx = tx - ax;
  let dy = ty - ay;
  let d = Math.hypot(dx, dy);
  const min = Math.abs(l1 - l2) + 1e-4;
  const max = l1 + l2 - 1e-4;
  d = clamp(d, min, max);
  const ux = dx / (Math.hypot(dx, dy) || 1);
  const uy = dy / (Math.hypot(dx, dy) || 1);
  dx = ux * d;
  dy = uy * d;
  const a1 = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const base = Math.atan2(dy, dx);
  const ang = base + a1 * bend;
  return [ax + Math.cos(ang) * l1, ay + Math.sin(ang) * l1];
}

// ─── Swing Rope (Verlet Pendulum) ────────────────────────────────────
const GRAVITY = 2600;
const ROPE_DAMPING = 0.996;

class SwingRope {
  constructor() {
    this.anchor = { x: 0, y: 0 };
    this.length = 200;
    this.naturalLength = 200;
    this.attached = false;
    this.x = 0; this.y = 0; this.px = 0; this.py = 0;
    this.shootT = 1;
    this.recoil = null;
  }
  attach(ax, ay, bx, by, velX, velY) {
    this.anchor = { x: ax, y: ay };
    this.length = Math.max(60, Math.hypot(bx - ax, by - ay));
    this.naturalLength = this.length;
    this.x = bx; this.y = by;
    this.px = bx - velX; this.py = by - velY;
    this.attached = true;
    this.shootT = 0;
  }
  detach() {
    if (!this.attached) return;
    this.attached = false;
    this.recoil = { ax: this.anchor.x, ay: this.anchor.y, bx: this.x, by: this.y, t: 0 };
  }
  scale(sx, sy) {
    this.anchor.x *= sx; this.anchor.y *= sy;
    this.x *= sx; this.px *= sx;
    this.y *= sy; this.py *= sy;
    const ls = Math.sqrt(Math.abs(sx * sy));
    this.length *= ls; this.naturalLength *= ls;
    if (this.recoil) {
      this.recoil.ax *= sx; this.recoil.ay *= sy;
      this.recoil.bx *= sx; this.recoil.by *= sy;
    }
  }
  velocity(dt) {
    const d = Math.max(dt, 1e-4);
    return { x: (this.x - this.px) / d, y: (this.y - this.py) / d };
  }
  step(dt, pump) {
    this.shootT = Math.min(1, this.shootT + dt * 3.2);
    if (this.recoil) this.recoil.t += dt;
    if (!this.attached) return;
    if (pump !== 0) {
      const min = this.naturalLength * 0.55;
      this.length = clamp(this.length - pump * 200 * dt, min, this.naturalLength);
    } else {
      this.length += (this.naturalLength - this.length) * Math.min(1, dt * 2.5);
    }
    const nx = this.x + (this.x - this.px) * ROPE_DAMPING;
    const ny = this.y + (this.y - this.py) * ROPE_DAMPING + GRAVITY * dt * dt;
    this.px = this.x; this.py = this.y;
    this.x = nx; this.y = ny;
    const dx = this.x - this.anchor.x;
    const dy = this.y - this.anchor.y;
    const d = Math.hypot(dx, dy) || 1e-4;
    const diff = (d - this.length) / d;
    this.x -= dx * diff;
    this.y -= dy * diff;
  }
  render(ctx, accent) {
    ctx.save();
    ctx.lineCap = "round";
    if (this.recoil && this.recoil.t < 0.35) {
      const r = this.recoil;
      const t = r.t / 0.35;
      const bx = r.bx + (r.ax - r.bx) * t * t * (3 - 2 * t);
      const by = r.by + (r.ay - r.by) * t * t * (3 - 2 * t) + Math.sin(t * Math.PI) * 18;
      ctx.strokeStyle = rgba("#e8ecff", 0.7 * (1 - t));
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(r.ax, r.ay);
      ctx.quadraticCurveTo((r.ax + bx) / 2, (r.ay + by) / 2 + 14 * (1 - t), bx, by);
      ctx.stroke();
    } else {
      this.recoil = null;
    }
    if (this.attached && this.shootT > 0) {
      const ex = this.anchor.x + (this.x - this.anchor.x) * this.shootT;
      const ey = this.anchor.y + (this.y - this.anchor.y) * this.shootT;
      const sag = 8 * (1 - this.shootT);
      ctx.shadowColor = accent;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = rgba(accent, 0.35);
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(this.anchor.x, this.anchor.y);
      ctx.quadraticCurveTo((this.anchor.x + ex) / 2, (this.anchor.y + ey) / 2 + sag, ex, ey);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(240,250,255,0.95)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(this.anchor.x, this.anchor.y);
      ctx.quadraticCurveTo((this.anchor.x + ex) / 2, (this.anchor.y + ey) / 2 + sag, ex, ey);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// ─── Web Effects (Shots + Splats) ────────────────────────────────────
class WebEffects {
  constructor() {
    this.splats = [];
    this.shots = [];
  }
  splat(x, y) {
    if (this.splats.length > 6) this.splats.shift();
    this.splats.push({ x, y, t: 0, spokes: 6 + Math.floor(rand(3)) });
  }
  shot(x1, y1, x2, y2) {
    if (this.shots.length > 4) this.shots.shift();
    this.shots.push({ x1, y1, x2, y2, t: 0 });
  }
  update(dt) {
    for (const s of this.splats) s.t += dt;
    for (const s of this.shots) s.t += dt;
    this.splats = this.splats.filter((s) => s.t < 4);
    this.shots = this.shots.filter((s) => s.t < 0.5);
  }
  render(ctx) {
    ctx.save();
    ctx.lineCap = "round";
    for (const s of this.shots) {
      const p = Math.min(1, s.t / 0.12);
      const ex = s.x1 + (s.x2 - s.x1) * p;
      const ey = s.y1 + (s.y2 - s.y1) * p;
      const fade = s.t < 0.2 ? 1 : 1 - (s.t - 0.2) / 0.3;
      ctx.strokeStyle = `rgba(240,244,255,${0.9 * fade})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }
    for (const s of this.splats) {
      const grow = Math.min(1, s.t / 0.15);
      const fade = s.t < 2.4 ? 1 : 1 - (s.t - 2.4) / 1.6;
      const r = 12 * grow;
      ctx.strokeStyle = `rgba(235,240,255,${0.75 * fade})`;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < s.spokes; i++) {
        const a = (i / s.spokes) * TAU + s.spokes;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + Math.cos(a) * r, s.y + Math.sin(a) * r);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(235,240,255,${0.9 * fade})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.8, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }
}

// ─── Draw Humanoid Spider ────────────────────────────────────────────
function drawSpider(ctx, s) {
  const sz = s.size;
  const pal = s.palette;
  const pose = s.pose;
  const ink = shade(pal.blue, 0.24);

  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(s.rotation);
  const stretchX = 1 + (1 - s.squash) * 0.72;
  ctx.scale(s.facing * sz * stretchX, sz * s.squash);
  ctx.globalAlpha = s.alpha;

  if (s.hidden !== "none") {
    ctx.beginPath();
    if (s.hidden === "left") ctx.rect(-0.2, -0.6, 0.75, 2);
    else if (s.hidden === "right") ctx.rect(-0.55, -0.6, 0.75, 2);
    else ctx.rect(-0.6, -0.25, 1.6, 0.7);
    ctx.clip();
  }

  // Breathing + physics-driven walk cycle
  const breathe = Math.sin(s.breathe * TAU * 0.28) * 0.008;
  let chestOff = breathe;
  let bodyBob = 0;
  let feet = { L: pose.footL, R: pose.footR };
  let hands = { L: pose.handL, R: pose.handR };

  if (s.walkPhase >= 0) {
    const ph = s.walkPhase;
    const stride = 0.16;
    const lift = 0.09;
    
    // Natural stance & swing phase
    const swingL = Math.sin(ph);
    const swingR = Math.sin(ph + Math.PI);
    
    const footLX = -0.035 + swingL * stride;
    const footLY = 0.985 - Math.max(0, swingL) * lift;
    
    const footRX = -0.035 + swingR * stride;
    const footRY = 0.985 - Math.max(0, swingR) * lift;

    feet = {
      L: [footLX, footLY],
      R: [footRX, footRY],
    };
    
    // Arms swing opposite to legs
    hands = {
      L: [-0.14 - Math.cos(ph) * 0.12, 0.52 + Math.abs(Math.sin(ph)) * 0.04],
      R: [0.14 + Math.cos(ph) * 0.12, 0.52 + Math.abs(Math.sin(ph + Math.PI)) * 0.04],
    };
    
    bodyBob = -Math.abs(Math.sin(ph * 2)) * 0.016;
    chestOff += 0.02 + Math.abs(Math.sin(ph)) * 0.01;
  }

  const pelvis = [pose.pelvis[0], pose.pelvis[1] + bodyBob];
  const chest = [pose.chest[0], pose.chest[1] - chestOff + bodyBob * 0.72];
  const head = [
    pose.head[0] + Math.sin(s.headTilt) * 0.025,
    pose.head[1] - chestOff * 1.25 + bodyBob * 0.48,
  ];

  // Solve limbs with clean joints
  const shoulder = [chest[0] + 0.004, chest[1] + 0.034];
  const shoulderL = [shoulder[0] - 0.066, shoulder[1]];
  const shoulderR = [shoulder[0] + 0.066, shoulder[1]];
  const hipL = [pelvis[0] - 0.046, pelvis[1] + 0.01];
  const hipR = [pelvis[0] + 0.046, pelvis[1] + 0.01];
  const elbowL = twoBone(shoulderL[0], shoulderL[1], hands.L[0], hands.L[1], UPPER_ARM, FOREARM, -pose.elbowBend);
  const elbowR = twoBone(shoulderR[0], shoulderR[1], hands.R[0], hands.R[1], UPPER_ARM, FOREARM, pose.elbowBend);
  const kneeL = twoBone(hipL[0], hipL[1], feet.L[0], feet.L[1], THIGH, SHIN, pose.kneeBend);
  const kneeR = twoBone(hipR[0], hipR[1], feet.R[0], feet.R[1], THIGH, SHIN, -pose.kneeBend);

  const strokePath = (points, color, width, shadow = false) => {
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.strokeStyle = shadow ? shade(ink, 0.88) : ink;
    ctx.lineWidth = width + 0.008;
    ctx.stroke();

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();

    if (!shadow) {
      ctx.globalAlpha = s.alpha * 0.28;
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = Math.max(0.005, width * 0.16);
      ctx.stroke();
      ctx.globalAlpha = s.alpha;
    }
  };

  const segment = (a, b, color, width, shadow = false) => strokePath([a, b], color, width, shadow);

  const between = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

  const terminal = (p, rx, ry, color, angle, shadow = false) => {
    ctx.save();
    ctx.translate(p[0], p[1]);
    ctx.rotate(angle);
    ctx.fillStyle = shadow ? shade(color, 0.92) : color;
    ctx.strokeStyle = shadow ? shade(ink, 0.88) : ink;
    ctx.lineWidth = 0.008;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
    if (!shadow) {
      ctx.strokeStyle = "rgba(255,255,255,0.38)";
      ctx.lineWidth = 0.005;
      ctx.beginPath();
      ctx.arc(-rx * 0.12, -ry * 0.12, Math.max(rx, ry) * 0.5, Math.PI * 1.1, Math.PI * 1.7);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawLeg = (hip, knee, foot, shadow) => {
    const blue = shadow ? shade(pal.blue, 0.88) : pal.blue;
    const red = shadow ? shade(pal.red, 0.9) : pal.red;
    strokePath([hip, knee, foot], blue, 0.07, shadow);
    const bootTop = between(knee, foot, 0.46);
    segment(bootTop, foot, red, 0.065, shadow);
    const footAngle = Math.atan2(foot[1] - knee[1], foot[0] - knee[0]);
    terminal(foot, 0.046, 0.024, red, footAngle, shadow);
  };

  const drawArm = (top, elbow, hand, shadow) => {
    const red = shadow ? shade(pal.red, 0.9) : pal.red;
    const blue = shadow ? shade(pal.blue, 0.88) : pal.blue;
    strokePath([top, elbow, hand], blue, 0.054, shadow);
    const cuff = between(elbow, hand, 0.44);
    segment(cuff, hand, red, 0.056, shadow);
    const angle = Math.atan2(hand[1] - elbow[1], hand[0] - elbow[0]);
    terminal(hand, 0.036, 0.028, red, angle, shadow);
  };

  // Far limbs (shadow/depth)
  drawLeg(hipL, kneeL, feet.L, true);
  drawArm(shoulderL, elbowL, hands.L, true);

  // Torso
  const torsoDx = pelvis[0] - chest[0];
  const torsoDy = pelvis[1] - chest[1];
  const torsoLen = Math.max(0.14, Math.hypot(torsoDx, torsoDy));
  const torsoAngle = Math.atan2(torsoDy, torsoDx) - Math.PI / 2;
  ctx.save();
  ctx.translate(chest[0], chest[1]);
  ctx.rotate(torsoAngle);

  const torsoPath = () => {
    ctx.beginPath();
    ctx.moveTo(-0.047, -0.052);
    ctx.bezierCurveTo(-0.086, -0.052, -0.143, -0.016, -0.148, 0.042);
    ctx.bezierCurveTo(-0.145, 0.1, -0.108, torsoLen * 0.62, -0.097, torsoLen - 0.008);
    ctx.bezierCurveTo(-0.066, torsoLen + 0.032, 0.066, torsoLen + 0.032, 0.097, torsoLen - 0.008);
    ctx.bezierCurveTo(0.108, torsoLen * 0.62, 0.145, 0.1, 0.148, 0.042);
    ctx.bezierCurveTo(0.143, -0.016, 0.086, -0.052, 0.047, -0.052);
    ctx.quadraticCurveTo(0, -0.026, -0.047, -0.052);
    ctx.closePath();
  };

  torsoPath();
  ctx.fillStyle = pal.red;
  ctx.fill();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 0.022;
  ctx.stroke();

  // Blue side panels
  ctx.fillStyle = pal.blue;
  ctx.beginPath();
  ctx.moveTo(-0.147, 0.035);
  ctx.bezierCurveTo(-0.121, 0.074, -0.086, torsoLen * 0.36, -0.055, torsoLen * 0.62);
  ctx.lineTo(-0.038, torsoLen + 0.018);
  ctx.lineTo(-0.099, torsoLen - 0.004);
  ctx.bezierCurveTo(-0.11, torsoLen * 0.6, -0.145, 0.098, -0.147, 0.035);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0.147, 0.035);
  ctx.bezierCurveTo(0.121, 0.074, 0.086, torsoLen * 0.36, 0.055, torsoLen * 0.62);
  ctx.lineTo(0.038, torsoLen + 0.018);
  ctx.lineTo(0.099, torsoLen - 0.004);
  ctx.bezierCurveTo(0.11, torsoLen * 0.6, 0.145, 0.098, 0.147, 0.035);
  ctx.closePath();
  ctx.fill();

  // Suit webbing detail
  if (sz > 48) {
    ctx.strokeStyle = pal.web;
    ctx.lineWidth = 0.006;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, -0.036);
    ctx.lineTo(0, torsoLen * 0.72);
    ctx.moveTo(-0.036, -0.032);
    ctx.quadraticCurveTo(-0.076, 0.005, -0.106, 0.055);
    ctx.moveTo(0.036, -0.032);
    ctx.quadraticCurveTo(0.076, 0.005, 0.106, 0.055);
    ctx.moveTo(-0.098, 0.058);
    ctx.quadraticCurveTo(0, 0.09, 0.098, 0.058);
    ctx.moveTo(-0.076, Math.min(torsoLen * 0.52, 0.125));
    ctx.quadraticCurveTo(0, Math.min(torsoLen * 0.65, 0.15), 0.076, Math.min(torsoLen * 0.52, 0.125));
    ctx.stroke();
  }

  // Chest emblem
  if (sz > 58) {
    const ey = Math.min(torsoLen * 0.47, 0.105);
    ctx.save();
    ctx.translate(0, ey);
    ctx.strokeStyle = pal.trim;
    ctx.fillStyle = pal.trim;
    ctx.lineWidth = 0.008;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.ellipse(0, -0.008, 0.012, 0.018, 0, 0, TAU);
    ctx.ellipse(0, 0.018, 0.016, 0.025, 0, 0, TAU);
    ctx.fill();
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const y = -0.018 + i * 0.014;
        const reach = 0.04 + (i === 1 || i === 2 ? 0.012 : 0);
        ctx.beginPath();
        ctx.moveTo(side * 0.01, y);
        ctx.lineTo(side * 0.027, y + (i < 2 ? -0.012 : 0.01));
        ctx.lineTo(side * reach, y + (i < 2 ? -0.002 : 0.022));
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Edge light
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 0.007;
  ctx.beginPath();
  ctx.moveTo(-0.118, 0.005);
  ctx.quadraticCurveTo(-0.143, 0.06, -0.1, torsoLen * 0.76);
  ctx.stroke();

  ctx.restore(); // torso

  // Neck + near limbs
  const neckEnd = between(chest, head, 0.57);
  segment([chest[0], chest[1] - 0.018], neckEnd, pal.red, 0.073);
  drawLeg(hipR, kneeR, feet.R, false);
  drawArm(shoulderR, elbowR, hands.R, false);

  // ── Mask ──
  ctx.save();
  ctx.translate(head[0], head[1]);
  ctx.rotate(s.headTilt);

  const headPath = () => {
    ctx.beginPath();
    ctx.moveTo(0, -0.108);
    ctx.bezierCurveTo(0.064, -0.106, 0.094, -0.065, 0.092, -0.008);
    ctx.bezierCurveTo(0.091, 0.055, 0.052, 0.099, 0, 0.112);
    ctx.bezierCurveTo(-0.052, 0.099, -0.091, 0.055, -0.092, -0.008);
    ctx.bezierCurveTo(-0.094, -0.065, -0.064, -0.106, 0, -0.108);
    ctx.closePath();
  };

  headPath();
  ctx.fillStyle = pal.red;
  ctx.fill();

  // Mask shading + webbing
  ctx.save();
  headPath();
  ctx.clip();
  const maskShade = ctx.createLinearGradient(-0.1, -0.1, 0.11, 0.1);
  maskShade.addColorStop(0, "rgba(255,255,255,0.16)");
  maskShade.addColorStop(0.48, "rgba(255,255,255,0)");
  maskShade.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = maskShade;
  ctx.fillRect(-0.11, -0.12, 0.22, 0.25);

  if (sz > 48) {
    ctx.strokeStyle = pal.web;
    ctx.lineWidth = 0.006;
    ctx.lineCap = "round";
    const rays = [
      [0, -0.112], [0.059, -0.092], [0.093, -0.03], [0.08, 0.07],
      [0.035, 0.108], [-0.035, 0.108], [-0.08, 0.07], [-0.093, -0.03], [-0.059, -0.092],
    ];
    for (const p of rays) {
      ctx.beginPath();
      ctx.moveTo(0, 0.006);
      ctx.lineTo(p[0], p[1]);
      ctx.stroke();
    }
    for (const [rx, ry] of [[0.035, 0.04], [0.064, 0.073], [0.093, 0.105]]) {
      ctx.beginPath();
      ctx.ellipse(0, 0.006, rx, ry, 0, 0, TAU);
      ctx.stroke();
    }
  }
  ctx.restore();

  headPath();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 0.02;
  ctx.stroke();

  // ── Expressive Eyes ──
  let eyeHeight = Math.max(0.07, 1 - s.blink);
  let eyeWidth = 1;
  let lidShift = 0;
  switch (s.expr) {
    case "happy": eyeHeight *= 0.7; lidShift = -0.005; break;
    case "suspicious": eyeHeight *= 0.78; lidShift = 0.009; break;
    case "sleepy": eyeHeight = Math.min(eyeHeight, 0.34); lidShift = 0.012; break;
    case "wow": eyeHeight = Math.min(1.16, eyeHeight * 1.12); eyeWidth = 1.08; break;
    default: break;
  }
  const lookNudgeX = clamp(s.lookX, -1, 1) * 0.0035;
  const lookNudgeY = clamp(s.lookY, -1, 1) * 0.0025;

  for (const side of [-1, 1]) {
    const innerX = side * (0.014 * eyeWidth) + lookNudgeX;
    const outerX = side * (0.078 * eyeWidth) + lookNudgeX;
    const topY = (-0.042 + lidShift + lookNudgeY) * eyeHeight;
    const bottomY = (0.043 + lidShift + lookNudgeY) * eyeHeight;
    ctx.beginPath();
    ctx.moveTo(innerX, topY);
    ctx.bezierCurveTo(
      side * 0.036 * eyeWidth + lookNudgeX, topY * 1.28,
      side * 0.068 * eyeWidth + lookNudgeX, topY * 1.12,
      outerX, topY * 0.3
    );
    ctx.bezierCurveTo(
      side * 0.078 * eyeWidth + lookNudgeX, bottomY * 0.42,
      side * 0.049 * eyeWidth + lookNudgeX, bottomY * 1.08,
      innerX, bottomY * 0.76
    );
    ctx.closePath();
    ctx.fillStyle = pal.lens;
    ctx.fill();
    ctx.strokeStyle = pal.trim;
    ctx.lineWidth = 0.012;
    ctx.lineJoin = "round";
    ctx.stroke();

    if (eyeHeight > 0.25) {
      ctx.strokeStyle = "rgba(255,255,255,0.52)";
      ctx.lineWidth = 0.004;
      ctx.beginPath();
      ctx.moveTo(innerX + side * 0.006, topY * 0.75);
      ctx.quadraticCurveTo(side * 0.047, topY * 1.08, outerX - side * 0.01, topY * 0.56);
      ctx.stroke();
    }
  }

  ctx.restore(); // head
  ctx.restore(); // body
}

// ─── Spider Controller ───────────────────────────────────────────────
const AIR_GRAVITY = 3400;
const WALK_SPEED = 130;
const RUN_SPEED = 580;

class SpiderController {
  constructor(canvas, palette, accentColor) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.palette = palette;
    this.accentColor = accentColor;
    this.brain = new Brain();
    this.fx = new WebEffects();
    this.rope = new SwingRope();

    // Physics
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.mode = "hidden";
    this.facing = 1;
    this.w = 0; this.h = 0;
    this.groundY = 0;
    this.margin = 26;

    // Render
    this.size = 84;
    this.rotation = 0;
    this.targetRotation = 0;
    this.squash = 1;
    this.alpha = 0;
    this.pose = POSES.stand;
    this.poseName = "stand";
    this.poseBlend = 9;
    this.walkPhase = -1;
    this.breathe = 0;
    this.blink = 0;
    this.nextBlink = 2;
    this.expr = "neutral";
    this.exprHold = 0;
    this.lookX = 0; this.lookY = 0;
    this.lookTX = 0; this.lookTY = 0;
    this.headTilt = 0;
    this.headTiltTarget = 0;
    this.hiddenEdge = "none";
    this.poseTweak = null;

    // Behavior
    this.behavior = null;
    this.idleGap = 1.5;
    this.stepSfxPhase = 0;

    // Pointer
    this.pointer = { x: -999, y: -999, vx: 0, vy: 0, lastT: 0 };
    this.fleeCooldown = 0;

    // Swing
    this.swingPump = 0;
    this.hammockAnchors = { ax: 0, bx: 0 };

    // Loop
    this.running = false;
    this.raf = 0;
    this.lastT = 0;
    this.frameDt = 1 / 60;
  }

  resize() {
    const oldW = this.w;
    const oldH = this.h;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = Math.max(1, window.innerWidth);
    this.h = Math.max(1, window.innerHeight);
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.ctx.setTransform(this.canvas.width / this.w, 0, 0, this.canvas.height / this.h, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
    this.groundY = this.h - 14;
    this.size = clamp(Math.min(this.w, this.h) * 0.16, 90, 140);

    if (oldW > 0 && oldH > 0) {
      const sx = this.w / oldW;
      const sy = this.h / oldH;
      this.pos.x *= sx;
      this.pos.y = this.mode === "ground" ? this.groundY : this.pos.y * sy;
      this.vel.x *= sx; this.vel.y *= sy;
      this.rope.scale(sx, sy);
      this.hammockAnchors.ax *= sx; this.hammockAnchors.bx *= sx;
      if (this.behavior) { this.behavior.tx *= sx; this.behavior.ty *= sy; }
      if (!this._isBusy("flee", "peek")) {
        this.pos.x = clamp(this.pos.x, this.margin - this.size * 0.25, this.w - this.margin + this.size * 0.25);
      }
      if (this.mode === "ground") this.pos.y = this.groundY;
    }

    if (!Number.isFinite(this.pos.x) || !Number.isFinite(this.pos.y)) {
      this.rope.detach();
      this.behavior = null;
      this.mode = "ground";
      this.pos = { x: this.w / 2, y: this.groundY };
      this.vel = { x: 0, y: 0 };
      this.alpha = 1;
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.resize();
    this.lastT = performance.now();
    if (this.mode === "hidden" && this.alpha === 0) this._spawnEntrance();
    const loop = (now) => {
      if (!this.running) return;
      const dt = clamp((now - this.lastT) / 1000, 0.0001, 0.05);
      this.lastT = now;
      this._update(dt);
      this._draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  onPointerMove(x, y) {
    const now = performance.now();
    const dt = Math.max(16, now - this.pointer.lastT) / 1000;
    this.pointer.vx = (x - this.pointer.x) / dt;
    this.pointer.vy = (y - this.pointer.y) / dt;
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.lastT = now;
  }

  onPointerDown(x, y) {
    if (this.mode === "hidden" || this.alpha < 0.5) return;
    const d = Math.hypot(x - this.pos.x, y - (this.pos.y - this.size * 0.5));
    if (d < 300 && !this._isBusy("dodge", "flee")) {
      this._startDodge(x);
    }
  }

  onDoubleClick(x, y) {
    if (this.mode === "hidden" || this.alpha < 0.5) return;
    this._faceToward(x);
    this.expr = "wow";
    this.exprHold = 0.8;
    this._startClimbString(x, Math.min(y, 80));
  }

  // ── Internal helpers ──

  _isBusy(...kinds) { return !!this.behavior && kinds.includes(this.behavior.kind); }
  _setPose(name, blend = 9) { this.poseName = name; this.poseBlend = blend; }
  _faceToward(x) { if (Math.abs(x - this.pos.x) > 8) this.facing = x > this.pos.x ? 1 : -1; }
  _boxTop() { return this.pos.y - this.size; }

  _handWorld() {
    const localX = 0.09 * this.facing;
    const localY = 0.05;
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    return {
      x: this.pos.x + (cos * localX - sin * localY) * this.size,
      y: this._boxTop() + (sin * localX + cos * localY) * this.size,
    };
  }

  _endBehavior() {
    this.behavior = null;
    this.poseTweak = null;
    this.walkPhase = -1;
    this.headTiltTarget = 0;
    this.idleGap = rand(0.4, 1.2);
  }

  _spawnEntrance() {
    const fromLeft = chance(0.5);
    this.mode = "air";
    this.pos = { x: fromLeft ? -this.size * 0.35 : this.w + this.size * 0.35, y: this.h * 0.28 };
    this.facing = fromLeft ? 1 : -1;
    this.vel = { x: (fromLeft ? 1 : -1) * rand(420, 560), y: -70 };
    this.alpha = 1;
    this._setPose("airborne", 12);
    this._startSwing(fromLeft ? this.w * 0.4 : this.w * 0.6, true);
  }

  // ── Behavior Starters ──

  _startWalk(run, tx) {
    const dest = tx ?? rand(this.margin + 30, this.w - this.margin - 30);
    this.mode = "ground";
    this.behavior = { kind: run ? "run" : "walk", t: 0, dur: 99, tx: dest, ty: 0, wall: 1, phase: 0, chained: false, released: false, dir: 1 };
    this._setPose("stand", 10);
  }

  _startHop(tx) {
    const dest = clamp(tx ?? this.pos.x + this.facing * rand(120, 320), this.margin, this.w - this.margin);
    const dist = dest - this.pos.x;
    const T = clamp(Math.abs(dist) / 380, 0.35, 0.75);
    this.vel = { x: dist / T, y: -AIR_GRAVITY * T * 0.5 * 0.85 };
    this.mode = "air";
    this._setPose("airborne", 14);
    this.behavior = { kind: "hop", t: 0, dur: 99, tx: dest, ty: 0, wall: 1, phase: 0, chained: false, released: false, dir: 1 };
  }

  _pickAnchor(preferX) {
    const r = Math.random();
    if (r < 0.12) return { x: chance(0.5) ? rand(4, 30) : this.w - rand(4, 30), y: rand(4, 40) };
    if (r < 0.2) {
      const left = preferX !== undefined ? preferX > this.w / 2 : chance(0.5);
      return { x: left ? rand(6, 26) : this.w - rand(6, 26), y: rand(this.h * 0.08, this.h * 0.3) };
    }
    const x = preferX !== undefined
      ? clamp(preferX + rand(-160, 160), 40, this.w - 40)
      : clamp(this.pos.x + this.facing * rand(140, 380) + rand(-120, 120), 40, this.w - 40);
    return { x, y: rand(4, 36) };
  }

  _startSwing(anchorX, immediate = false) {
    const anchor = immediate && anchorX !== undefined
      ? { x: clamp(anchorX, 40, this.w - 40), y: rand(8, Math.max(9, Math.min(36, this.h * 0.06))) }
      : this._pickAnchor(anchorX);
    const attach = () => {
      const hand = { x: this.pos.x, y: this._boxTop() + this.size * 0.1 };
      this.rope.attach(anchor.x, anchor.y, hand.x, hand.y, this.vel.x / 60, this.vel.y / 60);
      this.mode = "swing";
      this.swingPump = 0;
      this.fx.splat(anchor.x, anchor.y);
    };
    if (this.mode === "ground") {
      this.vel = { x: clamp((anchor.x - this.pos.x) * 2, -520, 520), y: -rand(420, 560) };
      this.mode = "air";
    } else if (immediate) {
      attach();
    }
    this._setPose("swing", 8);
    this.behavior = {
      kind: "swing", t: 0, dur: rand(1.4, 2.6), tx: anchor.x, ty: anchor.y,
      wall: 1, phase: 0, chained: false, released: false, dir: 1,
    };
  }

  _startHang(atX) {
    const x = clamp(atX ?? this.pos.x, this.w * 0.14, this.w * 0.72);
    this.rope.attach(x, rand(6, 20), this.pos.x, this.pos.y - this.size * 0.98, 0, 0);
    this.mode = "hang";
    this.swingPump = 0;
    this._setPose("hang", 7);
    this.fx.splat(x, 12);
    this.behavior = { kind: "hang", t: 0, dur: rand(4, 9), tx: x, ty: 12, wall: 1, phase: rand(3), chained: false, released: false, dir: 1 };
  }

  _startCrawl() {
    const wall = this.pos.x < this.w / 2 ? -1 : 1;
    this.mode = "wall";
    this.pos.x = wall === -1 ? this.margin - 6 : this.w - this.margin + 6;
    this.pos.y = this.groundY;
    this._setPose("crawl", 8);
    const climbTo = rand(this.h * 0.25, this.h * 0.6);
    this.behavior = { kind: "crawlWall", t: 0, dur: rand(4, 8), tx: 0, ty: climbTo, wall, phase: 0, chained: false, released: false, dir: 1 };
  }

  _startPeek() {
    const edgeLeft = chance(0.5);
    this.mode = "ground";
    this.hiddenEdge = edgeLeft ? "left" : "right";
    this.pos.x = edgeLeft ? -this.size * 0.32 : this.w + this.size * 0.32;
    this.facing = edgeLeft ? 1 : -1;
    this._setPose("curious", 5);
    this.behavior = { kind: "peek", t: 0, dur: rand(3.5, 7), tx: 0, ty: 0, wall: 1, phase: 0, chained: false, released: false, dir: 1 };
  }

  _startDodge(fromX) {
    const dir = this.pos.x >= fromX ? 1 : -1;
    const dist = rand(130, 240);
    const T = 0.38;
    this.rope.detach();
    this.vel = { x: (dir * dist) / T, y: -AIR_GRAVITY * T * 0.42 };
    this.mode = "air";
    this._setPose("dodge", 16);
    this.expr = "wow";
    this.exprHold = 0.6;
    this.behavior = { kind: "dodge", t: 0, dur: 99, tx: 0, ty: 0, wall: 1, phase: 0, chained: false, released: false, dir };
  }

  _startClimbString(targetX, targetY) {
    const tx = clamp(targetX ?? (this.pos.x + rand(-100, 100)), 50, this.w - 50);
    const ty = clamp(targetY ?? rand(15, 45), 10, this.h * 0.22);
    const hand = this._handWorld();
    this.fx.shot(hand.x, hand.y, tx, ty);
    this.fx.splat(tx, ty);
    this.rope.attach(tx, ty, hand.x, hand.y, 0, -500);
    this.mode = "climb";
    this._setPose("swing", 10);
    this.behavior = {
      kind: "climbString", t: 0, dur: rand(1.4, 2.5), tx, ty,
      wall: 1, phase: 0, chained: false, released: false, dir: 1,
    };
  }

  _dispatch(kind) {
    switch (kind) {
      case "climbString": return this._startClimbString();
      case "walk": return this._startWalk(false);
      case "run": return this._startWalk(true);
      case "hop": return this._startHop();
      case "swing": return this._startSwing();
      case "hang": return this._startHang();
      case "crawlWall": return this._startCrawl();
      case "peek": return this._startPeek();
      case "sitGround": case "perch": case "crouch": case "sleep":
      case "watch": case "wave": case "idle": {
        const poseFor = {
          sitGround: "sit", perch: "sit", crouch: "crouch", sleep: "sleep",
          watch: "watch", wave: "wave", idle: "stand",
        };
        const durFor = {
          sitGround: rand(4, 9), perch: rand(5, 10), crouch: rand(2.5, 6), sleep: rand(6, 12),
          watch: 1.9, wave: 2.2, idle: rand(3, 7),
        };
        if (kind === "wave") {
          this.poseTweak = (p, t) => ({
            ...p, handR: [0.28 + Math.sin(t * 9) * 0.055, 0.12 + Math.cos(t * 9) * 0.03],
          });
        }
        if (kind === "watch") {
          this.poseTweak = (p, t) => ({
            ...p, head: [p.head[0], p.head[1] + (t > 0.7 ? Math.sin(t * 5) * 0.006 : 0)],
          });
        }
        if (kind === "sleep") this.expr = "sleepy";
        this.behavior = { kind, t: 0, dur: durFor[kind], tx: 0, ty: 0, wall: 1, phase: 0, chained: false, released: false, dir: 1 };
        if (kind === "perch") {
          this._startHang(this.pos.x + rand(-60, 60));
          if (this.behavior) this.behavior.kind = "perch";
          this._setPose("sit", 6);
          return;
        }
        this._setPose(poseFor[kind], kind === "crouch" ? 12 : 6);
        return;
      }
    }
  }

  // ── Main Update ──

  _update(dt) {
    this.frameDt = dt;

    if (!Number.isFinite(this.pos.x) || !Number.isFinite(this.pos.y)
      || !Number.isFinite(this.vel.x) || !Number.isFinite(this.vel.y)) {
      this.rope.detach();
      this.behavior = null;
      this.mode = "ground";
      this.pos = { x: this.w / 2, y: this.groundY };
      this.vel = { x: 0, y: 0 };
      this.rotation = 0; this.targetRotation = 0;
    }

    if (this.mode !== "hidden") this.alpha = damp(this.alpha, 1, 9, dt);

    this.brain.tick(dt);

    // Ambient life
    this.breathe += dt;
    this.nextBlink -= dt;
    if (this.nextBlink <= 0) {
      this.nextBlink = rand(2.4, 5.5);
      this.blink = 1;
    }
    this.blink = damp(this.blink, 0, 14, dt);
    if (this.exprHold > 0) {
      this.exprHold -= dt;
      if (this.exprHold <= 0) this.expr = "neutral";
    }
    this.headTilt = damp(this.headTilt, this.headTiltTarget, 6, dt);
    this.squash = damp(this.squash, 1, 9, dt);
    this.rotation = damp(this.rotation, this.targetRotation, 8, dt);

    // Eye follow cursor
    const headWorldY = this._boxTop() + this.size * 0.2;
    const pd = Math.hypot(this.pointer.x - this.pos.x, this.pointer.y - headWorldY);
    if (pd < 620 && this.pointer.x > 0) {
      this.lookTX = clamp((this.pointer.x - this.pos.x) / 180, -1, 1);
      this.lookTY = clamp((this.pointer.y - headWorldY) / 220, -1, 1);
    } else {
      this.lookTX = Math.sin(this.breathe * 0.5) * 0.35;
      this.lookTY = 0;
    }
    this.lookX = damp(this.lookX, this.lookTX, 7, dt);
    this.lookY = damp(this.lookY, this.lookTY, 7, dt);

    // Reactions
    this.fleeCooldown = Math.max(0, this.fleeCooldown - dt);
    this._reactions();

    // Behavior
    if (this.behavior) this._updateBehavior(dt);
    else {
      this.idleGap -= dt;
      if (this.idleGap <= 0 && this.mode === "ground") {
        this._dispatch(this.brain.pick());
      }
    }

    // Physics by mode
    switch (this.mode) {
      case "climb": {
        this.rope.length = Math.max(35, this.rope.length - dt * 520);
        this.rope.step(dt, 0.9);
        const bob = { x: this.rope.x, y: this.rope.y };
        this.pos.x = damp(this.pos.x, bob.x, 12, dt);
        this.pos.y = damp(this.pos.y, bob.y + this.size * 0.65, 12, dt);
        
        // Physical rotation toward string vector
        const stringAngle = Math.atan2(this.rope.anchor.y - bob.y, this.rope.anchor.x - bob.x) + Math.PI / 2;
        this.targetRotation = clamp(stringAngle, -0.6, 0.6);
        this.rotation = damp(this.rotation, this.targetRotation, 12, dt);

        // Hand-over-hand climbing animation physics
        const tClimb = this.behavior ? this.behavior.t : 0;
        const armCycle = Math.sin(tClimb * 16);
        this.poseTweak = (p) => ({
          ...p,
          handL: armCycle > 0 ? [-0.04, -0.16] : [0.06, 0.08],
          handR: armCycle > 0 ? [0.06, 0.08] : [-0.04, -0.16],
          footL: [-0.14, 0.82 + Math.sin(tClimb * 12) * 0.09],
          footR: [0.14, 0.82 - Math.sin(tClimb * 12) * 0.09],
          kneeBend: 1, elbowBend: 1,
        });

        if (this.pos.y <= this.rope.anchor.y + this.size * 1.1 || this.rope.length <= 38) {
          this.rope.detach();
          this.mode = "air";
          this.vel = { x: rand(-220, 220), y: -300 };
          this._setPose("airborne", 12);
          this._endBehavior();
        }
        break;
      }
      case "air": {
        this.vel.y += AIR_GRAVITY * dt;
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
        this.targetRotation = clamp(this.vel.x / 2600, -0.22, 0.22);
        if (this.vel.y > 120 && this.poseName !== "airborne") this._setPose("airborne", 12);
        this.pos.x = clamp(this.pos.x, this.margin - 4, this.w - this.margin + 4);
        if (this.pos.y >= this.groundY) this._land();
        break;
      }
      case "swing": {
        const vel = this.rope.velocity(dt);
        this.swingPump = vel.y < 0 ? clamp(Math.abs(vel.x) / 480, 0.2, 1) : -0.35;
        this.rope.step(dt, this.swingPump * 0.6);
        const push = clamp((vel.x || 1), -1, 1) * 30;
        this.rope.x += push * dt;
        const bob = { x: this.rope.x, y: this.rope.y };
        const angle = Math.atan2(this.rope.anchor.x - bob.x, -(this.rope.anchor.y - bob.y));
        this.targetRotation = clamp(angle, -1.05, 1.05);
        this.rotation = this.targetRotation;
        const handLocalX = 0.09 * this.facing;
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        this.pos.x = bob.x - (cos * handLocalX - sin * 0.05) * this.size;
        this.pos.y = bob.y - (sin * handLocalX + cos * 0.05) * this.size + this.size;
        this._faceToward(this.pos.x + vel.x);
        if (this.pos.y >= this.groundY - this.size * 0.2) {
          this.rope.detach();
          const v2 = this.rope.velocity(dt);
          this.vel = { x: v2.x, y: Math.min(v2.y, 0) };
          this.mode = "air";
          this._setPose("airborne", 12);
          this._endBehavior();
        }
        break;
      }
      case "hang": {
        if (this.swingPump === -1) break; // hammock
        if (this.behavior) this.behavior.phase += dt * 2.4;
        const sway = Math.sin((this.behavior?.phase ?? 0)) * 0.08 * Math.max(0.3, 1 - (this.behavior?.t ?? 0) * 0.04);
        this.targetRotation = Math.PI + sway;
        const anchor = this.rope.anchor;
        const len = clamp(Math.hypot(this.pos.x - anchor.x, (this.pos.y - this.size) - anchor.y), this.size * 0.8, this.size * 2.4);
        const sx = anchor.x + Math.sin(sway * 2.2) * len * 0.12;
        const sy = anchor.y + len;
        this.pos.x = damp(this.pos.x, sx, 5, dt);
        this.pos.y = damp(this.pos.y, sy + this.size * 0.98, 5, dt);
        break;
      }
      case "ground":
        this.pos.y = this.groundY;
        this.targetRotation = 0;
        break;
      case "wall":
        this.targetRotation = -((this.behavior?.wall ?? 1)) * 0.12;
        break;
      default: break;
    }

    // Pose blend
    let target = POSES[this.poseName];
    if (this.poseTweak) target = this.poseTweak(target, this.behavior?.t ?? this.breathe);
    this.pose = blendPose(this.pose, target, Math.min(1, dt * this.poseBlend));
  }

  _updateBehavior(dt) {
    const b = this.behavior;
    b.t += dt;

    switch (b.kind) {
      case "walk": case "run": {
        const run = b.kind === "run";
        const speed = run ? RUN_SPEED : WALK_SPEED;
        const dx = b.tx - this.pos.x;
        const step = speed * dt;
        if (Math.abs(dx) <= Math.max(8, step) || b.t > 14) {
          this.pos.x = clamp(b.tx, this.margin, this.w - this.margin);
          return this._endBehavior();
        }
        this._faceToward(b.tx);
        this.pos.x += Math.sign(dx) * Math.min(Math.abs(dx), step);
        const freqScale = run ? 14 : 9;
        this.walkPhase = (b.phase += dt * freqScale);
        this._setPose("stand", 12);
        break;
      }
      case "flee": {
        this._faceToward(b.tx);
        const sp = RUN_SPEED * 1.15;
        const dx = b.tx - this.pos.x;
        const step = sp * dt;
        if (Math.abs(dx) <= Math.max(10, step)) {
          this.pos.x = b.tx;
          return this._endBehavior();
        }
        this.pos.x += Math.sign(dx) * Math.min(Math.abs(dx), step);
        this.walkPhase = (b.phase += dt * 16);
        this._setPose("stand", 12);
        break;
      }
      case "hop": case "dodge": {
        if (this.mode === "ground") return this._endBehavior();
        break;
      }
      case "swing": {
        if (!this.rope.attached && this.mode === "air") {
          if (this.vel.y < -60 || this.pos.y < this.groundY - this.size * 1.6) {
            const hand = { x: this.pos.x, y: this._boxTop() + this.size * 0.1 };
            this.rope.attach(b.tx, b.ty, hand.x, hand.y, this.vel.x / 60, this.vel.y / 60);
            this.mode = "swing";
            this.fx.splat(b.tx, b.ty);
          }
          break;
        }
        if (this.mode !== "swing") break;
        const vel = this.rope.velocity(dt);
        const overApex = vel.y < 0 && Math.sign(vel.x || this.facing) === this.facing;
        const hardTimeout = b.t > b.dur + 2.4;
        if ((b.t > b.dur && overApex) || hardTimeout) {
          const v = this.rope.velocity(dt);
          this.rope.detach();
          this.mode = "air";
          this.vel = {
            x: clamp(Number.isFinite(v.x) ? v.x * 1.02 : 0, -900, 900),
            y: clamp(Number.isFinite(v.y) ? v.y - 120 : 80, -1000, 700),
          };
          this._setPose("airborne", 10);
          if (!hardTimeout && !b.chained && chance(0.4)) {
            b.chained = true;
            b.t = 0;
            b.dur = rand(1.2, 2.2);
            const anchor = this._pickAnchor(this.pos.x + this.facing * rand(200, 380));
            b.tx = anchor.x; b.ty = anchor.y;
            setTimeout(() => {
              if (this.behavior === b && this.mode === "air") {
                const a2 = this._pickAnchor(this.pos.x + this.facing * rand(150, 320));
                b.tx = a2.x; b.ty = a2.y;
                this.rope.attach(a2.x, a2.y, this.pos.x, this._boxTop() + this.size * 0.1, this.vel.x / 60, this.vel.y / 60);
                this.mode = "swing";
              }
            }, 260);
          } else {
            return this._endBehavior();
          }
        }
        break;
      }
      case "hang": {
        if (b.t > b.dur) {
          this.rope.detach();
          this.mode = "air";
          this.vel = { x: rand(-40, 40), y: 60 };
          this.targetRotation = 0;
          this._setPose("airborne", 8);
          return this._endBehavior();
        }
        break;
      }
      case "perch": {
        if (b.t > b.dur + 2) {
          this.rope.detach();
          this.mode = "air";
          this.vel = { x: rand(-60, 60), y: 80 };
          this.targetRotation = 0;
          this._setPose("airborne", 8);
          return this._endBehavior();
        }
        break;
      }
      case "crawlWall": {
        const speed = 70;
        const dy = b.ty - this.pos.y;
        if (Math.abs(dy) > 10) {
          this.pos.y += Math.sign(dy) * speed * dt;
          this.walkPhase = (b.phase += dt * 8);
        } else if (b.t > b.dur * 0.55 || chance(dt * 0.3)) {
          this.walkPhase = -1;
          if (b.t > b.dur) {
            this.mode = "ground";
            this.pos.x += -b.wall * 30;
            this.facing = -b.wall;
            this.hiddenEdge = "none";
            this._setPose("stand", 8);
            return this._endBehavior();
          }
        }
        this.targetRotation = -b.wall * 0.12;
        break;
      }
      case "peek": {
        this.headTiltTarget = Math.sin(b.t * 1.4) * 0.5 + 0.2;
        if (b.t > b.dur) {
          const cameFromLeft = this.hiddenEdge === "left";
          this.hiddenEdge = "none";
          this.pos.x = cameFromLeft ? this.margin + 10 : this.w - this.margin - 10;
          this.facing = cameFromLeft ? 1 : -1;
          this._setPose("stand", 8);
          return this._endBehavior();
        }
        break;
      }
      case "sitGround": case "crouch": case "sleep":
      case "watch": case "wave": case "idle": {
        if (b.kind === "sleep" || b.kind === "sitGround" || b.kind === "idle") {
          this.headTiltTarget = b.kind === "idle" ? Math.sin(b.t * 0.8) * 0.14 : 0;
        }
        if (b.kind === "sleep") {
          this.expr = "sleepy";
        }
        if (b.t > b.dur) return this._endBehavior();
        break;
      }
      case "landBeat": {
        if (b.t > b.dur) return this._endBehavior();
        break;
      }
      default: return this._endBehavior();
    }
  }

  _land() {
    this.pos.y = this.groundY;
    this.mode = "ground";
    this.vel = { x: 0, y: 0 };
    this.targetRotation = 0;
    this.rotation = 0;
    this.squash = 0.72;
    this._setPose("land", 18);
    this.behavior = {
      kind: "landBeat", t: 0, dur: 0.34, tx: 0, ty: 0, wall: 1, phase: 0, chained: false, released: false, dir: 1,
    };
    setTimeout(() => {
      if (!this.behavior || this.behavior.kind === "landBeat") this._setPose("stand", 7);
    }, 320);
  }

  _reactions() {
    if (this.mode === "hidden" || this.alpha < 0.5) return;
    if (this.fleeCooldown > 0) return;
    if (this._isBusy("flee", "dodge", "hop", "swing", "hang")) return;

    const headY = this._boxTop() + this.size * 0.4;
    const d = Math.hypot(this.pointer.x - this.pos.x, this.pointer.y - headY);
    const cursorSpeed = Math.hypot(this.pointer.vx, this.pointer.vy);

    if (d < 120 && cursorSpeed > 260) {
      this.fleeCooldown = 1.4;
      if (chance(0.3)) {
        this._startSwing(this.pos.x + (this.pos.x > this.pointer.x ? 1 : -1) * rand(200, 340));
      } else {
        this.behavior = {
          kind: "flee", t: 0, dur: 0.8,
          tx: clamp(this.pos.x + (this.pos.x > this.pointer.x ? 1 : -1) * rand(180, 320), this.margin, this.w - this.margin),
          ty: 0, wall: 1, phase: 0, chained: false, released: false, dir: 0.001,
        };
      }
    }
  }

  // ── Draw ──

  _draw() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);

    this.fx.update(this.frameDt);
    this.fx.render(ctx);

    // Web rendering
    if (this.mode === "swing" && this.rope.attached) {
      this.rope.render(ctx, this.accentColor);
    } else if (this.mode === "hang" && this.rope.attached) {
      ctx.save();
      ctx.strokeStyle = "rgba(240,244,255,0.9)";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(this.rope.anchor.x, this.rope.anchor.y);
      ctx.lineTo(this.pos.x, this._boxTop() + this.size * 0.04);
      ctx.stroke();
      ctx.restore();
    }

    // Draw the character
    if (this.alpha > 0.01) {
      drawSpider(ctx, {
        x: this.pos.x,
        y: this._boxTop(),
        rotation: this.rotation,
        facing: this.facing,
        size: this.size,
        alpha: this.alpha,
        squash: this.squash,
        pose: this.pose,
        headTilt: this.headTilt,
        lookX: this.lookX,
        lookY: this.lookY,
        blink: this.blink,
        expr: this.expr,
        palette: this.palette,
        walkPhase: this.walkPhase,
        breathe: this.breathe,
        hidden: this.hiddenEdge,
      });
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// React Component
// ═══════════════════════════════════════════════════════════════════════

const InteractiveSpider = ({
  // Vibrant palette that pops against dark portfolio backgrounds
  palette = {
    red: "#b44dff",      // Bright purple suit (main body/mask/gloves)
    blue: "#3b4cca",     // Rich vibrant blue suit panels & limbs
    web: "rgba(0,255,234,0.45)",  // Cyan web detail lines
    lens: "#00ffea",     // Bright cyan-green eyes
    trim: "#151830",     // Dark outline
  },
  accentColor = "#00d9ff",
  enabled = true,
}) => {
  const canvasRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctrl = new SpiderController(canvas, palette, accentColor);
    controllerRef.current = ctrl;

    // Event handlers
    const onPointerMove = (e) => ctrl.onPointerMove(e.clientX, e.clientY);
    const onPointerDown = (e) => ctrl.onPointerDown(e.clientX, e.clientY);
    const onDblClick = (e) => ctrl.onDoubleClick(e.clientX, e.clientY);
    const onResize = () => ctrl.resize();

    let resizeTimer = 0;
    const onResizeDebounced = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(onResize, 100);
    };

    const onVisibility = () => {
      if (document.hidden) ctrl.stop();
      else ctrl.start();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("dblclick", onDblClick);
    window.addEventListener("resize", onResizeDebounced);
    document.addEventListener("visibilitychange", onVisibility);

    ctrl.start();

    return () => {
      ctrl.stop();
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("dblclick", onDblClick);
      window.removeEventListener("resize", onResizeDebounced);
      document.removeEventListener("visibilitychange", onVisibility);
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default InteractiveSpider;
