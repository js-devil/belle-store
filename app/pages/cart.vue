<template>
  <div id="page-content">
    <div class="page section-header text-center">
      <div class="page-title">
        <div class="wrapper"><h1 class="page-width">Shopping Cart</h1></div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-8">
          <CartTable :items="items" @update-qty="updateQty" @remove="removeFromCart" />
        </div>
        <div class="col-12 col-lg-4">
          <CartTotals v-if="items.length" :subtotal-usd="subtotalUsd" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ pageBodyClass: "page-template cart-variant1" });

const { items, subtotalUsd, updateQty, removeFromCart } = useCart();
</script>
