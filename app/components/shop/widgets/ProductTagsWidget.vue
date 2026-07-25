<template>
  <div class="sidebar_widget">
    <div class="widget-title"><h2>Product Tags</h2></div>
    <div class="widget-content">
      <ul class="product-tags">
        <li v-for="tag in tags" :key="tag">
          <a href="#" :title="'Show products matching tag ' + tag">{{ tag }}</a>
        </li>
      </ul>
      <span class="btn btn--small btnview">View all</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tags: { type: Array, required: true },
});
</script>

<style scoped>
.product-tags li {
  margin-right: 8px;
}
</style>
