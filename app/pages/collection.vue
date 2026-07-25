<template>
  <div id="page-content">
    <div class="page section-header text-center">
      <div class="page-title">
        <div class="wrapper"><h1 class="page-width">Collection Page</h1></div>
      </div>
    </div>
    <CollectionGrid :categories="categories" />
  </div>
</template>

<script setup>
import { categories } from "@/data/categories.js";
</script>
