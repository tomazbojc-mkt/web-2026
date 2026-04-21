/**
 * <trust-section>
 * Stats + social proof section. Two variants.
 * Reused across: index.html (static stats + marquee), content.html (animated count-up + testimonial)
 *
 * Attributes:
 *   variant — "default" (static stats, marquee) | "counters" (animated count-up + quote)
 *
 * Data island: <script type="application/json"> child with variant-specific fields.
 *
 * Default variant fields:
 *   headline, supporting, ctaLabel, ctaHref,
 *   stats: [{ value, label }],
 *   badges: ["Malta Gaming Authority (MGA)", ...]
 *
 * Counters variant fields:
 *   heading,
 *   stats: [{ target, suffix, label }],
 *   quote: { text, authorName, authorTitle }
 *
 * CMS (Strapi): TrustBlock component on each Page
 *
 * GSAP:
 *   default  — standard fade-up sequence (main.js)
 *   counters — count-up tweens on [data-count] elements via ScrollTrigger (main.js)
 */

const TRUST_DEFAULTS = {
  default: {
    headline: `licensed. certified.<br><span class="muted">built for regulated markets.</span>`,
    supporting: 'Bragg operates across 30+ regulated jurisdictions in North America, Latin America, and Europe. Certified where it counts.',
    ctaLabel: 'talk to sales',
    ctaHref: '#contact',
    stats: [
      { value: '30+',    label: 'regulated markets' },
      { value: '200+',   label: 'operator partners' },
      { value: '10,000+',label: 'games' },
      { value: '50+',    label: 'content providers' },
    ],
    badges: [
      'Malta Gaming Authority (MGA)',
      'Michigan Gaming Control Board (MGCB)',
      'New Jersey Division of Gaming Enforcement (DGE)',
      'Pennsylvania Dept. of Community & Economic Development (DCP)',
      'British Columbia Gaming Policy & Enforcement Branch (GPEB)',
      'Gaming Board for the Bahamas',
      'Oficiul Național pentru Jocuri de Noroc (ONJN) – Romania',
      'Curaçao Gaming Control Board',
      'Belgian Gaming Commission',
      'Hellenic Gaming Commission (HGC) – Greece',
      'Isle of Man Gambling Supervision Commission',
      'GambleAware',
      'Alcohol and Gaming Commission of Ontario (AGCO)',
      'Ministerio de Comercio Exterior y Turismo (MINCETUR) – Peru',
      'West Virginia Lottery',
      'Delaware Lottery',
    ],
  },
  counters: {
    heading: `why operators trust <span class="muted">bragg</span>`,
    stats: [
      { target: 1000, suffix: '+', label: 'Games available' },
      { target: 10,   suffix: '+', label: 'New releases monthly' },
      { target: 50,   suffix: '',  label: 'Jurisdictions served' },
      { target: 90,   suffix: '%', label: 'Player retention' },
    ],
    quote: {
      text: 'One of the things that has impressed us about Bragg is how they leverage that expertise to help us provide engaging, compliant, and localized experiences for our players.',
      authorName: 'Andreas Bardun',
      authorTitle: 'CEO, KTO Group',
    },
  },
};

class TrustSection extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') || 'default';
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag
      ? { ...TRUST_DEFAULTS[variant], ...JSON.parse(scriptTag.textContent) }
      : TRUST_DEFAULTS[variant];

    if (variant === 'counters') {
      const statsHTML = (d.stats || []).map((s, i) => `
<div class="trust-stat fade-up stagger-${i + 1}">
  <div class="trust-value">
    <span class="trust-number accent" data-count="${s.target}">0</span>
    ${s.suffix ? `<span class="trust-suffix accent">${s.suffix}</span>` : ''}
  </div>
  <span class="trust-label">${s.label}</span>
</div>`).join('');

      const q = d.quote || {};
      this.innerHTML = `
<section class="trust-section section">
  <div class="container">
    <h2 class="trust-heading fade-up">${d.heading}</h2>
    <div class="trust-stats">${statsHTML}</div>
    <div class="trust-quote fade-up">
      <div class="trust-quote-mark accent">&ldquo;</div>
      <blockquote>
        <p>${q.text}</p>
        <cite>&ndash; <strong>${q.authorName}</strong>, ${q.authorTitle}</cite>
      </blockquote>
    </div>
  </div>
</section>`;

    } else {
      // default — static stats + marquee
      const statsHTML = (d.stats || []).map(s => `
<div class="stat-item">
  <div class="stat-number">${s.value}</div>
  <div class="stat-label">${s.label}</div>
</div>`).join('');

      // Duplicate badges for seamless CSS marquee loop
      const badgeHTML = (d.badges || []).map(b => `<span class="license-badge">${b}</span>`).join('');

      this.innerHTML = `
<section class="trust" id="trust">
  <div class="container">
    <p class="large-text fade-up">${d.headline}</p>
    <p class="supporting fade-up stagger-1">${d.supporting}</p>
    <div class="stats-grid fade-up stagger-2">${statsHTML}</div>
    <div style="text-align: center; margin: 48px 0 56px;" class="fade-up stagger-3">
      <a href="${d.ctaHref}" class="btn btn--primary" data-js="btn-flair">${d.ctaLabel} <span>→</span></a>
    </div>
    <div class="license-marquee-wrapper fade-up stagger-4">
      <div class="license-marquee">
        <div class="license-marquee-track">
          ${badgeHTML}
          ${badgeHTML}
        </div>
      </div>
    </div>
  </div>
</section>`;
    }
  }
}

customElements.define('trust-section', TrustSection);
