<template>
  <div class="payment-placeholder">
    <h3 class="h4">Payment</h3>
    <p>
      This store is a research prototype for a study on 3D product visualization and
      does not process real payments. In a production version, a payment provider
      would be integrated here.
    </p>
    <button type="button" class="btn" disabled>Payment integration coming soon</button>
  </div>
</template>

<style scoped>
.payment-placeholder {
  background: #f7f7f7;
  border: 1px dashed #ccc;
  padding: 20px;
  margin-top: 20px;
}
.payment-placeholder button {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
