<template>
  <div class="sidebar_widget filterBox filter-widget">
    <div class="widget-title"><h2>Color</h2></div>
    <div class="filter-color swacth-list clearfix">
      <span
        v-for="color in colors"
        :key="color"
        class="swacth-btn"
        :class="[color, { checked: color === 'white' }]"
      ></span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  colors: {
    type: Array,
    default: () => [
      "black",
      "white",
      "red",
      "blue",
      "pink",
      "gray",
      "green",
      "orange",
      "yellow",
      "blueviolet",
      "brown",
      "darkGoldenRod",
      "darkGreen",
      "darkRed",
      "dimGrey",
      "khaki",
    ],
  },
});
</script>
