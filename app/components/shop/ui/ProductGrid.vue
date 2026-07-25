<template>
  <div class="grid-products grid--view-items">
    <div class="row">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add-to-cart="$emit('add-to-cart', $event)"
        @add-wishlist="$emit('add-wishlist', $event)"
      />
    </div>
  </div>
</template>

<script setup>
// import ProductCard from "./ProductCard.vue";

defineProps({
  products: { type: Array, required: true },
});
defineEmits(["add-to-cart", "add-wishlist"]);
</script>
