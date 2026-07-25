const MAX_RECENTLY_VIEWED = 8;

export function useRecentlyViewed() {
  const slugs = useState("recently-viewed-slugs", () => []);

  function markViewed(slug) {
    slugs.value = [slug, ...slugs.value.filter((s) => s !== slug)].slice(
      0,
      MAX_RECENTLY_VIEWED
    );
  }

  return { slugs, markViewed };
}
