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
          <WalletPayment :items="items" :subtotal-usd="subtotalUsd" @order-placed="handleOrderPlaced" />
        </div>
      </div>
    </div>

    <OrderConfirmationModal
      v-if="showConfirmationModal"
      @close="showConfirmationModal = false"
    />
  </div>
</template>

<script setup>
const { items, subtotalUsd, clearCart } = useCart();

// The modal is Teleported (independent of the item list above), so it stays
// up even though clearing the cart immediately swaps that list over to its
// "cart is empty" state.
const showConfirmationModal = ref(false);
function handleOrderPlaced() {
  showConfirmationModal.value = true;
  clearCart();
}
</script>
