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

  function showScreen(index, dir = 1) {
    if (index === current) return;

    const outScreen = screens[current];
    const inScreen  = screens[index];

    stopCycle(outScreen);

    const outY    = dir >= 0 ? '-100%' : '100%';
    const inFromY = dir >= 0 ? '100%'  : '-100%';

    gsap.killTweensOf(outScreen);
    gsap.killTweensOf(inScreen);

    inScreen.classList.add('phone__screen--active');

    gsap.to(outScreen, {
      y: outY,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => outScreen.classList.remove('phone__screen--active'),
    });

    gsap.fromTo(inScreen,
      { y: inFromY },
      { y: '0%', duration: 0.5, ease: 'power3.inOut' }
    );

    current = index;
    startCycle(inScreen);
    animateBg();
  }

  // Position all screens below, screen 0 visible
  gsap.set(screens, { y: '100%' });
  screens[0].classList.add('phone__screen--active');
  gsap.set(screens[0], { y: '0%' });
  startCycle(screens[0]);

  document.querySelectorAll('[data-js-article]:not([hidden])').forEach(article => {
    ScrollTrigger.create({
      trigger: article,
      start: 'top center',
      end:   'bottom center',
      onEnter:     () => showScreen(Number(article.dataset.section), 1),
      onEnterBack: () => showScreen(Number(article.dataset.section), -1),
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


// ── Feature labels: pop-in sequence on scroll into view ──────
(() => {
  const phone = document.querySelector('.big-idea__phone');
  if (!phone) return;
  const labels = phone.querySelectorAll('.feature-label--animated');
  if (!labels.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          labels.forEach((label, i) => {
            setTimeout(() => label.classList.add('is-visible'), i * 180);
          });
          obs.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );
  obs.observe(phone);
})();
