/**
 * <statement-section>
 * A large-statement "big idea" section. Two variants.
 * Reused across: index.html (default variant), fuze.html (visual variant with phone)
 *
 * Attributes:
 *   variant — "default" (text only) | "visual" (with phone image + data pills)
 *
 * Data island: <script type="application/json"> child with variant-specific fields.
 *
 * Default variant fields:
 *   largeText      — main statement (HTML allowed for <span class="muted"> segments)
 *   supportingText — secondary paragraph
 *   ctaLabel, ctaHref
 *
 * Visual variant fields:
 *   heading        — h2 text (HTML allowed for <span class="accent"> segment)
 *   supportingText — paragraph below phone
 *   phoneImageSrc, phoneImageAlt
 *   labels: [{ icon, label, value }]
 *
 * CMS (Strapi): BigIdeaBlock component on each Page
 *
 * GSAP:
 *   default  — SplitText animation variants on .large-text (main.js dev toggle)
 *   visual   — standard staggered fade-up (main.js)
 */

const STATEMENT_DEFAULTS = {
  default: {
    largeText: `your players don't experience your vendor stack.
      <span class="muted">they experience one casino.</span>
      we make sure it works like one.`,
    supportingText: 'A seamless player journey — from sign-up to first spin to loyal regular. Built on infrastructure that\'s stable, compliant, and ready for any market.',
    ctaLabel: 'talk to sales',
    ctaHref: '#contact',
  },
  visual: {
    heading: `most casinos run promotions.<br><span class="accent">fuze transforms the player journey.</span>`,
    supportingText: 'Stand out with experiences that are personalized, fun and rewarding. Make every moment exciting and competitive, keeping players hooked and driving growth across engagement, conversions, and loyalty.',
    phoneImageSrc: '../assets/fuze/phone-fuze.png',
    phoneImageAlt: 'Fuze phone gameplay preview',
    labels: [
      { icon: '💎', label: 'jackpot triggered', value: 'EUR12,480' },
      { icon: '⬆️', label: 'session time',      value: '+32% with Fuze™' },
      { icon: '🎯', label: 'reward unlocked',   value: 'reward unlocked' },
      { icon: '🏆', label: 'Live Tournament',   value: '1,247 players' },
    ],
  },
};

class StatementSection extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') || 'default';
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag
      ? { ...STATEMENT_DEFAULTS[variant], ...JSON.parse(scriptTag.textContent) }
      : STATEMENT_DEFAULTS[variant];

    if (variant === 'visual') {
      const labelHTML = (d.labels || []).map(l => `
<div class="big-idea__label">
  <div class="big-idea__label-icon" aria-hidden="true">${l.icon}</div>
  <div class="big-idea__label-text">
    <span class="big-idea__label-title">${l.label}</span>
    <span class="big-idea__label-value">${l.value}</span>
  </div>
</div>`).join('');

      this.innerHTML = `
<section class="big-idea section">
  <div class="container">
    <h2 class="big-idea__heading fade-up stagger-1">${d.heading}</h2>
    <div class="big-idea__phone fade-up stagger-2">
      ${labelHTML}
      <img src="${d.phoneImageSrc}" alt="${d.phoneImageAlt}" class="big-idea__phone-img">
    </div>
    <p class="big-idea__text fade-up stagger-3">${d.supportingText}</p>
  </div>
</section>`;

    } else {
      this.innerHTML = `
<section class="big-idea" id="solutions">
  <div class="container">
    <p class="large-text fade-up">${d.largeText}</p>
    <p class="supporting fade-up stagger-1">${d.supportingText}</p>
    <div style="text-align: center; margin-top: 40px;" class="fade-up stagger-2">
      <a href="${d.ctaHref}" class="btn btn--primary" data-js="btn-flair">${d.ctaLabel}</a>
    </div>
  </div>
</section>`;
    }
  }
}

customElements.define('statement-section', StatementSection);
