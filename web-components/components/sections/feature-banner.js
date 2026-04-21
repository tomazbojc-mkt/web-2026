/**
 * <feature-banner>
 * Decorative full-width banner with character images flanking a centered heading and CTA.
 * Reused across: content.html hub banner section only.
 *
 * Data island: <script type="application/json"> child
 *   { "heading": "", "subheading": "", "ctaLabel": "", "ctaHref": "",
 *     "leftChars": [{ "src": "", "alt": "", "class": "" }],
 *     "rightChars": [{ "src": "", "alt": "", "class": "" }] }
 *
 * CMS (Strapi): HubBannerBlock component
 *   fields: heading, subheading, ctaLabel, ctaHref,
 *           leftCharacterImages[], rightCharacterImages[]
 *
 * GSAP (complex — all handled by main.js):
 *   1. Scale scrub: 0.88 → 1, borderRadius 40px → 24px as section enters viewport
 *   2. Character slide-in: left chars from x:-120, right from x:120, triggered at 75% viewport
 *   3. Parallax: each character has a distinct yPercent scrub rate (king:15, cat:20, orbs:30, chick:25)
 *   Hub center yPercent: 10
 */

const FEATURE_BANNER_DEFAULTS = {
  heading: 'comprehensive<br>game aggregation',
  subheading: 'reduce integration headaches<br>one contract, hundreds of games',
  ctaLabel: 'bragg hub',
  ctaHref: '#',
  leftChars: [
    { src: '../assets/img/hub-banner/left-king-1.png', alt: 'King', class: 'hub-char hub-king' },
    { src: '../assets/img/hub-banner/left-hub-0.png',  alt: 'Hub element', class: 'hub-char hub-orbs' },
  ],
  rightChars: [
    { src: '../assets/img/hub-banner/right-chick-0.png', alt: 'Chick', class: 'hub-char hub-chick' },
    { src: '../assets/img/hub-banner/right-cat-1.png',   alt: 'Cat',   class: 'hub-char hub-cat' },
  ],
};

class FeatureBanner extends HTMLElement {
  connectedCallback() {
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag ? { ...FEATURE_BANNER_DEFAULTS, ...JSON.parse(scriptTag.textContent) } : FEATURE_BANNER_DEFAULTS;

    const leftHTML  = (d.leftChars  || []).map(c => `<img src="${c.src}" alt="${c.alt}" class="${c.class}">`).join('');
    const rightHTML = (d.rightChars || []).map(c => `<img src="${c.src}" alt="${c.alt}" class="${c.class}">`).join('');

    this.innerHTML = `
<section class="hub-banner">
  <div class="hub-banner-bg"></div>
  <div class="hub-characters hub-characters-left">${leftHTML}</div>
  <div class="hub-center">
    <h2 class="hub-heading fade-up">${d.heading}</h2>
    <p class="hub-sub fade-up stagger-1">${d.subheading}</p>
    <a href="${d.ctaHref}" class="hub-cta fade-up stagger-2">${d.ctaLabel}</a>
  </div>
  <div class="hub-characters hub-characters-right">${rightHTML}</div>
</section>`;
  }
}

customElements.define('feature-banner', FeatureBanner);
