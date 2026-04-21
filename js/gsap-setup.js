// ─────────────────────────────────────────────
// gsap-setup.js
// Registers GSAP plugins and sets global defaults.
// Must be loaded BEFORE all other js/ scripts.
// ─────────────────────────────────────────────

const gsapPlugins = [
	typeof ScrollTrigger !== 'undefined' ? ScrollTrigger : null,
	typeof SplitText !== 'undefined' ? SplitText : null,
].filter(Boolean);

if (gsapPlugins.length) {
	gsap.registerPlugin(...gsapPlugins);
}

gsap.config({ force3D: true });
gsap.defaults({ force3D: true });

// Adds 'js-ready' to <body> so CSS can safely show animated elements
document.body.classList.add('js-ready');
