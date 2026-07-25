<template>
  <div class="collection-box section">
    <div class="container-fluid">
      <div ref="gridEl" class="collection-grid">
        <div v-for="category in categories" :key="category.slug" class="collection-grid-item">
          <NuxtLink :to="`/shop?category=${category.slug}`" class="collection-grid-item__link">
            <img
              class="blur-up lazyload"
              :data-src="category.tileImage"
              :src="category.tileImage"
              :alt="category.label"
            />
            <div class="collection-grid-item__title-wrapper">
              <h3 class="collection-grid-item__title btn btn--secondary no-border">
                {{ category.label }}
              </h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, required: true },
});

const gridEl = ref(null);

// Initialized explicitly (rather than relying solely on main.js's own
// DOMContentLoaded-based init, which can silently no-op against Vue-rendered
// markup) so the category slider reliably becomes a slick carousel.
onMounted(() => {
  nextTick(() => {
    const $el = window.jQuery?.(gridEl.value);
    if ($el?.length && !$el.hasClass("slick-initialized")) {
      $el.slick({
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
          { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1 } },
          { breakpoint: 600, settings: { slidesToShow: 3, slidesToScroll: 1 } },
          { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        ],
      });
    }
  });
});
</script>
