<template>
  <main class="belle" :class="pageBodyClass">
    <Preloader />

    <div class="pageWrapper">
      <MainNav />

      <slot />

      <!--Footer-->
      <NavFooter />

      <!--Scroll Top-->
      <span id="site-scroll"><i class="icon anm anm-angle-up-r"></i></span>
      <!--End Scroll Top-->
    </div>
  </main>
</template>

<script setup>
const route = useRoute();

// Mirrors the legacy template's per-page <body> class (e.g. "template-product",
// "page-template") which a number of style.css rules are scoped under.
const pageBodyClass = computed(() => route.meta.pageBodyClass ?? "page-template");

useHead({
  script: [
    {
      src: "/js/main.js",
      tagPosition: "bodyClose", // Places the script before the closing </body> tag
    },
  ],
});
</script>
