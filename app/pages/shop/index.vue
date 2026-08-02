<template>
  <!--Body Content-->
  <div id="page-content">
    <CollectionBanner :image="bannerImage" :title="bannerTitle" />

    <div ref="contentEl" class="container">
      <div class="row">
        <Sidebar />
        <MainContent
          :products="displayedProducts"
          :view="view"
          :sort-by="sortBy"
          :has-more="displayedProducts.length < sortedProducts.length"
          @toggle-filter="toggleFilter"
          @update:view="view = $event"
          @update:sort="sortBy = $event"
          @add-to-cart="handleAddToCart"
          @add-wishlist="handleWishlist"
          @load-more="loadMore"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCategoryBySlug } from "@/data/categories.js";
import { getProductsByCategory } from "@/data/index.js";

const route = useRoute();
const { addToCart } = useCart();
const { toggle: toggleWishlist } = useWishlist();

const view = ref("grid");
const sortBy = ref("manual");
const page = ref(1);
const pageSize = 12;

const activeCategory = computed(() =>
  typeof route.query.category === "string"
    ? getCategoryBySlug(route.query.category)
    : null
);

const subcategoryLabel = {
  male: "Men's",
  female: "Women's",
  sneakers: "Sneakers",
}[route.query.subcategory];

const searchQuery = computed(() =>
  typeof route.query.search === "string" ? route.query.search.trim() : ""
);

const bannerTitle = computed(() => {
  if (searchQuery.value) return `Search results for "${searchQuery.value}"`;
  if (subcategoryLabel) return `${subcategoryLabel} Shoes`;
  return activeCategory.value?.label ?? "Shop All Products";
});
const bannerImage = computed(
  () => activeCategory.value?.tileImage ?? "/images/collection/collection-page1.jpg"
);

// reset pagination whenever the category/subcategory/search filter changes
watch(
  () => [route.query.category, route.query.subcategory, route.query.search],
  () => {
    page.value = 1;
  }
);

// Clicking a category in the nav lands on this page scrolled to the top
// (the hero banner), leaving the actual product grid a scroll away - jump
// straight to the grid whenever a category is present, both on first
// arrival (nav link navigates here fresh) and when switching categories
// without leaving the page (e.g. the sidebar's own category links).
const contentEl = ref(null);
function scrollToContent() {
  contentEl.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}
onMounted(() => {
  if (route.query.category) scrollToContent();
});
watch(() => route.query.category, (category, previous) => {
  if (category && category !== previous) scrollToContent();
});

const filteredProducts = computed(() => {
  const byCategory = getProductsByCategory(route.query.category, route.query.subcategory);
  if (!searchQuery.value) return byCategory;
  const needle = searchQuery.value.toLowerCase();
  return byCategory.filter(
    (product) =>
      product.title.toLowerCase().includes(needle) ||
      product.brand.toLowerCase().includes(needle) ||
      product.category.toLowerCase().includes(needle)
  );
});

const sortedProducts = computed(() => {
  const list = [...filteredProducts.value];
  switch (sortBy.value) {
    case "title-ascending":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "title-descending":
      return list.sort((a, b) => b.title.localeCompare(a.title));
    case "price-ascending":
      return list.sort((a, b) => a.priceUsd - b.priceUsd);
    case "price-descending":
      return list.sort((a, b) => b.priceUsd - a.priceUsd);
    case "best-selling":
      return list.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return list;
  }
});

const displayedProducts = computed(() =>
  sortedProducts.value.slice(0, page.value * pageSize)
);

function toggleFilter() {
  document.querySelector(".filterbar")?.classList.toggle("filterOpen");
}

function loadMore() {
  page.value++;
}

function handleAddToCart(product) {
  addToCart(product);
}

function handleWishlist(product) {
  toggleWishlist(product.slug);
}
</script>
