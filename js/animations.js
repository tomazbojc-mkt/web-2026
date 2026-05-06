// ─────────────────────────────────────────────
// animations.js
// All scroll-driven entrance animations:
//   • Fade-up for general elements
//   • Clip-mask wipe for headings
//   • Hero scramble-flip (home page)
//   • Content-hero colour reveal (content / fuze pages)
//   • Provider logos stagger
//   • Game releases grid entrance
//   • Hub banner parallax & character slide-in
//   • Trust stats count-up
//   • Video scale-in
// ─────────────────────────────────────────────


// ── Fade-ups & heading clip-mask wipe ────────
const clipWipeSelectors = 'h2.fade-up, .content-hero h1.fade-up';
const clipWipeEls = typeof SplitText !== 'undefined'
  ? new Set(gsap.utils.toArray(clipWipeSelectors))
  : new Set();

// Hide non-heading fade-up elements immediately (before scroll fires)
gsap.utils.toArray('.fade-up').forEach(el => {
  if (clipWipeEls.has(el)) return;
  gsap.set(el, { opacity: 0, y: 40 });
});

// Headings: SplitText line wipe on scroll
document.fonts.ready.then(() => {
  clipWipeEls.forEach(el => {
    const split = new SplitText(el, { type: 'lines' });
    split.lines.forEach(line => {
      const wrap = document.createElement('div');
      wrap.className = 'clip-wrap';
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
    });
    gsap.set(split.lines, { y: '105%' });

    const delay = el.classList.contains('stagger-4') ? 0.4
      : el.classList.contains('stagger-3') ? 0.3
      : el.classList.contains('stagger-2') ? 0.2
      : el.classList.contains('stagger-1') ? 0.1 : 0;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(split.lines, { y: 0, delay, stagger: 0.1, duration: 0.85, ease: 'power3.out' })
    });
  });
});

// Standard fade-ups for all other .fade-up elements
gsap.utils.toArray('.fade-up').forEach(el => {
  if (clipWipeEls.has(el)) return;

  const delay = el.classList.contains('stagger-4') ? 0.4
    : el.classList.contains('stagger-3') ? 0.3
    : el.classList.contains('stagger-2') ? 0.2
    : el.classList.contains('stagger-1') ? 0.1 : 0;

  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.9, delay, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
  });
});


// ── Hero scramble-flip (home / index page only) ──
/* TEMPORARILY DISABLED
document.fonts.ready.then(() => {
  if (document.querySelector('.content-hero')) return; // skip on content/fuze pages
  const mutedSpan = document.querySelector('.hero h1 .muted');
  if (!mutedSpan) return;

  const scrambleSplit = new SplitText(mutedSpan, { type: 'chars' });
  const chars = scrambleSplit.chars;

  chars.forEach(char => {
    const mask = document.createElement('span');
    mask.className = 'hero-char-mask';
    const dup = document.createElement('span');
    dup.className = 'hero-char-dup';
    dup.textContent = char.textContent;
    char.parentNode.insertBefore(mask, char);
    mask.appendChild(char);
    mask.appendChild(dup);
    gsap.set(char, { position: 'relative' });
    gsap.set(dup, { y: '120%' });
  });

  const indices = gsap.utils.shuffle([...Array(chars.length).keys()]);
  const tl = gsap.timeline({ delay: 1.2 });

  indices.forEach((i, order) => {
    const char = chars[i];
    const dup  = char.parentNode.querySelector('.hero-char-dup');
    tl.to(char, { y: '-120%', autoAlpha: 0, duration: 0.45, ease: 'power2.inOut' }, order * 0.04)
      .to(dup,  { y: '0%',    duration: 0.45, ease: 'power2.inOut' }, order * 0.04);
  });
});
TEMPORARILY DISABLED */


// ── Content-hero colour reveal (content / fuze pages) ──
document.fonts.ready.then(() => {
  const contentMuted = document.querySelector('.content-hero h1 .muted');
  if (!contentMuted) return;

  const split = new SplitText(contentMuted, { type: 'chars' });
  gsap.set(split.chars, { color: 'var(--black)' });

  gsap.timeline({ delay: 1.4 }).to(split.chars, {
    color: 'var(--accent)',
    duration: 0.08,
    stagger: { each: 0.04, from: 'start' },
    ease: 'none'
  });
});


