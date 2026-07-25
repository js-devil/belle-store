<template>
  <div class="tab-slider-product section">
    <div class="container">
      <div class="section-header text-center">
        <h2 class="h2">Shop by Highlight</h2>
        <p>A quick look at what's new, popular, and on sale right now</p>
      </div>
      <div class="tabs-listing">
        <ul class="tabs clearfix">
          <li
            v-for="tab in tabs"
            :key="tab.key"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </li>
        </ul>
        <div class="tab_container">
          <div class="tab_content grid-products" style="display: block">
            <div class="row">
              <ProductCard
                v-for="product in activeProducts"
                :key="product.id"
                :product="product"
                @add-to-cart="$emit('add-to-cart', $event)"
                @add-wishlist="$emit('add-wishlist', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  newArrivals: { type: Array, required: true },
  bestSellers: { type: Array, required: true },
  onSale: { type: Array, required: true },
});
defineEmits(["add-to-cart", "add-wishlist"]);

const tabs = [
  { key: "new", label: "New Arrivals" },
  { key: "bestsellers", label: "Best Sellers" },
  { key: "sale", label: "On Sale" },
];

const activeTab = ref("new");

const activeProducts = computed(() => {
  if (activeTab.value === "bestsellers") return props.bestSellers;
  if (activeTab.value === "sale") return props.onSale;
  return props.newArrivals;
});
</script>
