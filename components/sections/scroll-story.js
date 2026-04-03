/**
 * <scroll-story>
 * Scroll-driven interactive presentation: scrolling articles sync with a sticky phone display.
 * Reused across: fuze.html only (Fuze Presentation section).
 *
 * Data island: <script type="application/json"> child
 *   { "sections": [{
 *       "id": "registration", "label": "...", "heading": "...", "description": "...",
 *       "ctaLabel": "...", "ctaHref": "...",
 *       "cards": [{ "title": "", "tags": "", "metric": "", "useIcon": false, "description": "", "fullWidth": false }],
 *       "screenType": "video",          // "video" | "color"
 *       "screenSrc": "assets/video/...", // video src or color hex
 *       "screenLabel": ""               // label shown on color screens
 *     }]
 *   }
 *
 * CMS (Strapi): FuzePresentationBlock component
 *   fields: sections[] (FuzeSection: label, heading, description, cards[], phoneScreen)
 *
 * GSAP / ScrollTrigger:
 *   Each article registers a ScrollTrigger (start: top center, end: bottom center).
 *   onEnter / onEnterBack toggles .is-active on the matching phone screen.
 *   Requires GSAP + ScrollTrigger to be loaded before this component upgrades.
 */

const SCROLL_STORY_DEFAULTS = {
  sections: [
    {
      id: 'registration',
      label: 'Registration &amp; Onboarding',
      heading: 'Convert new players from day one, turn early sessions into lasting habits',
      description: 'Stop wasting acquisition spend on churn and bonus abuse by guiding new players through habit-forming milestones from the moment they register.',
      ctaLabel: 'book a demo',
      ctaHref: '#contact',
      cards: [
        { title: 'Bonus engine',  tags: 'Casino · Sportsbook', metric: '57<sup>%</sup>', description: 'optimization of bonus costs' },
        { title: 'Quests',        tags: 'Casino · Sportsbook', metric: '74<sup>%</sup>', description: 'increase in bets, session frequency &amp; length' },
      ],
      screenType: 'video',
      screenSrc: 'assets/video/01Registration-Onboarding.webm',
    },
    {
      id: 'early-life',
      label: 'Early Life',
      heading: 'Help players discover the games they\'ll love without relying on bonuses',
      description: 'Instead of burying thousands of titles in a generic lobby, Fuze™ uses machine learning to deliver a hyper-personalized game discovery experience that drives higher session value.',
      ctaLabel: 'book a demo',
      ctaHref: '#contact',
      cards: [
        { title: 'Game Recommendation System', tags: 'Casino', metric: '45<sup>%</sup>', description: 'increase in average revenue per session', fullWidth: true },
      ],
      screenType: 'color',
      screenSrc: '#3fdc5a',
      screenLabel: 'Early Life',
    },
    {
      id: 'retention',
      label: 'Retention &amp; Cross-sell',
      heading: 'Keep players coming back with excitement and real-time rewards',
      description: 'Break the cycle of transactional play by replacing static bonuses with dynamic, real-time mechanics that build long-term loyalty and seamless cross-sell.',
      ctaLabel: 'book a demo',
      ctaHref: '#contact',
      cards: [
        { title: 'Tournaments with real-time leaderboards', tags: 'Casino · Sportsbook', metric: '60<sup>%</sup>', description: 'extra revenue in bets during tournament periods' },
        { title: 'Big Ticket Bonanza',  tags: 'Casino · Sportsbook', metric: '80<sup>%</sup>', description: 'increase in bets' },
        { title: 'Fuze™ Arcade',        tags: 'Casino · Sportsbook', useIcon: true, description: 'On-the-spot excitement that keeps players coming back' },
        { title: 'Flash Jackpot',       tags: 'Casino · Sportsbook', useIcon: true, description: 'Instant player activity and heightened attention' },
        { title: 'In-game notifications', tags: 'Casino · Sportsbook', useIcon: true, description: 'Immediate engagement and conversions', fullWidth: true },
      ],
      screenType: 'color',
      screenSrc: '#ff6b35',
      screenLabel: 'Retention',
    },
    {
      id: 'vip',
      label: 'VIP &amp; Lifetime Value',
      heading: 'Turn everyday players into VIP and keep them playing longer',
      description: 'Since high-value players are built rather than born, Fuze™ provides the personalized incentives and progression needed to nurture regular users into loyal, long-term VIPs.',
      ctaLabel: 'book a demo',
      ctaHref: '#contact',
      cards: [
        { title: 'Loyalty System – Full Fuze™ Stack',      tags: 'Casino · Sportsbook', useIcon: true, description: 'More bets per session as players chase progression milestones' },
        { title: 'VIP Progression – Exclusive Tournaments', tags: 'Casino · Sportsbook', useIcon: true, description: 'Longer player lifecycles through progression-based engagement' },
      ],
      screenType: 'color',
      screenSrc: '#a855f7',
      screenLabel: 'VIP',
    },
  ],
};

