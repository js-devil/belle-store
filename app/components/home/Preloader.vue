<template>
  <!-- main.js's own DOMContentLoaded handler fades #pre-loader out via
       jQuery once the page has loaded - no Vue-side logic needed here. -->
  <div id="pre-loader">
    <div class="preloader-dots" role="status" aria-label="Loading">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style scoped>
/* #pre-loader itself (style.css) is a fixed, full-viewport box with no
   flex/centering of its own - the old <img> centered itself via absolute
   positioning + transform, which the dots need an equivalent for. */
#pre-loader {
  display: flex;
  align-items: center;
  justify-content: center;
}
.preloader-dots {
  display: flex;
  gap: 8px;
}
.preloader-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #111;
  animation: preloader-float 0.6s ease-in-out infinite alternate;
}
.preloader-dots span:nth-child(2) {
  animation-delay: 0.15s;
}
.preloader-dots span:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes preloader-float {
  from {
    transform: translateY(0);
    opacity: 0.4;
  }
  to {
    transform: translateY(-10px);
    opacity: 1;
  }
}
</style>
