<template>
  <div class="sidebar_widget">
    <div class="widget-title"><h2>Information</h2></div>
    <div class="widget-content">
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default:
      "Belle Store ships across Nigeria, with delivery in 1-7 days depending on your location. Prices can be viewed in Naira or US Dollars using the selector in the top bar.",
  },
});
</script>
