// Shared GSAP parallax helper for standalone page sections.
// Usage:
//   1. Mark a container with [data-parallax-section]
//   2. Mark moving elements with [data-parallax-speed="N"]
//      - positive: drifts down / lags behind the page
//      - negative: moves up faster than the page
//      - optional: add [data-parallax-trigger] to a parent to drive timing from a container
//   3. Load this file after gsap-setup.js, or call window.initGsapParallax()

const initialParallaxScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

window.initGsapParallax = function initGsapParallax(options = {}) {
  const {
    selector = '[data-parallax-speed]',
    distanceMultiplier = 18,
    scrub = 1.2,
  } = options;

  const parallaxItems = Array.from(document.querySelectorAll(selector));

  if (!parallaxItems.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const getScrollRange = (trigger) => {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const rect = trigger.getBoundingClientRect();
    const top = rect.top + currentScrollY;
    const bottom = rect.bottom + currentScrollY;

    return {
      start: Math.max(top - window.innerHeight, initialParallaxScrollY),
      end: bottom,
    };
  };

  parallaxItems.forEach((element) => {
    if (element.dataset.parallaxInitialized === 'true') {
      return;
    }

    const speed = Number(element.dataset.parallaxSpeed || 0);

    if (!Number.isFinite(speed) || speed === 0) {
      return;
    }

    const distance = speed * distanceMultiplier;
    const trigger = element.closest('[data-parallax-trigger]') || element;

    gsap.to(element, {
      y: distance,
      ease: 'none',
      immediateRender: false,
      scrollTrigger: {
        trigger,
        start: () => getScrollRange(trigger).start,
        end: () => getScrollRange(trigger).end,
        scrub,
        invalidateOnRefresh: true,
      },
    });

    element.dataset.parallaxInitialized = 'true';
  });
};

window.initGsapParallax();