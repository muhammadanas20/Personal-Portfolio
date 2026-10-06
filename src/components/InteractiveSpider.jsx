// src/components/InteractiveSpider.jsx
// ═══════════════════════════════════════════════════════════════════════
// Procedural Webhead Character — a Spider-Man-style humanoid that walks,
// swings, hangs, crawls walls, reacts to the cursor, and shows moods.
// Adapted from HyperTab's architecture into a single self-contained
// React component. Pure HTML5 Canvas 2D — zero external dependencies.
//
// Synced with HyperTab's recent spider rebuild:
//   • anatomy + gait model (stature-normalised proportions, muscle-girth
//     capsule meshes, stance/swing foot planting with ankle pitch,
//     contralateral arm swing, run flight phase)
//   • matrix-hierarchy rig (row-major 3×3 affine stack: body × spine ×
//     shoulders × wrists × head, inverse transforms for cursor aiming)
//   • reach-safe IK with depth-projected bend poles
//   • articulated hands (finger curls, spread, wrists) + new gestures
//   • shared attachment geometry — webs meet the rendered hand/ankles
//   • double-click "thwip" aiming from the actual wrist
//   • dragline silk rendering (thins under tension, sags when slack)
//   • ground contact shadows, reduced-motion companion
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

/** '#rrggbb' → rgb() with a multiplicative shade and optional white lift. */
const color = (hex, factor, white = 0) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${[(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map((v) => Math.round(clamp(v * factor + (255 - v) * white, 0, 255)))
    .join(",")})`;
};

// ─── Brain (Mood + Behavior) ─────────────────────────────────────────
const MOOD_TABLES = {
  chill: [
    ["climbString", 30], ["swing", 22], ["walk", 16], ["hop", 14], ["hang", 12],
    ["crawlWall", 12], ["run", 10], ["peek", 8], ["wave", 6], ["salute", 4],
  ],
  playful: [
    ["climbString", 36], ["swing", 28], ["run", 20], ["hop", 20], ["crawlWall", 12],
    ["hang", 10], ["peek", 8], ["wave", 6], ["walk", 6], ["salute", 5],
  ],
  sleepy: [
    ["climbString", 20], ["walk", 18], ["swing", 16], ["hang", 14],
    ["crawlWall", 10], ["hop", 8], ["crouch", 8], ["idle", 8], ["peek", 6],
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

// ─── Matrix math (row-major 3×3 affine) ─────────────────────────────
// Column vectors, parent × local. Canvas uses the same affine transform
// but a different argument order, hence apply().
const IDENTITY = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const translate = (x, y) => [1, 0, x, 0, 1, y, 0, 0, 1];
const scale = (x, y = x) => [x, 0, 0, 0, y, 0, 0, 0, 1];
const rotate = (r) => {
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [c, -s, 0, s, c, 0, 0, 0, 1];
};
function multiply(a, b) {
  return [
    a[0] * b[0] + a[1] * b[3],
    a[0] * b[1] + a[1] * b[4],
    a[0] * b[2] + a[1] * b[5] + a[2],
    a[3] * b[0] + a[4] * b[3],
    a[3] * b[1] + a[4] * b[4],
    a[3] * b[2] + a[4] * b[5] + a[5],
    0,
    0,
    1,
  ];
}
const compose = (...ms) => ms.reduce(multiply, IDENTITY);
const transform = (m, p) => [
  m[0] * p[0] + m[1] * p[1] + m[2],
  m[3] * p[0] + m[4] * p[1] + m[5],
];
function inverse(m) {
  const d = m[0] * m[4] - m[1] * m[3];
  if (Math.abs(d) < 1e-12) throw new RangeError("Singular rig transform");
  return [
    m[4] / d,
    -m[1] / d,
    (m[1] * m[5] - m[4] * m[2]) / d,
    -m[3] / d,
    m[0] / d,
    (m[3] * m[2] - m[0] * m[5]) / d,
    0,
    0,
    1,
  ];
}
function apply(ctx, m) {
  ctx.transform(m[0], m[3], m[1], m[4], m[2], m[5]);
}

// ─── Anatomy — stature-normalised proportions + gait ─────────────────
// 7.2-head athletic silhouette, tapered muscle profiles and gait targets.
// Art-directed proportions, not a medical anthropometric model.
// Coordinates: crown = 0, sole = 1, +y down.
const HEADS = 7.2;
const HEAD_H = 1 / HEADS;

/** Vertical landmarks, fraction of stature from the crown (y down). */
const LANDMARK = {
  crown: 0,
  chin: HEAD_H,
  brow: HEAD_H * 0.52,
  c7: HEAD_H + 0.048,
  acromion: 0.228,
  nipple: 0.352,
  navel: 0.452,
  crotch: 0.528,
  hip: 0.51,
  knee: 0.75,
  calf: 0.842,
  ankle: 0.956,
  sole: 1,
  elbow: 0.412,
  wrist: 0.577,
  fingertip: 0.694,
};

/** Half-widths (x), fraction of stature. */
const WIDTH = {
  head: 0.055,
  neck: 0.030,
  acromion: 0.108,
  deltoid: 0.126,
  chest: 0.116,
  waist: 0.072,
  trochanter: 0.068,
  hipMass: 0.088,
};

/** Head box (the mask lives in it). */
const HEAD = {
  cx: 0,
  cy: HEAD_H * 0.5,
  rx: WIDTH.head,
  ry: HEAD_H * 0.5,
};

/* Girth profiles — radius (half thickness) at t along each bone. */
const ARM_GIRTH = [
  { t: 0.0, r: 0.036 },
  { t: 0.2, r: 0.034 },
  { t: 0.42, r: 0.03 },
  { t: 0.78, r: 0.0225 },
  { t: 1.0, r: 0.0205 },
];
const FOREARM_GIRTH = [
  { t: 0.0, r: 0.0215 },
  { t: 0.22, r: 0.0235 },
  { t: 0.6, r: 0.0175 },
  { t: 1.0, r: 0.0128 },
];
const THIGH_GIRTH = [
  { t: 0.0, r: 0.047 },
  { t: 0.35, r: 0.045 },
  { t: 0.7, r: 0.0325 },
  { t: 1.0, r: 0.0262 },
];
const SHANK_GIRTH = [
  { t: 0.0, r: 0.03 },
  { t: 0.24, r: 0.0302 },
  { t: 0.62, r: 0.0205 },
  { t: 1.0, r: 0.0138 },
];

function sampleGirth(stops, t) {
  const x = clamp(t, 0, 1);
  for (let i = 1; i < stops.length; i++) {
    if (x <= stops[i].t) {
      const a = stops[i - 1];
      const b = stops[i];
      const u = (x - a.t) / (b.t - a.t || 1);
      // smooth (cosine) interpolation so muscle bellies read as volumes
      return lerp(a.r, b.r, 0.5 - 0.5 * Math.cos(Math.PI * u));
    }
  }
  return stops[stops.length - 1].r;
}

const smooth = (t) => t * t * (3 - 2 * t);

/**
 * One foot's cycle. u ∈ [0,1): stance 0→0.6 (planted, sweeps backwards
 * under the body), swing 0.6→1 (lifts, advances, reaches for heel strike).
 * Returns position in body space plus the ankle pitch curve.
 */
function footCycle(u, stride, lift, run) {
  const s = stride * 0.5;
  if (u < 0.6) {
    /* stance: foot locked to the ground → travels backwards linearly,
       with a heel-roll at contact and a plantarflexing push-off. The sweep
       is biased behind the hip so the leg never exceeds its reach. */
    const k = u / 0.6;
    const x = lerp(s * 0.75, -s * 1.05, k);
    const y =
      0.994 -
      Math.max(0, 0.02 - k * 0.1) * 0.35 -
      (k > 0.42 ? (k - 0.42) * 0.055 * run + (k - 0.42) * 0.02 : 0);
    let ang;
    if (k < 0.1) ang = lerp(-0.22, 0, smooth(k / 0.1)); // heel strike → flat
    else if (k < 0.42) ang = lerp(0, 0.06, (k - 0.1) / 0.32); // ankle rocker
    else ang = lerp(0.06, 0.34 + 0.2 * run, smooth((k - 0.42) / 0.58)); // push-off
    return { p: [x, y], ang };
  }
  /* swing: toe-off → heel kick (run) → knee-forward reach → heel strike */
  const w = (u - 0.6) / 0.4;
  const back = -s * 1.05;
  const fwd = s * 0.75;
  const x = lerp(back, fwd, smooth(clamp((w - 0.18) / 0.78, 0, 1)));
  const kick = run * 0.055 * Math.sin(Math.PI * clamp(w / 0.55, 0, 1));
  const clear = lift * Math.sin(Math.PI * clamp(w, 0, 1)) ** 1.25;
  const y = 0.994 - clear - kick;
  let ang;
  if (w < 0.3) ang = lerp(0.34 + 0.2 * run, -0.05, smooth(w / 0.3));
  else ang = lerp(-0.05, -0.2, smooth((w - 0.3) / 0.7));
  return { p: [x, y], ang };
}

/**
 * Full-body gait frame for a stride phase (radians; one TAU = one stride,
 * i.e. two steps). `run` blends walk → sprint kinematics.
 */
function gaitFrame(phase, run) {
  const r = clamp(run, 0, 1);
  const u = ((phase / TAU) % 1 + 1) % 1;

  const stride = lerp(0.3, 0.46, r);
  const lift = lerp(0.052, 0.105, r);

  const L = footCycle(u, stride, lift, r);
  const R = footCycle((u + 0.5) % 1, stride, lift, r);

  /* vertical bounce: CoM peaks at mid-stance of each leg (2× per stride) */
  const bobAmp = lerp(0.0085, 0.016, r);
  const bob = -bobAmp * Math.cos(TAU * 2 * (u - 0.3)) * 0.5 + bobAmp * 0.25;
  /* flight phase for runs: both feet off the ground around u≈0.1 & 0.6 */
  const flight = r > 0.35 ? Math.max(0, Math.sin(TAU * 2 * (u - 0.02))) * r * 0.5 : 0;

  const lean = lerp(0.055, 0.3, r) + flight * 0.05;

  /* trunk: pelvis carries the bounce, chest leans, head stays level
     (vestibular stabilisation — the head bounces ~40% less than the pelvis) */
  const pelvisOff = [0, bob - flight * 0.02];
  const chestOff = [Math.sin(lean) * 0.055, -Math.cos(lean) * 0.02 + bob * 0.28];
  const headOff = [Math.sin(lean) * 0.085, bob * 0.42 - 0.004];

  /* contralateral arm swing; elbow flexes more as the hand trails */
  const swingA = lerp(0.105, 0.17, r);
  const armY = lerp(0.575, 0.505, r);
  const aL = Math.sin(TAU * (u + 0.5));
  const aR = Math.sin(TAU * u);
  const flexL = Math.max(0, -aL) * lerp(0.02, 0.075, r);
  const flexR = Math.max(0, -aR) * lerp(0.02, 0.075, r);
  const handL = [-0.02 + aL * swingA, armY - flexL - Math.abs(aL) * 0.012 * r];
  const handR = [0.05 + aR * swingA, armY - flexR - Math.abs(aR) * 0.012 * r];

  return {
    footL: L.p, footR: R.p, footAngL: L.ang, footAngR: R.ang,
    handL, handR, pelvisOff, chestOff, headOff, lean, flight,
  };
}

const between = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

// ─── Pose Library ────────────────────────────────────────────────────
// Pose targets in stature units. The spine/head are FK; contacts use IK.
// Hand curls are thumb → little finger. Every channel is blendable.
const HANDS = {
  relaxed: [0.45, 0.4, 0.5, 0.55, 0.6],
  fist: [0.95, 1, 1, 1, 1],
  open: [0.05, 0, 0.05, 0.08, 0.12],
  grip: [0.65, 0.75, 0.8, 0.85, 0.85],
  thwip: [0.15, 0, 1, 1, 0.05],
};

const basePose = {
  pelvis: [0, 0.51],
  chest: [0.008, 0.228],
  head: [0.02, 0.08],
  handL: [-0.155, 0.55],
  handR: [0.18, 0.54],
  footL: [-0.095, 0.995],
  footR: [0.12, 0.995],
  kneeBend: 1,
  elbowBend: -1,
  curlL: HANDS.relaxed,
  curlR: HANDS.relaxed,
};
const pose = (p) => ({ ...basePose, ...p });

const POSES = {
  stand: pose({}),
  crouch: pose({
    pelvis: [-0.025, 0.69],
    chest: [0.13, 0.456],
    head: [0.17, 0.32],
    handL: [-0.21, 0.57],
    handR: [0.24, 0.935],
    footL: [-0.22, 0.99],
    footR: [0.21, 0.99],
    tension: 1,
    curlL: HANDS.fist,
    curlR: HANDS.open,
    spreadR: 0.8,
  }),
  land: pose({
    pelvis: [-0.04, 0.72],
    chest: [0.14, 0.505],
    head: [0.2, 0.37],
    handL: [-0.26, 0.52],
    handR: [0.26, 0.935],
    footL: [-0.25, 0.99],
    footR: [0.19, 0.99],
    tension: 1,
    curlL: HANDS.fist,
    curlR: HANDS.open,
    spreadR: 1,
  }),
  sit: pose({
    pelvis: [-0.06, 0.8],
    chest: [-0.04, 0.52],
    head: [-0.02, 0.37],
    handL: [-0.17, 0.82],
    handR: [0.22, 0.72],
    footL: [0.12, 0.98],
    footR: [0.34, 0.96],
  }),
  // Whole-body rotation inverts an upright skeleton: ankles ABOVE head.
  hang: pose({
    pelvis: [0, 0.51],
    chest: [-0.01, 0.228],
    head: [-0.01, 0.08],
    handL: [-0.16, 0.43],
    handR: [0.15, 0.41],
    footL: [-0.022, 0.965],
    footR: [0.022, 0.965],
    kneeBend: -1,
    curlL: HANDS.grip,
    curlR: HANDS.grip,
  }),
  swing: pose({
    pelvis: [0.035, 0.5],
    chest: [-0.045, 0.23],
    head: [-0.05, 0.085],
    handL: [0.06, -0.005],
    handR: [0.08, -0.065],
    footL: [-0.27, 0.73],
    footR: [-0.04, 0.91],
    kneeBend: -1,
    elbowBend: 1,
    curlL: HANDS.grip,
    curlR: HANDS.grip,
    wristL: -0.35,
    wristR: 0.1,
  }),
  crawl: pose({
    pelvis: [0, 0.54],
    chest: [0.03, 0.26],
    head: [0.04, 0.11],
    handL: [-0.31, 0.13],
    handR: [0.34, 0.4],
    footL: [-0.3, 0.78],
    footR: [0.31, 0.85],
    kneeBend: -1,
    elbowBend: 1,
    tension: 0.7,
    curlL: HANDS.open,
    curlR: HANDS.open,
    spreadL: 1,
    spreadR: 1,
  }),
  sleep: pose({
    pelvis: [-0.13, 0.83],
    chest: [0.1, 0.67],
    head: [0.2, 0.6],
    handL: [0.24, 0.75],
    handR: [0.22, 0.7],
    footL: [-0.11, 0.99],
    footR: [0.09, 0.98],
  }),
  hammock: pose({
    pelvis: [0, 0.51],
    chest: [0, 0.228],
    head: [0.01, 0.08],
    handL: [-0.055, 0.055],
    handR: [0.08, 0.06],
    footL: [-0.15, 0.94],
    footR: [0.13, 0.96],
    elbowBend: 1,
  }),
  watch: pose({
    head: [0.065, 0.085],
    handL: [0.1, 0.37],
    handR: [0.14, 0.38],
    elbowBend: 1,
    curlL: HANDS.fist,
    curlR: HANDS.thwip,
  }),
  wave: pose({
    handR: [0.3, 0.055],
    elbowBend: 1,
    curlR: HANDS.open,
    spreadR: 1,
    wristR: -0.25,
  }),
  curious: pose({
    pelvis: [-0.015, 0.52],
    chest: [0.05, 0.246],
    head: [0.12, 0.115],
    handR: [0.1, 0.21],
    elbowBend: 1,
    curlR: HANDS.grip,
  }),
  airborne: pose({
    pelvis: [0, 0.5],
    chest: [0.03, 0.22],
    head: [0.04, 0.075],
    handL: [-0.3, 0.22],
    handR: [0.34, 0.15],
    footL: [-0.25, 0.77],
    footR: [0.23, 0.84],
    curlL: HANDS.open,
    curlR: HANDS.thwip,
    spreadL: 0.7,
  }),
  dodge: pose({
    pelvis: [0, 0.59],
    chest: [-0.12, 0.335],
    head: [-0.14, 0.19],
    handL: [-0.32, 0.39],
    handR: [0.29, 0.44],
    footL: [-0.18, 0.99],
    footR: [0.19, 0.99],
    tension: 0.8,
    curlL: HANDS.open,
    curlR: HANDS.open,
  }),
  point: pose({
    chest: [0.035, 0.23],
    head: [0.075, 0.09],
    handL: [-0.16, 0.48],
    handR: [0.43, 0.25],
    footL: [-0.13, 0.99],
    footR: [0.17, 0.99],
    curlL: HANDS.fist,
    curlR: HANDS.thwip,
    spreadR: 0.8,
    wristR: -0.12,
    elbowBend: 1,
  }),
  salute: pose({
    handR: [0.08, 0.055],
    elbowBend: 1,
    curlR: HANDS.open,
    wristR: -0.65,
  }),
};

function blendPose(a, b, t) {
  const amt = clamp(t, 0, 1);
  const P = (ka, kb) => [lerp(ka[0], kb[0], amt), lerp(ka[1], kb[1], amt)];
  const fingers = (x = HANDS.relaxed, y = HANDS.relaxed) =>
    x.map((v, i) => lerp(v, y[i], amt));
  return {
    pelvis: P(a.pelvis, b.pelvis),
    chest: P(a.chest, b.chest),
    head: P(a.head, b.head),
    handL: P(a.handL, b.handL),
    handR: P(a.handR, b.handR),
    footL: P(a.footL, b.footL),
    footR: P(a.footR, b.footR),
    // Continuous poles pass through extension, rather than snapping branches
    // or permanently keeping the old sign during exponential interpolation.
    kneeBend: lerp(a.kneeBend, b.kneeBend, amt),
    elbowBend: lerp(a.elbowBend, b.elbowBend, amt),
    tension: lerp(a.tension ?? 0, b.tension ?? 0, amt),
    curlL: fingers(a.curlL, b.curlL),
    curlR: fingers(a.curlR, b.curlR),
    spreadL: lerp(a.spreadL ?? 0.2, b.spreadL ?? 0.2, amt),
    spreadR: lerp(a.spreadR ?? 0.2, b.spreadR ?? 0.2, amt),
    wristL: lerp(a.wristL ?? 0, b.wristL ?? 0, amt),
    wristR: lerp(a.wristR ?? 0, b.wristR ?? 0, amt),
  };
}

// ─── Skeleton (kinematics) ───────────────────────────────────────────
// Transform hierarchy: screen × body × spine × shoulder; wrist × fingers.
// A bend pole rotates through depth when changing sides, so projected
// bones can foreshorten but can never stretch. No pose owns a different
// bone length.
const BONES = {
  upperArm: 0.184,
  forearm: 0.165,
  thigh: 0.24,
  shin: 0.206,
  spine: 0.282,
  neckHead: 0.137,
};

function solveIK(root, target, l1, l2, pole) {
  const dx = target[0] - root[0];
  const dy = target[1] - root[1];
  const r = Math.hypot(dx, dy);
  const ux = r > 1e-8 ? dx / r : 0;
  const uy = r > 1e-8 ? dy / r : 1;
  const d = clamp(r, Math.abs(l1 - l2) + 1e-6, l1 + l2 - 1e-6);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const phi = ((1 - clamp(pole, -1, 1)) * Math.PI) / 2;
  const side = h * Math.cos(phi);
  return {
    root,
    joint: [root[0] + ux * a - uy * side, root[1] + uy * a + ux * side],
    end: [root[0] + ux * d, root[1] + uy * d],
    depth: h * Math.sin(phi),
  };
}

/** Local +y follows a bone. */
const boneFrame = (a, b) =>
  compose(
    translate(...a),
    rotate(Math.atan2(b[1] - a[1], b[0] - a[0]) - Math.PI / 2),
  );

function bodyMatrix(s) {
  const q = clamp(s.squash, 0.65, 1.25);
  return compose(
    translate(s.x, s.y),
    rotate(s.rotation),
    scale(s.facing * s.size * (1 + (1 - q) * 0.3), s.size * q),
  );
}

function solveSkeleton(s) {
  const p = s.pose;
  const g = s.walkPhase >= 0 ? gaitFrame(s.walkPhase, s.run ?? 0) : null;
  const breath = Math.sin(s.breathe * Math.PI * 0.56) * 0.0025;
  const pelvis = [p.pelvis[0], p.pelvis[1] + (g?.pelvisOff[1] ?? 0)];
  const desiredChest = [
    p.chest[0] + (g ? Math.sin(g.lean) * 0.12 : 0),
    p.chest[1] - breath,
  ];
  const spineAngle =
    Math.atan2(pelvis[1] - desiredChest[1], pelvis[0] - desiredChest[0]) -
    Math.PI / 2;
  const spine = compose(translate(...pelvis), rotate(spineAngle));
  const chest = transform(spine, [0, -BONES.spine]);
  const torso = compose(spine, translate(0, -BONES.spine));
  const desiredHead = [
    p.head[0] + (g ? Math.sin(g.lean) * 0.08 : 0),
    p.head[1],
  ];
  const hd = Math.atan2(desiredHead[1] - chest[1], desiredHead[0] - chest[0]);
  const head = [
    chest[0] + Math.cos(hd) * BONES.neckHead,
    chest[1] + Math.sin(hd) * BONES.neckHead,
  ];
  const headFrame = compose(
    translate(...head),
    rotate(s.headTilt + s.lookX * 0.065),
  );
  const armL = solveIK(
    transform(torso, [-0.104, 0.006]),
    g?.handL ?? p.handL,
    BONES.upperArm,
    BONES.forearm,
    -p.elbowBend,
  );
  const armR = solveIK(
    transform(torso, [0.104, 0.006]),
    g?.handR ?? p.handR,
    BONES.upperArm,
    BONES.forearm,
    p.elbowBend,
  );
  const footL = g?.footL ?? p.footL;
  const footR = g?.footR ?? p.footR;
  const ankle = (f) => [f[0], f[1] - 0.037];
  const legL = solveIK(
    transform(spine, [-0.06, 0]),
    ankle(footL),
    BONES.thigh,
    BONES.shin,
    g ? -1 : p.kneeBend,
  );
  const legR = solveIK(
    transform(spine, [0.06, 0]),
    ankle(footR),
    BONES.thigh,
    BONES.shin,
    g ? -1 : -p.kneeBend,
  );
  const world = bodyMatrix(s);
  const wristFrame = (a, offset) =>
    compose(
      boneFrame(a.joint, a.end),
      translate(0, Math.hypot(a.end[0] - a.joint[0], a.end[1] - a.joint[1])),
      rotate(offset),
    );
  const wristL = wristFrame(armL, p.wristL ?? 0);
  const wristR = wristFrame(armR, p.wristR ?? 0);
  return {
    world,
    torso,
    spine,
    headFrame,
    head,
    chest,
    pelvis,
    armL,
    armR,
    legL,
    legR,
    wristL,
    wristR,
    footAngL: g?.footAngL ?? 0,
    footAngR: g?.footAngR ?? 0,
    webHand: transform(compose(world, wristR), [0, 0.025]),
    webAnkle: transform(world, between(legL.end, legR.end, 0.5)),
  };
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
      /* Silk mechanics (dragline: ~10 GPa initial modulus, yield at ~2–5%
         strain): a loaded strand is effectively inextensible and thins as
         tension rises, while a slack strand sags into a catenary. */
      const cur = Math.hypot(this.x - this.anchor.x, this.y - this.anchor.y);
      const slack = clamp((this.naturalLength - cur) / this.naturalLength, 0, 1);
      const strain = clamp((cur - this.naturalLength) / this.naturalLength, 0, 0.3);
      const sag = (8 + slack * 110) * (1 - this.shootT * 0.5);
      const core = 1.7 - strain * 2.2;
      // bright core + accent glow
      ctx.shadowColor = accent;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = rgba(accent, 0.22);
      ctx.lineWidth = core + 2.1;
      ctx.beginPath();
      ctx.moveTo(this.anchor.x, this.anchor.y);
      ctx.quadraticCurveTo((this.anchor.x + ex) / 2, (this.anchor.y + ey) / 2 + sag, ex, ey);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(240,244,255,0.95)";
      ctx.lineWidth = Math.max(0.8, core);
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

// ─── Cinematic vector rig ────────────────────────────────────────────
// Local anatomical meshes are lit, layered and posed by the matrix
// skeleton. Illustrated movie-inspired suit — no sprites or remote models.
const INK = "#09101c";
const PATHS = new Map();

function drawSpider(ctx, s, solved) {
  if (s.alpha <= 0 || s.size <= 0) return;
  const k = solved ?? solveSkeleton(s);
  const pal = s.palette;
  const detail = s.quality > 0.5;
  const micro = detail && s.size > 180;
  ctx.save();
  apply(ctx, k.world);
  ctx.globalAlpha *= s.alpha;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (s.hidden !== "none") {
    ctx.beginPath();
    if (s.hidden === "left") ctx.rect(-0.2, -1, 1, 3);
    else if (s.hidden === "right") ctx.rect(-0.8, -1, 1, 3);
    else ctx.rect(-1, -0.25, 2, 1.5);
    ctx.clip();
  }
  const lit = (base, frame, radius, far = false) => {
    if (!detail) return color(base, far ? 0.76 : 1);
    // Transform the screen-space key light into each part's local basis.
    const inv = inverse(compose(k.world, frame));
    const o = transform(inv, [0, 0]);
    const l = transform(inv, [-0.65, -0.76]);
    const side = l[0] - o[0] > 0 ? 1 : -1;
    const g = ctx.createLinearGradient(-radius * side, 0, radius * side, 0);
    g.addColorStop(0, color(base, far ? 0.35 : 0.42));
    g.addColorStop(0.2, color(base, far ? 0.55 : 0.7));
    g.addColorStop(0.52, color(base, far ? 0.74 : 1));
    g.addColorStop(0.8, color(base, far ? 0.84 : 1, far ? 0.02 : 0.18));
    g.addColorStop(1, color(base, far ? 0.65 : 0.85));
    return g;
  };
  const stroke = (width = 0.0025, c = INK) => {
    ctx.lineWidth = width;
    ctx.strokeStyle = c;
    ctx.stroke();
  };
  const path = (d) => {
    let p = PATHS.get(d);
    if (!p) {
      p = new Path2D(d);
      PATHS.set(d, p);
    }
    return p;
  };
  const fillPath = (d, fill, outline = 0) => {
    const p = path(d);
    ctx.fillStyle = fill;
    ctx.fill(p);
    if (outline) {
      ctx.strokeStyle = INK;
      ctx.lineWidth = outline;
      ctx.stroke(p);
    }
  };
  /** Projected lattice, scalloped between meridians instead of circles. */
  const lattice = (width, height, step = 0.035) => {
    ctx.strokeStyle = pal.web;
    ctx.lineWidth = 0.0017;
    ctx.beginPath();
    for (let j = -2; j <= 2; j++) {
      const x = (j * width) / 2.4;
      ctx.moveTo(x, -0.06);
      ctx.quadraticCurveTo(x * 0.65, height * 0.4, x * 0.82, height + 0.04);
    }
    for (let y = -0.04; y < height + 0.04; y += step) {
      ctx.moveTo(-width, y);
      for (let j = 0; j < 4; j++)
        ctx.quadraticCurveTo(
          -width + ((j + 0.5) * width) / 2,
          y + 0.013,
          -width + ((j + 1) * width) / 2,
          y,
        );
    }
    ctx.stroke();
  };
  /** One smooth muscle envelope, with joint caps under the next segment. */
  const segment = (a, b, profile, base, far, web = false) => {
    const frame = boneFrame(a, b);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 1e-5) return;
    ctx.save();
    apply(ctx, frame);
    const steps = 12;
    const mesh = () => {
      ctx.beginPath();
      ctx.moveTo(-profile[0].r, 0);
      for (let i = 1; i <= steps; i++)
        ctx.lineTo(-sampleGirth(profile, i / steps), (i / steps) * len);
      const end = sampleGirth(profile, 1);
      ctx.quadraticCurveTo(0, len + end * 0.7, end, len);
      for (let i = steps - 1; i >= 0; i--)
        ctx.lineTo(sampleGirth(profile, i / steps), (i / steps) * len);
      ctx.quadraticCurveTo(0, -profile[0].r * 1.9, -profile[0].r, 0);
      ctx.closePath();
    };
    mesh();
    ctx.fillStyle = lit(base, frame, Math.max(...profile.map((p) => p.r)), far);
    ctx.fill();
    // Thin silhouettes, not thick black outlines around every joint.
    stroke(far ? 0.002 : 0.0015, color(base, 0.35));
    if (detail) {
      ctx.save();
      mesh();
      ctx.clip();
      if (web) lattice(Math.max(...profile.map((p) => p.r)) * 1.15, len, 0.03);
      if (micro) {
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        for (let y = 0; y < len; y += 0.006)
          for (let x = -0.04; x < 0.04; x += 0.006)
            ctx.fillRect(x, y, 0.0012, 0.0012);
      }
      // Long anatomical highlight, no sphere-stack banding.
      ctx.strokeStyle = far
        ? "rgba(143,175,208,0.08)"
        : "rgba(177,211,245,0.12)";
      ctx.lineWidth = 0.003;
      ctx.beginPath();
      ctx.moveTo(-profile[0].r * 0.55, len * 0.07);
      ctx.quadraticCurveTo(
        -profile[1].r * 0.9,
        len * 0.4,
        -sampleGirth(profile, 1) * 0.5,
        len * 0.9,
      );
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  };
  const boot = (leg, angle, far) => {
    const calf = between(leg.joint, leg.end, 0.34);
    segment(
      calf,
      leg.end,
      [
        { t: 0, r: 0.025 },
        { t: 0.45, r: 0.022 },
        { t: 1, r: 0.016 },
      ],
      pal.red,
      far,
      true,
    );
    const frame = compose(translate(...leg.end), rotate(angle));
    ctx.save();
    apply(ctx, frame);
    const foot =
      "M -0.016 -0.007 Q -0.022 0.009 -0.023 0.028 Q -0.024 0.039 -0.005 0.04 L 0.067 0.039 Q 0.08 0.038 0.08 0.030 Q 0.077 0.020 0.048 0.016 Q 0.022 0.008 0.016 -0.008 Z";
    fillPath(foot, lit(pal.red, frame, 0.035, far), 0.0025);
    if (detail) {
      ctx.save();
      ctx.clip(path(foot));
      lattice(0.085, 0.04, 0.018);
      ctx.restore();
    }
    ctx.beginPath();
    ctx.moveTo(-0.017, 0.037);
    ctx.quadraticCurveTo(0.03, 0.043, 0.075, 0.036);
    stroke(0.004, color(pal.blue, 0.8));
    ctx.restore();
  };
  const leg = (chain, angle, far) => {
    segment(chain.root, chain.joint, THIGH_GIRTH, pal.blue, far);
    segment(chain.joint, chain.end, SHANK_GIRTH, pal.blue, far);
    boot(chain, angle, far);
  };
  const hand = (frame, curls, spread, far) => {
    ctx.save();
    apply(ctx, frame);
    const palm =
      "M -0.013 -0.006 Q -0.017 0.012 -0.018 0.026 Q -0.016 0.04 0 0.039 Q 0.018 0.039 0.018 0.026 L 0.013 -0.006 Z";
    fillPath(palm, lit(pal.red, frame, 0.021, far), 0.0015);
    // Four fingers, three articulated phalanges each. Curl is projected from
    // a hinge in depth, while spread/wrist use actual parent × local matrices.
    for (let i = 0; i < 4; i++) {
      const curl = clamp(curls[i + 1], 0, 1);
      const x = -0.013 + i * 0.0085;
      const length = [0.034, 0.038, 0.035, 0.028][i];
      let joint = compose(
        translate(x, 0.03 - Math.abs(i - 1.4) * 0.001),
        rotate((i - 1.5) * spread * 0.23),
      );
      for (let ph = 0; ph < 3; ph++) {
        const bend = curl * (ph + 1) * 0.95;
        const len = length * [0.45, 0.32, 0.23][ph];
        const projected = len * Math.cos(bend);
        const end = transform(joint, [0, projected]);
        const start = transform(joint, [0, 0]);
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        stroke(0.0075, far ? color(pal.red, 0.5) : color(pal.red, 0.68));
        stroke(0.0048, far ? color(pal.red, 0.72) : color(pal.red, 1, 0.15));
        joint = compose(joint, translate(0, projected), rotate(curl * 0.13));
      }
    }
    // Opposable thumb: a separate two-joint branch off the palm.
    const tc = curls[0];
    const thumb = compose(
      translate(-0.012, 0.011),
      rotate(lerp(0.95, -0.3, tc)),
    );
    const a = transform(thumb, [0, 0]);
    const b = transform(thumb, [0, 0.018]);
    const c = transform(
      compose(thumb, translate(0, 0.018), rotate(-tc * 1.1)),
      [0, 0.013],
    );
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(c[0], c[1]);
    stroke(0.009, color(pal.red, far ? 0.5 : 0.75));
    stroke(0.0055, color(pal.red, far ? 0.7 : 1, 0.1));
    if (detail) {
      ctx.beginPath();
      ctx.moveTo(-0.012, 0.005);
      ctx.lineTo(0.012, 0.005);
      stroke(0.0018, pal.web);
    }
    ctx.restore();
  };
  const arm = (chain, wrist, curls, spread, far) => {
    segment(chain.root, chain.joint, ARM_GIRTH, pal.blue, far);
    // Red shoulder saddle and long red gauntlet over the blue undersuit.
    segment(
      chain.root,
      between(chain.root, chain.joint, 0.32),
      [
        { t: 0, r: 0.038 },
        { t: 0.6, r: 0.035 },
        { t: 1, r: 0.032 },
      ],
      pal.red,
      far,
      true,
    );
    segment(chain.joint, chain.end, FOREARM_GIRTH, pal.blue, far);
    segment(
      between(chain.joint, chain.end, 0.25),
      chain.end,
      [
        { t: 0, r: 0.024 },
        { t: 0.4, r: 0.02 },
        { t: 1, r: 0.013 },
      ],
      pal.red,
      far,
      true,
    );
    hand(wrist, curls, spread, far);
  };
  const p = s.pose;
  // Far side is shaded, never solid black. Both thighs tuck behind the pelvis.
  leg(k.legL, k.footAngL, true);
  arm(k.armL, k.wristL, p.curlL ?? HANDS.relaxed, p.spreadL ?? 0.2, true);
  leg(k.legR, k.footAngR, false);

  ctx.save();
  apply(ctx, k.torso);
  const body =
    "M -0.032 -0.053 Q -0.062 -0.026 -0.105 -0.014 Q -0.125 0.006 -0.112 0.054 L -0.089 0.135 Q -0.065 0.215 -0.081 0.282 Q -0.076 0.314 -0.034 0.330 Q 0 0.335 0.034 0.330 Q 0.076 0.314 0.081 0.282 Q 0.065 0.215 0.089 0.135 L 0.112 0.054 Q 0.125 0.006 0.105 -0.014 Q 0.062 -0.026 0.032 -0.053 Z";
  fillPath(body, lit(pal.blue, k.torso, 0.12), 0.003);
  ctx.save();
  ctx.clip(path(body));
  const red =
    "M -0.035 -0.06 L -0.125 -0.018 L -0.111 0.065 Q -0.088 0.083 -0.076 0.099 L -0.042 0.227 L 0 0.288 L 0.042 0.227 L 0.076 0.099 Q 0.088 0.083 0.111 0.065 L 0.125 -0.018 L 0.035 -0.06 Z";
  fillPath(red, lit(pal.red, k.torso, 0.11));
  // Pectoral planes and abdominal masses are subtle specular/shadow shapes.
  for (const side of [-1, 1]) {
    ctx.save();
    apply(ctx, scale(side, 1));
    fillPath(
      "M 0.008 0.021 Q 0.064 -0.008 0.101 0.024 Q 0.099 0.057 0.066 0.072 L 0.008 0.062 Z",
      "rgba(255,177,167,0.12)",
    );
    fillPath(
      "M 0.009 0.059 Q 0.055 0.080 0.088 0.058 Q 0.062 0.086 0.013 0.079 Z",
      "rgba(32,1,16,0.26)",
    );
    for (let i = 0; i < 4; i++) {
      const y = 0.09 + i * 0.033;
      const w = 0.054 - i * 0.007;
      ctx.beginPath();
      ctx.moveTo(0.004, y);
      ctx.quadraticCurveTo(w * 0.6, y - 0.006, w, y + 0.002);
      ctx.lineTo(w * 0.87, y + 0.024);
      ctx.lineTo(0.005, y + 0.021);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, y, 0, y + 0.028);
      grad.addColorStop(0, "rgba(255,188,175,0.12)");
      grad.addColorStop(0.7, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(20,0,14,0.27)");
      ctx.fillStyle = grad;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(0.092, 0.091);
    ctx.quadraticCurveTo(0.075, 0.17, 0.065, 0.215);
    stroke(0.004, "rgba(133,173,222,0.18)");
    fillPath(
      "M 0.046 0.238 L 0.079 0.215 L 0.084 0.249 L 0.035 0.273 Z",
      color(pal.red, 0.83),
    );
    ctx.restore();
  }
  if (detail) {
    ctx.save();
    ctx.clip(path(red));
    lattice(0.115, 0.29, 0.034);
    ctx.restore();
  }
  // Raised black chest emblem with eight angular legs.
  ctx.save();
  apply(ctx, translate(0, 0.058));
  ctx.fillStyle = pal.trim;
  ctx.beginPath();
  ctx.ellipse(0, -0.015, 0.007, 0.012, 0, 0, TAU);
  ctx.ellipse(0, 0.007, 0.01, 0.019, 0, 0, TAU);
  ctx.fill();
  for (const side of [-1, 1])
    for (let i = 0; i < 4; i++) {
      const y = -0.023 + i * 0.014;
      const direction = i < 2 ? -1 : 1;
      ctx.beginPath();
      ctx.moveTo(side * 0.007, y);
      ctx.lineTo(side * (0.02 + (i % 2) * 0.008), y + direction * 0.012);
      ctx.lineTo(side * (0.027 + (i % 2) * 0.01), y + direction * 0.038);
      stroke(0.0038, pal.trim);
    }
  ctx.restore();
  ctx.restore();
  ctx.restore();

  arm(k.armR, k.wristR, p.curlR ?? HANDS.relaxed, p.spreadR ?? 0.2, false);
  // A short neck, seated into the trapezius, rather than a floating mask.
  segment(
    transform(k.torso, [0, -0.045]),
    [k.head[0], k.head[1] + HEAD.ry * 0.66],
    [
      { t: 0, r: 0.03 },
      { t: 1, r: 0.026 },
    ],
    pal.red,
    false,
    true,
  );

  ctx.save();
  apply(ctx, k.headFrame);
  const skull =
    "M 0 -0.073 C 0.035 -0.075 0.055 -0.050 0.055 -0.020 C 0.055 0.018 0.041 0.049 0.024 0.064 Q 0 0.082 -0.024 0.064 C -0.041 0.049 -0.055 0.018 -0.055 -0.020 C -0.055 -0.050 -0.035 -0.075 0 -0.073 Z";
  fillPath(skull, lit(pal.red, k.headFrame, 0.059), 0.0026);
  ctx.save();
  ctx.clip(path(skull));
  if (detail) {
    const yaw = clamp(s.lookX, -1, 1) * 0.006;
    const cy = 0.02;
    ctx.strokeStyle = pal.web;
    ctx.lineWidth = 0.0017;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU;
      ctx.beginPath();
      ctx.moveTo(yaw, cy);
      ctx.quadraticCurveTo(
        yaw + Math.cos(a) * 0.03,
        cy + Math.sin(a) * 0.045,
        Math.cos(a) * 0.095,
        cy + Math.sin(a) * 0.13,
      );
      ctx.stroke();
    }
    for (const r of [0.23, 0.45, 0.67, 0.88, 1.1]) {
      ctx.beginPath();
      for (let i = 0; i <= 12; i++) {
        const a = (i / 12) * TAU;
        const x = yaw + Math.cos(a) * 0.071 * r;
        const y = cy + Math.sin(a) * 0.105 * r;
        if (i === 0) ctx.moveTo(x, y);
        else {
          const mid = a - TAU / 24;
          ctx.quadraticCurveTo(
            yaw + Math.cos(mid) * 0.062 * r,
            cy + Math.sin(mid) * 0.092 * r,
            x,
            y,
          );
        }
      }
      ctx.stroke();
    }
    fillPath(
      "M -0.044 -0.041 Q -0.036 -0.063 -0.017 -0.066 Q -0.032 -0.036 -0.039 -0.019 Z",
      "rgba(255,211,191,0.23)",
    );
    fillPath(
      "M 0.004 0.014 Q 0.002 0.038 0.016 0.041 L 0.007 0.050 L -0.004 0.043 Z",
      "rgba(43,2,13,0.22)",
    );
  }
  // Angular swept lenses: high outer corner, narrow nasal bridge, black bezel.
  const expression =
    s.expr === "sleepy"
      ? 0.35
      : s.expr === "suspicious"
        ? 0.72
        : s.expr === "happy"
          ? 0.8
          : s.expr === "wow"
            ? 1.1
            : 1;
  const eyeOpen = Math.max(0.09, (1 - s.blink) * expression);
  for (const side of [-1, 1]) {
    ctx.save();
    apply(
      ctx,
      compose(
        translate(clamp(s.lookX, -1, 1) * 0.002, clamp(s.lookY, -1, 1) * 0.002),
        scale(side, eyeOpen),
      ),
    );
    const lens =
      "M 0.007 0.012 Q 0.022 -0.014 0.049 -0.039 C 0.055 -0.009 0.045 0.023 0.027 0.031 Q 0.017 0.036 0.007 0.012 Z";
    const glass = ctx.createLinearGradient(0, -0.04, 0, 0.036);
    glass.addColorStop(0, "#ffffff");
    glass.addColorStop(0.55, pal.lens);
    glass.addColorStop(1, "#94b3c8");
    fillPath(lens, detail ? glass : pal.lens, 0.006);
    if (detail) {
      ctx.beginPath();
      ctx.moveTo(0.02, 0.003);
      ctx.quadraticCurveTo(0.034, -0.018, 0.045, -0.026);
      stroke(0.0022, "rgba(255,255,255,0.9)");
    }
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
  ctx.restore();
}

// ─── Spider Controller ───────────────────────────────────────────────
const AIR_GRAVITY = 3400;
// Gait-locked ground speeds: the stance sweep in gaitFrame() matches these
// px/s at the rendered character sizes (HyperTab's tuned pair).
const WALK_SPEED = 95;
const RUN_SPEED = 420;

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
    this.size = 116;
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
    this.thwip = null;
    this.reducedMotion = false;

    // Behavior
    this.behavior = null;
    this.idleGap = 1.5;

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
    const oldGroundY = this.groundY;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = Math.max(1, window.innerWidth);
    this.h = Math.max(1, window.innerHeight);
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    // Use the actual backing-store ratio after rounding. This keeps the
    // procedural linework pin-sharp on fractional-DPR/zoomed displays.
    this.ctx.setTransform(this.canvas.width / this.w, 0, 0, this.canvas.height / this.h, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";
    this.groundY = this.h - 14;
    this.size = clamp(Math.min(this.w, this.h) * 0.18, 96, 156);

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
      if (this.mode === "ground" || Math.abs(this.pos.y - oldGroundY) < 2) this.pos.y = this.groundY;
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
    if (this.reducedMotion || this.mode === "hidden" || this.alpha < 0.5) return;
    const d = Math.hypot(x - this.pos.x, y - (this.pos.y - this.size * 0.5));
    if (d < 300 && !this._isBusy("dodge", "flee")) {
      this._startDodge(x);
    }
  }

  onDoubleClick(x, y) {
    if (this.reducedMotion || this.mode === "hidden" || this.alpha < 0.5) return;
    // Face the click, aim, and thwip a web at it — the strand then emits
    // from the actual wrist/palm location, not a guessed hand position.
    this._faceToward(x);
    this.thwip = { x: clamp(x, 10, this.w - 10), y: clamp(y, 8, this.h - 8), t: 0, fired: false };
    this.expr = "wow";
    this.exprHold = 0.8;
  }

  // ── Internal helpers ──

  _isBusy(...kinds) { return !!this.behavior && kinds.includes(this.behavior.kind); }
  _setPose(name, blend = 9) { this.poseName = name; this.poseBlend = blend; }
  _faceToward(x) { if (Math.abs(x - this.pos.x) > 8) this.facing = x > this.pos.x ? 1 : -1; }
  _boxTop() { return this.pos.y - this.size; }

  /** One render snapshot is used by meshes AND attachment calculations. */
  _renderState() {
    const bk = this.behavior?.kind;
    const local = inverse(bodyMatrix({ x: 0, y: 0, rotation: this.rotation, facing: this.facing, size: 1, squash: 1 }));
    const look = transform(local, [this.lookX, this.lookY]);
    return {
      x: this.pos.x, y: this._boxTop(), rotation: this.rotation, facing: this.facing,
      size: this.size, alpha: this.alpha, squash: this.squash, pose: this.pose,
      headTilt: this.headTilt, lookX: look[0], lookY: look[1], blink: this.blink,
      expr: this.expr, palette: this.palette,
      walkPhase: this.thwip ? -1 : this.walkPhase,
      run: bk === "run" || bk === "flee" ? 1 : bk === "walk" ? 0.12 : 0,
      breathe: this.breathe, hidden: this.hiddenEdge, quality: 1,
    };
  }

  /** world position of the "near hand" (used by web lines) */
  _handWorld() {
    const p = solveSkeleton(this._renderState()).webHand;
    return { x: p[0], y: p[1] };
  }

  /** Translate the body, never stretch a bone, to meet a world constraint. */
  _pinAttachment(which, x, y) {
    const p = solveSkeleton(this._renderState())[which];
    this.pos.x += x - p[0];
    this.pos.y += y - p[1];
  }

  _endBehavior() {
    this.behavior = null;
    this.poseTweak = null;
    this.walkPhase = -1;
    this.headTiltTarget = 0;
    this.idleGap = rand(0.4, 1.2);
  }

  _spawnEntrance() {
    if (this.reducedMotion) {
      // Reduced motion gets a visible, stationary companion, not a walk-in.
      this.mode = "ground";
      this.pos = { x: this.w - Math.max(70, this.size * 0.6), y: this.groundY };
      this.facing = -1;
      this.alpha = 1;
      this.pose = POSES.stand;
      this.behavior = null;
      return;
    }
    // Cinematic entrance: always aim across the viewport rather than picking
    // another anchor in the same corner.
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
      const hand = this._handWorld();
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
    this.poseTweak = null;
    this.walkPhase = -1;
    switch (kind) {
      case "climbString": return this._startClimbString();
      case "walk": return this._startWalk(false);
      case "run": return this._startWalk(true);
      case "hop": return this._startHop();
      case "swing": return this.reducedMotion ? this._startWalk(true) : this._startSwing();
      case "hang": return this._startHang();
      case "crawlWall": return this._startCrawl();
      case "peek": return this._startPeek();
      case "sitGround": case "perch": case "crouch": case "sleep":
      case "watch": case "wave": case "salute": case "idle": {
        const poseFor = {
          sitGround: "sit", perch: "sit", crouch: "crouch", sleep: "sleep",
          watch: "watch", wave: "wave", salute: "salute", idle: "stand",
        };
        const durFor = {
          sitGround: rand(4, 9), perch: rand(5, 10), crouch: rand(2.5, 6), sleep: rand(6, 12),
          watch: 1.9, wave: 2.2, salute: 2.4, idle: rand(3, 7),
        };
        if (kind === "wave" && !this.reducedMotion) {
          this.poseTweak = (p, t) => ({
            ...p,
            handR: [p.handR[0] + Math.sin(t * 7) * 0.025, p.handR[1]],
            wristR: (p.wristR ?? 0) + Math.sin(t * 9) * 0.32,
          });
        }
        if (kind === "watch") {
          this.poseTweak = (p, t) => ({
            ...p,
            head: [p.head[0], p.head[1] + (t > 0.7 ? Math.sin(t * 5) * 0.006 : 0)],
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

    if (this.reducedMotion) {
      if (this.mode !== "hidden") {
        this.rope.detach(); this.behavior = null; this.mode = "ground";
        this.pos.y = this.groundY; this.walkPhase = -1;
        this.rotation = this.targetRotation = 0; this.squash = 1;
        this.pose = POSES.stand; this.alpha = 1; this.blink = 0;
      }
      return;
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
        // The body itself is placed after the pose blend by pinning the
        // rendered wrist to the rope (shared attachment geometry).

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
        this._faceToward(this.pos.x + vel.x);
        this._pinAttachment("webHand", bob.x, bob.y);
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
        const len = clamp(this.rope.length, this.size * 0.85, this.size * 2.0);
        this.rope.x = anchor.x + Math.sin(sway * 2.2) * len * 0.12;
        this.rope.y = anchor.y + len;
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
    if (this.thwip) {
      this.thwip.t += dt;
      const local = transform(inverse(bodyMatrix(this._renderState())), [this.thwip.x, this.thwip.y]);
      // Upper body overlay: keep locomotion/foot contacts when firing in air.
      const aiming = this.mode === "ground" ? POSES.point : target;
      target = { ...aiming, handR: local, curlR: HANDS.thwip, spreadR: 0.9, wristR: -0.10 };
    }
    this.pose = blendPose(this.pose, target, 1 - Math.exp(-dt * (this.thwip ? 20 : this.poseBlend)));
    if (this.mode === "swing" && this.rope.attached) this._pinAttachment("webHand", this.rope.x, this.rope.y);
    if (this.mode === "hang" && this.rope.attached && this.swingPump !== -1) this._pinAttachment("webAnkle", this.rope.x, this.rope.y);
    if (this.mode === "climb" && this.rope.attached) this._pinAttachment("webHand", this.rope.x, this.rope.y);
    if (this.thwip && this.thwip.t > 0.16 && !this.thwip.fired) {
      const hand = this._handWorld();
      this.fx.shot(hand.x, hand.y, this.thwip.x, this.thwip.y);
      this.fx.splat(this.thwip.x, this.thwip.y);
      this.thwip.fired = true;
    }
    if (this.thwip && this.thwip.t > 0.85) this.thwip = null;
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
      case "climbString": {
        // Completion is handled by the climb physics in _update; keep the
        // behaviour (and its hand-over-hand pose tweak) alive until then.
        if (this.mode !== "climb") return this._endBehavior();
        break;
      }
      case "swing": {
        if (!this.rope.attached && this.mode === "air") {
          if (this.vel.y < -60 || this.pos.y < this.groundY - this.size * 1.6) {
            const hand = this._handWorld();
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
          // Release at the apex, but always release after a short grace period.
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
                const hand = this._handWorld();
                this.rope.attach(a2.x, a2.y, hand.x, hand.y, this.vel.x / 60, this.vel.y / 60);
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
          b.phase += dt * 4;
          this.walkPhase = -1;
          // Independent crawl contacts — alternate limbs instead of using
          // the ground gait's foot plants.
          this.poseTweak = (p) => ({
            ...p,
            handL: [p.handL[0], p.handL[1] + Math.sin(b.phase) * 0.055],
            handR: [p.handR[0], p.handR[1] - Math.sin(b.phase) * 0.055],
            footL: [p.footL[0], p.footL[1] - Math.sin(b.phase) * 0.06],
            footR: [p.footR[0], p.footR[1] + Math.sin(b.phase) * 0.06],
          });
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
      case "watch": case "wave": case "salute": case "idle": {
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
    this.squash = 0.88;
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
      if (chance(0.3) && !this.reducedMotion) {
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
    const state = this._renderState();
    const rig = solveSkeleton(state);

    this.fx.update(this.frameDt);
    this.fx.render(ctx);

    // Web rendering
    if (this.mode === "swing" && this.rope.attached) {
      this.rope.render(ctx, this.accentColor);
    } else if (this.mode === "hang" && this.rope.attached) {
      // a simple taut strand while hanging / perching
      ctx.save();
      ctx.strokeStyle = "rgba(240,244,255,0.9)";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(this.rope.anchor.x, this.rope.anchor.y);
      ctx.lineTo(rig.webAnkle[0], rig.webAnkle[1]);
      ctx.stroke();
      ctx.restore();
    }

    // Ground contact lives in screen space; never rotates with the hero.
    if (this.mode === "ground" && this.alpha > 0.01) {
      ctx.save();
      for (const ankle of [rig.legL.end, rig.legR.end]) {
        const foot = transform(rig.world, ankle);
        const gradient = ctx.createRadialGradient(foot[0], this.groundY, 0, foot[0], this.groundY, this.size * 0.095);
        gradient.addColorStop(0, `rgba(0,0,0,${this.alpha * 0.45})`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(foot[0], this.groundY, this.size * 0.095, this.size * 0.022, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Draw the character
    if (this.alpha > 0.01) {
      drawSpider(ctx, state, rig);
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
    ctrl.reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

// Test-only handle (used by the headless rig checks); not a named export,
// so fast-refresh keeps working for this component module.
InteractiveSpider.__internals = {
  SpiderController,
  Brain,
  POSES,
  HANDS,
  BONES,
  blendPose,
  solveIK,
  solveSkeleton,
  bodyMatrix,
  gaitFrame,
  drawSpider,
  SwingRope,
  WebEffects,
};

export default InteractiveSpider;
