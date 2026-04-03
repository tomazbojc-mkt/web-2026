/**
 * <logo-scroller>
 * Infinite CSS-animated horizontal marquee of text badges.
 * Used standalone or embedded inside trust-section.
 * Reused across: index.html trust section only.
 *
 * Data island: <script type="application/json"> child
 *   { "badges": ["Malta Gaming Authority (MGA)", ...] }
 *
 * CMS (Strapi): LicenseBadge collection
 *
 * GSAP: none — pure CSS animation (animation: marquee linear infinite).
 *       Badges are duplicated in innerHTML for seamless loop.
 */

const SCROLLER_DEFAULTS = {
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
};

class LogoScroller extends HTMLElement {
  connectedCallback() {
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag ? { ...SCROLLER_DEFAULTS, ...JSON.parse(scriptTag.textContent) } : SCROLLER_DEFAULTS;

    const badgeHTML = (d.badges || []).map(b => `<span class="license-badge">${b}</span>`).join('');

    this.innerHTML = `
<div class="license-marquee-wrapper">
  <div class="license-marquee">
    <div class="license-marquee-track">
      ${badgeHTML}
      ${badgeHTML}
    </div>
  </div>
</div>`;
  }
}

customElements.define('logo-scroller', LogoScroller);
