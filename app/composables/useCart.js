function lineKey(productId, size, color) {
  return `${productId}::${size ?? ""}::${color ?? ""}`;
}

export function useCart() {
  const items = useState("cart-items", () => []);

  function addToCart(product, { qty = 1, size = null, color = null } = {}) {
    const key = lineKey(product.id, size, color);
    const existing = items.value.find((item) => item.key === key);
    if (existing) {
      existing.qty += qty;
      return;
    }
    items.value.push({
      key,
      productId: product.id,
      slug: product.slug,
      name: product.title,
      image: product.images.primary,
      unitPriceUsd: product.priceUsd,
      qty,
      size,
      color,
    });
  }

  function removeFromCart(key) {
    items.value = items.value.filter((item) => item.key !== key);
  }

  function updateQty(key, qty) {
    const item = items.value.find((item) => item.key === key);
    if (!item) return;
    if (qty <= 0) {
      removeFromCart(key);
      return;
    }
    item.qty = qty;
  }

  function clearCart() {
    items.value = [];
  }

  const itemCount = computed(() =>
    items.value.reduce((total, item) => total + item.qty, 0)
  );

  const subtotalUsd = computed(() =>
    items.value.reduce((total, item) => total + item.unitPriceUsd * item.qty, 0)
  );

  return {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    itemCount,
    subtotalUsd,
  };
}
