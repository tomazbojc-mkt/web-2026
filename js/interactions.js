// ─────────────────────────────────────────────
// interactions.js
// User-interaction behaviours (no scroll triggers):
//   • Smooth scroll for anchor links
//   • Button flair hover effect
//   • Game / roadmap thumb hover overlay
// ─────────────────────────────────────────────


// ── Smooth scroll for marked anchor links ────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function getScrollTarget(hash) {
  if (!hash || hash === '#') return null;

  const targetId = decodeURIComponent(hash.slice(1));
  if (!targetId) return null;

  return document.getElementById(targetId);
}

function getScrollTop(target) {
  const nav = document.getElementById('nav');
  const navOffset = nav ? nav.getBoundingClientRect().height : 0;

  return Math.max(0, window.scrollY + target.getBoundingClientRect().top - navOffset);
}

document.querySelectorAll('[data-js-scroll-to][href^="#"]:not([href="#"])').forEach(link => {
  link.addEventListener('click', event => {
    const hash = link.getAttribute('href');
    const target = getScrollTarget(hash);

    if (!target) return;

    event.preventDefault();

    window.scrollTo({
      top: getScrollTop(target),
      behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
    });

    if (window.history && typeof window.history.pushState === 'function') {
      window.history.pushState(null, '', hash);
    }
  });
});


// ── Button flair hover ────────────────────────
// Creates a radial "blob" that follows the cursor inside each primary button
document.querySelectorAll('[data-js-btn-flair]').forEach(btn => {
  const label = document.createElement('span');
  label.className = 'btn-label';
  while (btn.firstChild) label.appendChild(btn.firstChild);
  btn.appendChild(label);

  const flair = document.createElement('span');
  flair.className = 'btn-flair';
  btn.appendChild(flair);

  const xSet = gsap.quickSetter(flair, 'xPercent');
  const ySet = gsap.quickSetter(flair, 'yPercent');

  function getXY(e) {
    const { left, top, width, height } = btn.getBoundingClientRect();
    return {
      x: gsap.utils.clamp(0, 100, ((e.clientX - left) / width)  * 100),
      y: gsap.utils.clamp(0, 100, ((e.clientY - top)  / height) * 100)
    };
  }

  btn.addEventListener('mouseenter', e => {
    const { x, y } = getXY(e);
    xSet(x); ySet(y);
    gsap.to(flair, { scale: 1, duration: 0.4, ease: 'power2.out' });
  });

  btn.addEventListener('mouseleave', e => {
    const { x, y } = getXY(e);
    gsap.killTweensOf(flair);
    gsap.to(flair, {
      xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
      yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
      scale: 0, duration: 0.3, ease: 'power2.out'
    });
  });

  btn.addEventListener('mousemove', e => {
    const { x, y } = getXY(e);
    gsap.to(flair, { xPercent: x, yPercent: y, duration: 0.4, ease: 'power2' });
  });
});


// ── Game / roadmap thumb hover overlay ────────
// Injects "play game" and "more info" links on hover
document.querySelectorAll('[data-js-thumb-overlay-host]').forEach(thumb => {
  const overlay = document.createElement('div');
  overlay.className = 'thumb-overlay';
  overlay.innerHTML = `
    <a href="#" class="thumb-overlay-btn">play game</a>
    <a href="#" class="thumb-overlay-btn thumb-overlay-btn--ghost">more info</a>
  `;
  thumb.appendChild(overlay);
});
