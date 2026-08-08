export function useWishlist() {
  const ids = useState("wishlist-ids", () => []);
  const { showToast } = useToast();

  function has(slug) {
    return ids.value.includes(slug);
  }

  function toggle(slug) {
    if (has(slug)) {
      remove(slug);
    } else {
      ids.value.push(slug);
      showToast("Added to wishlist");
    }
  }

  function remove(slug) {
    ids.value = ids.value.filter((id) => id !== slug);
  }

  return { ids, has, toggle, remove };
}
