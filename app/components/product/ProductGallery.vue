<template>
  <div class="product-details-img">
    <div class="product-thumb">
      <div class="product-dec-slider-2 product-tab-left">
        <a
          v-for="(image, index) in thumbnails"
          :key="image"
          href="javascript:void(0)"
          :class="{ active: index === activeIndex }"
          @click="activeIndex = index"
        >
          <img class="blur-up lazyload" :src="image" :alt="product.title" />
        </a>
      </div>
    </div>
    <div class="zoompro-wrap product-zoom-right pl-20">
      <div class="zoompro-span">
        <img class="blur-up lazyload" :src="thumbnails[activeIndex]" :alt="product.title" />
      </div>
      <div v-if="product.labels && product.labels.length" class="product-labels">
        <span
          v-for="label in product.labels"
          :key="label.text"
          class="lbl"
          :class="label.class"
          >{{ label.text }}</span
        >
      </div>
      <div class="product-buttons">
        <span v-if="product.model3d" class="tooltip-wrap">
          <a
            href="javascript:void(0)"
            class="btn view-3d-trigger"
            title="View 3D"
            @click="open3dViewer"
            ><i class="icon anm anm-play-r" aria-hidden="true"></i
          ></a>
          <span class="tooltip-bubble">Click to view product in 3D</span>
        </span>
        <a
          href="javascript:void(0)"
          class="btn prlightbox"
          title="Zoom"
          @click="showLightbox = true"
          ><i class="icon anm anm-expand-l-arrows" aria-hidden="true"></i
        ></a>
      </div>
    </div>

    <ImageLightbox
      v-if="showLightbox"
      :images="thumbnails"
      :start-index="activeIndex"
      :product-title="product.title"
      @close="showLightbox = false"
    />
    <ProductViewer3D
      v-if="show3dViewer"
      :model-src="product.model3d"
      :poster-image="product.images.primary"
      :product-title="product.title"
      :product-slug="product.slug"
      @close="show3dViewer = false"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
});

const thumbnails = computed(() =>
  props.product.images.gallery?.length
    ? props.product.images.gallery
    : [props.product.images.primary, props.product.images.hover]
);

const activeIndex = ref(0);
const showLightbox = ref(false);
const show3dViewer = ref(false);

function open3dViewer() {
  show3dViewer.value = true;
}
</script>

<style scoped>
.tooltip-wrap {
  position: relative;
  display: inline-block;
}
.tooltip-bubble {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  padding: 6px 10px;
  background: #111;
  color: #fff;
  font-size: 12px;
  line-height: 1.3;
  white-space: nowrap;
  border-radius: 3px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease-in-out;
  pointer-events: none;
  z-index: 10;
}
.tooltip-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  right: 12px;
  border: 5px solid transparent;
  border-top-color: #111;
}
.tooltip-wrap:hover .tooltip-bubble,
.tooltip-wrap:focus-within .tooltip-bubble {
  opacity: 1;
  visibility: visible;
}
</style>
