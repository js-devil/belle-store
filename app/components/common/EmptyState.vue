<template>
  <div class="empty-page-content empty-state text-center">
    <i :class="['icon', 'anm', icon]" class="empty-state__icon"></i>
    <h2 class="empty-state__title">{{ title }}</h2>
    <p class="empty-state__message">{{ message }}</p>
    <NuxtLink :to="ctaLink" class="btn">{{ ctaText }}</NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: "anm-heart-l" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  ctaText: { type: String, default: "Continue Shopping" },
  ctaLink: { type: String, default: "/shop" },
});
</script>

<style scoped>
.empty-state {
  max-width: 420px;
  margin: 0 auto;
}
.empty-state__icon {
  font-size: 56px;
  color: #c3c2b7;
  display: inline-block;
  margin-bottom: 20px;
}
.empty-state__title {
  margin-bottom: 10px;
}
.empty-state__message {
  color: #767676;
  margin-bottom: 28px;
}
</style>
