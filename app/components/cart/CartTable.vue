<template>
  <div class="cart-table-wrap">
    <EmptyState
      v-if="items.length === 0"
      icon="anm-bag-l"
      title="Your cart is empty"
      message="Browse the catalog and add items to see them here."
      cta-text="Browse Products"
      cta-link="/shop"
    />
    <table v-else class="cart style2">
      <thead class="cart__row cart__header">
        <tr>
          <th colspan="2">Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th class="text-right">Total</th>
          <th class="action">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.key"
          class="cart__row border-bottom line1 cart-flex border-top"
        >
          <td class="cart__image-wrapper cart-flex-item">
            <NuxtLink :to="`/product/${item.slug}`"
              ><img class="cart__image" :src="item.image" :alt="item.name"
            /></NuxtLink>
          </td>
          <td class="cart__meta small--text-left cart-flex-item">
            <div class="list-view-item__title">
              <NuxtLink :to="`/product/${item.slug}`">{{ item.name }}</NuxtLink>
            </div>
            <div v-if="item.size || item.color" class="cart__meta-text">
              <template v-if="item.color">Color: {{ item.color }}<br /></template>
              <template v-if="item.size">Size: {{ item.size }}<br /></template>
            </div>
          </td>
          <td class="cart__price-wrapper cart-flex-item">
            <span class="money">{{ formatPrice(item.unitPriceUsd) }}</span>
          </td>
          <td class="cart__update-wrapper cart-flex-item text-right">
            <div class="cart__qty text-center">
              <div class="qtyField">
                <a
                  class="qtyBtn minus"
                  href="javascript:void(0);"
                  @click="$emit('update-qty', item.key, item.qty - 1)"
                  ><i class="icon icon-minus"></i
                ></a>
                <input
                  class="cart__qty-input qty"
                  type="text"
                  :id="`qty-${item.key}`"
                  :value="item.qty"
                  pattern="[0-9]*"
                  readonly
                />
                <a
                  class="qtyBtn plus"
                  href="javascript:void(0);"
                  @click="$emit('update-qty', item.key, item.qty + 1)"
                  ><i class="icon icon-plus"></i
                ></a>
              </div>
            </div>
          </td>
          <td class="text-right small--hide cart-price">
            <div><span class="money">{{ formatPrice(item.unitPriceUsd * item.qty) }}</span></div>
          </td>
          <td class="text-center small--hide">
            <a
              href="#"
              class="btn btn--secondary cart__remove"
              title="Remove item"
              @click.prevent="$emit('remove', item.key)"
              ><i class="icon icon anm anm-times-l"></i
            ></a>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="items.length" class="cart-continue-row">
      <NuxtLink to="/shop" class="btn btn-secondary btn--small cart-continue"
        >Continue shopping</NuxtLink
      >
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
});
defineEmits(["update-qty", "remove"]);

const { formatPrice } = useCurrency();
</script>
