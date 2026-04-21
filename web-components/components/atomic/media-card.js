/**
 * <media-card>
 * A game or media thumbnail card. Two variants: thumb and roadmap.
 * Reused across: content.html game releases grid, roadmap carousel, showcase section.
 *
 * Attributes:
 *   variant      — "thumb" (default, plain image) | "roadmap" (image + name + studio + optional badge)
 *   src          — image source path
 *   alt          — image alt text (default: "Game")
 *   name         — game title (roadmap variant)
 *   studio       — studio name (roadmap variant)
 *   badge        — badge label, e.g. "new" (roadmap variant, optional)
 *   scatter-x    — xPercent scatter value for showcase animation (thumb variant)
 *   scatter-y    — yPercent scatter value for showcase animation
 *   scatter-r    — rotation scatter value
 *   scatter-s    — scale scatter value
 *
 * CMS (Strapi): Game content type
 *   fields: thumbnailUrl, thumbnailAlt, name, studio, isNew, scatterX/Y/R/S
 *
 * GSAP: .game-thumb and .roadmap-card elements are targeted by ScrollTrigger.batch in main.js.
 *       Showcase scatter values are read from data-scatter-* attributes by main.js.
 */
class MediaCard extends HTMLElement {
  connectedCallback() {
    const variant  = this.getAttribute('variant') || 'thumb';
    const src      = this.getAttribute('src')     || '';
    const alt      = this.getAttribute('alt')     || 'Game';

    if (variant === 'roadmap') {
      const name   = this.getAttribute('name')   || '';
      const studio = this.getAttribute('studio') || '';
      const badge  = this.getAttribute('badge')  || '';

      this.innerHTML = `
<div class="roadmap-card">
  <div class="roadmap-thumb" data-js="thumb-overlay-host">
    ${badge ? `<span class="roadmap-badge">${badge}</span>` : ''}
    <img src="${src}" alt="${alt}">
  </div>
  <div class="roadmap-info">
    <div>
      <span class="roadmap-name">${name}</span>
      <span class="roadmap-studio">${studio}</span>
    </div>
  </div>
</div>`;

    } else {
      // thumb variant (game releases grid, showcase)
      const scatterX = this.getAttribute('scatter-x') || '';
      const scatterY = this.getAttribute('scatter-y') || '';
      const scatterR = this.getAttribute('scatter-r') || '';
      const scatterS = this.getAttribute('scatter-s') || '';
      const scatterAttrs = [
        scatterX ? `data-scatter-x="${scatterX}"` : '',
        scatterY ? `data-scatter-y="${scatterY}"` : '',
        scatterR ? `data-scatter-r="${scatterR}"` : '',
        scatterS ? `data-scatter-s="${scatterS}"` : '',
      ].filter(Boolean).join(' ');

      this.innerHTML = `
<div class="game-thumb" data-js="thumb-overlay-host" ${scatterAttrs}>
  <img src="${src}" alt="${alt}">
</div>`;
    }
  }
}

customElements.define('media-card', MediaCard);
