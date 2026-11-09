# Muhammad Anas — Portfolio

One bundle, two editions:

| Route | Edition | What it is |
| --- | --- | --- |
| `/` | **Scenes** | Nine numbered scenes on one dark technical surface — mono instrumentation, letterboxed media, PRJ_00X project list and a trio of AGENT cursors |
| `/atelier` | **Atelier** | The editorial paper edition — warm cream, kinetic serif, risograph art, ink chapters |

Both share the content in `src/scenes/data.js` / the section components, the Lenis smooth
scroll and the self-hosted fonts. The Atelier design system is documented in
[`DESIGN.md`](DESIGN.md).

## Scenes edition (front door)

- **Structure** — `SCENE 01 ORIGIN → 02 ABOUT → 03 SKILLS → 04 SELECTED WORKS → 05 INTENT →
  06 TRACK RECORD → 07 OFF-SCREEN → 08 DEEP DIVE → 09 CONNECT`, each with a numbered header,
  a live scene rail and a scroll read-out in the bottom HUD
- **Chrome** — fixed mark + status + PKT clock, 12-column instrumentation grid, pointer
  coordinates, scroll percentage and build stamp
- **AGENT cursors** — three spring-damped pointers (`AGENT·01/02/03`) orbiting the exact
  cursor dot; they collapse on click and step aside over text fields. Not mounted on touch
  or reduced motion
- **Type** — Space Grotesk for display (uppercase, tight), JetBrains Mono for every label
- **Media** — letterboxed frames with corner ticks, a document gallery with lightbox, and a
  typographic résumé cover instead of a rasterised PDF
- **Interaction** — project rows reveal a floating artwork preview, marquee strips, scene
  reveals that respect `prefers-reduced-motion`
- **Design language** is a homage to scene-based technical portfolios; all copy, images and
  identity are Anas's own — no third-party text, assets or code are reproduced

## Atelier edition (`/atelier`) — design language
- **Paper & ink** — warm cream `#F2EEE7` canvas with film grain; two dark "ink" chapters
  (Selected Work, Contact) for magazine-like pacing
- **Type** — Fraunces Variable (display, wonky italics), Space Grotesk Variable (body),
  JetBrains Mono Variable (meta labels), all self-hosted via Fontsource
- **Accents** — vermilion `#EF4B22`, highlighter yellow `#FFC94A`
- **Motion** — Lenis weighted smooth scroll, line-mask heading reveals, scramble-decode
  roles, marquee ticker, rotating ink seals, magnetic buttons, dot cursor
  (all disabled under `prefers-reduced-motion`)
- **Artwork** — project covers are a bespoke risograph illustration series generated
  for this redesign (no stock, no placeholders)

## Light & dark
- Two full themes — **paper** (default) and **charcoal** — driven by one attribute
  (`<html data-theme="…">`) and a runtime palette of CSS custom properties
- The toggle lives in the header (and in the mobile menu); the choice is stored in
  `localStorage` and the OS `prefers-color-scheme` is honoured until you pick a side
- An inline script in `index.html` applies the theme before first paint — no flash
- `color-scheme` and `<meta name="theme-color">` follow the active theme, so the
  address bar, form controls and scrollbars match
- The grain, the ink seals, the custom cursor and every hairline re-tint with it

## Chapters
`00 Hero → ticker → 01 About → 02 Toolkit → 03 Selected Work → 04 Education →
05 Honors → 06 Contact → Footer`

## Project structure
```
src/
├── scenes/         # Scenes edition — data, chrome, agent cursors, scene parts, css
├── components/     # cursor, marquee, magnetic, reveal/mask-lines, scramble,
│                   # seal, section-heading, scroll-progress, theme-toggle
├── lay/            # navbar (full-screen ink mobile menu), footer
├── sections/       # hero, about, toolkit, projects, education, achievements, contact
├── lib/scroll.js   # Lenis smooth scroll + anchor travelling
├── lib/theme.jsx   # theme engine (provider, hook, storage, system preference)
├── App.jsx         # Atelier composition
├── main.jsx        # route switch: / → Scenes, /atelier → Atelier
└── index.css       # design tokens & editorial component styles (Tailwind v4)
```

## Tech stack
React 19 · Vite (rolldown) · Tailwind CSS v4 · Framer Motion 12 · Lenis ·
Fontsource variable fonts · Lucide icons · EmailJS contact form

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run test:theme # headless check of the theme engine (jsdom)
```
Contact form needs EmailJS keys in `.env`:
`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.

## Removed along the way
Interactive spider, CRT/skeuomorphic console panels, preloader gate, click-sparks,
terminal hero, Three.js scene — replaced by the editorial system above.
