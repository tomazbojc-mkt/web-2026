/**
 * <quote-block>
 * A pull-quote / testimonial block with a large opening quote mark, quote text, and attribution.
 * Reused across: content.html trust section only.
 *
 * Attributes:
 *   quote          — the quote body text
 *   author-name    — person's name (bolded in cite)
 *   author-title   — person's title/role
 *   author-company — company name
 *
 * CMS (Strapi): Testimonial content type
 *   fields: quoteText, authorName, authorTitle, authorCompany
 *
 * GSAP: standard fade-up via .fade-up class, handled by global main.js
 */
class QuoteBlock extends HTMLElement {
  connectedCallback() {
    const quote         = this.getAttribute('quote')          || '';
    const authorName    = this.getAttribute('author-name')    || '';
    const authorTitle   = this.getAttribute('author-title')   || '';
    const authorCompany = this.getAttribute('author-company') || '';

    const attribution = [authorTitle, authorCompany].filter(Boolean).join(', ');

    this.innerHTML = `
<div class="trust-quote fade-up">
  <div class="trust-quote-mark accent">&ldquo;</div>
  <blockquote>
    <p>${quote}</p>
    <cite>&ndash; <strong>${authorName}</strong>${attribution ? `, ${attribution}` : ''}</cite>
  </blockquote>
</div>`;
  }
}

customElements.define('quote-block', QuoteBlock);
