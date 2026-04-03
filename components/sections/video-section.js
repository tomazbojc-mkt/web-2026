/**
 * <video-section>
 * Full-width video placeholder with a centered play icon and label.
 * Reused across: index.html only.
 *
 * Attributes:
 *   label    — descriptive text below play icon
 *   video-id — id for the video container element (default: "videoPlaceholder")
 *
 * CMS (Strapi): VideoBlock component
 *   fields: label, videoUrl (future), posterImage (future)
 *
 * GSAP: scale scrub animation on #videoPlaceholder (0.85 → 1) handled by main.js.
 *       The component renders with id="videoPlaceholder" so GSAP can find it.
 */
class VideoSection extends HTMLElement {
  connectedCallback() {
    const label   = this.getAttribute('label')    || 'see bragg in action';
    const videoId = this.getAttribute('video-id') || 'videoPlaceholder';

    this.innerHTML = `
<section class="video-section">
  <div class="video-container" id="${videoId}">
    <div class="video-inner">
      <div class="video-play-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="31" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
          <path d="M26 20L46 32L26 44V20Z" fill="rgba(255,255,255,0.8)"/>
        </svg>
      </div>
      <p class="video-label">${label}</p>
    </div>
  </div>
</section>`;
  }
}

customElements.define('video-section', VideoSection);
