/**
 * Web Components registry
 * Import this single file to register all components on a page.
 *
 * Usage in Hugo templates:
 *   <script type="module" src="/web-components/components/index.js"></script>
 *
 * Or import individual groups as needed:
 *   import '/web-components/components/global/site-nav.js';
 *   import '/web-components/components/global/site-footer.js';
 *
 * Component reuse summary:
 *   ALL PAGES  — site-nav, site-footer, page-closer, hero-section
 *   2+ PAGES   — statement-section (default+fuze), trust-section (default+counters),
 *                metric-pill (homepage hero + fuze big-idea), stat-count (both trust variants)
 *   HOMEPAGE   — page-subbar, video-section, pillars-section, capability-list,
 *                delivery-section, logo-scroller
 *   FUZE PAGE  — scroll-story
 *   CONTENT    — logos-grid, releases-grid, feature-banner, media-showcase,
 *                product-roadmap, geo-presence, licensing-grid
 */

// ─── Global ──────────────────────────────────────────────────────────────────
import './global/site-nav.js';
import './global/site-footer.js';
import './global/page-closer.js';

// ─── Atomic ───────────────────────────────────────────────────────────────────
import './atomic/metric-pill.js';
import './atomic/feature-card.js';
import './atomic/stat-count.js';
import './atomic/logo-badge.js';
import './atomic/media-card.js';
import './atomic/quote-block.js';
import './atomic/geo-country.js';

// ─── Sections ─────────────────────────────────────────────────────────────────
import './sections/hero-section.js';
import './sections/page-subbar.js';
import './sections/statement-section.js';
import './sections/video-section.js';
import './sections/pillars-section.js';
import './sections/capability-list.js';
import './sections/delivery-section.js';
import './sections/trust-section.js';
import './sections/logo-scroller.js';
import './sections/scroll-story.js';
import './sections/logos-grid.js';
import './sections/releases-grid.js';
import './sections/feature-banner.js';
import './sections/media-showcase.js';
import './sections/product-roadmap.js';
import './sections/geo-presence.js';
import './sections/licensing-grid.js';
