/**
 * <feature-card>
 * A card showing a feature, capability, or product option.
 * Used as: pillar-card (homepage why-bragg), fuze-card (fuze presentation), launch-card (homepage launch)
 *
 * Attributes:
 *   variant      — "pillar" (default) | "fuze" | "launch"
 *   title        — card heading
 *   description  — body text
 *   label        — small option label above title (launch variant: "option 01")
 *   tags         — comma-separated platform tags (fuze variant: "Casino,Sportsbook")
 *   metric       — metric value string (fuze variant, e.g. "57%")
 *   use-icon     — if set, shows a ⚡ icon instead of metric (fuze variant)
 *   full-width   — if set, applies .card-full modifier (fuze variant)
 *   cta-label    — link text (launch variant)
 *   cta-href     — link href (launch variant)
 *   option-type  — "turnkey" | "modular" (launch variant, adds CSS modifier class)
 *
 * CMS (Strapi): PillarCard | FuzeCard | LaunchCard components
 */
class FeatureCard extends HTMLElement {
  connectedCallback() {
    const variant     = this.getAttribute('variant')     || 'pillar';
    const title       = this.getAttribute('title')       || '';
    const description = this.getAttribute('description') || '';

    if (variant === 'pillar') {
      this.innerHTML = `
<div class="pillar-card fade-up">
  <h3>${title}</h3>
  <p>${description}</p>
</div>`;

    } else if (variant === 'fuze') {
      const tags      = (this.getAttribute('tags') || '').split(',').filter(Boolean);
      const metric    = this.getAttribute('metric')   || '';
      const useIcon   = this.hasAttribute('use-icon');
      const fullWidth = this.hasAttribute('full-width');
      const tagHTML   = tags.map(t => t.trim()).join(' · ');
      const metricHTML = useIcon
        ? `<div class="card-icon">&#x26A1;</div>`
        : metric ? `<div class="card-metric">${metric}</div>` : '';

      this.innerHTML = `
<article class="card${fullWidth ? ' card-full' : ''}">
  <h4 class="card-title">${title}</h4>
  ${tagHTML ? `<p class="card-tags">${tagHTML}</p>` : ''}
  ${metricHTML}
  <p class="card-desc">${description}</p>
</article>`;

    } else if (variant === 'launch') {
      const label      = this.getAttribute('label')      || '';
      const ctaLabel   = this.getAttribute('cta-label')  || 'get started';
      const ctaHref    = this.getAttribute('cta-href')   || '#contact';
      const optionType = this.getAttribute('option-type') || '';

      this.innerHTML = `
<div class="launch-card ${optionType} fade-up">
  ${label ? `<div class="card-label">${label}</div>` : ''}
  <h3>${title}</h3>
  <p>${description}</p>
  <a href="${ctaHref}" class="card-arrow">${ctaLabel} →</a>
</div>`;
    }
  }
}

customElements.define('feature-card', FeatureCard);
