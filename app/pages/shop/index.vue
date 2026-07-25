<template>
  <!--Body Content-->
  <div id="page-content">
    <CollectionBanner :image="bannerImage" :title="bannerTitle" />

    <div class="container">
      <div class="row">
        <Sidebar />
        <MainContent
          :products="displayedProducts"
          :view="view"
          :sort-by="sortBy"
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

const bannerTitle = computed(() => activeCategory.value?.label ?? "Shop All Products");
const bannerImage = computed(
  () => activeCategory.value?.tileImage ?? "/images/collection/collection-page1.jpg"
);

// reset pagination whenever the category filter changes
watch(
  () => route.query.category,
  () => {
    page.value = 1;
  }
);

const filteredProducts = computed(() =>
  getProductsByCategory(route.query.category)
);

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
