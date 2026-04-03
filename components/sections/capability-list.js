/**
 * <capability-list>
 * Two-column AI/intelligence feature section: left text + right capability list.
 * Reused across: index.html only (AI interstitial section).
 *
 * Data island: <script type="application/json"> child
 *   { "eyebrow": "", "headline": "", "supporting": "",
 *     "items": [{ "title": "", "description": "" }] }
 *
 * CMS (Strapi): AiSectionBlock component
 *   fields: eyebrow, headline (rich text), supportingText, capabilities[]
 *
 * GSAP: left col stagger fade-up, capabilities list as one block (stagger-3) — main.js
 */

const CAPABILITY_DEFAULTS = {
  eyebrow: 'intelligent by design',
  headline: `smarter where<br><span class="muted">it counts.</span>`,
  supporting: 'AI runs through every layer of the Bragg stack — not as a bolt-on, but built into how your casino thinks, reacts, and grows.',
  items: [
    { title: 'predictive engagement',      description: 'Algorithms that anticipate player behavior and trigger the right action before churn happens.' },
    { title: 'personalized Fuze™',         description: 'Tournaments, missions, and rewards shaped by individual player data — not one-size-fits-all campaigns.' },
    { title: 'AI-powered content lobby',   description: 'A game lobby that learns what each player wants to see, surfacing the right titles at the right moment.' },
    { title: 'intelligent player journeys',description: 'Smart onboarding, retention triggers, and re-engagement flows that adapt in real time.' },
  ],
};

class CapabilityList extends HTMLElement {
  connectedCallback() {
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag ? { ...CAPABILITY_DEFAULTS, ...JSON.parse(scriptTag.textContent) } : CAPABILITY_DEFAULTS;

    const itemHTML = (d.items || []).map(item => `
<div class="ai-cap-item">
  <div class="ai-cap-indicator"></div>
  <div class="ai-cap-content">
    <h4>${item.title}</h4>
    <p>${item.description}</p>
  </div>
</div>`).join('');

    this.innerHTML = `
<section class="ai-section">
  <div class="container">
    <div class="ai-inner">
      <div class="ai-text-col">
        <div class="eyebrow ai-eyebrow fade-up">${d.eyebrow}</div>
        <p class="ai-headline fade-up stagger-1">${d.headline}</p>
        <p class="ai-supporting fade-up stagger-2">${d.supporting}</p>
      </div>
      <div class="ai-capabilities fade-up stagger-3">${itemHTML}</div>
    </div>
  </div>
</section>`;
  }
}

customElements.define('capability-list', CapabilityList);
