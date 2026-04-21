# GSAP Parallax Setup

This project uses a shared GSAP parallax helper from `js/parallax.js`.

The helper is attribute-driven:

- `data-parallax-speed` controls how much an element moves
- `data-parallax-trigger` optionally lets a parent container control the timing

The default behavior is:

- each element starts in its authored position on initial page load
- parallax begins when that element enters the viewport
- the movement is scrubbed to scroll progress with GSAP `ScrollTrigger`
- reduced-motion users do not get parallax

---

## 1. Required scripts

Load scripts in this order at the bottom of the page:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script src="../js/gsap-setup.js"></script>
<script src="../js/parallax.js"></script>
```

Notes:

- GSAP and `ScrollTrigger` must load before `gsap-setup.js`
- `gsap-setup.js` must load before `parallax.js`
- `parallax.js` auto-initializes itself
- `SplitText` is not required for parallax-only pages

If the page is not one directory below the site root, adjust the relative `../js/...` path accordingly.

---

## 2. Basic markup

Add `data-parallax-speed` to any element that should move.

```html
<img src="img/logo.svg" alt="Logo" data-parallax-speed="-10">
```

That is enough for the default behavior.

---

## 3. How speed values work

`data-parallax-speed` accepts positive and negative numbers.

- positive value: element drifts down and feels slower than page scroll
- negative value: element moves up faster than the page
- `0`: no parallax

Examples:

```html
<div data-parallax-speed="5"></div>
<div data-parallax-speed="20"></div>
<div data-parallax-speed="-10"></div>
<div data-parallax-speed="-40"></div>
```

Practical guidance:

- `1` to `5`: subtle motion
- `10` to `25`: noticeable motion
- `30+`: strong motion
- very large values like `100` or `1000` usually indicate the shared multiplier should be retuned instead

---

## 4. Default trigger behavior

By default, each element uses itself as the scroll trigger.

That means:

- the element starts at its normal position on load
- parallax begins when the element enters the viewport
- parallax ends when the element leaves the viewport

This is the preferred behavior for most pages because each item feels responsive as soon as it appears.

---

## 5. Container-triggered timing

If you want a parent container to control the timing, add `data-parallax-trigger` to that parent.

```html
<section class="hero" data-parallax-trigger>
  <img src="img/logo.svg" alt="Logo" data-parallax-speed="-10">
  <img src="img/clouds.png" alt="" data-parallax-speed="20">
</section>
```

With this setup:

- the children still move individually
- but the parent section controls when the animation starts and ends

Use `data-parallax-trigger` when:

- several elements should share one scroll timing window
- a small element should feel tied to a larger hero block
- you want less jumpy timing for tiny objects

---

## 6. Recommended page patterns

### Pattern A: Independent elements

Use this when each decorative element should react when it enters the viewport.

```html
<div class="feature-card">
  <img src="img/orb.png" alt="" data-parallax-speed="8">
  <h2>Feature title</h2>
</div>
```

### Pattern B: Shared hero timing

Use this when hero artwork should all be driven by the same section.

```html
<header class="hero" data-parallax-trigger>
  <div class="hero__clouds" data-parallax-speed="20"></div>
  <img class="hero__logo" src="img/logo.svg" alt="Brand logo" data-parallax-speed="-10">
  <img class="hero__character" src="img/character.png" alt="" data-parallax-speed="6">
</header>
```

### Pattern C: Mixed content section

Use this when only a few accents in a content block should move.

```html
<section class="story-block">
  <div class="story-block__accent" data-parallax-speed="12"></div>
  <h2>Section title</h2>
  <p>Body copy...</p>
</section>
```

---

## 7. Tuning the global behavior

The shared helper lives in `js/parallax.js`.

Important defaults:

- `distanceMultiplier = 18`
- `scrub = 1.2`

What they do:

- `distanceMultiplier`: multiplies every `data-parallax-speed` value
- `scrub`: controls how tightly movement follows scroll

If authors consistently need very large numbers in markup, raise `distanceMultiplier`.

Examples:

- `18`: conservative
- `30`: stronger
- `40+`: more dramatic

If movement feels too delayed or too floaty, adjust `scrub`.

- lower scrub: tighter response
- higher scrub: smoother, softer response

---

## 8. Initial load behavior

The helper is designed so elements do not render pre-shifted on page load.

Expected behavior:

- authored layout is visible first
- parallax starts only after scroll progress begins

If an element still feels wrong on load, first check:

- whether it has a very large speed value
- whether a parent `data-parallax-trigger` is making the scroll range too broad
- whether CSS already applies a transform to the same element

If CSS already uses `transform` on the same node, prefer moving parallax to an inner wrapper.

---

## 9. CSS guidance

Parallax works best when the animated element can safely receive a GSAP `y` transform.

Recommended:

```css
.parallax-item {
  will-change: transform;
}
```

Avoid stacking multiple unrelated transforms on the exact same element in CSS and JS.

Prefer this structure when needed:

```html
<div class="hero__logo-shell">
  <img class="hero__logo" src="img/logo.svg" alt="Logo" data-parallax-speed="-10">
</div>
```

---

## 10. Accessibility

The helper automatically disables parallax for users with:

```css
prefers-reduced-motion: reduce
```

Do not add alternate forced animation logic on top of that.

---

## 11. Troubleshooting

### Element does not move

Check:

- GSAP and ScrollTrigger are loaded
- `gsap-setup.js` loads before `parallax.js`
- the element has a non-zero `data-parallax-speed`
- no JavaScript error earlier in the page stopped execution

### Element moves in the wrong direction

Check the sign of `data-parallax-speed`:

- positive = down
- negative = up

### Element starts moving too late

That usually means a parent trigger is controlling timing.

Check whether the element is inside a `data-parallax-trigger` container.

### Element is already shifted on load

Check:

- whether the element has a very large speed value
- whether CSS already applies a transform
- whether the chosen trigger container is too large

### Values feel too large everywhere

Raise the shared `distanceMultiplier` in `js/parallax.js` instead of putting huge numbers in HTML.

---

## 12. WSG example

Current WSG usage pattern:

```html
<header class="studio-page__hero">
  <div class="studio-page__layer" data-parallax-speed="20"></div>
  <img class="studio-page__brand" src="img/WSGLogo.svg" alt="Wild Streak Gaming logo" data-parallax-speed="-10">
</header>
```

This gives:

- clouds and backgrounds drifting downward
- the logo moving upward faster than page scroll

---

## 13. Rule of thumb

Use element-level triggers by default.

Only add `data-parallax-trigger` when multiple items need to share one common scroll window.