/**
 * <hero-section>
 * Page hero. Three variants, one for each page.
 * Reused across: index.html, fuze.html, content.html
 *
 * Attributes:
 *   variant — "default" (homepage) | "fuze" | "content"
 *
 * Data island: <script type="application/json"> child with variant-specific fields.
 *
 * Default variant fields:
 *   eyebrow, headline (with muted), subheadline, ctaLabel, ctaHref,
 *   tags: [{ icon, label, value }]
 *
 * Fuze variant fields:
 *   headline, subheadline, primaryCtaLabel, primaryCtaHref,
 *   secondaryCtaLabel, secondaryCtaHref, heroImageSrc, heroImageAlt
 *
 * Content variant fields:
 *   headlineMuted, headlinePlain, subheadline, primaryCtaLabel, primaryCtaHref,
 *   secondaryCtaLabel, secondaryCtaHref, heroImageSrc, heroImageAlt,
 *   awardsImageSrc, awardsLabel, awardsTitle
 *
 * CMS (Strapi): HeroBlock component on each Page
 *
 * GSAP:
 *   default — SplitText scramble-flip on h1 .muted span (main.js)
 *   fuze    — standard clip-wipe on h2.fade-up (main.js)
 *   content — SplitText color reveal on h1 .muted span + .flip-i char (main.js)
 */

const HERO_DEFAULTS = {
  default: {
    eyebrow: 'the player-first igaming platform',
    headline: `games in.<br>players engaged.<br><span class="muted">revenue growing.</span>`,
    subheadline: 'platform, content, and smarter player engagement tools — all in one integration. all bragg.',
    ctaLabel: 'talk to sales',
    ctaHref: '#contact',
    phoneSrc: 'assets/img/web-phone.png',
    phoneAlt: 'Bragg platform on mobile',
    tags: [
      { icon: '🏆', label: 'Live Tournament',  value: '1,247 players' },
      { icon: '↑',  label: 'Session Time',     value: '+32% with Fuze™' },
      { icon: '🎯', label: 'Mission Complete', value: 'Reward unlocked' },
      { icon: '💎', label: 'Jackpot Triggered', value: '€12,480' },
    ],
  },
  fuze: {
    headline: `identify the player journey.<br>make it smooth.<br><span class="muted">retain the player.</span>`,
    subheadline: 'Fuze™ turns every player interaction into measurable engagement. Our real-time gamification engine is platform and product agnostic, intelligently adapting to player behavior to maximize retention and lifetime value.',
    primaryCtaLabel: 'book a demo',
    primaryCtaHref: '#contact',
    secondaryCtaLabel: 'explore',
    secondaryCtaHref: '#solutions',
    heroImageSrc: 'assets/img/fuze-hero.png',
    heroImageAlt: 'Fuze player journey',
  },
  content: {
    headlineMuted: `exclus<span class="flip-i">i</span>ve content.`,
    headlinePlain: 'global reach.',
    subheadline: 'deliver unique, high-performing Bragg titles alongside the industry\'s best aggregated content — all fully licensed and compliant across regulated markets worldwide',
    primaryCtaLabel: 'talk to sales',
    primaryCtaHref: '#contact',
    secondaryCtaLabel: 'explore',
    secondaryCtaHref: '#solutions',
    heroImageSrc: 'assets/img/content-hero.png',
    heroImageAlt: 'Bragg Gaming Content',
    awardsImageSrc: 'assets/img/awards.png',
    awardsLabel: 'AWARDS 2024',
    awardsTitle: 'Slot Supplier',
  },
};

class HeroSection extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') || 'default';
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag
      ? { ...HERO_DEFAULTS[variant], ...JSON.parse(scriptTag.textContent) }
      : HERO_DEFAULTS[variant];

    if (variant === 'fuze') {
      this.innerHTML = `
<section class="hero content-hero fuze-hero section">
  <div class="container">
    <div class="hero-content">
      <h1 class="fade-up stagger-1">${d.headline}</h1>
      <h2 class="fade-up stagger-2">${d.subheadline}</h2>
      <div class="hero-buttons fade-up stagger-3">
        <a href="${d.primaryCtaHref}" class="btn btn--primary" data-js="btn-flair">${d.primaryCtaLabel}</a>
        <a href="${d.secondaryCtaHref}" class="btn btn--secondary">${d.secondaryCtaLabel}</a>
      </div>
    </div>
  </div>
  <div class="hero-fuze">
    <img src="${d.heroImageSrc}" alt="${d.heroImageAlt}" class="hero-fuze--image">
  </div>
</section>`;

    } else if (variant === 'content') {
      this.innerHTML = `
<section class="hero content-hero section">
  <div class="container">
    <div class="hero-content">
      <h1 class="fade-up stagger-1">
        <span class="muted">${d.headlineMuted}</span><br>
        ${d.headlinePlain}
      </h1>
      <h2 class="fade-up stagger-2">${d.subheadline}</h2>
      <div class="hero-buttons fade-up stagger-3">
        <a href="${d.primaryCtaHref}" class="btn btn--primary" data-js="btn-flair">${d.primaryCtaLabel}</a>
        <a href="${d.secondaryCtaHref}" class="btn btn--secondary">${d.secondaryCtaLabel}</a>
      </div>
    </div>
    <div class="hero-visual fade-up stagger-2">
      <img src="${d.heroImageSrc}" alt="${d.heroImageAlt}" class="hero-image">
    </div>
  </div>
  <div class="hero-awards fade-up stagger-4">
    <img src="${d.awardsImageSrc}" alt="Awards" class="hero-awards-icon">
    <div class="hero-awards-text">
      <span class="hero-awards-label">${d.awardsLabel}</span>
      <span class="hero-awards-title">${d.awardsTitle} <span>→</span></span>
    </div>
  </div>
</section>`;

    } else {
      // default / homepage
      const tagHTML = (d.tags || []).map((t, i) => `
<div class="data-tag tag-${i + 1}">
  <span class="data-tag-icon">${t.icon}</span>
  <div class="data-tag-content">
    <span class="data-tag-label">${t.label}</span>
    <span class="data-tag-value">${t.value}</span>
  </div>
</div>`).join('');

      this.innerHTML = `
<section class="hero">
  <div class="container">
    <div class="hero-content">
      <div class="eyebrow fade-up">${d.eyebrow}</div>
      <h1 class="fade-up stagger-1">${d.headline}</h1>
      <h2 class="fade-up stagger-2">${d.subheadline}</h2>
      <div class="hero-buttons fade-up stagger-3">
        <a href="${d.ctaHref}" class="btn btn--primary" data-js="btn-flair">${d.ctaLabel}</a>
      </div>
    </div>
    <div class="hero-visual fade-up stagger-2">
      <div class="hero-glow"></div>
      ${tagHTML}
      <div class="hero-phone">
        <img src="${d.phoneSrc}" alt="${d.phoneAlt}" class="hero-phone-img">
      </div>
    </div>
  </div>
</section>`;
    }
  }
}

customElements.define('hero-section', HeroSection);
