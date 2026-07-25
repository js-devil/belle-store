<template>
  <div id="pre-loader">
    <img src="/images/loader.gif" alt="Loading..." />
  </div>
</template>

<script setup>
onMounted(() => {
  function pre_loader() {
    try {
      console.log({ $ });
      $("#load").fadeOut();
      $("#pre-loader").delay(0).fadeOut("slow");
    } catch (error) {
      console.log({ error });
    }
  }
  console.log("preloader triggered");
  //   pre_loader();
});
</script>
