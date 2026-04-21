/**
 * <logo-badge>
 * A text badge displaying a license/regulator name. Used inside the logo scroller marquee.
 * Reused across: index.html trust section marquee only.
 *
 * Attributes:
 *   name — the regulator / license name text
 *
 * CMS (Strapi): LicenseBadge component
 *   fields: name
 *
 * Note: The parent <logo-scroller> component handles duplicating badges for the seamless CSS loop.
 */
class LogoBadge extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || this.textContent.trim() || '';
    this.innerHTML = `<span class="license-badge">${name}</span>`;
  }
}

customElements.define('logo-badge', LogoBadge);
