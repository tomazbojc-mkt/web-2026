/**
 * <delivery-section>
 * Two-column section: left text + right pair of delivery option cards.
 * Reused across: index.html only ("Launch Your Way" section).
 *
 * Data island: <script type="application/json"> child
 *   { "eyebrow": "", "headline": "", "supporting": "", "ctaLabel": "", "ctaHref": "",
 *     "cards": [{ "label": "", "title": "", "description": "", "ctaLabel": "", "ctaHref": "", "type": "" }] }
 *
 * CMS (Strapi): LaunchSectionBlock component
 *   fields: eyebrow, headlineText, supportingText, ctaLabel, ctaHref, launchCards[]
 *
 * GSAP: left col stagger fade-up, cards stagger-1/stagger-2 — main.js
 */

const DELIVERY_DEFAULTS = {
  eyebrow: 'flexible delivery',
  headline: 'launch your way.',
  supporting: 'Whether you\'re building from scratch or upgrading what you have — Bragg fits your stage.',
  ctaLabel: 'talk to sales',
  ctaHref: '#contact',
  cards: [
    {
      label: 'option 01',
      title: 'full turnkey',
      description: 'We build the whole house. Launch a complete online casino with platform, content, and engagement tools out of the box. Go live faster.',
      ctaLabel: 'get started',
      ctaHref: '#contact',
      type: 'turnkey',
    },
    {
      label: 'option 02',
      title: 'modular',
      description: 'Already have a platform? Plug in what you need — content, aggregation, gamification — without replacing your stack.',
      ctaLabel: 'get started',
      ctaHref: '#contact',
      type: 'modular',
    },
  ],
};

class DeliverySection extends HTMLElement {
  connectedCallback() {
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag ? { ...DELIVERY_DEFAULTS, ...JSON.parse(scriptTag.textContent) } : DELIVERY_DEFAULTS;

    const cardHTML = (d.cards || []).map((c, i) => `
<div class="launch-card ${c.type || ''} fade-up stagger-${i + 1}">
  <div class="card-label">${c.label}</div>
  <h3>${c.title}</h3>
  <p>${c.description}</p>
  <a href="${c.ctaHref}" class="card-arrow">${c.ctaLabel} →</a>
</div>`).join('');

    this.innerHTML = `
<section class="launch" id="launch">
  <div class="container">
    <div class="launch-left">
      <div class="eyebrow fade-up">${d.eyebrow}</div>
      <p class="large-text fade-up stagger-1">${d.headline}</p>
      <p class="supporting fade-up stagger-2">${d.supporting}</p>
      <div style="margin-top: 32px;" class="fade-up stagger-3">
        <a href="${d.ctaHref}" class="btn btn--primary" data-js="btn-flair">${d.ctaLabel} <span>→</span></a>
      </div>
    </div>
    <div class="launch-cards">${cardHTML}</div>
  </div>
</section>`;
  }
}

customElements.define('delivery-section', DeliverySection);
