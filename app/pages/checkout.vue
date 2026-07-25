<template>
  <div id="page-content">
    <div class="page section-header text-center">
      <div class="page-title">
        <div class="wrapper"><h1 class="page-width">Checkout</h1></div>
      </div>
    </div>
    <div class="container">
      <p v-if="items.length === 0" class="text-center">
        Your cart is empty. <NuxtLink to="/shop">Continue shopping</NuxtLink>
      </p>
      <div v-else class="row">
        <div class="col-12 col-lg-7">
          <OrderSummary :items="items" :subtotal-usd="subtotalUsd" />
        </div>
        <div class="col-12 col-lg-5">
          <PaymentPlaceholder />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { items, subtotalUsd } = useCart();
</script>
