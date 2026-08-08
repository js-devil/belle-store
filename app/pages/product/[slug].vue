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
            <ProductGallery
              ref="galleryRef"
              :product="product"
              @view-3d-opened="engagement.recordViewer3dOpened()"
              @rotate="engagement.recordRotate()"
              @zoom="engagement.recordZoom()"
              @viewer-error="engagement.recordViewerError()"
              @thumbnail-switch="engagement.recordThumbnailSwitch()"
              @image-zoom="engagement.recordImageZoom()"
              @load-time="engagement.recordLoadTime($event)"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-12">
            <ProductInfo
              :product="product"
              :in-wishlist="inWishlist"
              @add-to-cart="handleAddToCart"
              @add-wishlist="handleWishlist"
              @go-to-reviews="handleGoToReviews"
              @go-to-size-chart="handleGoToSizeChart"
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
const galleryRef = ref(null);

useHead({ title: `${product.value.title} | Belle Store` });

// One consolidated engagement summary per visit, sent on leaving - see
// useProductEngagement.js for why this replaced a network call per gesture.
const engagement = useProductEngagement(product.value);

// Pulled (not pushed) so a viewer/lightbox/reviews-tab left open when the
// visitor navigates away still gets counted - see currentOpenDurations() in
// ProductGallery.vue for why this can't just be a close event instead.
// "2D viewing time" combines the image lightbox, thumbnail dwell (both from
// ProductGallery) with reviews-tab dwell (from ProductTabs) into one total,
// since all three are the same thing from the study's point of view -
// evaluating the product visually/via feedback without the 3D viewer.
function flushEngagement() {
  const durations = galleryRef.value?.currentOpenDurations();
  if (durations) {
    engagement.recordViewer3dOpenMs(durations.viewer3dOpenMs);
    const reviewsOpenMs = tabsRef.value?.currentReviewsOpenMs?.() ?? 0;
    engagement.recordImageLightboxOpenMs(durations.imageLightboxOpenMs + reviewsOpenMs);
  }
  engagement.flush();
}

onMounted(() => {
  markViewed(product.value.slug);
  window.addEventListener("beforeunload", flushEngagement);
});
onBeforeUnmount(() => {
  flushEngagement();
  window.removeEventListener("beforeunload", flushEngagement);
});

function handleAddToCart({ qty, size, color }) {
  addToCart(product.value, { qty, size, color });
  engagement.recordAddedToCart();
}

function handleWishlist() {
  const wasInWishlist = has(product.value.slug);
  toggleWishlist(product.value.slug);
  if (!wasInWishlist) engagement.recordAddedToWishlist();
}

function handleGoToReviews() {
  tabsRef.value?.goToReviews();
  engagement.recordViewedReviews();
}

function handleGoToSizeChart() {
  tabsRef.value?.goToSizeChart();
  engagement.recordViewedSizeChart();
}
</script>
