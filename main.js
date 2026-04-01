// ==================== GSAP SETUP ====================
gsap.registerPlugin(ScrollTrigger, SplitText);
document.body.classList.add('js-ready');

// ==================== CSS VARIABLES ====================
const ACCENT_COLORS = [
  { name: 'blue', var: '--brand-blue' },
  { name: 'green', var: '--brand-green' },
];
let currentAccentIdx = 0;
const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

// ==================== SECTION 2 REF ====================
const bigIdeaText = document.querySelector('.big-idea .large-text');

// ==================== GLOBAL FADE-UPS ====================
// Hide all .fade-up elements immediately to prevent flash before scroll triggers fire
// (bigIdeaText is excluded — variant system handles it)
// Headings that get clip-mask wipe instead of standard fade-up
const clipWipeSelectors = 'h2.fade-up, .content-hero h1.fade-up';
const clipWipeEls = new Set(gsap.utils.toArray(clipWipeSelectors));

gsap.utils.toArray('.fade-up').forEach(el => {
  if (el === bigIdeaText) return;
  if (clipWipeEls.has(el)) return;
  gsap.set(el, { opacity: 0, y: 40 });
});

// ==================== HEADING CLIP-MASK WIPE ====================
// Selected headings get SplitText line wipe instead of simple fade
document.fonts.ready.then(() => {
  clipWipeEls.forEach(el => {
    if (el === bigIdeaText) return;

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
  if (el === bigIdeaText) return;
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

// ==================== SECTION 2: TEXT ANIMATION VARIANTS ====================
const VARIANTS = [
  { id: 1, name: 'Lines fade up' },
  { id: 2, name: 'Words cascade' },
  { id: 3, name: 'Char reveal' },
  { id: 4, name: 'Clip mask wipe' },
  { id: 5, name: 'Font weight — timed' },
  { id: 6, name: 'Font weight — scrub' },
  { id: 7, name: 'Combo sequence' },
];

let currentVariant = 1;
let activeSplit = null;
let activeScrollTriggers = [];

function cleanupVariant() {
  activeScrollTriggers.forEach(st => st && st.kill());
  activeScrollTriggers = [];

  // Unwrap V7 sentence wrappers and clip-wraps before reverting SplitText
  bigIdeaText.querySelectorAll('.clip-wrap, .v7-s1, .v7-s3').forEach(wrap => {
    while (wrap.firstChild) wrap.parentNode.insertBefore(wrap.firstChild, wrap);
    wrap.remove();
  });
  // Reset muted display (may have been set to block for V7)
  const mutedEl = bigIdeaText.querySelector('.muted');
  if (mutedEl) mutedEl.style.removeProperty('display');

  if (activeSplit) {
    activeSplit.revert();
    activeSplit = null;
  }

  const muted = bigIdeaText.querySelector('.muted');
  gsap.killTweensOf(bigIdeaText);
  if (muted) gsap.killTweensOf(muted);
  gsap.set(bigIdeaText, { clearProps: 'all' });
  if (muted) gsap.set(muted, { clearProps: 'all' });
}

function buildVariant(n, immediate) {
  const el = bigIdeaText;
  const muted = el.querySelector('.muted');

  // Helper: run animFn immediately or wire it to a one-shot ScrollTrigger
  const withTrigger = (animFn) => {
    if (immediate) {
      animFn();
    } else {
      let st;
      st = ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => { animFn(); st.kill(); }
      });
      activeScrollTriggers.push(st);
    }
  };

  if (n === 1) {
    // Lines slide up + fade
    activeSplit = new SplitText(el, { type: 'lines' });
    gsap.set(activeSplit.lines, { opacity: 0, y: 32 });
    withTrigger(() => gsap.to(activeSplit.lines, {
      opacity: 1, y: 0,
      stagger: 0.12, duration: 0.9, ease: 'power3.out'
    }));
  }

  else if (n === 2) {
    // Words cascade
    activeSplit = new SplitText(el, { type: 'words' });
    gsap.set(activeSplit.words, { opacity: 0, y: 18 });
    withTrigger(() => gsap.to(activeSplit.words, {
      opacity: 1, y: 0,
      stagger: 0.025, duration: 0.55, ease: 'power3.out'
    }));
  }

  else if (n === 3) {
    // Character reveal left to right
    activeSplit = new SplitText(el, { type: 'chars,words' });
    gsap.set(activeSplit.chars, { opacity: 0 });
    withTrigger(() => gsap.to(activeSplit.chars, {
      opacity: 1,
      stagger: 0.012, duration: 0.35, ease: 'power2.out'
    }));
  }

  else if (n === 4) {
    // Clip mask wipe: lines slide up from behind overflow:hidden containers
    activeSplit = new SplitText(el, { type: 'lines' });
    activeSplit.lines.forEach(line => {
      const wrap = document.createElement('div');
      wrap.className = 'clip-wrap';
      wrap.style.overflow = 'hidden';
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
    });
    gsap.set(activeSplit.lines, { y: '105%' });
    withTrigger(() => gsap.to(activeSplit.lines, {
      y: 0,
      stagger: 0.1, duration: 0.85, ease: 'power3.out'
    }));
  }

  else if (n === 5) {
    // Variable font weight + green shimmer — left to right
    // Each char: weight 100→800 + color flashes green then settles back to muted gray
    muted.style.display = 'block';
    activeSplit = new SplitText(muted, { type: 'chars' });
    activeSplit.chars.forEach(c => c.style.display = 'inline');
    gsap.set(el, { opacity: 0, y: 20 });
    gsap.set(activeSplit.chars, { fontVariationSettings: "'wght' 100", color: accent });
    withTrigger(() => {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.to(activeSplit.chars, {
        keyframes: [
          { fontVariationSettings: "'wght' 800", color: accent, duration: 0.35, ease: 'power2.out' },
          { fontVariationSettings: "'wght' 100", color: accent, duration: 0.4, ease: 'power1.in' }
        ],
        stagger: 0.045,
        delay: 0.3
      });
    });
  }

  else if (n === 6) {
    // Variable font weight — scrub (weight follows scroll position)
    // On immediate (toggle click), play a timed version instead
    gsap.set(el, { opacity: 0, y: 20 });
    gsap.set(muted, { fontVariationSettings: "'wght' 100" });

    if (immediate) {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.to(muted, {
        fontVariationSettings: "'wght' 800",
        duration: 1.6, ease: 'power2.inOut', delay: 0.2
      });
    } else {
      let stFade;
      stFade = ScrollTrigger.create({
        trigger: el, start: 'top 85%',
        onEnter: () => {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
          stFade.kill();
        }
      });
      const stScrub = ScrollTrigger.create({
        trigger: el,
        start: 'top 75%',
        end: 'center 40%',
        scrub: 0.8,
        onUpdate: self => {
          const wght = Math.round(100 + self.progress * 700);
          gsap.set(muted, { fontVariationSettings: `'wght' ${wght}` });
        }
      });
      activeScrollTriggers.push(stFade, stScrub);
    }
  }

  else if (n === 7) {
    // Combo sequence: each sentence animates differently, in order
    // Wrap the two raw text nodes so we can target them independently
    const wrapTextNode = (node, cls) => {
      const span = document.createElement('span');
      span.className = cls;
      span.style.display = 'block';
      node.parentNode.insertBefore(span, node);
      span.appendChild(node);
      return span;
    };

    const textNodes = Array.from(el.childNodes).filter(
      node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
    );
    const s1 = wrapTextNode(textNodes[0], 'v7-s1'); // "your players don't experience..."
    const s3 = wrapTextNode(textNodes[1], 'v7-s3'); // "we make sure it works like one."
    muted.style.display = 'block';                  // "they experience one casino."

    // Sentence 1: char reveal
    activeSplit = new SplitText(s1, { type: 'chars,words' });
    gsap.set(activeSplit.chars, { opacity: 0 });

    // Sentence 2: line fade up
    gsap.set(muted, { opacity: 0, y: 30 });

    // Sentence 3: fade up
    gsap.set(s3, { opacity: 0, y: 20 });

    withTrigger(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // S1: chars appear left to right
      tl.to(activeSplit.chars, {
        opacity: 1,
        stagger: 0.025,
        duration: 0.4,
        ease: 'power2.out'
      });

      // pause — let S1 land before the next sentence appears
      tl.to(muted, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '+=0.5');

      // short pause then S3
      tl.to(s3, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '+=0.35');
    });
  }
}

function applyVariant(n, immediate = false) {
  cleanupVariant();
  currentVariant = n;
  buildVariant(n, immediate);
  updateToggleLabel();
  history.replaceState(null, '', '?anim=' + n);
}

// ==================== FLOATING TOGGLE ====================
function createToggle() {
  const panel = document.createElement('div');
  panel.id = 'anim-toggle';
  panel.innerHTML = `
    <span class="anim-toggle-title">text animation</span>
    <div class="anim-toggle-controls">
      <button class="anim-toggle-btn" id="anim-prev">←</button>
      <span id="anim-label"></span>
      <button class="anim-toggle-btn" id="anim-next">→</button>
    </div>
    <div class="anim-toggle-footer">
      <span id="anim-counter"></span>
      <button class="anim-toggle-replay" id="anim-replay">▶ replay</button>
    </div>
    <div class="anim-toggle-divider"></div>
    <span class="anim-toggle-title">accent color</span>
    <div class="anim-toggle-swatches" id="accent-swatches"></div>
  `;
  document.body.appendChild(panel);

  document.getElementById('anim-prev').addEventListener('click', () => {
    applyVariant(currentVariant === 1 ? VARIANTS.length : currentVariant - 1, true);
  });
  document.getElementById('anim-next').addEventListener('click', () => {
    applyVariant(currentVariant === VARIANTS.length ? 1 : currentVariant + 1, true);
  });
  document.getElementById('anim-replay').addEventListener('click', () => {
    applyVariant(currentVariant, true);
  });

  // Accent swatches
  const swatchContainer = document.getElementById('accent-swatches');
  ACCENT_COLORS.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'accent-swatch' + (i === currentAccentIdx ? ' active' : '');
    btn.style.background = `var(${c.var})`;
    btn.title = c.name;
    btn.addEventListener('click', () => {
      currentAccentIdx = i;
      document.documentElement.style.setProperty('--accent', `var(${c.var})`);
      swatchContainer.querySelectorAll('.accent-swatch').forEach((s, j) => {
        s.classList.toggle('active', j === i);
      });
      applyVariant(currentVariant, true);
    });
    swatchContainer.appendChild(btn);
  });
}

