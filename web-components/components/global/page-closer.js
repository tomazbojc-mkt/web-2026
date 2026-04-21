/**
 * <page-closer>
 * Final CTA section. Appears on every page.
 * Reused across: index.html, fuze.html, content.html
 *
 * Attributes:
 *   headline     — plain text lines (use \n for line breaks)
 *   muted-line   — the accent/muted highlighted line
 *   cta-label    — button text (default: "talk to our team")
 *   cta-href     — button link (default: "#contact")
 *
 * CMS (Strapi): CloserBlock component on each page
 *   fields: headlineLines[], mutedLine, ctaLabel, ctaHref
 *
 * GSAP: .fade-up and .stagger-1 classes are picked up by global main.js
 */
class PageCloser extends HTMLElement {
  connectedCallback() {
    const headline  = this.getAttribute('headline')   || 'this is bragg.\nbuilt around the player.';
    const mutedLine = this.getAttribute('muted-line') || 'smart where it matters.';
    const ctaLabel  = this.getAttribute('cta-label')  || 'talk to our team';
    const ctaHref   = this.getAttribute('cta-href')   || '#contact';

    const lines = headline.split('\n').join('<br>');

    this.innerHTML = `
<section class="closer" id="contact">
  <div class="container">
    <p class="large-text fade-up">
      ${lines}<br>
      <span class="muted">${mutedLine}</span>
    </p>
    <a href="${ctaHref}" class="btn btn--primary fade-up stagger-1" data-js="btn-flair">${ctaLabel}</a>
  </div>
</section>`;
  }
}

customElements.define('page-closer', PageCloser);
