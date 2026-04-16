// ==================== GSAP SETUP ====================
gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.config({ force3D: true });
gsap.defaults({ force3D: true });
document.body.classList.add('js-ready');

// ==================== HIDE-ON-SCROLL NAV ====================
(() => {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const HIDE_AFTER    = 80;  // px from top before hide logic activates
  const INTENT_THRESH = 70;  // px of accumulated scroll needed to trigger toggle

  let lastY       = window.scrollY;
  let accumulated = 0;       // running total in current direction
  let ticking     = false;

  function update() {
    const y     = window.scrollY;
    const delta = y - lastY;
    lastY = y;

    // Shadow when not at top
    nav.classList.toggle('nav--scrolled', y > 0);

    // Always show near the top
    if (y < HIDE_AFTER) {
      nav.classList.remove('nav--hidden');
      accumulated = 0;
      ticking = false;
      return;
    }

    // Accumulate scroll in the current direction; reset when direction flips
    if ((delta > 0 && accumulated < 0) || (delta < 0 && accumulated > 0)) {
      accumulated = 0;
    }
    accumulated += delta;

    if (accumulated > INTENT_THRESH) {
      // Enough intentional downward scroll — hide
      nav.classList.add('nav--hidden');
      accumulated = 0;
    } else if (accumulated < -INTENT_THRESH) {
      // Enough intentional upward scroll — show
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

// ==================== NAV MEGA MENU ====================
(() => {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const megaWrap = nav.querySelector('#navMega');
  const triggers = Array.from(nav.querySelectorAll('.nav-link-trigger[data-menu]'));
  const panels = Array.from(nav.querySelectorAll('.nav-mega-panel[data-menu]'));

  if (!megaWrap || !triggers.length || !panels.length) return;

  let activeMenu = null;
  let wrapTween = null;

  gsap.set(megaWrap, {
    autoAlpha: 0,
    y: -10,
    pointerEvents: 'none'
  });

  function getPanel(menu) {
    return nav.querySelector(`.nav-mega-panel[data-menu="${menu}"]`);
  }

  function setTriggerState(menu, expanded) {
    triggers.forEach(trigger => {
      const isMatch = trigger.dataset.menu === menu;
      trigger.setAttribute('aria-expanded', isMatch && expanded ? 'true' : 'false');
    });
  }

  function showWrap() {
    if (wrapTween) wrapTween.kill();
    wrapTween = gsap.to(megaWrap, {
      autoAlpha: 1,
      y: 0,
      pointerEvents: 'auto',
      duration: 0.26,
      ease: 'power2.out'
    });
  }

  function hideWrap() {
    if (wrapTween) wrapTween.kill();
    wrapTween = gsap.to(megaWrap, {
      autoAlpha: 0,
      y: -10,
      pointerEvents: 'none',
      duration: 0.2,
      ease: 'power2.in'
    });
  }

  function showPanel(panel) {
    gsap.set(panel, { display: 'grid' });
    gsap.fromTo(panel,
      { autoAlpha: 0, y: -8 },
      { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power2.out' }
    );
  }

  function hidePanel(panel) {
    gsap.to(panel, {
      autoAlpha: 0,
      y: -8,
      duration: 0.16,
      ease: 'power2.in',
      onComplete: () => gsap.set(panel, { display: 'none' })
    });
  }

  function openMenu(menu) {
    if (activeMenu === menu) return;

    const nextPanel = getPanel(menu);
    if (!nextPanel) return;

    const currentPanel = activeMenu ? getPanel(activeMenu) : null;

    if (currentPanel) hidePanel(currentPanel);
    showPanel(nextPanel);
    showWrap();

    activeMenu = menu;
    setTriggerState(menu, true);
    megaWrap.setAttribute('aria-hidden', 'false');
    nav.classList.add('nav--menu-open');
    nav.classList.remove('nav--hidden');
  }

  function closeMenu() {
    if (!activeMenu) return;

    const currentPanel = getPanel(activeMenu);
    if (currentPanel) hidePanel(currentPanel);

    hideWrap();
    setTriggerState(activeMenu, false);
    megaWrap.setAttribute('aria-hidden', 'true');
    nav.classList.remove('nav--menu-open');
    activeMenu = null;
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      const menu = trigger.dataset.menu;
      if (!menu) return;

      if (activeMenu === menu) {
        closeMenu();
      } else {
        openMenu(menu);
      }
    });
  });

  document.addEventListener('click', e => {
    if (!activeMenu) return;
    if (nav.contains(e.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('scroll', () => {
    if (!activeMenu) return;
    closeMenu();
  }, { passive: true });
})();



// ==================== GLOBAL FADE-UPS ====================
// Headings that get clip-mask wipe instead of standard fade-up
const clipWipeSelectors = 'h2.fade-up, .content-hero h1.fade-up';
const clipWipeEls = new Set(gsap.utils.toArray(clipWipeSelectors));

gsap.utils.toArray('.fade-up').forEach(el => {
  if (clipWipeEls.has(el)) return;
  gsap.set(el, { opacity: 0, y: 40 });
});

// ==================== HEADING CLIP-MASK WIPE ====================
// Selected headings get SplitText line wipe instead of simple fade
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
      onEnter: () => {
        gsap.to(split.lines, {
          y: 0,
          delay,
          stagger: 0.1,
          duration: 0.85,
          ease: 'power3.out'
        });
      }
    });
  });
});

