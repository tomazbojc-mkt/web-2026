// ─────────────────────────────────────────────
// fuze.js
// Fuze page-specific interactions:
//   • Phone screen switcher (scroll-driven)
//   • Background shape rotation on screen swap
//   • Flip cards (click + icon to reveal back)
// ─────────────────────────────────────────────


// ── Phone screen switcher ─────────────────────
(() => {
  if (!window.matchMedia('(min-width: 901px)').matches) return;

  const screens = document.querySelectorAll('[data-js-screen]');
  const phoneBg = document.querySelector('[data-js-bg]');
  if (!screens.length) return;

  let current = 0;
  let cycleTimer = null;

  // ── Generic multi-image crossfade cycle ──
  function startCycle(screen) {
    const imgs = screen.querySelectorAll('img');
    if (imgs.length < 2) return;
    screen.classList.add('phone__screen--cycling');
    let frameIndex = 0;
    imgs[frameIndex].classList.add('is-active');
    cycleTimer = setInterval(() => {
      imgs[frameIndex].classList.remove('is-active');
      frameIndex = (frameIndex + 1) % imgs.length;
      imgs[frameIndex].classList.add('is-active');
    }, 3000);
  }

  function stopCycle(screen) {
    clearInterval(cycleTimer);
    cycleTimer = null;
    screen.classList.remove('phone__screen--cycling');
    screen.querySelectorAll('img').forEach(img => img.classList.remove('is-active'));
  }

  function animateBg() {
    if (!phoneBg) return;
    gsap.to(phoneBg, { rotation: '+=45', duration: 0.6, ease: 'back.out(1.6)' });
  }

  function showScreen(index) {
    if (index === current) return;
    stopCycle(screens[current]);
    screens[current].classList.remove('phone__screen--active');
    current = index;
    screens[current].classList.add('phone__screen--active');
    startCycle(screens[current]);
    animateBg();
  }

  screens[0].classList.add('phone__screen--active');
  startCycle(screens[0]);

  document.querySelectorAll('[data-js-article]').forEach(article => {
    ScrollTrigger.create({
      trigger: article,
      start: 'top center',
      end:   'bottom center',
      onEnter:     () => showScreen(Number(article.dataset.section)),
      onEnterBack: () => showScreen(Number(article.dataset.section)),
    });
  });
})();


// ── Flip cards ────────────────────────────────
const allFlipCards = Array.from(document.querySelectorAll('[data-js-flip-card]'));

function resetAllCards(except) {
  allFlipCards.forEach(c => { if (c !== except) c.classList.remove('card--flipped'); });
}

allFlipCards.forEach(card => {
  const front = card.querySelector('.card__front');
  const back = card.querySelector('.card__back');

  if (!front || !back) return;

  // Plus icon → flip to back
  const icon = front.querySelector('svg');
  if (icon) {
    icon.setAttribute('role', 'button');
    icon.setAttribute('aria-label', 'Learn more');
    icon.addEventListener('click', e => {
      e.stopPropagation();
      resetAllCards(card);
      card.classList.add('card--flipped');
    });
  }

  // Clicking the back → flip back to front
  back.addEventListener('click', () => card.classList.remove('card--flipped'));
});
