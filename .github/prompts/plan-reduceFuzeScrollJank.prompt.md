## Plan: Reduce Fuze Scroll Jank

Recommended approach: treat this as a layered performance problem, not a single CSS fix. The first pass should remove the highest-cost global behaviors (global force3D, broad will-change, duplicate smooth scrolling, expensive fixed blur) before changing the phone architecture. The sticky phone should only be reworked if those cheaper fixes do not bring scroll back to 60fps, because sticky by itself is not automatically wrong here.

**Steps**
1. Establish a baseline on fuze.html using browser profiling before changing behavior. Measure FPS/frame time while scrolling through the Fuze presentation section, and capture a layer/paint profile around the sticky phone and fixed nav. This is the reference for all follow-up validation.
2. Phase 1: remove global compositing pressure. Update /Users/tomaz.bojc/Documents/sandbox/web-2026/js/gsap-setup.js so GSAP does not force GPU compositing for every animation by default. Keep force3D only on animations that actually benefit from it. This blocks step 4 because it changes the phone transition behavior too.
3. Phase 1: narrow will-change usage. Remove persistent will-change declarations from /Users/tomaz.bojc/Documents/sandbox/web-2026/fuze/phone.scss, /Users/tomaz.bojc/Documents/sandbox/web-2026/css/styles.css, and /Users/tomaz.bojc/Documents/sandbox/web-2026/web-components/css/components/styles/shared.css. Reapply will-change transiently in JS only immediately before phone screen transitions or other active transforms, then clear it after the animation completes. This can run in parallel with step 4.
4. Phase 1: eliminate smooth-scroll conflicts. Decide on a single smooth-scroll mechanism. Remove either the global CSS smooth scrolling in /Users/tomaz.bojc/Documents/sandbox/web-2026/css/styles.css or the JS scrollIntoView smooth behavior in /Users/tomaz.bojc/Documents/sandbox/web-2026/js/interactions.js so scroll momentum is not being decorated twice. Also optimize the button flair handler to stop calling getBoundingClientRect on every mousemove, since that can introduce avoidable main-thread work during active interaction.
5. Phase 1: reduce fixed-layer paint cost. Simplify the nav treatment in /Users/tomaz.bojc/Documents/sandbox/web-2026/css/navigation.css by reducing or conditionally applying backdrop-filter and reviewing the heavy nav shadow once scrolled. This can run in parallel with steps 3 and 4.
6. Phase 2: tune the phone section without redesigning it yet. Keep the current sticky layout in /Users/tomaz.bojc/Documents/sandbox/web-2026/fuze/phone.scss and /Users/tomaz.bojc/Documents/sandbox/web-2026/js/fuze.js, but reduce nested compositing and transition pressure: remove translateZ(0) unless profiling proves it helps, keep only the active screen animating, and ensure screen/background transitions do not leave stale promoted layers behind. This depends on steps 2 and 3.
7. Phase 2: reduce ScrollTrigger overhead in /Users/tomaz.bojc/Documents/sandbox/web-2026/js/animations.js, /Users/tomaz.bojc/Documents/sandbox/web-2026/js/fuze.js, and /Users/tomaz.bojc/Documents/sandbox/web-2026/js/nav.js. Consolidate redundant scroll listeners, review whether each individual trigger is needed, and prefer grouped/batched triggers where behavior stays the same. This can start after the baseline from step 1 and should be validated after step 6.
8. Phase 3: only if jank remains, change the phone architecture. Replace sticky positioning with a simpler desktop-only structure such as a non-sticky static preview, or a JS-managed pinned/fixed visual that avoids sticky plus nested transform interactions. This is intentionally deferred because it changes layout behavior and is a higher-risk intervention. It depends on steps 2 through 7 being insufficient.
9. Re-profile after each phase and compare against the baseline. Stop once the page scrolls smoothly enough on the target browsers instead of continuing to stack speculative optimizations.

**Relevant files**
- /Users/tomaz.bojc/Documents/sandbox/web-2026/fuze.html — page entry point; confirms the Fuze presentation layout and which scripts/styles load on this page
- /Users/tomaz.bojc/Documents/sandbox/web-2026/js/gsap-setup.js — global GSAP plugin registration and current force3D defaults
- /Users/tomaz.bojc/Documents/sandbox/web-2026/js/fuze.js — phone screen switching logic and per-article ScrollTrigger setup
- /Users/tomaz.bojc/Documents/sandbox/web-2026/js/animations.js — page-wide fade, SplitText, parallax, and scroll-triggered animation setup
- /Users/tomaz.bojc/Documents/sandbox/web-2026/js/interactions.js — anchor smooth scrolling and button flair mousemove work
- /Users/tomaz.bojc/Documents/sandbox/web-2026/js/nav.js — nav scroll listeners and hide/show behavior
- /Users/tomaz.bojc/Documents/sandbox/web-2026/fuze/phone.scss — sticky phone wrapper, nested screen layers, and will-change usage
- /Users/tomaz.bojc/Documents/sandbox/web-2026/css/navigation.css — fixed nav with backdrop-filter and scrolled shadow
- /Users/tomaz.bojc/Documents/sandbox/web-2026/css/styles.css — global scroll-behavior, generic fade-up will-change, and extra blur-heavy effects
- /Users/tomaz.bojc/Documents/sandbox/web-2026/web-components/css/components/styles/shared.css — shared animation utility classes that currently keep elements promoted

**Verification**
1. Record a performance trace in Chrome or Safari while scrolling through the Fuze presentation section before any code changes. Verify whether dropped frames cluster around nav blur repainting, sticky phone updates, or ScrollTrigger callbacks.
2. After Phase 1, confirm fewer composited layers and lower paint time in the Rendering/Layers tools, especially for the nav and phone subtree.
3. After Phase 2, verify the phone still swaps screens correctly for each article and that no stale screen remains visible after reverse scrolling.
4. Regression-check anchor navigation, button hover flair, nav hide/show, and any entrance animations on the same page.
5. Test on macOS Safari and Chrome at minimum, because sticky plus transform and backdrop-filter costs differ materially between engines.

**Decisions**
- Included: performance review and a remediation plan focused on fuze.html scroll smoothness.
- Excluded for now: a full visual redesign of the Fuze presentation or removal of GSAP entirely.
- Recommendation: do not add more persistent will-change as a first fix. In this codebase it is already overused and is more likely to increase layer pressure than solve the jank.
- Recommendation: do not assume the sticky phone is the root cause until the cheaper global fixes are tested; it is likely an amplifier rather than the sole problem.

**Further Considerations**
1. If the target audience is primarily Safari users, prioritize nav blur reduction and sticky/transform cleanup before deeper ScrollTrigger refactors.
2. If the page must keep the current exact desktop behavior, prefer transient layer promotion and trigger consolidation over replacing the sticky phone outright.
3. If profiling shows the initial page load is also slow, defer non-critical SplitText work in /Users/tomaz.bojc/Documents/sandbox/web-2026/js/animations.js until after first paint.
