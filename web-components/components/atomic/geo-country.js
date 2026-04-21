/**
 * <geo-country>
 * A single country entry with flag emoji and country name.
 * Used inside the geo-presence section country lists.
 * Reused across: content.html global presence section only.
 *
 * Attributes:
 *   flag   — flag emoji (e.g. "🇧🇪")
 *   name   — country name
 *   types  — comma-separated presence types for tab filtering
 *            (values: "exclusive", "aggregated", "pam")
 *
 * CMS (Strapi): Country content type
 *   fields: name, flagEmoji, presenceTypes[]
 *
 * Note: The parent <geo-presence> section handles tab filter show/hide
 *       by toggling visibility based on the `types` attribute.
 */
class GeoCountry extends HTMLElement {
  connectedCallback() {
    const flag  = this.getAttribute('flag')  || '';
    const name  = this.getAttribute('name')  || '';
    const types = this.getAttribute('types') || 'all';

    // data-types is read by geo-presence for filtering
    this.innerHTML = `
<li class="gp-country" data-types="${types}">
  <span class="gp-flag">${flag}</span>
  <span class="gp-country-name">${name}</span>
</li>`;
  }
}

customElements.define('geo-country', GeoCountry);
