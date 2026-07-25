<template>
  <div id="page-content">
    <HeroSlideshow />

    <ProductTabsSlider
      :new-arrivals="newArrivals"
      :best-sellers="bestSellers"
      :on-sale="onSale"
      @add-to-cart="handleAddToCart"
      @add-wishlist="handleWishlist"
    />

    <CategoryShowcase :categories="categories" />

    <BrandSlider />

    <FeaturedProductGrid
      :products="featuredProducts"
      @add-to-cart="handleAddToCart"
      @add-wishlist="handleWishlist"
    />

    <StoreFeatureBar />
  </div>
</template>

<script setup>
import { categories } from "@/data/categories.js";
import { products } from "@/data/index.js";

definePageMeta({ pageBodyClass: "template-index template-index-belle" });

const { addToCart } = useCart();
const { toggle: toggleWishlist } = useWishlist();

const newArrivals = computed(() =>
  products.filter((p) => p.labels.some((l) => l.class === "pr-label1")).slice(0, 8)
);
const bestSellers = computed(() =>
  [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8)
);
const onSale = computed(() =>
  products.filter((p) => p.compareAtPriceUsd).slice(0, 8)
);
const featuredProducts = computed(() =>
  [...products].sort((a, b) => b.rating - a.rating).slice(0, 8)
);

function handleAddToCart(product) {
  addToCart(product);
}

function handleWishlist(product) {
  toggleWishlist(product.slug);
}
</script>
