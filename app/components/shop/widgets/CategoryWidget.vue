<template>
  <div class="sidebar_widget categories filter-widget">
    <div class="widget-title"><h2>Categories</h2></div>
    <div class="widget-content">
      <ul class="sidebar_categories">
        <li class="level1">
          <NuxtLink to="/shop" class="site-nav" exact-active-class="active">All Products</NuxtLink>
        </li>
        <li v-for="category in categories" :key="category.slug" class="level1">
          <div v-if="category.slug === 'shoes'" class="category-row">
            <NuxtLink
              to="/shop?category=shoes"
              class="site-nav category-row__link"
              :class="{ active: isShoesActive }"
              >{{ category.name }}</NuxtLink
            >
            <button
              type="button"
              class="category-row__toggle"
              :class="{ 'is-open': shoesExpanded }"
              :aria-expanded="shoesExpanded"
              aria-label="Toggle shoe subcategories"
              @click="shoesExpanded = !shoesExpanded"
            >
              <i class="anm anm-angle-down-l"></i>
            </button>
          </div>
          <NuxtLink v-else :to="`/shop?category=${category.slug}`" class="site-nav">{{
            category.name
          }}</NuxtLink>

          <ul v-if="category.slug === 'shoes'" v-show="shoesExpanded" class="sub-category-list">
            <li v-for="sub in shoeSubcategories" :key="sub.slug">
              <NuxtLink
                :to="`/shop?category=shoes&subcategory=${sub.slug}`"
                class="site-nav"
                :class="{ active: route.query.subcategory === sub.slug }"
                >{{ sub.label }}</NuxtLink
              >
            </li>
          </ul>
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

const route = useRoute();

const isShoesActive = computed(
  () => route.query.category === "shoes" && !route.query.subcategory
);

// Auto-expand the subcategory list whenever a shoe subcategory is already
// selected (e.g. arrived here via a direct link), so the active item is visible.
const shoesExpanded = ref(Boolean(route.query.subcategory));
</script>

<style scoped>
.category-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.category-row__link {
  flex: 1;
}
.category-row__toggle {
  background: none;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  color: #767676;
  font-size: 12px;
  line-height: 1;
  transition: transform 0.15s ease-in-out;
}
.category-row__toggle.is-open {
  transform: rotate(180deg);
}
.sub-category-list {
  margin: 4px 0 10px 15px;
}
.sub-category-list a.active {
  font-weight: 600;
  color: #111;
}
</style>
