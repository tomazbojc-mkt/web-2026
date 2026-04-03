/**
 * <metric-pill>
 * Floating frosted-glass pill showing a metric: icon + label + value.
 * Reused across: index.html hero visual (as .data-tag), fuze.html big-idea (as .big-idea__label)
 *
 * Attributes:
 *   icon     — emoji or text icon (e.g. "🏆")
 *   label    — metric label text
 *   value    — metric value text
 *   variant  — "tag" (default, homepage hero) | "label" (fuze big-idea style)
 *
 * CMS (Strapi): DataTag component
 *   fields: icon, label, value
 *
 * Note: Positioning (tag-1 through tag-4) is handled by CSS on the parent container.
 */
class MetricPill extends HTMLElement {
  connectedCallback() {
    const icon    = this.getAttribute('icon')    || '';
    const label   = this.getAttribute('label')   || '';
    const value   = this.getAttribute('value')   || '';
    const variant = this.getAttribute('variant') || 'tag';

    if (variant === 'label') {
      // fuze big-idea style: .big-idea__label
      this.innerHTML = `
<div class="big-idea__label">
  <div class="big-idea__label-icon" aria-hidden="true">${icon}</div>
  <div class="big-idea__label-text">
    <span class="big-idea__label-title">${label}</span>
    <span class="big-idea__label-value">${value}</span>
  </div>
</div>`;
    } else {
      // homepage hero style: .data-tag
      this.innerHTML = `
<div class="data-tag">
  <span class="data-tag-icon">${icon}</span>
  <div class="data-tag-content">
    <span class="data-tag-label">${label}</span>
    <span class="data-tag-value">${value}</span>
  </div>
</div>`;
    }
  }
}

customElements.define('metric-pill', MetricPill);
