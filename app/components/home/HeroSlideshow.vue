<template>
  <div class="slideshow slideshow-wrapper pb-section sliderFull">
    <div class="home-slideshow">
      <div v-for="slide in slides" :key="slide.title" class="slide">
        <div class="blur-up lazyload bg-size">
          <img
            class="blur-up lazyload bg-img"
            :data-src="slide.image"
            :src="slide.image"
            :alt="slide.title"
            :title="slide.title"
          />
          <div class="slideshow__text-wrap slideshow__overlay classic bottom">
            <div class="slideshow__text-content bottom">
              <div class="wrap-caption center">
                <h2 class="h1 mega-title slideshow__title">{{ slide.title }}</h2>
                <span class="mega-subtitle slideshow__subtitle">{{
                  slide.subtitle
                }}</span>
                <NuxtLink :to="slide.to" class="btn">{{ slide.cta }}</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const slides = [
  {
    title: "Everything You Need, In One Place",
    subtitle: "Shoes, furniture, jewelry, electronics and more, all under one roof",
    cta: "Shop now",
    to: "/shop",
    image: "/images/slideshow-banners/belle-banner1.jpg",
  },
  {
    title: "Discover Deals Across Every Category",
    subtitle: "New arrivals and everyday low prices, delivered across Nigeria",
    cta: "Explore collections",
    to: "/collection",
    image: "/images/slideshow-banners/belle-banner2.jpg",
  },
];
</script>
