<template>
  <div class="store-feature section">
    <div class="container">
      <ul class="display-table store-info">
        <li class="display-table-cell">
          <i class="icon anm anm-truck-r"></i>
          <h5>Free Shipping &amp; Return</h5>
          <span class="sub-text">On orders over {{ formatPrice(100) }}</span>
        </li>
        <li class="display-table-cell">
          <i class="icon anm anm-badge-check-r"></i>
          <h5>Money Guarantee</h5>
          <span class="sub-text">14 day return policy</span>
        </li>
        <li class="display-table-cell">
          <i class="icon anm anm-headphones-r"></i>
          <h5>Online Support</h5>
          <span class="sub-text">Here to help, every day</span>
        </li>
        <li class="display-table-cell">
          <i class="icon anm anm-lock-r"></i>
          <h5>Secure Payments</h5>
          <span class="sub-text">Your data stays protected</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const { formatPrice } = useCurrency();
</script>