// ── Provider logos stagger ────────────────────
const providerLogos = gsap.utils.toArray('.provider-logo');
if (providerLogos.length) {
  gsap.set(providerLogos, { opacity: 0, scale: 0.8, y: 20 });
  ScrollTrigger.create({
    trigger: '.providers-grid',
    start: 'top 85%',
    once: true,
    onEnter: () => gsap.to(providerLogos, {
      opacity: 1, scale: 1, y: 0, duration: 0.4,
      ease: 'back.out(1.4)',
      stagger: { each: 0.06, from: 'start' }
    })
  });
}


// ── Game releases grid entrance ───────────────
const gameThumbs = gsap.utils.toArray('.game-thumb');
if (gameThumbs.length) {
  gsap.set(gameThumbs, { opacity: 0, scale: 0.8, y: 60, rotation: gsap.utils.wrap([-4, 3, -2, 5, 2, -3, 4, -5]) });
  ScrollTrigger.batch(gameThumbs, {
    start: 'top 90%',
    once: true,
    onEnter: batch => gsap.to(batch, {
      opacity: 1, scale: 1, y: 0, rotation: 0,
      duration: 0.7, ease: 'back.out(1.4)', stagger: 0.08, overwrite: true
    })
  });
}


// ── Hub banner parallax & character slide-in ──
const hubBanner = document.querySelector('.hub-banner');
if (hubBanner) {
  const king     = hubBanner.querySelector('.hub-king');
  const orbs     = hubBanner.querySelector('.hub-orbs');
  const chick    = hubBanner.querySelector('.hub-chick');
  const cat      = hubBanner.querySelector('.hub-cat');
  const hubCenter = hubBanner.querySelector('.hub-center');

  // Scale-up as banner enters viewport
  gsap.set(hubBanner, { scale: 0.88, borderRadius: '40px' });
  gsap.to(hubBanner, {
    scale: 1, borderRadius: '24px', ease: 'none',
    scrollTrigger: { trigger: hubBanner, start: 'top bottom', end: 'top bottom-=300', scrub: 0.4 }
  });

  // Characters slide in from the sides once
  gsap.set([king, orbs], { x: -120, opacity: 0 });
  gsap.set([cat, chick], { x: 120,  opacity: 0 });
  ScrollTrigger.create({
    trigger: hubBanner, start: 'top 75%', once: true,
    onEnter: () => {
      gsap.to(king,  { x: 0, opacity: 1, duration: 1, ease: 'power3.out' });
      gsap.to(orbs,  { x: 0, opacity: 1, duration: 1, delay: 0.15, ease: 'power3.out' });
      gsap.to(chick, { x: 0, opacity: 1, duration: 1, delay: 0.1,  ease: 'power3.out' });
      gsap.to(cat,   { x: 0, opacity: 1, duration: 1, delay: 0.2,  ease: 'power3.out' });
    }
  });

  // Parallax drift on scroll
  const parallaxConfig = { ease: 'none', scrollTrigger: { trigger: hubBanner, start: 'top bottom', end: 'bottom top', scrub: 1.5 } };
  gsap.to(king,      { yPercent: 15, ...parallaxConfig });
  gsap.to(cat,       { yPercent: 20, ...parallaxConfig });
  gsap.to(orbs,      { yPercent: 30, ...parallaxConfig });
  gsap.to(chick,     { yPercent: 25, ...parallaxConfig });
  gsap.to(hubCenter, { yPercent: 10, ...parallaxConfig });
}


// ── Trust stats count-up ──────────────────────
document.querySelectorAll('.trust-number[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count);
  const obj = { val: 0 };
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter: () => gsap.to(obj, {
      val: target, duration: 1.8, ease: 'power2.out',
      onUpdate() { el.textContent = Math.round(obj.val).toLocaleString(); }
    })
  });
});


// ── Feature-label pop-in (generic) ────────────
// Staggered reveal for any .feature-label--animated not already
// handled by a page-specific script (e.g. fuze.js)
(() => {
  const labels = gsap.utils.toArray('.feature-label--animated:not(.is-visible)');
  if (!labels.length) return;

  ScrollTrigger.create({
    trigger: labels[0].closest('section, .hero, .wrapper') || labels[0],
    start: 'top 75%',
    once: true,
    onEnter: () => {
      labels.forEach((label, i) => {
        setTimeout(() => label.classList.add('is-visible'), i * 180);
      });
    }
  });
})();


// ── Video scale-in ────────────────────────────
const videoEl = document.getElementById('videoPlaceholder');
if (videoEl) {
  gsap.fromTo(videoEl, { scale: 0.85 }, {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: videoEl, start: 'top bottom', end: 'top 30%', scrub: true }
  });
}
