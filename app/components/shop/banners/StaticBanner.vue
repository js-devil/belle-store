<template>
  <div class="sidebar_widget static-banner">
    <img :src="image" :alt="alt" />
  </div>
</template>

<script setup>
defineProps({
  image: { type: String, required: true },
  alt: { type: String, default: "" },
});
</script>
