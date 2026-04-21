/**
 * <pillars-section>
 * Two-column section: left text column + right grid of feature pillar cards.
 * Reused across: index.html only ("Why Bragg" section).
 *
 * Attributes:
 *   heading      — left column heading
 *   answer       — left column body (HTML allowed for <span class="muted"> highlights)
 *   cta-label    — CTA button text
 *   cta-href     — CTA button link
 *
 * Data island: <script type="application/json"> child
 *   { "heading": "", "answer": "", "ctaLabel": "", "ctaHref": "",
 *     "cards": [{ "title": "", "description": "" }] }
 *
 * CMS (Strapi): WhyBraggBlock component
 *   fields: heading, answerText (rich text), ctaLabel, ctaHref, pillarCards[]
 *
 * GSAP: left column fade-up, pillar cards staggered stagger-1 through stagger-4 (main.js)
 */

const PILLARS_DEFAULTS = {
  heading: 'why bragg?',
  answer: `the all-in-one platform where
    <span class="muted">player engagement</span>
    meets
    <span class="muted">operator growth.</span>`,
  ctaLabel: 'talk to sales',
  ctaHref: '#contact',
  cards: [
    { title: 'player account management', description: 'Registration, wallets, KYC, payments, and back-office. The engine your casino runs on.' },
    { title: 'casino content', description: '8,000+ slots and table games from Bragg\'s own studios and premium partners.' },
    { title: 'player gamification', description: 'Tournaments, missions, jackpots, free rounds, and AI-powered recommendations through Fuze™.' },
    { title: 'game aggregation', description: 'One API. Thousands of titles. 50+ third-party providers. Curated for your market.' },
  ],
};

class PillarsSection extends HTMLElement {
  connectedCallback() {
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag ? { ...PILLARS_DEFAULTS, ...JSON.parse(scriptTag.textContent) } : PILLARS_DEFAULTS;

    const cardHTML = (d.cards || []).map((c, i) => `
<div class="pillar-card fade-up stagger-${i + 1}">
  <h3>${c.title}</h3>
  <p>${c.description}</p>
</div>`).join('');

    this.innerHTML = `
<section class="why-bragg" id="why">
  <div class="container">
    <div class="why-left">
      <h1 class="fade-up">${d.heading}</h1>
      <p class="answer fade-up stagger-1">${d.answer}</p>
      <div style="margin-top: 40px;" class="fade-up stagger-2">
        <a href="${d.ctaHref}" class="btn btn--primary" data-js="btn-flair">${d.ctaLabel} <span>→</span></a>
      </div>
    </div>
    <div class="pillar-cards">${cardHTML}</div>
  </div>
</section>`;
  }
}

customElements.define('pillars-section', PillarsSection);
