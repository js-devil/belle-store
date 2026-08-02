<template>
  <div class="mobile-nav-wrapper" :class="{ active: isMobileNavOpen }" role="navigation">
    <div class="closemobileMenu" @click="closeMobileNav">
      <i class="icon anm anm-times-l pull-right"></i> Close Menu
    </div>
    <ul id="MobileNav" class="mobile-nav">
      <li class="lvl1">
        <NuxtLink to="/">Home</NuxtLink>
      </li>
      <li class="lvl1 parent megamenu">
        <a href="#" @click.prevent="toggleSection('shop')"
          >Shop
          <i class="anm anm-caret-down" :class="{ 'is-open': openSection === 'shop' }"></i
        ></a>
        <ul :style="{ display: openSection === 'shop' ? 'block' : 'none' }">
          <li><NuxtLink to="/shop" class="site-nav">All Products</NuxtLink></li>
          <li><NuxtLink to="/collection" class="site-nav">Collection</NuxtLink></li>
          <li v-for="category in categories" :key="category.slug">
            <NuxtLink :to="`/shop?category=${category.slug}`" class="site-nav">{{
              category.label
            }}</NuxtLink>
          </li>
        </ul>
      </li>
      <li class="lvl1 parent megamenu">
        <a href="#" @click.prevent="toggleSection('pages')"
          >Pages
          <i class="anm anm-caret-down" :class="{ 'is-open': openSection === 'pages' }"></i
        ></a>
        <ul :style="{ display: openSection === 'pages' ? 'block' : 'none' }">
          <li><NuxtLink to="/cart" class="site-nav">Cart</NuxtLink></li>
          <li><NuxtLink to="/wishlist" class="site-nav">Wishlist</NuxtLink></li>
          <li><NuxtLink to="/about-us" class="site-nav">About Us</NuxtLink></li>
          <li><NuxtLink to="/faq" class="site-nav">FAQs</NuxtLink></li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { categories } from "@/data/categories.js";

const { isMobileNavOpen, closeMobileNav } = useUiState();

// The legacy CSS shifts .pageWrapper via a body.menuOn class when the
// drawer opens (see responsive.css) - body isn't a Vue-managed element,
// so toggle the class directly, client-side only.
watch(isMobileNavOpen, (open) => {
  if (typeof document !== "undefined") {
    document.body.classList.toggle("menuOn", open);
  }
});

// The legacy megamenu reveal relied on main.js's jQuery click handler, which
// (like every other jQuery-vs-Vue-DOM interaction found in this codebase)
// doesn't reliably attach to Vue-rendered markup - toggle it in Vue instead.
// Only one section open at a time, accordion-style.
const openSection = ref(null);
function toggleSection(name) {
  openSection.value = openSection.value === name ? null : name;
}
</script>

<style scoped>
.megamenu > a .anm-caret-down {
  display: inline-block;
  transition: transform 0.2s ease-in-out;
}
.megamenu > a .anm-caret-down.is-open {
  transform: rotate(180deg);
}
</style>
