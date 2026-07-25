<template>
  <div id="page-content">
    <div class="page section-header text-center">
      <div class="page-title">
        <div class="wrapper"><h1 class="page-width">Wish List</h1></div>
      </div>
    </div>
    <div class="container">
      <WishlistTable
        :items="wishlistProducts"
        @remove="remove"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </div>
</template>

<script setup>
import { getProductBySlug } from "@/data/index.js";

const { ids, remove } = useWishlist();
const { addToCart } = useCart();

const wishlistProducts = computed(() =>
  ids.value.map((slug) => getProductBySlug(slug)).filter(Boolean)
);

function handleAddToCart(product) {
  addToCart(product);
}
</script>
