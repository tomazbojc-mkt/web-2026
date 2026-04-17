// ─────────────────────────────────────────────
// fuze.js
// Fuze page-specific interactions:
//   • Phone screen switcher (scroll-driven)
//   • Background shape rotation on screen swap
//   • Flip cards (click + icon to reveal back)
// ─────────────────────────────────────────────


// Exposed by the screen switcher IIFE so the flip-card handler can call it
let selectCardImages = null;

// ── Phone screen switcher ─────────────────────
(() => {
  if (!window.matchMedia('(min-width: 901px)').matches) return;

  const screens = Array.from(document.querySelectorAll('[data-js-screen]'));
  const phoneBg = document.querySelector('[data-js-bg]');
  const presentation = document.querySelector('.fuze-presentation');
  if (!screens.length) return;

  let current = 0;
  let cycleTimer = null;
  let activeCycleScreen = null;

  // ── Generic multi-image crossfade cycle ──
  function getScreenImages(screen) {
    const activeSet = screen.querySelector('[data-js-screen-set-active]');
    return Array.from((activeSet || screen).querySelectorAll('img'));
  }

  function resetScreenFrame(screen) {
    const imgs = getScreenImages(screen);
    if (imgs.length < 2) return;

    screen.classList.add('phone__screen--sequenced');
    screen.classList.remove('phone__screen--cycling');
    imgs.forEach((img, index) => img.classList.toggle('is-active', index === 0));
  }

  function startCycle(screen) {
    const imgs = getScreenImages(screen);
    if (imgs.length < 2) return;

    if (activeCycleScreen && activeCycleScreen !== screen) {
      stopCycle(activeCycleScreen);
    }

    clearInterval(cycleTimer);
    cycleTimer = null;
    resetScreenFrame(screen);

    screen.classList.add('phone__screen--cycling');
    activeCycleScreen = screen;

    let frameIndex = 0;
    cycleTimer = setInterval(() => {
      imgs[frameIndex].classList.remove('is-active');
      frameIndex = (frameIndex + 1) % imgs.length;
      imgs[frameIndex].classList.add('is-active');
    }, 3000);
  }

  function stopCycle(screen, { reset = true } = {}) {
    clearInterval(cycleTimer);
    cycleTimer = null;

    if (!screen) {
      activeCycleScreen = null;
      return;
    }

    screen.classList.remove('phone__screen--cycling');
    if (reset) resetScreenFrame(screen);
    if (activeCycleScreen === screen) activeCycleScreen = null;
  }

  function animateBg() {
    if (!phoneBg) return;
    gsap.to(phoneBg, { rotation: '+=45', duration: 0.6, ease: 'back.out(1.6)' });
  }

  function clearSectionSelection(sectionIndex) {
    const article = document.querySelector(`[data-js-article][data-section="${sectionIndex}"]`);
    if (article) article.querySelectorAll('[data-js-flip-card]').forEach(c => c.removeAttribute('data-js-card-selected'));
  }

  function activateDefaultSet(screen, sectionIndex) {
    const sets = Array.from(screen.querySelectorAll('[data-js-screen-set]'));
    if (!sets.length) return;
    sets.forEach((set, i) => {
      if (i === 0) set.setAttribute('data-js-screen-set-active', '');
      else set.removeAttribute('data-js-screen-set-active');
    });
    Array.from(sets[0].querySelectorAll('img')).forEach((img, i) => img.classList.toggle('is-active', i === 0));
    const article = document.querySelector(`[data-js-article][data-section="${sectionIndex}"]`);
    if (!article) return;
    const grid = article.querySelector('.card-grid');
    if (!grid) return;
    grid.querySelectorAll('[data-js-flip-card]').forEach(c => c.removeAttribute('data-js-card-selected'));
    const firstCard = grid.querySelector(`[data-js-flip-card][data-name="${sets[0].dataset.jsScreenSet}"]`);
    if (firstCard) firstCard.setAttribute('data-js-card-selected', '');
  }

  function showScreen(index, dir = 1) {
    const inScreen = screens[index];
    if (!inScreen) return;

    if (index === current) {
      if (activeCycleScreen !== inScreen) startCycle(inScreen);
      return;
    }

    activateDefaultSet(inScreen, index);

    const outScreen = screens[current];

    stopCycle(outScreen, { reset: false });

    const outY    = dir >= 0 ? '-100%' : '100%';
    const inFromY = dir >= 0 ? '100%'  : '-100%';

    gsap.killTweensOf(outScreen);
    gsap.killTweensOf(inScreen);

    inScreen.classList.add('phone__screen--active');

    gsap.to(outScreen, {
      y: outY,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        outScreen.classList.remove('phone__screen--active');
        resetScreenFrame(outScreen);
      },
    });

    gsap.fromTo(inScreen,
      { y: inFromY },
      {
        y: '0%',
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => startCycle(inScreen),
      }
    );

    current = index;
    animateBg();
  }

  // Position all screens below, screen 0 visible
  screens.forEach(resetScreenFrame);
  gsap.set(screens, { y: '100%' });
  screens[0].classList.add('phone__screen--active');
  gsap.set(screens[0], { y: '0%' });

  if (presentation) {
    ScrollTrigger.create({
      trigger: presentation,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => stopCycle(screens[current]),
      onLeaveBack: () => stopCycle(screens[current]),
    });
  }

  document.querySelectorAll('[data-js-article]:not([hidden])').forEach(article => {
    ScrollTrigger.create({
      trigger: article,
      start: 'top center',
      end:   'bottom center',
      onEnter:     () => showScreen(Number(article.dataset.section), 1),
      onEnterBack: () => showScreen(Number(article.dataset.section), -1),
    });
  });

  // ── Card-driven image set swap ──
  selectCardImages = function(card) {
    const article = card.closest('[data-js-article]');
    if (!article) return;
    const sectionIndex = Number(article.dataset.section);
    const screen = screens[sectionIndex];
    if (!screen) return;

    const targetSet = screen.querySelector(`[data-js-screen-set="${card.dataset.name}"]`);
    if (!targetSet) return;

    // Pre-activate first image before the set becomes visible
    Array.from(targetSet.querySelectorAll('img')).forEach((img, i) => {
      img.classList.toggle('is-active', i === 0);
    });

    screen.querySelectorAll('[data-js-screen-set]').forEach(set => {
      if (set === targetSet) set.setAttribute('data-js-screen-set-active', '');
      else set.removeAttribute('data-js-screen-set-active');
    });

    const grid = card.closest('.card-grid');
    if (grid) {
      grid.querySelectorAll('[data-js-flip-card]').forEach(c => c.removeAttribute('data-js-card-selected'));
    }
    card.setAttribute('data-js-card-selected', '');

    if (sectionIndex === current) {
      stopCycle(screen, { reset: false });
      screen.classList.add('phone__screen--sequenced');
      screen.classList.remove('phone__screen--cycling');
      startCycle(screen);
    }
  };

  // Wire all flip cards; no-op if no matching set exists
  document.querySelectorAll('[data-js-flip-card]').forEach(card => {
    const front = card.querySelector('.card__front');
    if (front) front.addEventListener('click', () => selectCardImages(card));
  });

  // Initialize selected state from whichever set is active in HTML
  document.querySelectorAll('[data-js-screen-set-active]').forEach(activeSet => {
    const screen = activeSet.closest('[data-js-screen]');
    if (!screen) return;
    const article = document.querySelector(`[data-js-article][data-section="${screen.dataset.screen}"]`);
    if (!article) return;
    const card = article.querySelector(`[data-js-flip-card][data-name="${activeSet.dataset.jsScreenSet}"]`);
    if (card) card.setAttribute('data-js-card-selected', '');
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
      if (selectCardImages) selectCardImages(card);
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
