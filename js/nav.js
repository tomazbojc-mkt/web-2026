// ─────────────────────────────────────────────
// nav.js
// Two behaviours for the top navigation bar:
//   1. Hide the nav when the user scrolls down,
//      reveal it when they scroll back up.
//   2. Animate mega-menu panels open/closed.
// ─────────────────────────────────────────────


// ── 1. Hide / show on scroll ──────────────────
(() => {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const HIDE_AFTER    = 80;  // px from top before hide logic activates
  const INTENT_THRESH = 70;  // px of accumulated scroll needed to trigger toggle

  let lastY       = window.scrollY;
  let accumulated = 0;
  let ticking     = false;

  function update() {
    const y     = window.scrollY;
    const delta = y - lastY;
    lastY = y;

    // Add shadow when not at the very top
    nav.classList.toggle('nav--scrolled', y > 0);

    // Always show when near the top of the page
    if (y < HIDE_AFTER) {
      nav.classList.remove('nav--hidden');
      accumulated = 0;
      ticking = false;
      return;
    }

    // Reset accumulator when scroll direction reverses
    if ((delta > 0 && accumulated < 0) || (delta < 0 && accumulated > 0)) {
      accumulated = 0;
    }
    accumulated += delta;

    if (accumulated > INTENT_THRESH) {
      nav.classList.add('nav--hidden');
      accumulated = 0;
    } else if (accumulated < -INTENT_THRESH) {
      nav.classList.remove('nav--hidden');
      accumulated = 0;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();


// ── 2. Mega menu ─────────────────────────────
(() => {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const megaWrap  = nav.querySelector('#navMega');
  const overlay   = document.getElementById('navOverlay');
  const triggers  = Array.from(nav.querySelectorAll('.mega-menu__trigger[data-menu]'));
  const panels    = Array.from(nav.querySelectorAll('.mega-menu__panel[data-menu]'));

  if (!megaWrap || !triggers.length || !panels.length) return;

  let activeMenu = null;
  let wrapTween  = null;

  gsap.set(megaWrap, { autoAlpha: 0, y: -10, pointerEvents: 'none' });

  function getPanel(menu) {
    return nav.querySelector(`.mega-menu__panel[data-menu="${menu}"]`);
  }

  function setTriggerState(menu, expanded) {
    triggers.forEach(t => {
      t.setAttribute('aria-expanded', t.dataset.menu === menu && expanded ? 'true' : 'false');
    });
  }

  function showWrap() {
    if (wrapTween) wrapTween.kill();
    wrapTween = gsap.to(megaWrap, { autoAlpha: 1, y: 0, pointerEvents: 'auto', duration: 0.26, ease: 'power2.out' });
  }

  function hideWrap() {
    if (wrapTween) wrapTween.kill();
    wrapTween = gsap.to(megaWrap, { autoAlpha: 0, y: -10, pointerEvents: 'none', duration: 0.14, ease: 'power2.in' });
  }

  function showPanel(panel) {
    gsap.set(panel, { display: 'grid', position: 'relative' });
    gsap.fromTo(panel, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power2.out' });
  }

  function hidePanel(panel, immediate) {
    if (immediate) {
      gsap.set(panel, { display: 'none', autoAlpha: 0, y: -8, position: 'absolute' });
      return;
    }
    gsap.to(panel, { autoAlpha: 0, y: -8, duration: 0.12, ease: 'power2.in', onComplete: () => gsap.set(panel, { display: 'none', position: 'absolute' }) });
  }

  function openMenu(menu) {
    if (activeMenu === menu) return;
    const nextPanel    = getPanel(menu);
    if (!nextPanel) return;
    const currentPanel = activeMenu ? getPanel(activeMenu) : null;
    if (currentPanel) hidePanel(currentPanel, true);
    showPanel(nextPanel);
    showWrap();
    activeMenu = menu;
    setTriggerState(menu, true);
    megaWrap.setAttribute('aria-hidden', 'false');
    nav.classList.add('nav--menu-open');
    nav.classList.remove('nav--hidden');
    if (overlay) overlay.classList.add('nav-overlay--active');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    if (!activeMenu) return;
    const currentPanel = getPanel(activeMenu);
    if (currentPanel) hidePanel(currentPanel, false);
    hideWrap();
    setTriggerState(activeMenu, false);
    megaWrap.setAttribute('aria-hidden', 'true');
    nav.classList.remove('nav--menu-open');
    if (overlay) overlay.classList.remove('nav-overlay--active');
    document.body.classList.remove('no-scroll');
    activeMenu = null;
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      const menu = trigger.dataset.menu;
      if (!menu) return;
      activeMenu === menu ? closeMenu() : openMenu(menu);
    });
  });

  document.addEventListener('click', e => { if (!activeMenu || nav.contains(e.target)) return; closeMenu(); });
  if (overlay) overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('scroll', () => { if (activeMenu) closeMenu(); }, { passive: true });
})();
