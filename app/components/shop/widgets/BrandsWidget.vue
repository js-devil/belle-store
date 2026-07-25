<template>
  <div class="sidebar_widget filterBox filter-widget">
    <div class="widget-title"><h2>Brands</h2></div>
    <ul>
      <li v-for="brand in brands" :key="brand">
        <input type="checkbox" :value="brand" :id="'brand-' + brand" />
        <label :for="'brand-' + brand"
          ><span><span></span></span>{{ brand }}</label
        >
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  brands: {
    type: Array,
    default: () => ["Allen Vela", "Oxymat", "Vanelas", "Pagini", "Monark"],
  },
});
</script>
