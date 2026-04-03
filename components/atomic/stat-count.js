/**
 * <stat-count>
 * Displays a statistic with an optional animated count-up.
 * Reused across: index.html trust section (static), content.html trust section (animated)
 *
 * Attributes:
 *   value    — display string when static (e.g. "30+", "200+")
 *   label    — description text below the number
 *   target   — integer target for count-up animation; if absent, renders static value
 *   suffix   — appended after the animated number (e.g. "+", "%")
 *   variant  — "static" (default) | "animated"
 *
 * CMS (Strapi): StatItem component
 *   fields: value, label, animatedTarget (optional), suffix (optional)
 *
 * GSAP: when variant="animated", the global main.js targets [data-count] for count-up.
 *       The component sets data-count on the number span to hook into that behavior.
 */
class StatCount extends HTMLElement {
  connectedCallback() {
    const label   = this.getAttribute('label')  || '';
    const target  = this.getAttribute('target');
    const suffix  = this.getAttribute('suffix') || '';
    const value   = this.getAttribute('value')  || (target ? '0' : '');

    if (target) {
      // Animated variant — used on content.html trust section
      // data-count is read by GSAP in main.js for count-up tween
      this.innerHTML = `
<div class="trust-stat fade-up">
  <div class="trust-value">
    <span class="trust-number accent" data-count="${target}">0</span>
    ${suffix ? `<span class="trust-suffix accent">${suffix}</span>` : ''}
  </div>
  <span class="trust-label">${label}</span>
</div>`;
    } else {
      // Static variant — used on index.html trust section
      this.innerHTML = `
<div class="stat-item">
  <div class="stat-number">${value}</div>
  <div class="stat-label">${label}</div>
</div>`;
    }
  }
}

customElements.define('stat-count', StatCount);
