/**
 * <releases-grid>
 * Two-column layout: left text + right grid of game thumbnails.
 * Reused across: content.html game releases section only.
 *
 * Data island: <script type="application/json"> child
 *   { "heading": "", "subheading": "", "ctaLabel": "", "ctaHref": "",
 *     "games": [{ "src": "", "alt": "" }] }
 *
 * CMS (Strapi): GameReleasesSectionBlock component
 *   fields: heading (rich text), subheading, ctaLabel, ctaHref,
 *           games[] (relation to Game collection, ordered, limit 8)
 *
 * GSAP: ScrollTrigger.batch stagger on .game-thumb elements with rotation variance (main.js)
 */

const RELEASES_GRID_DEFAULTS = {
  heading: `our latest <span class="muted">bragg games</span> releases`,
  subheading: 'Top games across many markets, smashing hits',
  ctaLabel: 'talk to sales',
  ctaHref: '#contact',
  games: [
    { src: '../assets/img/thumbs/Group 239046232.png',  alt: 'Game' },
    { src: '../assets/img/thumbs/Group 239046438.png',  alt: 'Game' },
    { src: '../assets/img/thumbs/Group 239046439.png',  alt: 'Game' },
    { src: '../assets/img/thumbs/Group 239046440.png',  alt: 'Game' },
    { src: '../assets/img/thumbs/Group 239046441.png',  alt: 'Game' },
    { src: '../assets/img/thumbs/Group 239046442.png',  alt: 'Game' },
    { src: '../assets/img/thumbs/Group-239046443.png',  alt: 'Game' },
    { src: '../assets/img/thumbs/Group-239046444.png',  alt: 'Game' },
  ],
};

class ReleasesGrid extends HTMLElement {
  connectedCallback() {
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag ? { ...RELEASES_GRID_DEFAULTS, ...JSON.parse(scriptTag.textContent) } : RELEASES_GRID_DEFAULTS;

    const thumbHTML = (d.games || []).map(g => `
  <div class="game-thumb" data-js="thumb-overlay-host"><img src="${g.src}" alt="${g.alt}"></div>`).join('');

    this.innerHTML = `
<section class="game-releases section" id="releases">
  <div class="container">
    <div class="releases-layout">
      <div class="releases-left">
        <h2 class="releases-heading fade-up">${d.heading}</h2>
        <p class="releases-sub fade-up stagger-1">${d.subheading}</p>
        <div class="releases-buttons fade-up stagger-2">
          <a href="${d.ctaHref}" class="btn btn--primary" data-js="btn-flair">${d.ctaLabel}</a>
        </div>
      </div>
      <div class="releases-grid">${thumbHTML}</div>
    </div>
  </div>
</section>`;
  }
}

customElements.define('releases-grid', ReleasesGrid);
