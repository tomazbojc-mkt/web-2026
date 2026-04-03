/**
 * <licensing-grid>
 * Regional regulator logo grid + ISO certification block.
 * Reused across: content.html regional licensing section only.
 *
 * Data island: <script type="application/json"> child
 *   { "heading": "", "subheading": "",
 *     "licences": [{ "src": "", "alt": "", "name": "" }],
 *     "iso": { "badgeSrc": "", "badgeAlt": "", "description": "" } }
 *
 * CMS (Strapi): RegionalLicensingBlock component
 *   fields: heading (rich text), subheading,
 *           licences[] (Licence: jurisdiction, logoUrl, logoAlt),
 *           isoBadge (media), isoDescription (rich text)
 *
 * GSAP: standard fade-up sequence on grid (main.js)
 */

const LICENSING_GRID_DEFAULTS = {
  heading: `<span class="rl-heading-main">regional</span> <span class="muted">licensing</span>`,
  subheading: 'Bragg Gaming Group, holds iGaming B2B licences',
  licences: [
    { src: 'assets/img/licence/1465a3ae2327656a886fa3692dcf04d1b33f1a9d.png', alt: 'Sweden regulator logo',           name: 'Sweden' },
    { src: 'assets/img/licence/fa737b1b3adb6df53ab43e35dac28348e903a2a0.png', alt: 'Malta regulator logo',            name: 'Malta' },
    { src: 'assets/img/licence/b157b9766b52e6204e1b0a1e2bc6ffffd51c1045.png', alt: 'Greece regulator logo',           name: 'Greece' },
    { src: 'assets/img/licence/9a4ad3d3eb6b2ecc0e456ec2fa4d190e155f8ca9.png', alt: 'British Columbia regulator logo', name: 'British Columbia' },
    { src: 'assets/img/licence/34675307f936a7965a63473fbaaf5960e93afab9.png', alt: 'UK regulator logo',               name: 'UK' },
    { src: 'assets/img/licence/fc1a6e3c6783a0f96b9acc7fd4b02f5c824599a6.png', alt: 'Romania regulator logo',          name: 'Romania' },
    { src: 'assets/img/licence/12c74d0fbe192983f8e55d5639f696d3a068dfdf.png', alt: 'Bahamas regulator logo',          name: 'Bahamas' },
    { src: 'assets/img/licence/3b4cfbc13082d1008b388f9f3f34e2a3ae3caa2c.png', alt: 'Ontario regulator logo',          name: 'Ontario' },
    { src: 'assets/img/licence/158e0a426d46795395f5adb8760dabbc1b78ffcb.png', alt: 'New Jersey regulator logo',       name: 'New Jersey' },
    { src: 'assets/img/licence/d7b539533759062d5602baaf8e62130d30d01a23.png', alt: 'Michigan regulator logo',         name: 'Michigan' },
    { src: 'assets/img/licence/2b51d072d8b35ee46b27c5ce2da13b7fc05c10a4.png', alt: 'Connecticut regulator logo',      name: 'Connecticut' },
    { src: 'assets/img/licence/97507d8c9c9d0f1ef9a6c7405233cc879015a5d4.png', alt: 'Pennsylvania regulator logo',     name: 'Pennsylvania' },
    { src: 'assets/img/licence/ba8b06d47ef84c851156baaecb5c541ab873e513.png', alt: 'Belgium regulator logo',          name: 'Belgium' },
    { src: 'assets/img/licence/e176629299c9a828aa126578919337d181f60fc1.png', alt: 'Isle of Man regulator logo',      name: 'Isle of Man' },
    { src: 'assets/img/licence/a3341cecb67337e8b9785f4609320b7d1682793c.png', alt: 'Peru regulator logo',             name: 'Peru' },
    { src: 'assets/img/licence/47ad445830b307f17d886b0894b6c5bb65fb592b.png', alt: 'West Virginia regulator logo',   name: 'West Virginia' },
    { src: 'assets/img/licence/643b08f11d510a51443caadbb2e916e849732879.png', alt: 'Delaware regulator logo',        name: 'Delaware' },
  ],
  iso: {
    badgeSrc: 'assets/img/licence/165e2c0254fe186068903786884bbf7356357f02.png',
    badgeAlt: 'ISO 27001 badge',
    description: `Bragg Gaming Group companies Oryx Gaming Limited and Oryx razvojne storitve are accredited with the
      <strong>ISO/IEC 27001 Certification</strong> for its
      <strong>Information Security Management System</strong> (ISMS)`,
  },
};

class LicensingGrid extends HTMLElement {
  connectedCallback() {
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag ? { ...LICENSING_GRID_DEFAULTS, ...JSON.parse(scriptTag.textContent) } : LICENSING_GRID_DEFAULTS;

    const licenceHTML = (d.licences || []).map(l => `
<li class="rl-card">
  <img src="${l.src}" alt="${l.alt}">
  <span>${l.name}</span>
</li>`).join('');

    const iso = d.iso || {};

    this.innerHTML = `
<section class="regional-licensing section">
  <div class="container">
    <h2 class="rl-heading fade-up">${d.heading}</h2>
    <p class="rl-sub fade-up stagger-1">${d.subheading}</p>
    <ul class="rl-grid fade-up stagger-2">${licenceHTML}</ul>
    ${iso.badgeSrc ? `
    <div class="rl-iso fade-up stagger-3">
      <img src="${iso.badgeSrc}" alt="${iso.badgeAlt || 'ISO badge'}">
      <p>${iso.description}</p>
    </div>` : ''}
  </div>
</section>`;
  }
}

customElements.define('licensing-grid', LicensingGrid);
