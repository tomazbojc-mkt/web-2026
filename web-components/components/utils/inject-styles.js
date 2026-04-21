/**
 * inject-styles(id, css)
 *
 * Injects a component's CSS string into <head> exactly once per component tag.
 * Call from connectedCallback when a component wants to self-contain its styles
 * rather than relying on the barrel web-components/css/components/styles/index.css.
 *
 * Forward-compatible: swap the body to use CSSStyleSheet + adoptedStyleSheets
 * when migrating to shadow DOM — the call-sites (components) don't change.
 *
 * Usage inside a component file:
 *   import { injectStyles } from '../utils/inject-styles.js';
 *
 *   const CSS = `
 *     .my-thing { color: red; }
 *   `;
 *
 *   class MyThing extends HTMLElement {
 *     connectedCallback() {
 *       injectStyles('my-thing', CSS);
 *       this.innerHTML = `<div class="my-thing">Hello</div>`;
 *     }
 *   }
 */

const injected = new Set();

export function injectStyles(id, css) {
  if (injected.has(id)) return;
  injected.add(id);
  const el = document.createElement('style');
  el.dataset.component = id;
  el.textContent = css;
  document.head.appendChild(el);
}
