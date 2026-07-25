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
        <a
          href="javascript:void(0)"
          class="btn view-3d-trigger"
          title="View 3D"
          @click="show3dViewer = true"
          ><i class="icon anm anm-play-r" aria-hidden="true"></i
        ></a>
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
      :model-data="product.model3d"
      :poster-image="product.images.primary"
      :product-title="product.title"
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
</script>
