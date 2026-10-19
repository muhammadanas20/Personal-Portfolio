# Atelier — Design System & UI Specification
### Muhammad Anas · Personal Portfolio · Full redesign v3.0
Concept board: [`design/concept-board.jpg`](design/concept-board.jpg)

---

## 1. Design Direction

A complete departure from the previous dark "cyber-console / CRT" theme (screws, LEDs,
terminal hero, spider, preloader — all removed). The new direction is **editorial paper**:
the calm confidence of award-winning studio sites (Awwwards SOTD language — confident
typography, weighted smooth scroll, one continuous surface) fused with **kinetic type**
and tactile print textures (risograph grain, halftone art, misregistration accents).

Design principles:
1. **Type is the interface.** Oversized viewport-scaled serif headlines carry the visual
   weight; no decorative 3D.
2. **Pacing.** Light paper sections alternate with two dark "ink" chapters
   (Selected Work, Contact) so the page breathes like a printed magazine.
3. **Motion earns its place.** Every animation is a reveal, a response, or a rhythm —
   never decoration. Reduced-motion is fully respected.
4. **Print soul.** Film grain overlay, hairline rules, ink stamps, risograph artwork.

## 2. Color

| Token        | Hex / value          | Usage                                   |
|--------------|----------------------|-----------------------------------------|
| `paper`      | `#F2EEE7`            | Global background (light chapters)      |
| `paper-2`    | `#FAF8F2`            | Cards, raised surfaces on paper         |
| `ink`        | `#1A1610`            | Headings/body on paper; dark chapter bg |
| `ink-soft`   | `#6E675A`            | Secondary text on paper                 |
| `line`       | `rgba(26,22,16,.16)` | Hairline rules & borders on paper       |
| `cream`      | `#EDE7DB`            | Text on ink (dark chapters)             |
| `cream-soft` | `#A79E8E`            | Secondary text on ink                   |
| `vermilion`  | `#EF4B22`            | Primary accent — links, seals, stamps   |
| `highlight`  | `#FFC94A`            | Marker-highlight sweeps on keywords     |

Contrast: ink on paper = 15.4:1 · cream on ink = 13.9:1 · vermilion on paper = 4.0:1
(large type / graphics only) · ink-soft on paper = 5.3:1. WCAG AA across text.

## 3. Typography

| Role            | Family                          | Notes                                        |
|-----------------|---------------------------------|----------------------------------------------|
| Display         | **Fraunces Variable**           | `opsz 144`, WONK=1 on italic accent words    |
| Body / UI       | **Space Grotesk Variable**      | 300–700, body 16–18px / 1.65                 |
| Meta / labels   | **JetBrains Mono Variable**     | 11–12px, uppercase, tracking .18em           |

Scale (clamp, fluid):
- Hero name: `clamp(3.4rem, 11.5vw, 10.5rem)`, leading .88, tracking -.02em
- Section title: `clamp(2.4rem, 6vw, 5rem)`, leading .95
- Statement text: `clamp(1.15rem, 2.2vw, 1.6rem)`
- Body: 1rem–1.125rem · Meta: .6875rem–.75rem

## 4. Layout & Spacing
- Container: max-width 1200px, gutters 20px → 32px (≥sm)
- Section rhythm: `py 96px` mobile → `140px` desktop; hairline dividers between chapters
- Grid: 12-col conceptual; asymmetric editorial splits (7/5, 5/7), broken with
  overlapping stamps/seals and offset captions
- Radii: mostly 0 (editorial sharp) · images: arch top (`border-radius: 999px 999px 0 0`)
  for the portrait, 4px elsewhere
- Borders: 1px hairlines, never heavy shadows

## 5. Signature Components
1. **Grain overlay** — fixed SVG turbulence film, opacity .28, pointer-events none
2. **Marquee ticker** — ink strip, mono + serif-italic mix, 42s linear loop, pause on hover
3. **Line-mask reveal** — headings rise from clipped lines, `cubic-bezier(.16,1,.3,1)` 0.9s
4. **Scramble-decode** — rotating role words decode from glyph noise (1.1s)
5. **Rotating seal** — circular SVG text stamp ("· MUHAMMAD ANAS · FULL-STACK DEVELOPER"),
   22s rotation, vermilion dot core
6. **Magnetic buttons** — pointer-follow translate (≤10px), spring back
7. **Dot cursor** — 6px ink dot + 34px trailing ring, grows over interactive targets;
   native cursor restored on touch devices
8. **Index numbers** — `01/` mono prefixes on every chapter header
9. **Highlight sweep** — vermilion/yellow marker underline drawn on scroll-in
10. **Scroll progress hairline** — 2px vermilion rule at viewport top

## 6. Motion Spec
- Smooth scroll: Lenis, `lerp .09`, `duration 1.15`, disabled for `prefers-reduced-motion`
- Reveals: `whileInView`, once, `y 28→0`, opacity, `.7s`, stagger .08–.12s
- Marquee: translateX −50% loop · Seal: rotate 360°/22s
- Hover: links underline draw .35s; project art scale 1→1.06 (600ms); arrow slide 24px
- No scroll-jacking, no page loader, no intro gate — content paints immediately

## 7. Chapters (page order)
`Nav → 00 Hero → Ticker → 01 About → 02 Toolkit (bento) → 03 Selected Work (ink) →
04 Education → 05 Honors → 06 Contact (ink) → Footer`

## 8. Responsive Strategy
- ≥1280: full asymmetric editorial layouts, seal & captions visible
- 768–1279: 2-col collapses to stacked pairs; bento 4→2 cols; projects alternate → single
- ≤767: single column, hero name 11.5vw, marquee 1 line, full-screen ink mobile menu
  with staggered links, touch: native cursor, tap targets ≥44px
- Breakpoints: sm 640 · md 768 · lg 1024 · xl 1280 (Tailwind defaults)

## 9. Accessibility
- Semantic landmarks, single h1, skip-to-content link, visible focus rings (vermilion 2px)
- All interactive elements keyboard reachable; modal (certificate viewer) traps Esc +
  backdrop click, restores scroll lock
- `prefers-reduced-motion`: Lenis off, marquee paused, reveals instant, cursor native
- Alt text on all art; decorative grain/seals `aria-hidden`
