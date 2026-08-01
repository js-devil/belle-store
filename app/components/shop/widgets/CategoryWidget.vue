<template>
  <div class="sidebar_widget categories filter-widget">
    <div class="widget-title"><h2>Categories</h2></div>
    <div class="widget-content">
      <ul class="sidebar_categories">
        <li class="level1 sub-level">
          <NuxtLink to="/shop" class="site-nav">All Products</NuxtLink>
        </li>
        <li v-for="category in categories" :key="category.slug" class="level1 sub-level">
          <template v-if="category.slug === 'shoes'">
            <a
              href="javascript:void(0)"
              class="site-nav"
              :class="{ active: shoesExpanded }"
              @click="shoesExpanded = !shoesExpanded"
              >{{ category.name }}</a
            >
            <ul :style="{ display: shoesExpanded ? 'block' : 'none' }">
              <li v-for="sub in shoeSubcategories" :key="sub.slug">
                <NuxtLink :to="`/shop?category=shoes&subcategory=${sub.slug}`" class="site-nav">{{
                  sub.label
                }}</NuxtLink>
              </li>
            </ul>
          </template>
          <NuxtLink v-else :to="`/shop?category=${category.slug}`" class="site-nav">{{
            category.name
          }}</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { shoeSubcategories } from "@/data/categories.js";

defineProps({
  categories: { type: Array, required: true },
});

const shoesExpanded = ref(false);
</script>
