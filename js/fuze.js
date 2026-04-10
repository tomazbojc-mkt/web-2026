// ─────────────────────────────────────────────
// fuze.js
// Fuze page-specific interactions:
//   • Phone screen switcher (scroll-driven)
//   • Background shape rotation on screen swap
//   • Flip cards (click + icon to reveal back)
// ─────────────────────────────────────────────


// ── Phone screen switcher ─────────────────────
(() => {
  const screens = document.querySelectorAll('.phone-screen');
  const phoneBg = document.querySelector('.phone-bg');
  let current = 0;

  function animateBg() {
    if (!phoneBg) return;
    gsap.to(phoneBg, { rotation: '+=45', duration: 0.6, ease: 'back.out(1.6)' });
  }

  function showScreen(index) {
    if (index === current) return;
    screens[current].classList.remove('is-active');
    current = index;
    screens[current].classList.add('is-active');
    animateBg();
  }

  screens[0].classList.add('is-active');

  document.querySelectorAll('.fuze-presentation__article').forEach(article => {
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
const allFlipCards = Array.from(document.querySelectorAll('.card[data-flip-text]'));

function resetAllCards(except) {
  allFlipCards.forEach(c => { if (c !== except) c.classList.remove('is-flipped'); });
}

allFlipCards.forEach(card => {
  const text = card.dataset.flipText;

  // Wrap existing children in .card-front
  const front = document.createElement('div');
  front.className = 'card-front';
  while (card.firstChild) front.appendChild(card.firstChild);

  // Build .card-back
  const back = document.createElement('div');
  back.className = 'card-back';
  back.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="card-back-close lucide lucide-circle-minus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
    <p>${text}</p>
  `;

  // Wrap both in .card-inner
  const inner = document.createElement('div');
  inner.className = 'card-inner';
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
      card.classList.add('is-flipped');
    });
  }

  // Clicking the back → flip back to front
  back.addEventListener('click', () => card.classList.remove('is-flipped'));
});
