<template>
  <div class="sidebar_widget">
    <div class="widget-title"><h2>Popular Products</h2></div>
    <div class="widget-content">
      <div class="list list-sidebar-products">
        <div class="grid">
          <div v-for="product in products" :key="product.id" class="grid__item">
            <div class="mini-list-item">
              <div class="mini-view_image">
                <NuxtLink class="grid-view-item__link" :to="`/product/${product.slug}`">
                  <img
                    class="grid-view-item__image"
                    :src="product.image"
                    :alt="product.title"
                  />
                </NuxtLink>
              </div>
              <div class="details">
                <NuxtLink class="grid-view-item__title" :to="`/product/${product.slug}`">{{
                  product.title
                }}</NuxtLink>
                <div class="grid-view-item__meta">
                  <span class="product-price__price"
                    ><span class="money">{{ formatPrice(product.price) }}</span></span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  products: { type: Array, required: true },
});

const { formatPrice } = useCurrency();
</script>
