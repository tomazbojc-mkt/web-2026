/**
 * <logos-grid>
 * A heading + subheading + grid of provider/partner logos.
 * Reused across: content.html providers section only.
 *
 * Data island: <script type="application/json"> child
 *   { "heading": "", "subheading": "",
 *     "logos": [{ "src": "", "alt": "" }] }
 *
 * CMS (Strapi): ProvidersSectionBlock component
 *   fields: heading (rich text), subheading, providers[] (relation to Provider)
 *
 * GSAP: ScrollTrigger.batch stagger scale+y entrance on .provider-logo elements (main.js)
 */

const LOGOS_GRID_DEFAULTS = {
  heading: `<span class="muted">exclusive studios</span><br> and premium content`,
  subheading: 'differentiate your casino with games players can\'t find elsewhere',
  logos: Array.from({ length: 20 }, (_, i) => ({
    src: `assets/img/providers/Provider Logo Variants_OK${i === 0 ? '' : '-' + i}.png`,
    alt: 'Provider',
  })),
};

class LogosGrid extends HTMLElement {
  connectedCallback() {
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag ? { ...LOGOS_GRID_DEFAULTS, ...JSON.parse(scriptTag.textContent) } : LOGOS_GRID_DEFAULTS;

    const logoHTML = (d.logos || []).map(l => `
<div class="provider-logo"><img src="${l.src}" alt="${l.alt}"></div>`).join('');

    this.innerHTML = `
<section class="providers section" id="solutions">
  <div class="container">
    <h2 class="providers-heading fade-up">${d.heading}</h2>
    <p class="providers-sub fade-up stagger-1">${d.subheading}</p>
    <div class="providers-grid fade-up stagger-2">${logoHTML}</div>
  </div>
</section>`;
  }
}

customElements.define('logos-grid', LogosGrid);
