<template>
  <div class="product-single__meta">
    <h1 class="product-single__title">{{ product.title }}</h1>
    <div class="prInfoRow">
      <div class="product-stock">
        <span v-if="product.stock > 0" class="instock">In Stock</span>
        <span v-else class="outstock">Unavailable</span>
      </div>
      <div class="product-sku">SKU: <span class="variant-sku">{{ product.sku }}</span></div>
      <div class="product-review">
        <a class="reviewLink" href="#tab2" @click.prevent="$emit('go-to-reviews')"
          >{{ "★".repeat(product.rating) }}{{ "☆".repeat(5 - product.rating) }}
          <span class="spr-badge-caption">{{ product.reviewCount }} reviews</span></a
        >
      </div>
    </div>
    <p class="product-single__price">
      <s v-if="product.compareAtPriceUsd"
        ><span class="money">{{ formatPrice(product.compareAtPriceUsd) }}</span></s
      >
      <span class="product-price__price product-price__sale product-price__sale--single">
        <span class="money">{{ formatPrice(product.priceUsd) }}</span>
      </span>
      <span v-if="product.compareAtPriceUsd" class="discount-badge"
        >You Save
        <span class="money">{{
          formatPrice(product.compareAtPriceUsd - product.priceUsd)
        }}</span>
        ({{ savingsPercent }}%)</span
      >
    </p>

    <div class="product-single__description rte" v-html="product.description"></div>

    <div v-if="product.sizes && product.sizes.length" class="product-form__item">
      <label
        >Size: <strong>{{ selectedSize }}</strong>
        <a v-if="product.sizeChart" href="#tab3" class="sizelink ml-2" @click.prevent="$emit('go-to-size-chart')"
          >Size Guide</a
        ></label
      >
      <ul class="swatches">
        <li
          v-for="size in product.sizes"
          :key="size"
          class="swatch medium"
          :class="{ active: selectedSize === size }"
          @click="selectedSize = size"
        >
          {{ size }}
        </li>
      </ul>
    </div>

    <div class="product-action clearfix">
      <div class="product-form__item--quantity">
        <div class="wrapQtyBtn">
          <div class="qtyField">
            <a class="qtyBtn minus" href="javascript:void(0);" @click="qty = Math.max(1, qty - 1)"
              ><i class="fa anm anm-minus-r"></i
            ></a>
            <input type="text" :value="qty" class="product-form__input qty" readonly />
            <a class="qtyBtn plus" href="javascript:void(0);" @click="qty++"
              ><i class="fa anm anm-plus-r"></i
            ></a>
          </div>
        </div>
      </div>
      <div class="product-form__item--submit">
        <button
          type="button"
          class="btn product-form__cart-submit"
          :disabled="product.stock <= 0"
          @click="handleAddToCart"
        >
          <span>{{ product.stock > 0 ? "Add to cart" : "Sold out" }}</span>
        </button>
      </div>
    </div>

    <div class="display-table shareRow">
      <div class="wishlist-btn">
        <a
          class="wishlist add-to-wishlist"
          href="#"
          :class="{ 'is-active': inWishlist }"
          @click.prevent="$emit('add-wishlist')"
          ><i :class="inWishlist ? 'fa fa-heart wishlist-heart--filled' : 'icon anm anm-heart-l'"></i>
          <span>{{ inWishlist ? "In Wishlist" : "Add to Wishlist" }}</span></a
        >
      </div>
    </div>

    <p v-if="product.priceUsd < FREE_SHIPPING_THRESHOLD" id="freeShipMsg" class="freeShipMsg">
      Spend {{ formatPrice(FREE_SHIPPING_THRESHOLD - product.priceUsd) }} more for FREE SHIPPING!
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
  inWishlist: { type: Boolean, default: false },
});
const emit = defineEmits(["add-to-cart", "add-wishlist", "go-to-reviews", "go-to-size-chart"]);

const { formatPrice } = useCurrency();

const FREE_SHIPPING_THRESHOLD = 100;

const qty = ref(1);
const selectedSize = ref(props.product.sizes?.[0] ?? null);
const selectedColor = ref(props.product.colors?.[0]?.name ?? null);

const savingsPercent = computed(() => {
  if (!props.product.compareAtPriceUsd) return 0;
  return Math.round(
    ((props.product.compareAtPriceUsd - props.product.priceUsd) /
      props.product.compareAtPriceUsd) *
      100
  );
});

function handleAddToCart() {
  emit("add-to-cart", {
    qty: qty.value,
    size: selectedSize.value,
    color: selectedColor.value,
  });
}
</script>

<style scoped>
.wishlist-heart--filled {
  color: #e0245e;
}
/* The legacy .swatches li styling only targets the shop grid card context
   (.grid-products .item .swatches li), so on the PDP these render unsized -
   give the swatch circle (image or plain hex colour) explicit dimensions. */
.swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.swatches .swatch {
  width: 28px;
  height: 28px;
  display: inline-block;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
}
.swatches .swatch.rounded {
  border-radius: 50%;
}
/* Size swatches ("UK9", "M", "42"...) are text, not a fixed-size colour
   circle - let them size to their label with breathing room, and use a
   rounded pill border that hugs the text instead of the plain square
   default (2px solid, corner-to-corner) border-color swap used elsewhere. */
.swatches .swatch.medium:not(.rounded) {
  width: auto;
  height: auto;
  min-width: 40px;
  padding: 6px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border-color: #ddd;
}
.swatches .swatch.active {
  border-color: #111;
  font-weight: 600;
}
.swatches .swatch img,
.swatches .swatch .swatch-color {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