class ScrollStory extends HTMLElement {
  connectedCallback() {
    const scriptTag = this.querySelector('script[type="application/json"]');
    const d = scriptTag ? { ...SCROLL_STORY_DEFAULTS, ...JSON.parse(scriptTag.textContent) } : SCROLL_STORY_DEFAULTS;

    const articlesHTML = (d.sections || []).map((sec, idx) => {
      const cardsHTML = (sec.cards || []).map(c => {
        const metricOrIcon = c.useIcon
          ? `<p class="card-icon">&#9889;</p>`
          : c.metric ? `<p class="card-metric">${c.metric}</p>` : '';
        return `
<article class="card${c.fullWidth ? ' card-full' : ''}">
  <h4 class="card-title">${c.title}</h4>
  ${c.tags ? `<p class="card-tags">${c.tags}</p>` : ''}
  ${metricOrIcon}
  <p class="card-desc">${c.description}</p>
</article>`;
      }).join('');

      // Group non-fullWidth cards in a grid, fullWidth cards standalone
      const gridCards = (sec.cards || []).filter(c => !c.fullWidth);
      const fullCards = (sec.cards || []).filter(c => c.fullWidth);
      const gridHTML = gridCards.length > 0 ? `<div class="cards-grid">${
        gridCards.map(c => {
          const metricOrIcon = c.useIcon
            ? `<p class="card-icon">&#9889;</p>`
            : c.metric ? `<p class="card-metric">${c.metric}</p>` : '';
          return `<article class="card"><h4 class="card-title">${c.title}</h4>${c.tags ? `<p class="card-tags">${c.tags}</p>` : ''}${metricOrIcon}<p class="card-desc">${c.description}</p></article>`;
        }).join('')
      }</div>` : '';
      const fullHTML = fullCards.map(c => {
        const metricOrIcon = c.useIcon
          ? `<p class="card-icon">&#9889;</p>`
          : c.metric ? `<p class="card-metric">${c.metric}</p>` : '';
        return `<article class="card card-full"><h4 class="card-title">${c.title}</h4>${c.tags ? `<p class="card-tags">${c.tags}</p>` : ''}${metricOrIcon}<p class="card-desc">${c.description}</p></article>`;
      }).join('');

      return `
<article class="fuze-presentation__article" id="${sec.id}" data-section="${idx}">
  <div class="content">
    <p class="label">${sec.label}</p>
    <h3 class="fp-heading">${sec.heading}</h3>
    <p class="description">${sec.description}</p>
    ${gridHTML}${fullHTML}
    <a href="${sec.ctaHref}" class="btn-primary">${sec.ctaLabel}</a>
  </div>
</article>`;
    }).join('');

    const screensHTML = (d.sections || []).map((sec, idx) => {
      if (sec.screenType === 'video') {
        return `<div class="phone-screen" data-screen="${idx}">
  <video class="phone-video" src="${sec.screenSrc}" autoplay loop muted playsinline></video>
</div>`;
      }
      return `<div class="phone-screen" data-screen="${idx}" style="background:${sec.screenSrc}; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:13px; letter-spacing:0.08em; text-transform:uppercase;">${sec.screenLabel || ''}</div>`;
    }).join('');

    this.innerHTML = `
<section class="fuze-presentation">
  <div class="fuze-presentation__articles">${articlesHTML}</div>
  <div class="phone-track" aria-hidden="true">
    <div class="phone">
      <div class="phone-screens">${screensHTML}</div>
    </div>
  </div>
</section>`;

    this._initScrollSync();
  }

  _initScrollSync() {
    // Requires GSAP ScrollTrigger to be loaded on the page
    if (typeof ScrollTrigger === 'undefined') return;

    const articles = this.querySelectorAll('.fuze-presentation__article');
    const screens  = this.querySelectorAll('.phone-screen');

    const showScreen = (index) => {
      screens.forEach((s, i) => s.classList.toggle('is-active', i === index));
    };

    showScreen(0);

    articles.forEach((article, index) => {
      ScrollTrigger.create({
        trigger: article,
        start: 'top center',
        end: 'bottom center',
        onEnter:     () => showScreen(index),
        onEnterBack: () => showScreen(index),
      });
    });
  }
}

customElements.define('scroll-story', ScrollStory);
