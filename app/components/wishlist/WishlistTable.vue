<template>
  <div class="wishlist-table table-content table-responsive">
    <EmptyState
      v-if="items.length === 0"
      icon="anm-heart-l"
      title="Your wishlist is empty"
      message="Tap the heart icon on any product to save it here for later."
      cta-text="Browse Products"
      cta-link="/shop"
    />
    <table v-else class="table table-bordered">
      <thead>
        <tr>
          <th class="product-name text-center alt-font">Remove</th>
          <th class="product-price text-center alt-font">Images</th>
          <th class="product-name alt-font">Product</th>
          <th class="product-price text-center alt-font">Unit Price</th>
          <th class="stock-status text-center alt-font">Stock Status</th>
          <th class="product-subtotal text-center alt-font">Add to Cart</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in items" :key="product.slug">
          <td class="product-remove text-center" valign="middle">
            <a href="#" @click.prevent="$emit('remove', product.slug)"
              ><i class="icon icon anm anm-times-l"></i
            ></a>
          </td>
          <td class="product-thumbnail text-center">
            <NuxtLink :to="`/product/${product.slug}`"
              ><img :src="product.images.primary" :alt="product.title" title=""
            /></NuxtLink>
          </td>
          <td class="product-name">
            <h4 class="no-margin">
              <NuxtLink :to="`/product/${product.slug}`">{{ product.title }}</NuxtLink>
            </h4>
          </td>
          <td class="product-price text-center">
            <span class="amount">{{ formatPrice(product.priceUsd) }}</span>
          </td>
          <td class="stock text-center">
            <span v-if="product.stock > 0" class="in-stock">in stock</span>
            <span v-else class="out-stock">Out Of stock</span>
          </td>
          <td class="product-subtotal text-center">
            <button
              type="button"
              class="btn btn-small"
              :disabled="product.stock <= 0"
              @click="$emit('add-to-cart', product)"
            >
              Add To Cart
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
});
defineEmits(["remove", "add-to-cart"]);

const { formatPrice } = useCurrency();
</script>
