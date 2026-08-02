<template>
  <div
    class="col-6 col-sm-6 col-md-4 col-lg-3 item"
    :class="{ 'grid-view-item--sold-out': product.stock <= 0 }"
  >
    <div class="product-image">
      <!-- product image with hover and labels -->
      <NuxtLink :to="`/product/${product.slug}`">
        <img
          class="primary blur-up lazyload"
          :data-src="product.images.primary"
          :src="product.images.primary"
          alt="image"
          title="product"
        />
        <img
          class="hover blur-up lazyload"
          :data-src="product.images.hover"
          :src="product.images.hover"
          alt="image"
          title="product"
        />
        <!-- labels -->
        <div
          v-if="product.labels && product.labels.length"
          class="product-labels"
          :class="{ rectangular: product.rectangularLabels }"
        >
          <span
            v-for="label in product.labels"
            :key="label.text"
            class="lbl"
            :class="label.class"
            >{{ label.text }}</span
          >
        </div>
        <!-- sold out badge -->
        <span v-if="product.stock <= 0" class="sold-out"><span>Sold out</span></span>
      </NuxtLink>

      <!-- action buttons -->
      <form class="variants add" action="#" @click.prevent="handleAddToCart">
        <button class="btn btn-addto-cart" type="button">
          {{ hasVariants ? "Select Options" : "Add to cart" }}
        </button>
      </form>
      <div class="button-set">
        <a
          v-if="product.model3d"
          href="javascript:void(0)"
          title="View in 3D"
          class="view-3d-trigger"
          @click.prevent="show3dViewer = true"
        >
          <i class="icon anm anm-play-r" aria-hidden="true"></i>
        </a>
        <NuxtLink :to="`/product/${product.slug}`" title="View Product" class="quick-view">
          <i class="icon anm anm-search-plus-r"></i>
        </NuxtLink>
        <div class="wishlist-btn">
          <a
            class="wishlist add-to-wishlist"
            href="#"
            :title="inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'"
            :class="{ 'is-active': inWishlist }"
            @click.prevent="$emit('add-wishlist', product)"
          >
            <i :class="inWishlist ? 'fa fa-heart wishlist-heart--filled' : 'icon anm anm-heart-l'"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- product details -->
    <div class="product-details text-center">
      <div class="product-name">
        <NuxtLink :to="`/product/${product.slug}`">{{ product.title }}</NuxtLink>
      </div>
      <div class="product-price">
        <span v-if="product.compareAtPriceUsd" class="old-price">{{
          formatPrice(product.compareAtPriceUsd)
        }}</span>
        <span class="price">{{ formatPrice(product.priceUsd) }}</span>
      </div>
      <div class="product-review">
        <i
          v-for="n in 5"
          :key="n"
          class="font-13 fa"
          :class="n <= product.rating ? 'fa-star' : 'fa-star-o'"
        ></i>
      </div>
      <!-- color swatches -->
      <ul v-if="product.colors && product.colors.length" class="swatches">
        <li
          v-for="color in product.colors"
          :key="color.name"
          class="swatch medium rounded"
        >
          <img :src="color.swatch" :alt="color.name" />
        </li>
      </ul>
    </div>

    <ProductViewer3D
      v-if="show3dViewer"
      :model-src="product.model3d"
      :poster-image="product.images.primary"
      :product-title="product.title"
      :product-slug="product.slug"
      :colors="product.colors"
      :color-target-materials="product.colorTargetMaterials"
      :material-colors="product.materialColors"
      @close="show3dViewer = false"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
});
const emit = defineEmits(["add-to-cart", "add-wishlist"]);

const { formatPrice } = useCurrency();
const { has } = useWishlist();

const hasVariants = computed(
  () => !!(props.product.sizes?.length || props.product.colors?.length)
);
const inWishlist = computed(() => has(props.product.slug));
const show3dViewer = ref(false);

function handleAddToCart() {
  if (hasVariants.value) {
    navigateTo(`/product/${props.product.slug}`);
    return;
  }
  emit("add-to-cart", props.product);
}
</script>

<style scoped>
.wishlist-heart--filled {
  color: #e0245e;
}
/* Matches the generic a.quick-view/a.wishlist box treatment in style.css -
   that rule is a plain class selector (not scoped to any parent context),
   but it doesn't know about this new button's class name. */
.view-3d-trigger {
  color: #000;
  background-color: #fff;
  border: 0;
  width: 35px;
  height: 35px;
  line-height: 34px;
  display: block;
  text-align: center;
  padding: 0;
  margin-bottom: 5px;
}
.view-3d-trigger:hover {
  color: #fff;
  background-color: #000;
  opacity: 0.8;
}
</style>
