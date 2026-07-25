<template>
  <div class="cart__footer">
    <div class="solid-border">
      <div class="row border-bottom pb-2">
        <span class="col-12 col-sm-6 cart__subtotal-title">Subtotal</span>
        <span class="col-12 col-sm-6 text-right"
          ><span class="money">{{ formatPrice(subtotalUsd) }}</span></span
        >
      </div>
      <div class="row border-bottom pb-2 pt-2">
        <span class="col-12 col-sm-6 cart__subtotal-title">Tax</span>
        <span class="col-12 col-sm-6 text-right">Calculated at checkout</span>
      </div>
      <div class="row border-bottom pb-2 pt-2">
        <span class="col-12 col-sm-6 cart__subtotal-title">Shipping</span>
        <span class="col-12 col-sm-6 text-right">Free shipping</span>
      </div>
      <div class="row border-bottom pb-2 pt-2">
        <span class="col-12 col-sm-6 cart__subtotal-title"><strong>Total</strong></span>
        <span class="col-12 col-sm-6 cart__subtotal-title cart__subtotal text-right"
          ><span class="money">{{ formatPrice(subtotalUsd) }}</span></span
        >
      </div>
      <div v-if="showCheckoutButton" class="cart__shipping">
        Shipping &amp; taxes calculated at checkout
      </div>
      <template v-if="showCheckoutButton">
        <p class="cart_tearm">
          <label
            ><input
              type="checkbox"
              v-model="agreedToTerms"
              class="checkbox"
              value="tearm"
            />
            I agree with the terms and conditions</label
          >
        </p>
        <NuxtLink
          to="/checkout"
          class="btn btn--small-wide checkout"
          :class="{ disabled: !agreedToTerms }"
          :tabindex="agreedToTerms ? 0 : -1"
          @click="!agreedToTerms && $event.preventDefault()"
          >Proceed To Checkout</NuxtLink
        >
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  subtotalUsd: { type: Number, required: true },
  showCheckoutButton: { type: Boolean, default: true },
});

const { formatPrice } = useCurrency();
const agreedToTerms = ref(false);
</script>
