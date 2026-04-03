/**
 * <media-showcase>
 * Scroll-scrubbed scatter-to-grid animation for game thumbnails.
 * Reused across: content.html only (currently hidden — display:none).
 *
 * Attributes:
 *   hidden — if present, section renders with display:none (default behavior)
 *
 * Data island: <script type="application/json"> child
 *   { "title": "",
 *     "games": [{
 *       "src": "", "alt": "",
 *       "scatterX": -45, "scatterY": -35, "scatterR": -8, "scatterS": 0.7
 *     }] }
 *
 * CMS (Strapi): ShowcaseSectionBlock component
 *   fields: title, games[] (Game with scatterX/Y/R/S position fields)
 *
 * GSAP (scroll-scrubbed timeline — main.js):
 *   Thumbs start at scatter positions (xPercent, yPercent, rotation, scale * 3),
 *   title fades out at progress 0.3,
 *   all thumbs animate to 0/0/0/1 with stagger 0.02 from position 0.35.
 *   Timeline scrub: 0.8
 */

const MEDIA_SHOWCASE_DEFAULTS = {
  title: 'our latest bragg games releases',
  games: [
    { src: 'assets/img/thumbs/Group 239046232.png', alt: 'Game', scatterX: -45, scatterY: -35, scatterR: -8,  scatterS: 0.7  },
    { src: 'assets/img/thumbs/Group 239046438.png', alt: 'Game', scatterX: -10, scatterY: -50, scatterR:  5,  scatterS: 0.5  },
    { src: 'assets/img/thumbs/Group 239046439.png', alt: 'Game', scatterX:  20, scatterY: -45, scatterR: -3,  scatterS: 0.9  },
    { src: 'assets/img/thumbs/Group 239046440.png', alt: 'Game', scatterX:  50, scatterY: -20, scatterR:  6,  scatterS: 0.55 },
    { src: 'assets/img/thumbs/Group 239046441.png', alt: 'Game', scatterX: -40, scatterY:  30, scatterR:  4,  scatterS: 0.65 },
    { src: 'assets/img/thumbs/Group 239046442.png', alt: 'Game', scatterX:  -5, scatterY:  35, scatterR: -6,  scatterS: 0.55 },
    { src: 'assets/img/thumbs/Group-239046443.png', alt: 'Game', scatterX:  30, scatterY:  25, scatterR:  3,  scatterS: 0.8  },
    { src: 'assets/img/thumbs/Group-239046444.png', alt: 'Game', scatterX:  55, scatterY:  40, scatterR: -5,  scatterS: 0.6  },
  ],
};

class MediaShowcase extends HTMLElement {
  connectedCallback() {
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag ? { ...MEDIA_SHOWCASE_DEFAULTS, ...JSON.parse(scriptTag.textContent) } : MEDIA_SHOWCASE_DEFAULTS;
    const isHidden = this.hasAttribute('hidden');

    const thumbHTML = (d.games || []).map(g => `
<div class="showcase-thumb"
  data-scatter-x="${g.scatterX}"
  data-scatter-y="${g.scatterY}"
  data-scatter-r="${g.scatterR}"
  data-scatter-s="${g.scatterS}">
  <img src="${g.src}" alt="${g.alt}">
</div>`).join('');

    this.innerHTML = `
<section class="showcase-section"${isHidden ? ' style="display:none;"' : ''}>
  <div class="showcase-pin">
    <h2 class="showcase-title">${d.title}</h2>
    <div class="showcase_grid">${thumbHTML}</div>
  </div>
</section>`;
  }
}

customElements.define('media-showcase', MediaShowcase);