// Standard fade-ups for non-heading elements
gsap.utils.toArray('.fade-up').forEach(el => {
  if (clipWipeEls.has(el)) return;

  const delay = el.classList.contains('stagger-4') ? 0.4
    : el.classList.contains('stagger-3') ? 0.3
    : el.classList.contains('stagger-2') ? 0.2
    : el.classList.contains('stagger-1') ? 0.1 : 0;

  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  });
});

// ==================== PROVIDER LOGOS STAGGER ====================
const providerLogos = gsap.utils.toArray('.provider-logo');
if (providerLogos.length) {
  gsap.set(providerLogos, { opacity: 0, scale: 0.8, y: 20 });

  ScrollTrigger.create({
    trigger: '.providers-grid',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(providerLogos, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'back.out(1.4)',
        stagger: { each: 0.06, from: 'start' }
      });
    }
  });
}

// ==================== HERO SCRAMBLE FLIP (index page only) ====================
// After the h1 fade-up lands (~1s), each letter in "revenue growing."
// individually slides up like a departure-board flip, in random order.
document.fonts.ready.then(() => {
  // Skip on content-hero page — it has its own animation
  if (document.querySelector('.content-hero')) return;
  const mutedSpan = document.querySelector('.hero h1 .muted');
  if (!mutedSpan) return;

  const scrambleSplit = new SplitText(mutedSpan, { type: 'chars' });
  const chars = scrambleSplit.chars;

  // Wrap each char in an overflow-hidden mask and add a duplicate below
  chars.forEach(char => {
    const mask = document.createElement('span');
    mask.className = 'hero-char-mask';

    const dup = document.createElement('span');
    dup.className = 'hero-char-dup';
    dup.textContent = char.textContent;

    char.parentNode.insertBefore(mask, char);
    mask.appendChild(char);
    mask.appendChild(dup);

    // Position: original at 0, duplicate starts below
    gsap.set(char, { position: 'relative' });
    gsap.set(dup, { y: '120%' });
  });

  // Build a randomised order of indices
  const indices = gsap.utils.shuffle([...Array(chars.length).keys()]);

  // Animate after fade-up completes (~1.2s)
  const tl = gsap.timeline({ delay: 1.2 });

  indices.forEach((i, order) => {
    const char = chars[i];
    const dup = char.parentNode.querySelector('.hero-char-dup');

    tl.to(char, {
      y: '-120%',
      autoAlpha: 0,
      duration: 0.45,
      ease: 'power2.inOut'
    }, order * 0.04)
    .to(dup, {
      y: '0%',
      duration: 0.45,
      ease: 'power2.inOut'
    }, order * 0.04);
  });
});

// ==================== VIDEO SCALE ====================
const videoEl = document.getElementById('videoPlaceholder');
if (videoEl) {
  gsap.fromTo(videoEl,
    { scale: 0.85 },
    {
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: videoEl,
        start: 'top bottom',
        end: 'top 30%',
        scrub: true
      }
    }
  );
}

// ==================== NAV SCROLL STATE ====================


// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});



// ==================== CONTENT-HERO: COLOR REVEAL ====================
document.fonts.ready.then(() => {
  const contentMuted = document.querySelector('.content-hero h1 .muted');
  if (!contentMuted) return;

  const split = new SplitText(contentMuted, { type: 'chars' });
  gsap.set(split.chars, { color: 'var(--black)' });

  const tl = gsap.timeline({ delay: 1.4 });
  tl.to(split.chars, {
    color: 'var(--accent)',
    duration: 0.08,
    stagger: { each: 0.04, from: 'start' },
    ease: 'none'
  });
});

