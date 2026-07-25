<template>
  <Teleport to="body">
    <div class="lightbox-overlay" @click.self="$emit('close')">
      <button type="button" class="lightbox-close" @click="$emit('close')">
        <i class="anm anm-times-l"></i>
      </button>
      <button
        v-if="images.length > 1"
        type="button"
        class="lightbox-nav lightbox-prev"
        @click="prev"
      >
        <i class="fa fa-angle-left"></i>
      </button>
      <img class="lightbox-image" :src="images[activeIndex]" :alt="productTitle" />
      <button
        v-if="images.length > 1"
        type="button"
        class="lightbox-nav lightbox-next"
        @click="next"
      >
        <i class="fa fa-angle-right"></i>
      </button>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  images: { type: Array, required: true },
  startIndex: { type: Number, default: 0 },
  productTitle: { type: String, default: "" },
});
defineEmits(["close"]);

const activeIndex = ref(props.startIndex);

function next() {
  activeIndex.value = (activeIndex.value + 1) % props.images.length;
}
function prev() {
  activeIndex.value =
    (activeIndex.value - 1 + props.images.length) % props.images.length;
}
</script>

<style scoped>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.lightbox-image {
  max-width: 85vw;
  max-height: 85vh;
  object-fit: contain;
}
.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  font-size: 26px;
  cursor: pointer;
}
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #fff;
  font-size: 36px;
  cursor: pointer;
  padding: 12px;
}
.lightbox-prev {
  left: 12px;
}
.lightbox-next {
  right: 12px;
}
</style>
