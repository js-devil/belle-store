<template>
  <div class="wallet-payment">
    <h3 class="h4">Payment</h3>
    <p class="wallet-payment__note">
      This store is a research prototype for a study on 3D product visualization. There's no
      real payment provider - instead, every account gets a starting wallet balance to shop
      with, so the checkout experience still feels real.
    </p>

    <template v-if="!isLoggedIn">
      <p>Log in or create a free account to place your order.</p>
      <button type="button" class="btn" @click="showModal = true">Log in / Create account</button>
    </template>

    <template v-else-if="!orderPlaced">
      <div class="wallet-payment__balance">
        <span>Wallet balance</span>
        <strong>{{ formatPrice(account.walletUsd) }}</strong>
      </div>
      <p v-if="insufficientFunds" class="wallet-payment__error">
        Your wallet balance isn't enough to cover this order ({{ formatPrice(subtotalUsd) }}). Remove an
        item or come back once your balance covers it.
      </p>
      <p v-else-if="errorMessage" class="wallet-payment__error">{{ errorMessage }}</p>
      <button type="button" class="btn" :disabled="placing || insufficientFunds" @click="placeOrder">
        {{ placing ? "Placing order..." : `Place order - ${formatPrice(subtotalUsd)}` }}
      </button>
    </template>

    <template v-else>
      <div class="wallet-payment__success">
        <i class="anm anm-check-circle"></i>
        <p>
          Order placed! <strong>{{ formatPrice(subtotalUsd) }}</strong> was deducted from your wallet.
          Remaining balance: <strong>{{ formatPrice(account.walletUsd) }}</strong>.
        </p>
      </div>
    </template>

    <AccountModal
      v-if="showModal"
      @close="showModal = false"
      @authenticated="showModal = false"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, required: true },
  subtotalUsd: { type: Number, required: true },
});
const emit = defineEmits(["order-placed"]);

const { account, isLoggedIn, purchase } = useAccount();
const { formatPrice } = useCurrency();

const showModal = ref(false);
const placing = ref(false);
const orderPlaced = ref(false);
const errorMessage = ref("");

const insufficientFunds = computed(
  () => isLoggedIn.value && account.value.walletUsd < props.subtotalUsd
);

async function placeOrder() {
  placing.value = true;
  errorMessage.value = "";
  try {
    await purchase({
      amountUsd: props.subtotalUsd,
      slugs: props.items.map((item) => item.slug),
    });
    orderPlaced.value = true;
    emit("order-placed");
  } catch (error) {
    errorMessage.value = error?.data?.statusMessage || error?.statusMessage || "Couldn't place the order.";
  } finally {
    placing.value = false;
  }
}
</script>

<style scoped>
.wallet-payment {
  background: #f7f7f7;
  border: 1px solid #eee;
  padding: 20px;
  margin-top: 20px;
}
.wallet-payment__note {
  font-size: 13px;
  color: #767676;
}
.wallet-payment__balance {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 12px 16px;
  margin-bottom: 14px;
  font-size: 15px;
}
.wallet-payment .btn {
  width: 100%;
}
.wallet-payment .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.wallet-payment__error {
  color: #c0392b;
  font-size: 13px;
}
.wallet-payment__success {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.wallet-payment__success i {
  color: #2e7d32;
  font-size: 22px;
  line-height: 1;
}
.wallet-payment__success p {
  margin: 0;
}
</style>
