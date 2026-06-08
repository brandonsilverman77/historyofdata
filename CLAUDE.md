# CLAUDE.md

Project context for Claude. Read this first when returning to the project.

## What this is

**"The Closing Window"** — a single-page, scroll-driven narrative ("scrollytelling")
website making the argument that as social media grew to 5.6B+ users, independent
research access to the platforms collapsed in ~18 months (Feb 2023 – Aug 2024).

It is an editorial/data-storytelling piece, **not** an app. There is no backend,
no database, and no user input. It just renders a fixed narrative with animated
stats and one chart.

- **Live:** GitHub Pages (deploys automatically — see Deployment).
- **Repo:** https://github.com/brandonsilverman77/historyofdata
- **Author:** Brandon Silverman (brandon.silverman@gmail.com)

## Tech stack

- Plain **HTML + CSS + vanilla JS**. No framework, no bundler, **no build step**.
- **Chart.js 4.4.7** loaded from CDN (jsDelivr) — the only external JS dependency.
- Google Fonts: Source Serif 4 (body), Inter (UI/headings), JetBrains Mono (labels).
- Targets modern browsers; uses `IntersectionObserver` and CSS custom properties.

## File map

| File | Purpose |
|------|---------|
| `index.html` | All page content + structure. Sections are ordered chapters (Hero → Prologue → Ch.1 Golden Age → Ch.2 Doors Close → Ch.3 Paradox → Ch.4 Stakes → Closing → CTA → Footer). |
| `styles.css` | All styling. Design tokens live in `:root` (CSS variables). Responsive breakpoint at `max-width: 768px`. |
| `script.js` | Three behaviors only: (1) fade-in on scroll, (2) animated number counters, (3) the Chart.js "paradox" chart. Plus smooth-scroll for anchors. |
| `.github/workflows/deploy.yml` | GitHub Pages deploy (push to `main`). |
| `.claude/launch.json` | Local dev server configs (gitignored). |

## How content & animation work (conventions)

- **Fade-in:** add class `fade-in` to any element. `script.js` observes it and adds
  `.visible` when it scrolls into view. CSS handles the transition.
- **Animated counters:** an element with `class="big-number" data-target="33306"`
  (optional `data-suffix="%"` / `"+"`) animates from 0 to target once on scroll.
- **The chart** (`#paradoxChart`) is built entirely in `script.js` → `createParadoxChart()`.
  It plots two series: *Social Media Users (billions)* and a *Research Access Index*.
- **Design tokens:** change colors/fonts via the CSS variables in `:root`
  (e.g. `--color-accent`, `--color-gold`, `--font-serif`). Don't hardcode hex values
  elsewhere — reuse the vars.

## ⚠️ Data integrity notes (important for edits)

- The **"Research Access Index"** (the red line in the chart, `access` array in
  `script.js`) is an **editorial/narrative construct, normalized 0–100** — it is NOT
  a measured dataset. This is stated in a code comment; keep that honesty if you edit it.
- The **user-count series** and the big stats (33,306 studies; 88%; $42,000/mo; etc.)
  are sourced from real reporting/research. If you change a number, keep it consistent
  between `index.html` (display) and `script.js` (chart) and don't invent figures.
- The footer cites sources generically. New claims should be defensible.

## Run locally

No build needed — just serve the folder over HTTP (don't open via `file://`, the
CDN/fonts and observers behave better over HTTP).

```bash
cd /Users/brandonsilverman/historyofdata
python3 -m http.server 8080
# then open http://localhost:8080
```

There is also a `dev` config in `.claude/launch.json` that runs exactly this on port 8080.

## Deployment

Fully automatic via GitHub Actions (`.github/workflows/deploy.yml`):

- **Trigger:** any push to `main` (or manual `workflow_dispatch`).
- **What it does:** uploads the repo root (`path: '.'`) as a Pages artifact and deploys it.
- So: **commit → push to `main` → it's live.** No manual deploy step.

## History / gotchas (so you don't repeat past confusion)

- A large **"CAASPP" chart** (California student-assessment data: ELA/Math dashboard +
  gauge toggle) was once added to `index.html` (commit `9602eb5`, +8,108 lines) and then
  **reverted** (`3da090f`). The current site does **not** contain it. That work belonged
  to a different effort — see below.
- `.claude/launch.json` has a second config named **`kiddata`** pointing at
  **`/tmp/kiddata`** (port 8090). That is a **separate side project** about a child's
  (Caleb's) report-card / test scores — it is *not* part of this repo, and `/tmp/kiddata`
  is a temp dir that gets cleared on reboot. If a "report card scores" page ever "won't
  update," it's almost certainly because that temp project's files are gone, not a bug here.
  Don't conflate it with "The Closing Window."

## If asked to extend this site

- Add a new chapter = add a `chapter-header` section + `narrative-section`s in `index.html`,
  reuse existing classes (`.body-text`, `.section-heading`, `.stat-break`, `.tool-card`, etc.).
- Add an animated stat = use the `big-number`/`data-target` pattern.
- Keep it dependency-light and build-step-free; that's a core property of this project.
