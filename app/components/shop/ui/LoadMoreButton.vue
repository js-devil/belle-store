<template>
  <div v-if="hasMore" class="infinitpaginOuter">
    <div class="infinitpagin">
      <a href="#" class="btn loadMore" @click.prevent="$emit('load-more')"
        >Load More</a
      >
    </div>
  </div>
</template>

<script setup>
defineProps({
  hasMore: { type: Boolean, default: true },
});
defineEmits(["load-more"]);
</script>
