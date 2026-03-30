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
gsap.utils.toArray('.fade-up').forEach(el => {
  if (el === bigIdeaText) return;
  gsap.set(el, { opacity: 0, y: 40 });
});

gsap.utils.toArray('.fade-up').forEach(el => {
  if (el === bigIdeaText) return;

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
