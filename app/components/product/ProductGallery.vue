<template>
  <div class="product-details-img">
    <div class="product-thumb">
      <div class="product-dec-slider-2 product-tab-left">
        <a
          v-for="(image, index) in thumbnails"
          :key="image"
          href="javascript:void(0)"
          :class="{ active: index === activeIndex }"
          @click="selectThumbnail(index)"
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
          <span class="tooltip-bubble" :class="{ 'is-auto-visible': showAutoTooltip }"
            >Click to view product in 3D</span
          >
        </span>
        <a
          href="javascript:void(0)"
          class="btn prlightbox"
          title="Zoom"
          @click="openLightbox"
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
      :colors="product.colors"
      :color-target-materials="product.colorTargetMaterials"
      :material-colors="product.materialColors"
      :dark-background="!!product.viewerDarkBackground"
      @close="show3dViewer = false"
      @rotate="emit('rotate')"
      @zoom="emit('zoom')"
      @error="emit('viewer-error')"
      @load-time="emit('load-time', $event)"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
});
// All engagement counts are emitted up to the page, which accumulates the
// whole visit and sends one consolidated event on leaving - see
// useProductEngagement.js.
const emit = defineEmits([
  "view-3d-opened",
  "rotate",
  "zoom",
  "viewer-error",
  "thumbnail-switch",
  "image-zoom",
  "load-time",
]);

const thumbnails = computed(() =>
  props.product.images.gallery?.length
    ? props.product.images.gallery
    : [props.product.images.primary, props.product.images.hover]
);

const activeIndex = ref(0);
const showLightbox = ref(false);
const show3dViewer = ref(false);

// Thumbnail dwell time: a switch itself is instant, so there's no "open"
// event to watch like the viewer/lightbox - instead, the gap between one
// switch and the next IS the time spent looking at that thumbnail's image.
// Capped per-gap so a switch followed by, say, going to make coffee doesn't
// get counted as browsing time; the trailing gap up to flush time (still
// looking at the last-selected thumbnail when the visit ends) is added the
// same way in currentOpenDurations() below.
const THUMBNAIL_DWELL_CAP_MS = 15000;
let lastThumbnailAt = null;
const thumbnailDwellMs = ref(0);

function selectThumbnail(index) {
  const now = Date.now();
  if (lastThumbnailAt != null) {
    thumbnailDwellMs.value += Math.min(now - lastThumbnailAt, THUMBNAIL_DWELL_CAP_MS);
  }
  lastThumbnailAt = now;
  activeIndex.value = index;
  emit("thumbnail-switch");
}

function openLightbox() {
  showLightbox.value = true;
  emit("image-zoom");
}

function open3dViewer() {
  show3dViewer.value = true;
  showAutoTooltip.value = false;
  emit("view-3d-opened");
}

// "Looking duration": how long the 3D viewer / image lightbox actually
// stayed open, tracked here (rather than via a close event from the child)
// because ProductGallery persists for the whole page visit while the
// viewer/lightbox can be opened and closed several times, or left open
// when the visitor navigates away entirely. A close event tied to the
// child's onBeforeUnmount would miss that last case, since a hard
// navigation tears down the page without ever running Vue's unmount
// hooks - watching the open flags here and reading currentOpenDurations()
// at flush time (see [slug].vue) covers a still-open viewer too.
let viewer3dOpenedAt = null;
let lightboxOpenedAt = null;
const viewer3dOpenMs = ref(0);
const imageLightboxOpenMs = ref(0);

// Attention moved elsewhere - stop crediting thumbnail-dwell time so it
// doesn't double-count the same wall-clock span the viewer/lightbox open
// duration already covers.
function closeThumbnailDwell() {
  if (lastThumbnailAt != null) {
    thumbnailDwellMs.value += Math.min(Date.now() - lastThumbnailAt, THUMBNAIL_DWELL_CAP_MS);
    lastThumbnailAt = null;
  }
}

watch(show3dViewer, (isOpen) => {
  if (isOpen) {
    viewer3dOpenedAt = Date.now();
    closeThumbnailDwell();
  } else if (viewer3dOpenedAt != null) {
    viewer3dOpenMs.value += Date.now() - viewer3dOpenedAt;
    viewer3dOpenedAt = null;
  }
});
watch(showLightbox, (isOpen) => {
  if (isOpen) {
    lightboxOpenedAt = Date.now();
    closeThumbnailDwell();
  } else if (lightboxOpenedAt != null) {
    imageLightboxOpenMs.value += Date.now() - lightboxOpenedAt;
    lightboxOpenedAt = null;
  }
});

function currentOpenDurations() {
  const now = Date.now();
  return {
    viewer3dOpenMs: viewer3dOpenMs.value + (viewer3dOpenedAt != null ? now - viewer3dOpenedAt : 0),
    // "Time inside the image zoom" broadened to the fuller 2D-inspection
    // picture: lightbox open time, plus thumbnail dwell (see
    // selectThumbnail() above) and reviews-tab dwell (see ProductTabs.vue,
    // pulled in at [slug].vue's flush time) - all three are real,
    // independently-measured spans, summed by the caller rather than here
    // so this component doesn't need to know about the reviews tab.
    imageLightboxOpenMs:
      imageLightboxOpenMs.value +
      (lightboxOpenedAt != null ? now - lightboxOpenedAt : 0) +
      thumbnailDwellMs.value +
      (lastThumbnailAt != null ? Math.min(now - lastThumbnailAt, THUMBNAIL_DWELL_CAP_MS) : 0),
  };
}

defineExpose({ currentOpenDurations });

// Surface the 3D-view tooltip on its own for a few seconds when the page
// loads, rather than only on hover, so first-time visitors notice the
// feature exists without having to discover it by accident.
const showAutoTooltip = ref(false);
let autoTooltipTimer = null;

if (props.product.model3d) {
  onMounted(() => {
    showAutoTooltip.value = true;
    autoTooltipTimer = setTimeout(() => {
      showAutoTooltip.value = false;
    }, 4000);
  });
  onBeforeUnmount(() => clearTimeout(autoTooltipTimer));
}
</script>

<style scoped>
.tooltip-wrap {
  position: relative;
  /* .product-buttons .btn elements stack vertically via float:right + clear:both
     (see style.css) - this wrapper must join that same float stack, otherwise
     it sits in normal flow and the plain .btn sibling below (zoom) floats
     above/beside it instead of stacking underneath as intended. */
  float: right;
  clear: both;
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
.tooltip-wrap:focus-within .tooltip-bubble,
.tooltip-bubble.is-auto-visible {
  opacity: 1;
  visibility: visible;
}

/* Desktop lays the gallery out with plain floats (.product-thumb at 12.5%
   width, .product-zoom-right at 87%, both float:left - see style.css) with
   no mobile override at all, so on a narrow screen the thumbnail rail
   squeezes into a sliver beside the main image instead of stacking.
   Reflow with flex + order on mobile: main image on top, thumbnails as a
   row underneath, without changing DOM order (which the click/active-state
   logic doesn't need to change). */
@media (max-width: 767px) {
  .product-details-img {
    display: flex;
    flex-direction: column;
  }
  .product-thumb {
    width: 100%;
    float: none;
    order: 2;
    padding-right: 0;
    margin-top: 12px;
  }
  .product-dec-slider-2 {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .product-dec-slider-2 a {
    width: 60px;
    height: 60px;
  }
  .zoompro-wrap {
    width: 100%;
    float: none;
    order: 1;
    padding-left: 0 !important;
  }
}
</style>
