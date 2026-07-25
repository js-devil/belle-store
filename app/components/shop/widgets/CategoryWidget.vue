<template>
  <div class="sidebar_widget categories filter-widget">
    <div class="widget-title"><h2>Categories</h2></div>
    <div class="widget-content">
      <ul class="sidebar_categories">
        <li class="level1 sub-level">
          <NuxtLink to="/shop" class="site-nav">All Products</NuxtLink>
        </li>
        <li
          v-for="category in categories"
          :key="category.slug"
          class="level1 sub-level"
        >
          <NuxtLink :to="`/shop?category=${category.slug}`" class="site-nav">{{
            category.name
          }}</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, required: true },
});
</script>
