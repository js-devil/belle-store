// Client-only (see filename suffix): hydrates our useState-backed cart/wishlist/currency/
// recently-viewed state from localStorage, then keeps localStorage in sync.
//
// The read from localStorage must happen AFTER Vue's first client render is
// hydrated against the server-rendered HTML, not before. Nuxt plugins run
// before the app mounts, so reading localStorage here directly (as this used
// to) meant a returning visitor's client-side first render already reflected
// their saved cart/wishlist/recently-viewed items while the server-rendered
// HTML was always empty - a guaranteed "Hydration completed but contains
// mismatches" warning for any component depending on this state. Deferring
// the read to the app:mounted hook (fires once hydration is done) fixes it.
export default defineNuxtPlugin((nuxtApp) => {
  const persisted = [
    { key: "belle-cart", state: useState("cart-items", () => []) },
    { key: "belle-wishlist", state: useState("wishlist-ids", () => []) },
    { key: "belle-currency", state: useState("currency-country", () => "NG") },
    {
      key: "belle-recently-viewed",
      state: useState("recently-viewed-slugs", () => []),
    },
    { key: "belle-account", state: useState("account", () => null) },
  ];

  nuxtApp.hook("app:mounted", () => {
    for (const { key, state } of persisted) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          state.value = JSON.parse(raw);
        } catch {
          // ignore malformed persisted state
        }
      }
      watch(
        state,
        (value) => localStorage.setItem(key, JSON.stringify(value)),
        { deep: true }
      );
    }
  });
});
