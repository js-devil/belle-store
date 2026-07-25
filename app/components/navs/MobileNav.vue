<template>
  <div class="mobile-nav-wrapper" role="navigation">
    <div class="closemobileMenu">
      <i class="icon anm anm-times-l pull-right"></i> Close Menu
    </div>
    <ul id="MobileNav" class="mobile-nav">
      <li class="lvl1">
        <NuxtLink to="/">Home</NuxtLink>
      </li>
      <li class="lvl1 parent megamenu">
        <a href="#">Shop <i class="anm anm-plus-l"></i></a>
        <ul>
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
        <a href="#">Pages <i class="anm anm-plus-l"></i></a>
        <ul>
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
</script>