function updateToggleLabel() {
  const v = VARIANTS.find(v => v.id === currentVariant);
  document.getElementById('anim-label').textContent = v.name;
  document.getElementById('anim-counter').textContent = `${currentVariant} / ${VARIANTS.length}`;
}

// Wait for fonts before initialising — SplitText line positions depend on font metrics
document.fonts.ready.then(() => {
  const urlParam = parseInt(new URLSearchParams(window.location.search).get('anim'));
  const initial = urlParam >= 1 && urlParam <= VARIANTS.length ? urlParam : 1;
  createToggle();
  applyVariant(initial, false);
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
    scrollTrigger: { trigger: hubBanner, start: 'top bottom', end: 'bottom top', scrub: true }
  });

  gsap.to(cat, {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: { trigger: hubBanner, start: 'top bottom', end: 'bottom top', scrub: true }
  });

  gsap.to(orbs, {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: { trigger: hubBanner, start: 'top bottom', end: 'bottom top', scrub: true }
  });

  gsap.to(chick, {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: { trigger: hubBanner, start: 'top bottom', end: 'bottom top', scrub: true }
  });

  gsap.to(hubCenter, {
    yPercent: 10,
    ease: 'none',
    scrollTrigger: { trigger: hubBanner, start: 'top bottom', end: 'bottom top', scrub: true }
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

// ==================== SHOWCASE: SCATTERED → GRID ====================
(() => {
  const section = document.querySelector('.showcase-section');
  if (!section) return;

  const title = section.querySelector('.showcase-title');
  const thumbs = gsap.utils.toArray('.showcase-thumb');
  if (!thumbs.length) return;

  // Read scattered positions from data attributes (percentages of viewport)
  thumbs.forEach(thumb => {
    const sx = parseFloat(thumb.dataset.scatterX) || 0;
    const sy = parseFloat(thumb.dataset.scatterY) || 0;
    const sr = parseFloat(thumb.dataset.scatterR) || 0;
    const ss = parseFloat(thumb.dataset.scatterS) || 0.6;

    // Start scattered: translate in vw/vh, rotated, scaled
    gsap.set(thumb, {
      xPercent: sx * 3,
      yPercent: sy * 3,
      rotation: sr,
      scale: ss
    });
  });

  // Master timeline scrubbed by scroll
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      pin: false // we use sticky instead
    }
  });

  // Phase 1 (0 → 0.4): Title visible, thumbs scattered with subtle float
  // Phase 2 (0.4 → 0.7): Title fades out
  // Phase 3 (0.4 → 1.0): Thumbs move to grid positions

  // Fade out title
  tl.to(title, {
    opacity: 0,
    scale: 0.9,
    duration: 0.3,
    ease: 'power2.in'
  }, 0.3);

  // Animate each thumb to its grid position
  thumbs.forEach((thumb, i) => {
    tl.to(thumb, {
      xPercent: 0,
      yPercent: 0,
      rotation: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power2.inOut'
    }, 0.35 + i * 0.02);
  });
})();

// ==================== BUTTON FLAIR HOVER ====================
document.querySelectorAll('.btn-primary').forEach(btn => {
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
document.querySelectorAll('.game-thumb, .roadmap-thumb').forEach(thumb => {
  const overlay = document.createElement('div');
  overlay.className = 'thumb-overlay';
  overlay.innerHTML = `
    <a href="#" class="thumb-overlay-btn">play game</a>
    <a href="#" class="thumb-overlay-btn thumb-overlay-btn--ghost">more info</a>
  `;
  thumb.appendChild(overlay);
});
