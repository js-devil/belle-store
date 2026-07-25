// Client-only (see filename suffix): hydrates our useState-backed cart/wishlist/currency/
// recently-viewed state from localStorage on load, then keeps localStorage in sync.
// Never runs during SSR, so useState defaults stay identical on server and client.
export default defineNuxtPlugin(() => {
  const persisted = [
    { key: "belle-cart", state: useState("cart-items", () => []) },
    { key: "belle-wishlist", state: useState("wishlist-ids", () => []) },
    { key: "belle-currency", state: useState("currency-country", () => "NG") },
    {
      key: "belle-recently-viewed",
      state: useState("recently-viewed-slugs", () => []),
    },
  ];

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
