<template>
  <div class="col-12 col-sm-12 col-md-9 col-lg-9 main-col">
    <div class="productList">
      <button
        type="button"
        class="btn btn-filter d-block d-md-none d-lg-none"
        @click="$emit('toggle-filter')"
      >
        Product Filters
      </button>
      <Toolbar
        :view="view"
        :product-count="products.length"
        :sort-by="sortBy"
        @update:view="$emit('update:view', $event)"
        @update:sort="$emit('update:sort', $event)"
      />
      <ProductGrid
        :products="products"
        @add-to-cart="$emit('add-to-cart', $event)"
        @add-wishlist="$emit('add-wishlist', $event)"
      />
      <LoadMoreButton :has-more="hasMore" @load-more="$emit('load-more')" />
    </div>
  </div>
</template>

<script setup>
// import Toolbar from "./ui/Toolbar.vue";
// import ProductGrid from "./ui/ProductGrid.vue";
// import LoadMoreButton from "./ui/LoadMoreButton.vue";

defineProps({
  products: { type: Array, required: true },
  view: { type: String, default: "grid" },
  sortBy: { type: String, default: "manual" },
  hasMore: { type: Boolean, default: true },
});
defineEmits([
  "toggle-filter",
  "update:view",
  "update:sort",
  "add-to-cart",
  "add-wishlist",
  "load-more",
]);
</script>
