/**
 * <geo-presence>
 * Global presence section with tab filter and region/country lists.
 * Reused across: content.html only.
 *
 * Data island: <script type="application/json"> child
 *   { "heading": "", "subheading": "",
 *     "filters": [{ "label": "All", "value": "all" }, ...],
 *     "regions": [{
 *       "name": "Europe",
 *       "countries": [{ "flag": "🇧🇪", "name": "Belgium", "types": ["exclusive","aggregated"] }]
 *     }] }
 *
 * CMS (Strapi): GlobalPresenceSectionBlock component
 *   fields: heading, subheading, regions[] (Region → countries[] → Country)
 *   Country: name, flagEmoji, presenceTypes[] (exclusive | aggregated | pam)
 *
 * GSAP: standard fade-up on section blocks (main.js). No per-item animation.
 *
 * Interactive: tab buttons toggle country visibility by comparing filter value
 *              against country's data-types attribute. Pure DOM manipulation.
 */

const GEO_PRESENCE_DEFAULTS = {
  heading: 'global presence',
  subheading: 'bragg maintains a presence in a slew of regulated markets internationally',
  filters: [
    { label: 'All',               value: 'all' },
    { label: 'Exclusive Games',   value: 'exclusive' },
    { label: 'Aggregated Games',  value: 'aggregated' },
    { label: 'PAM Platform',      value: 'pam' },
  ],
  regions: [
    {
      name: 'Europe',
      countries: [
        { flag: '🇧🇪', name: 'Belgium',         types: 'exclusive,aggregated' },
        { flag: '🇭🇷', name: 'Croatia',          types: 'exclusive,aggregated' },
        { flag: '🇨🇿', name: 'Czech Republic',   types: 'exclusive,aggregated' },
        { flag: '🇪🇪', name: 'Estonia',          types: 'exclusive,aggregated' },
        { flag: '🇩🇪', name: 'Germany',          types: 'exclusive,aggregated' },
        { flag: '🇬🇷', name: 'Greece',           types: 'exclusive,aggregated' },
        { flag: '🇱🇻', name: 'Latvia',           types: 'exclusive,aggregated' },
        { flag: '🇲🇹', name: 'Malta',            types: 'exclusive,aggregated,pam' },
        { flag: '🇵🇹', name: 'Portugal',         types: 'exclusive,aggregated' },
        { flag: '🇷🇴', name: 'Romania',          types: 'exclusive,aggregated' },
        { flag: '🇪🇸', name: 'Spain',            types: 'exclusive,aggregated' },
        { flag: '🇸🇪', name: 'Sweden',           types: 'exclusive,aggregated' },
        { flag: '🇳🇱', name: 'The Netherlands',  types: 'exclusive,aggregated' },
      ],
    },
    {
      name: 'Latin America &amp; Caribbean',
      countries: [
        { flag: '🇧🇷', name: 'Brazil',      types: 'exclusive,aggregated' },
        { flag: '🇵🇪', name: 'Peru',        types: 'exclusive,aggregated' },
        { flag: '🇨🇼', name: 'Curaçao',     types: 'aggregated' },
        { flag: '🇧🇸', name: 'The Bahamas', types: 'aggregated' },
      ],
    },
    {
      name: 'North America',
      countries: [
        { flag: '🇺🇸', name: 'United States', types: 'exclusive,aggregated,pam' },
        { flag: '🇨🇦', name: 'Canada',        types: 'exclusive,aggregated,pam' },
      ],
    },
  ],
};

class GeoPresence extends HTMLElement {
  connectedCallback() {
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag ? { ...GEO_PRESENCE_DEFAULTS, ...JSON.parse(scriptTag.textContent) } : GEO_PRESENCE_DEFAULTS;

    const filterHTML = (d.filters || []).map((f, i) => `
<button class="gp-filter${i === 0 ? ' active' : ''}"
  data-filter="${f.value}"
  role="tab"
  aria-selected="${i === 0 ? 'true' : 'false'}">${f.label}</button>`).join('');

    const regionHTML = (d.regions || []).map(r => `
<dt class="gp-region-name">${r.name}</dt>
<dd class="gp-countries">
  <ul class="gp-country-list">
    ${(r.countries || []).map(c => `
    <li class="gp-country" data-types="${c.types}">
      <span class="gp-flag">${c.flag}</span>
      <span class="gp-country-name">${c.name}</span>
    </li>`).join('')}
  </ul>
</dd>`).join('');

    this.innerHTML = `
<section class="global-presence section">
  <div class="container">
    <h2 class="global-presence-heading fade-up">${d.heading}</h2>
    <p class="global-presence-sub fade-up stagger-1">${d.subheading}</p>
    <div class="gp-filters fade-up stagger-2" role="tablist">${filterHTML}</div>
    <dl class="gp-regions fade-up stagger-3">${regionHTML}</dl>
  </div>
</section>`;

    this._initFilter();
  }

  _initFilter() {
    const buttons   = this.querySelectorAll('.gp-filter');
    const countries = this.querySelectorAll('.gp-country');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.dataset.filter;
        countries.forEach(c => {
          const types = (c.dataset.types || '').split(',');
          c.style.display = (filter === 'all' || types.includes(filter)) ? '' : 'none';
        });
      });
    });
  }
}

customElements.define('geo-presence', GeoPresence);
