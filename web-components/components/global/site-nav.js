/**
 * <site-nav>
 * Global navigation bar. Appears on every page.
 * Reused across: index.html, fuze.html, content.html
 *
 * Attributes:
 *   logo-src  — path to logo image (default: ../assets/logo-new.svg)
 *   logo-alt  — alt text for logo (default: "Logo")
 *
 * CMS (Strapi): SiteSettings singleton
 *   fields: logoUrl, logoAlt, navLinks[], ctaLabel, ctaHref
 *
 * Data island (optional): place a <script type="application/json"> child
 * to override links. Schema:
 *   { "links": [{ "label": "...", "href": "...", "hasChevron": true }],
 *     "cta": { "label": "...", "href": "..." } }
 */

const NAV_CHEVRON = `<svg class="nav-chevron" viewBox="0 0 12 12" fill="none">
  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const NAV_DEFAULTS = {
  links: [
    { label: 'What we do', href: '#solutions', hasChevron: true },
    { label: 'About us',   href: '#why',       hasChevron: true },
    { label: 'Careers',    href: '#launch',     hasChevron: true },
  ],
  cta: { label: 'Talk to sales', href: '#contact' },
};

class SiteNav extends HTMLElement {
  connectedCallback() {
    const logoSrc = this.getAttribute('logo-src') || '../assets/logo-new.svg';
    const logoAlt = this.getAttribute('logo-alt') || 'Logo';

    const scriptTag = this.querySelector('script[type="application/json"]');
    const data = scriptTag ? { ...NAV_DEFAULTS, ...JSON.parse(scriptTag.textContent) } : NAV_DEFAULTS;

    const linkItems = data.links.map(({ label, href, hasChevron }) => `
      <li><a href="${href}">${label}${hasChevron ? ` ${NAV_CHEVRON}` : ''}</a></li>
    `).join('');

    this.innerHTML = `
<nav id="nav">
  <div class="nav-inner">
    <span class="nav-logo"><img src="${logoSrc}" alt="${logoAlt}" /></span>
    <ul class="nav-links">
      ${linkItems}
      <li><a href="${data.cta.href}" class="nav-cta">${data.cta.label}</a></li>
    </ul>
  </div>
</nav>`;

    this._initScrollShadow();
  }

  _initScrollShadow() {
    // Matches behavior in main.js: add shadow class on scroll
    const nav = this.querySelector('#nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

customElements.define('site-nav', SiteNav);
