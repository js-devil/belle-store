<template>
  <div class="product-rows section">
    <div class="container">
      <div class="section-header text-center">
        <h2 class="h2">Featured Products</h2>
        <p>A curated pick from across our categories</p>
      </div>
      <div class="grid-products">
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
    </div>
  </div>
</template>

<script setup>
defineProps({
  products: { type: Array, required: true },
});
defineEmits(["add-to-cart", "add-wishlist"]);
</script>
