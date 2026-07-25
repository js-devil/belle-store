<template>
  <div class="collection-header">
    <div class="collection-hero">
      <div class="collection-hero__image">
        <img
          class="blur-up lazyload"
          :data-src="image"
          :src="image"
          :alt="title"
          :title="title"
        />
      </div>
      <div class="collection-hero__title-wrapper">
        <h1 class="collection-hero__title page-width">{{ title }}</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  image: { type: String, required: true },
  title: { type: String, required: true },
});
</script>
