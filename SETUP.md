# Bragg Gaming — Frontend Setup

## Project structure

```
web-2026/
├── index.html          ← Home page
├── content.html        ← Games / Content page
├── fuze.html           ← Fuze product page
├── styles.css          ← All shared styles
├── fuze.scss           ← Fuze SCSS entrypoint
├── fuze.css            ← Compiled Fuze CSS entrypoint (imported by styles.css)
├── package.json        ← Sass build scripts
├── assets/             ← Images, SVGs, videos, fonts
├── fuze/               ← Fuze SCSS sources + compiled CSS outputs
└── js/                 ← Site JavaScript — one file per concern
    ├── gsap-setup.js   ← GSAP plugin registration (must load first)
    ├── nav.js          ← Navigation: hide-on-scroll + mega menu
    ├── animations.js   ← Scroll-driven entrance animations
    └── interactions.js ← Hover effects, overlays, smooth scroll
```

---

## How to run locally

If you are only viewing the site, no build tools are required. Just serve the folder over HTTP.

**Option A — Python (built into macOS/Linux):**
```bash
cd web-2026
python3 -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

**Option B — Node.js:**
```bash
npx serve .
```

## Working on Fuze SCSS

The Fuze styles now use `.scss` source files that compile back to the existing `.css` files in place.
That keeps all current HTML and CSS imports working unchanged.

Install dependencies once:

```bash
npm install
```

Build the Fuze SCSS once:

```bash
npm run build:scss
```

Watch the Fuze SCSS during development:

```bash
npm run watch:scss
```

Source files:

- `fuze.scss` → `fuze.css`
- `fuze/*.scss` → `fuze/*.css`

The compiled CSS remains part of the project output, so deployment is still static.

> ⚠️ Do not open HTML files directly with `file://` — some browsers block scripts loaded that way.

---

## How the scripts are loaded

Each HTML page loads scripts at the bottom of `<body>` in this order:

```html
<!-- 1. GSAP library (from CDN — requires internet) -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>

<!-- 2. Site scripts — order matters -->
<script src="js/gsap-setup.js"></script>   ← must be first
<script src="js/nav.js"></script>
<script src="js/animations.js"></script>
<script src="js/interactions.js"></script>
```

**The order is important.** `gsap-setup.js` registers the GSAP plugins — if it runs after the others, animations will silently fail.

---

## What each JS file does

| File | What it controls |
|---|---|
| `js/gsap-setup.js` | Registers GSAP plugins, sets performance defaults. **Touch nothing else before this runs.** |
| `js/nav.js` | Hides the navbar on scroll-down, shows it on scroll-up. Also powers the mega-menu dropdowns. |
| `js/animations.js` | All scroll-triggered animations: headings wipe in, game thumbs bounce in, hub banner parallax, provider logos stagger, stats count-up, etc. |
| `js/interactions.js` | Cursor-following hover effect on buttons, hover overlays on game thumbnails, smooth scroll for anchor links. |

---

## Adjusting animation timing

All key values are at the top of each function or clearly commented. For example:

**Nav hide sensitivity** (`js/nav.js`):
```js
const HIDE_AFTER    = 80;  // px scrolled before hide activates
const INTENT_THRESH = 70;  // px needed in one direction to toggle
```

**Fade-up speed** (`js/animations.js`):
```js
gsap.to(el, { duration: 0.9, ease: 'power3.out', ... })
//           ↑ increase for slower, decrease for faster
```

---

## Deploying

The site is still deployed as plain HTML/CSS/JS. If you changed any Fuze `.scss` files, run the Sass build first so the generated `.css` files are up to date, then copy the entire folder to any static host (GitHub Pages, Netlify, Vercel, S3, etc.).

GitHub Pages is already configured via `.github/workflows/`. Push to `main` and the site publishes automatically.
