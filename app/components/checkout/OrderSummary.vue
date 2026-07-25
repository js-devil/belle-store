<template>
  <div class="order-summary">
    <h3 class="h4">Order Summary</h3>
    <ul class="order-summary__items">
      <li v-for="item in items" :key="item.key" class="order-summary__item">
        <img :src="item.image" :alt="item.name" />
        <div class="order-summary__item-meta">
          <span class="order-summary__item-name">{{ item.name }}</span>
          <span v-if="item.size || item.color" class="order-summary__item-variant">{{
            [item.color, item.size].filter(Boolean).join(" / ")
          }}</span>
          <span class="order-summary__item-qty">Qty: {{ item.qty }}</span>
        </div>
        <span class="order-summary__item-price">{{
          formatPrice(item.unitPriceUsd * item.qty)
        }}</span>
      </li>
    </ul>
    <CartTotals :subtotal-usd="subtotalUsd" :show-checkout-button="false" />
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  subtotalUsd: { type: Number, required: true },
});

const { formatPrice } = useCurrency();
</script>

<style scoped>
.order-summary__items {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
}
.order-summary__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.order-summary__item img {
  width: 56px;
  height: 56px;
  object-fit: cover;
}
.order-summary__item-meta {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.order-summary__item-variant,
.order-summary__item-qty {
  font-size: 12px;
  color: #777;
}
</style>
