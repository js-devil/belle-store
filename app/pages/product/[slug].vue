<template>
  <div v-if="product" id="page-content">
    <div class="bredcrumbWrap">
      <div class="container breadcrumbs">
        <NuxtLink to="/">Home</NuxtLink> &rsaquo;
        <NuxtLink :to="`/shop?category=${product.category}`">{{ categoryLabel }}</NuxtLink>
        &rsaquo; {{ product.title }}
      </div>
    </div>

    <div id="ProductSection-product-template" class="product-template__container prstyle1 container">
      <div class="product-single">
        <div class="row">
          <div class="col-lg-6 col-md-6 col-sm-12 col-12">
            <ProductGallery :product="product" />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-12">
            <ProductInfo
              :product="product"
              :in-wishlist="inWishlist"
              @add-to-cart="handleAddToCart"
              @add-wishlist="handleWishlist"
              @go-to-reviews="tabsRef?.goToReviews()"
              @go-to-size-chart="tabsRef?.goToSizeChart()"
            />
          </div>
        </div>
      </div>

      <TrustBadgeStrip />

      <ProductTabs ref="tabsRef" :product="product" />

      <div v-if="relatedProducts.length" class="related-product grid-products">
        <header class="section-header">
          <h2 class="section-header__title text-center h2"><span>Related Products</span></h2>
        </header>
        <div class="row">
          <ProductCard
            v-for="related in relatedProducts"
            :key="related.id"
            :product="related"
            @add-to-cart="addToCart(related)"
            @add-wishlist="toggleWishlist(related.slug)"
          />
        </div>
      </div>

      <div v-if="recentlyViewedProducts.length" class="related-product grid-products">
        <header class="section-header">
          <h2 class="section-header__title text-center h2"><span>Recently Viewed</span></h2>
        </header>
        <div class="row">
          <ProductCard
            v-for="viewed in recentlyViewedProducts"
            :key="viewed.id"
            :product="viewed"
            @add-to-cart="addToCart(viewed)"
            @add-wishlist="toggleWishlist(viewed.slug)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getProductBySlug, getRelatedProducts, getCategoryBySlug } from "@/data/index.js";

definePageMeta({
  validate: (route) => !!getProductBySlug(route.params.slug),
  pageBodyClass: "template-product",
});

const route = useRoute();
const { addToCart } = useCart();
const { has, toggle: toggleWishlist } = useWishlist();
const { markViewed, slugs: recentlyViewedSlugs } = useRecentlyViewed();
const { logEvent } = useAnalytics();

const product = computed(() => getProductBySlug(route.params.slug));

const categoryLabel = computed(
  () => getCategoryBySlug(product.value.category)?.label ?? product.value.category
);
const inWishlist = computed(() => has(product.value.slug));
const relatedProducts = computed(() => getRelatedProducts(product.value, 4));
const recentlyViewedProducts = computed(() =>
  recentlyViewedSlugs.value
    .filter((slug) => slug !== product.value.slug)
    .map((slug) => getProductBySlug(slug))
    .filter(Boolean)
    .slice(0, 4)
);

const tabsRef = ref(null);

useHead({ title: `${product.value.title} | Belle Store` });

const viewStartedAt = Date.now();

function logTimeOnPage() {
  const seconds = Math.round((Date.now() - viewStartedAt) / 1000);
  logEvent("time_on_page", { slug: product.value.slug, seconds });
}

onMounted(() => {
  markViewed(product.value.slug);
  window.addEventListener("beforeunload", logTimeOnPage);
});
onBeforeUnmount(() => {
  logTimeOnPage();
  window.removeEventListener("beforeunload", logTimeOnPage);
});

function handleAddToCart({ qty, size, color }) {
  addToCart(product.value, { qty, size, color });
  logEvent("add_to_cart", { slug: product.value.slug, qty });
}

function handleWishlist() {
  toggleWishlist(product.value.slug);
}
</script>
