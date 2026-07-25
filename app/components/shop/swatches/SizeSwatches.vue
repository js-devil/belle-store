<template>
  <div class="sidebar_widget filterBox filter-widget size-swacthes">
    <div class="widget-title"><h2>Size</h2></div>
    <div class="filter-color swacth-list">
      <ul>
        <li v-for="size in sizes" :key="size">
          <span class="swacth-btn" :class="{ checked: size === 'X' }">{{
            size
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sizes: {
    type: Array,
    default: () => ["X", "XL", "XLL", "M", "L", "S", "XXXL", "XXL", "XS"],
  },
});
</script>
