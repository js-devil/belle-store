<template>
  <div class="section logo-section">
    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
          <div ref="logoBarEl" class="logo-bar">
            <div v-for="brand in brands" :key="brand.slug" class="logo-bar__item">
              <img :src="brand.logo" :alt="brand.name" :title="brand.name" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// One well-known brand per product category we carry.
const brands = [
  { slug: "nike", name: "Nike", logo: "/images/brands/nike.svg" },
  { slug: "ikea", name: "IKEA", logo: "/images/brands/ikea.svg" },
  { slug: "pandora", name: "Pandora", logo: "/images/brands/pandora.svg" },
  { slug: "samsung", name: "Samsung", logo: "/images/brands/samsung.svg" },
  { slug: "trek", name: "Trek", logo: "/images/brands/trek.svg" },
  { slug: "lego", name: "LEGO", logo: "/images/brands/lego.svg" },
  { slug: "pottery-barn", name: "Pottery Barn", logo: "/images/brands/pottery-barn.svg" },
];

const logoBarEl = ref(null);

// Initialized explicitly (see CategoryShowcase.vue) since main.js's own
// DOMContentLoaded-based init doesn't reliably run against Vue-rendered markup.
onMounted(() => {
  nextTick(() => {
    const $el = window.jQuery?.(logoBarEl.value);
    if ($el?.length && !$el.hasClass("slick-initialized")) {
      $el.slick({
        dots: false,
        infinite: true,
        slidesToShow: 6,
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
