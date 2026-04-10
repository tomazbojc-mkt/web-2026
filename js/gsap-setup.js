// ─────────────────────────────────────────────
// gsap-setup.js
// Registers GSAP plugins and sets global defaults.
// Must be loaded BEFORE all other js/ scripts.
// ─────────────────────────────────────────────

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.config({ force3D: true });
gsap.defaults({ force3D: true });

// Adds 'js-ready' to <body> so CSS can safely show animated elements
document.body.classList.add('js-ready');