// ==================== HUB BANNER SCROLL EFFECTS ====================
const hubBanner = document.querySelector('.hub-banner');
if (hubBanner) {
  const king  = hubBanner.querySelector('.hub-king');
  const orbs  = hubBanner.querySelector('.hub-orbs');
  const chick = hubBanner.querySelector('.hub-chick');
  const cat   = hubBanner.querySelector('.hub-cat');
  const hubCenter = hubBanner.querySelector('.hub-center');

  // 1) GROW EFFECT: banner starts smaller, scales up as it enters viewport
  gsap.set(hubBanner, { scale: 0.88, borderRadius: '40px' });

  gsap.to(hubBanner, {
    scale: 1,
    borderRadius: '24px',
    ease: 'none',
    scrollTrigger: {
      trigger: hubBanner,
      start: 'top bottom',
      end: 'top bottom-=300',  // fully grown when top of banner is 200px into viewport
      scrub: 0.4
    }
  });

  // 2) CHARACTER SLIDE-IN (from sides, triggered once)
  gsap.set([king, orbs], { x: -120, opacity: 0 });
  gsap.set([cat, chick], { x: 120, opacity: 0 });

  ScrollTrigger.create({
    trigger: hubBanner,
    start: 'top 75%',
    once: true,
    onEnter: () => {
      gsap.to(king, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' });
      gsap.to(orbs, { x: 0, opacity: 1, duration: 1, delay: 0.15, ease: 'power3.out' });
      gsap.to(chick, { x: 0, opacity: 1, duration: 1, delay: 0.1, ease: 'power3.out' });
      gsap.to(cat, { x: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out' });
    }
  });

  // 3) PARALLAX: characters anchored at bottom:0, drift upward on scroll
  gsap.to(king, {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: { trigger: hubBanner, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
  });

  gsap.to(cat, {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: { trigger: hubBanner, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
  });

  gsap.to(orbs, {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: { trigger: hubBanner, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
  });

  gsap.to(chick, {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: { trigger: hubBanner, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
  });

  gsap.to(hubCenter, {
    yPercent: 10,
    ease: 'none',
    scrollTrigger: { trigger: hubBanner, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
  });
}

// ==================== TRUST STATS COUNT-UP ====================
document.querySelectorAll('.trust-number[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count);
  const obj = { val: 0 };

  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate() {
          el.textContent = Math.round(obj.val).toLocaleString();
        }
      });
    }
  });
});

// ==================== GAME RELEASES SCROLL ANIMATION ====================
const gameThumbs = gsap.utils.toArray('.game-thumb');
if (gameThumbs.length) {
  // Initial state — hidden, scaled down, offset
  gsap.set(gameThumbs, { opacity: 0, scale: 0.8, y: 60, rotation: gsap.utils.wrap([-4, 3, -2, 5, 2, -3, 4, -5]) });

  ScrollTrigger.batch(gameThumbs, {
    start: 'top 90%',
    onEnter: batch => {
      gsap.to(batch, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.7,
        ease: 'back.out(1.4)',
        stagger: 0.08,
        overwrite: true
      });
    },
    once: true
  });
}

// ==================== SECTION OVERLAP PARALLAX (DISABLED) ====================
// Uncomment to re-enable: each section scrolls slightly slower when leaving,
// so the next one overlaps it with a parallax effect.
// document.querySelectorAll('.content-hero, .providers, .game-releases, .trust-section, .hub-banner, .why-bragg, .ai-section, .launch, .trust').forEach(section => {
//   if (section.classList.contains('showcase-section')) return;
//   gsap.to(section, {
//     yPercent: 15,
//     ease: 'none',
//     scrollTrigger: {
//       trigger: section,
//       start: 'bottom bottom',
//       end: 'bottom top',
//       scrub: true
//     }
//   });
// });


// ==================== BUTTON FLAIR HOVER ====================
document.querySelectorAll('[data-js="btn-flair"]').forEach(btn => {
  // Wrap existing contents in a label span
  const label = document.createElement('span');
  label.className = 'btn-label';
  while (btn.firstChild) label.appendChild(btn.firstChild);
  btn.appendChild(label);

  // Add flair element
  const flair = document.createElement('span');
  flair.className = 'btn-flair';
  btn.appendChild(flair);

  const xSet = gsap.quickSetter(flair, 'xPercent');
  const ySet = gsap.quickSetter(flair, 'yPercent');

  function getXY(e) {
    const { left, top, width, height } = btn.getBoundingClientRect();
    const x = gsap.utils.clamp(0, 100, ((e.clientX - left) / width) * 100);
    const y = gsap.utils.clamp(0, 100, ((e.clientY - top) / height) * 100);
    return { x, y };
  }

  btn.addEventListener('mouseenter', e => {
    const { x, y } = getXY(e);
    xSet(x);
    ySet(y);
    gsap.to(flair, { scale: 1, duration: 0.4, ease: 'power2.out' });
  });

  btn.addEventListener('mouseleave', e => {
    const { x, y } = getXY(e);
    gsap.killTweensOf(flair);
    gsap.to(flair, {
      xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
      yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
      scale: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  btn.addEventListener('mousemove', e => {
    const { x, y } = getXY(e);
    gsap.to(flair, { xPercent: x, yPercent: y, duration: 0.4, ease: 'power2' });
  });
});

// ==================== GAME THUMB HOVER OVERLAY ====================
document.querySelectorAll('[data-js="thumb-overlay-host"]').forEach(thumb => {
  const overlay = document.createElement('div');
  overlay.className = 'thumb-overlay';
  overlay.innerHTML = `
    <a href="#" class="thumb-overlay-btn">play game</a>
    <a href="#" class="thumb-overlay-btn thumb-overlay-btn--ghost">more info</a>
  `;
  thumb.appendChild(overlay);
});
