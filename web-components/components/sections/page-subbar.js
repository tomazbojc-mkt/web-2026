/**
 * <page-subbar>
 * A two-column text bar displayed directly below the homepage hero.
 * Reused across: index.html only.
 *
 * Attributes:
 *   left-text  — left side text (default: "platform. content. engagement.")
 *   right-text — right side text (default: "nasdaq: brag · tsx: brag")
 *
 * CMS (Strapi): HeroSubBar component
 *   fields: leftText, rightText
 */
class PageSubbar extends HTMLElement {
  connectedCallback() {
    const leftText  = this.getAttribute('left-text')  || 'platform. content. engagement.';
    const rightText = this.getAttribute('right-text') || 'nasdaq: brag &nbsp;·&nbsp; tsx: brag';

    this.innerHTML = `
<div class="hero-sub-bar">
  <span>${leftText}</span>
  <span>${rightText}</span>
</div>`;
  }
}

customElements.define('page-subbar', PageSubbar);
