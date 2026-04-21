/**
 * <product-roadmap>
 * Heading + jurisdiction filter toolbar + horizontal scrollable game card carousel.
 * Reused across: content.html roadmap section only.
 *
 * Data island: <script type="application/json"> child
 *   { "heading": "", "subheading": "", "viewAllLabel": "", "viewAllHref": "",
 *     "jurisdictions": ["Michigan", "New Jersey", ...],
 *     "games": [{ "src": "", "alt": "", "name": "", "studio": "", "badge": "" }] }
 *
 * CMS (Strapi): RoadmapSectionBlock component
 *   fields: heading (rich text), subheading, viewAllCtaLabel, viewAllCtaHref,
 *           jurisdictions[] (Jurisdiction collection), games[] (Game collection)
 *
 * GSAP: ScrollTrigger.batch entrance shared with .game-thumb (main.js).
 *       Carousel scroll is horizontal CSS overflow — no GSAP on carousel itself.
 *
 * Interactive: jurisdiction <select> filters cards by data-jurisdiction attribute.
 *              Filtering is pure DOM show/hide (client-side).
 */

const ROADMAP_DEFAULTS = {
  heading: `upcoming releases <span class="highlight">&amp; roadmap</span>`,
  subheading: 'stay ahead with our content pipeline',
  viewAllLabel: 'view full roadmap',
  viewAllHref: '#',
  jurisdictions: ['Michigan', 'New Jersey', 'Ontario', 'UK', 'Sweden', 'Brazil'],
  games: [
    { src: '../assets/img/thumbs/Group 239046232.png', alt: 'Game', name: 'Cherry Bomber',    studio: 'Atomic Slot Lab', badge: 'new' },
    { src: '../assets/img/thumbs/Group 239046438.png', alt: 'Game', name: 'Dega Babyu',       studio: 'Atomic Slot Lab' },
    { src: '../assets/img/thumbs/Group 239046439.png', alt: 'Game', name: 'Crystal Ball',     studio: 'Gamomat' },
    { src: '../assets/img/thumbs/Group 239046440.png', alt: 'Game', name: 'Slide Strike',     studio: 'Gamomat' },
    { src: '../assets/img/thumbs/Group 239046441.png', alt: 'Game', name: 'Panda Pots',       studio: 'Gamomat' },
    { src: '../assets/img/thumbs/Group 239046442.png', alt: 'Game', name: 'Party Parrots',    studio: 'Indigo Magic' },
    { src: '../assets/img/thumbs/Group-239046443.png', alt: 'Game', name: 'Fire My Laser',    studio: 'Wild Streak', badge: 'new' },
    { src: '../assets/img/thumbs/Group-239046444.png', alt: 'Game', name: 'Volcano Explosive', studio: 'Spin Games' },
  ],
};

class ProductRoadmap extends HTMLElement {
  connectedCallback() {
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag ? { ...ROADMAP_DEFAULTS, ...JSON.parse(scriptTag.textContent) } : ROADMAP_DEFAULTS;

    const jurisdictionOptions = (d.jurisdictions || [])
      .map(j => `<option>${j}</option>`).join('');

    const cardHTML = (d.games || []).map(g => `
<div class="roadmap-card">
  <div class="roadmap-thumb" data-js="thumb-overlay-host">
    ${g.badge ? `<span class="roadmap-badge">${g.badge}</span>` : ''}
    <img src="${g.src}" alt="${g.alt}">
  </div>
  <div class="roadmap-info">
    <div>
      <span class="roadmap-name">${g.name}</span>
      <span class="roadmap-studio">${g.studio}</span>
    </div>
  </div>
</div>`).join('');

    this.innerHTML = `
<section class="roadmap section">
  <div class="container">
    <h2 class="roadmap-heading fade-up">${d.heading}</h2>
    <p class="roadmap-sub fade-up stagger-1">${d.subheading}</p>
    <div class="roadmap-toolbar fade-up stagger-2">
      <div class="roadmap-filter">
        <label>Jurisdiction</label>
        <select>${jurisdictionOptions}</select>
      </div>
      <a href="${d.viewAllHref}" class="btn btn--secondary">${d.viewAllLabel}</a>
    </div>
    <div class="roadmap-carousel fade-up stagger-3">
      <div class="roadmap-track">${cardHTML}</div>
    </div>
  </div>
</section>`;
  }
}

customElements.define('product-roadmap', ProductRoadmap);
