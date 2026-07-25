<template>
  <div class="container collection-box">
    <div class="row">
      <div
        v-for="category in categories"
        :key="category.slug"
        class="col-6 col-sm-6 col-md-3 col-lg-3"
      >
        <div class="colletion-item">
          <NuxtLink :to="`/shop?category=${category.slug}`">
            <img
              class="blur-up lazyload"
              :data-src="category.tileImage"
              :src="category.tileImage"
              :alt="category.label"
              :title="category.label"
            />
            <span class="title"><span>{{ category.label }}</span></span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, required: true },
});
</script>
