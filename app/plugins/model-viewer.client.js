// Registers the <model-viewer> custom element. Client-only: it's a browser
// Web Component (uses the customElements registry + WebGL), not SSR-safe.
//
// The import must happen INSIDE the plugin function, not as a bare top-level
// `import "@google/model-viewer"` - a side-effect-only top-level import looks
// unused to Vite/Rollup's tree-shaking and gets dropped entirely (this plugin
// was silently compiling down to `export default () => {}`, so the custom
// element never registered and <model-viewer> rendered as an empty, inert tag).
export default defineNuxtPlugin(() => {
  import("@google/model-viewer");
});
