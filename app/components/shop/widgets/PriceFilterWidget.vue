<template>
  <div class="sidebar_widget filterBox filter-widget">
    <div class="widget-title"><h2>Price</h2></div>
    <form action="#" method="post" class="price-filter">
      <div id="slider-range" class="ui-slider"></div>
      <div class="row">
        <div class="col-6">
          <p class="no-margin"><input id="amount" type="text" /></p>
        </div>
        <div class="col-6 text-right margin-25px-top">
          <button class="btn btn-secondary btn--small">filter</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

// jQuery UI slider initialization (client-only)
onMounted(() => {
  if (typeof $ !== "undefined" && $("#slider-range").length) {
    $("#slider-range").slider({
      range: true,
      min: 0,
      max: 1000,
      values: [0, 500],
      slide: (event, ui) => {
        $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
      },
    });
    $("#amount").val(
      "$" +
        $("#slider-range").slider("values", 0) +
        " - $" +
        $("#slider-range").slider("values", 1),
    );
  }
});
</script>
