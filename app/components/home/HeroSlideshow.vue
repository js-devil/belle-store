<template>
  <div class="slideshow slideshow-wrapper pb-section sliderFull">
    <div ref="sliderEl" class="home-slideshow">
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
  {
    title: "The Perfect Gift, Any Occasion",
    subtitle: "From jewelry to gadgets, find something for everyone on your list",
    cta: "Find a gift",
    to: "/collection",
    image: "/images/slideshow-banners/home9-banner1.jpg",
  },
  {
    title: "Fine Jewelry for Every Story",
    subtitle: "Necklaces, rings and bangles crafted to be worn every day",
    cta: "Shop jewelry",
    to: "/shop?category=jewelry",
    image: "/images/slideshow-banners/home8-jewelry-banner1.jpg",
  },
  {
    title: "New Season, New Favorites",
    subtitle: "Fresh styles just landed across shoes and accessories",
    cta: "Shop shoes",
    to: "/shop?category=shoes",
    image: "/images/slideshow-banners/home11-grid-banner1.jpg",
  },
];

const sliderEl = ref(null);

// Initialized explicitly (see CategoryShowcase.vue) since main.js's own
// DOMContentLoaded-based init doesn't reliably run against Vue-rendered markup.
onMounted(() => {
  nextTick(() => {
    const $el = window.jQuery?.(sliderEl.value);
    if ($el?.length && !$el.hasClass("slick-initialized")) {
      $el.slick({
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 4000,
      });
    }
  });
});
</script>
