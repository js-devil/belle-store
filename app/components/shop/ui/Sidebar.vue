<template>
  <div class="col-12 col-sm-12 col-md-3 col-lg-3 sidebar filterbar">
    <div class="closeFilter d-block d-md-none d-lg-none">
      <i class="icon icon anm anm-times-l"></i>
    </div>
    <div class="sidebar_tags" style="padding-top: 16px">
      <CategoryWidget :categories="categories" />
      <PriceFilterWidget />
      <SizeSwatches v-if="sizes.length" :sizes="sizes" />
      <ColorSwatches v-if="colors.length" :colors="colors" />
      <BrandsWidget v-if="brands.length" :brands="brands" />
      <PopularProducts :products="popularProducts" />
      <InformationWidget />
      <ProductTagsWidget v-if="tags.length" :tags="tags" />
    </div>
  </div>
</template>

<script setup>
import { categories as allCategories } from "@/data/categories.js";
import { getProductsByCategory, products } from "@/data/index.js";

const categories = allCategories.map((category) => ({
  name: category.label,
  slug: category.slug,
}));

const route = useRoute();

// Scope the size/color/brand/tag filters to whatever category is currently
// selected, so we never show filters (e.g. shoe sizes) that don't apply to
// the products actually on screen.
const scopedProducts = computed(() =>
  getProductsByCategory(route.query.category, route.query.subcategory),
);

const sizes = computed(() => [
  ...new Set(scopedProducts.value.flatMap((product) => product.sizes ?? [])),
]);
const colors = computed(() => [
  ...new Set(
    scopedProducts.value.flatMap(
      (product) => product.colors?.map((color) => color.name) ?? [],
    ),
  ),
]);
const brands = computed(() => [
  ...new Set(scopedProducts.value.map((product) => product.brand)),
]);
const tags = computed(() => [
  ...new Set(scopedProducts.value.map((product) => product.category)),
]);

const popularProducts = [...products]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 4)
  .map((product) => ({
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.priceUsd,
    image: product.images.primary,
  }));
</script>

<style scoped>
/* Keep the sidebar in view while scrolling the product grid, but only where
   it renders inline (desktop) - the same class also drives the mobile
   off-canvas filter drawer, which must stay position:fixed via its own rules. */
@media (min-width: 768px) {
  .sidebar.filterbar {
    position: sticky;
    top: 20px;
    align-self: flex-start;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
  }
}
</style>
