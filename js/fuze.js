// ─────────────────────────────────────────────
// fuze.js
// Fuze page-specific interactions:
//   • Phone screen switcher (scroll-driven)
//   • Background shape rotation on screen swap
//   • Flip cards (click + icon to reveal back)
// ─────────────────────────────────────────────


// ── Phone screen switcher ─────────────────────
(() => {
  const screens = document.querySelectorAll('[data-js="phone-screen"]');
  const phoneBg = document.querySelector('[data-js="phone-bg"]');
  let current = 0;

  function animateBg() {
    if (!phoneBg) return;
    gsap.to(phoneBg, { rotation: '+=45', duration: 0.6, ease: 'back.out(1.6)' });
  }

  function showScreen(index) {
    if (index === current) return;
    screens[current].classList.remove('phone__screen--active');
    current = index;
    screens[current].classList.add('phone__screen--active');
    animateBg();
  }

  screens[0].classList.add('phone__screen--active');

  document.querySelectorAll('[data-js="fuze-article"]').forEach(article => {
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
const allFlipCards = Array.from(document.querySelectorAll('[data-js="flip-card"]'));

function resetAllCards(except) {
  allFlipCards.forEach(c => { if (c !== except) c.classList.remove('card--flipped'); });
}

allFlipCards.forEach(card => {
  const text = card.dataset.flipText;

  // Wrap existing children in .card__front
  const front = document.createElement('div');
  front.className = 'card__front';
  while (card.firstChild) front.appendChild(card.firstChild);

  // Build .card__back
  const back = document.createElement('div');
  back.className = 'card__back';
  back.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="card__back-close lucide lucide-circle-minus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
    <p>${text}</p>
  `;

  // Wrap both in .card__inner
  const inner = document.createElement('div');
  inner.className = 'card__inner';
  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

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
