<template>
  <Teleport to="body">
    <div class="viewer3d-overlay" @click.self="handleClose">
      <div ref="panelEl" class="viewer3d-panel" :class="{ 'is-fullscreen': isFullscreen }">
        <div class="viewer3d-toolbar">
          <button
            v-if="modelSrc"
            type="button"
            class="viewer3d-icon-btn"
            :title="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
            @click="toggleFullscreen"
          >
            <i :class="isFullscreen ? 'anm anm-compress-alt' : 'anm anm-expand-l-arrows'"></i>
          </button>
          <button type="button" class="viewer3d-icon-btn viewer3d-close" title="Close" @click="handleClose">
            <i class="anm anm-times-l"></i>
          </button>
        </div>

        <!-- Real 3D model: model-viewer gives free mouse/touch orbit-drag rotation
             (both axes) and scroll/pinch zoom via camera-controls - no custom
             gesture handling needed for the core interaction. -->
        <template v-if="modelSrc">
          <model-viewer
            v-show="!hasError"
            ref="viewerEl"
            :src="modelSrc"
            :poster="posterImage"
            :alt="productTitle"
            camera-controls
            touch-action="none"
            shadow-intensity="1"
            exposure="1"
            class="viewer3d-model"
            @progress="handleProgress"
            @camera-change="handleCameraChange"
            @load="handleLoad"
            @error="handleError"
          ></model-viewer>

          <!-- Sleek, simple loading indicator: a slim bar rather than a
               spinner (some models are 10MB+ and a spinner reads as "stuck"),
               centered with a short status line rather than pinned to an edge. -->
          <div v-if="!isLoaded && !hasError" class="viewer3d-loading">
            <div class="viewer3d-loading__bar">
              <div class="viewer3d-loading__fill" :style="{ width: `${loadPercent}%` }"></div>
            </div>
            <p class="viewer3d-loading__text">Loading 3D model&hellip; {{ loadPercent }}%</p>
          </div>
          <p v-if="!hasError && !(colors && colors.length)" class="viewer3d-hint">
            Drag to rotate &middot; Scroll or pinch to zoom
          </p>

          <div v-if="colors && colors.length && !hasError" class="viewer3d-colors">
            <p class="viewer3d-colors__label">Choose a colour:</p>
            <div class="viewer3d-colors__row">
              <button
                v-for="color in colors"
                :key="color.name"
                type="button"
                class="viewer3d-color-swatch"
                :class="{ active: selectedColorName === color.name }"
                :style="{ backgroundColor: color.hex }"
                :title="color.name"
                :aria-label="`View in ${color.name}`"
                @click="selectColor(color)"
              ></button>
            </div>
            <p class="viewer3d-colors__selected">{{ selectedColorName }}</p>
          </div>

          <div v-if="hasError" class="viewer3d-placeholder">
            <img :src="posterImage" :alt="productTitle" />
            <p class="viewer3d-message">
              The 3D model for <strong>{{ productTitle }}</strong> couldn't be loaded right now.
            </p>
          </div>
        </template>

        <!-- No 3D asset sourced yet for this product - graceful placeholder. -->
        <div v-else class="viewer3d-placeholder">
          <img :src="posterImage" :alt="productTitle" />
          <p class="viewer3d-message">
            Interactive 3D preview coming soon for <strong>{{ productTitle }}</strong
            >.
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelSrc: { type: String, default: null },
  posterImage: { type: String, required: true },
  productTitle: { type: String, required: true },
  productSlug: { type: String, default: null },
  colors: { type: Array, default: null },
});
const emit = defineEmits(["close"]);

const { logEvent } = useAnalytics();

const panelEl = ref(null);
const viewerEl = ref(null);
const isFullscreen = ref(false);
const isLoaded = ref(false);
const loadPercent = ref(0);
const hasError = ref(false);
const selectedColorName = ref(props.colors?.[0]?.name ?? null);

function handleProgress(event) {
  loadPercent.value = Math.round((event.detail?.totalProgress ?? 0) * 100);
}

function hexToRgb01(hex) {
  const value = hex.replace("#", "");
  const r = parseInt(value.substring(0, 2), 16) / 255;
  const g = parseInt(value.substring(2, 4), 16) / 255;
  const b = parseInt(value.substring(4, 6), 16) / 255;
  return [r, g, b, 1];
}

// None of these GLBs ship KHR_materials_variants, so "choosing a colour"
// isn't a matter of switching a baked-in variant - it's a live retint of
// every material's base colour via model-viewer's material API instead.
function applyColor(hex) {
  const materials = viewerEl.value?.model?.materials;
  if (!materials?.length) return;
  const rgba = hexToRgb01(hex);
  materials.forEach((material) => material.pbrMetallicRoughness?.setBaseColorFactor(rgba));
}

function selectColor(color) {
  selectedColorName.value = color.name;
  applyColor(color.hex);
}

function handleLoad() {
  isLoaded.value = true;
  if (props.colors?.length) {
    applyColor(props.colors[0].hex);
  }
}

function handleError(event) {
  // model-viewer fires this when the GLB fails to fetch or fails to parse -
  // previously unhandled, so a broken model silently rendered as an empty
  // canvas (reported as "showing blank/white") with no indication anything
  // had gone wrong.
  console.error("model-viewer failed to load", props.modelSrc, event.detail);
  hasError.value = true;
  isLoaded.value = true;
}

// The native Fullscreen API is unreliable on mobile browsers (notably iOS
// Safari, which doesn't support it on arbitrary elements at all), which is
// why the expand button "sometimes doesn't respond" on mobile. Toggling this
// flag and relying purely on the .is-fullscreen CSS class below works
// everywhere since it never depends on browser fullscreen support.
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}

// Classify each camera-change as a rotation (theta/phi moved) or a zoom
// (radius moved), and debounce so one continuous drag/pinch gesture counts
// as a single logged event rather than one per animation frame.
let lastOrbit = null;
let gestureTimer = null;
let gestureKind = null;
const GESTURE_IDLE_MS = 400;

function handleCameraChange(event) {
  if (event.detail?.source !== "user-interaction") return;
  const orbit = viewerEl.value?.getCameraOrbit?.();
  if (!orbit) return;

  if (lastOrbit) {
    const rotated =
      Math.abs(orbit.theta - lastOrbit.theta) > 0.001 ||
      Math.abs(orbit.phi - lastOrbit.phi) > 0.001;
    const zoomed = Math.abs(orbit.radius - lastOrbit.radius) > 0.001;

    if (zoomed) gestureKind = "zoom_event";
    else if (rotated && gestureKind !== "zoom_event") gestureKind = "rotate_gesture";
  }
  lastOrbit = orbit;

  clearTimeout(gestureTimer);
  gestureTimer = setTimeout(() => {
    if (gestureKind) {
      logEvent(gestureKind, { slug: props.productSlug });
    }
    gestureKind = null;
  }, GESTURE_IDLE_MS);
}

function handleClose() {
  emit("close");
}

onBeforeUnmount(() => {
  clearTimeout(gestureTimer);
});
</script>

<style scoped>
.viewer3d-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.viewer3d-panel {
  position: relative;
  background: #111;
  border-radius: 4px;
  width: 90vw;
  max-width: 900px;
  height: 80vh;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.viewer3d-panel.is-fullscreen {
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  border-radius: 0;
}
.viewer3d-toolbar {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  z-index: 5;
}
.viewer3d-icon-btn {
  background: rgba(255, 255, 255, 0.12);
  border: none;
  color: #fff;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.viewer3d-icon-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}
.viewer3d-model {
  width: 100%;
  height: 100%;
  --poster-color: transparent;
}
.viewer3d-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.45);
  z-index: 4;
  pointer-events: none;
}
.viewer3d-loading__bar {
  width: 160px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}
.viewer3d-loading__fill {
  height: 100%;
  background: #fff;
  transition: width 0.15s ease-out;
}
.viewer3d-loading__text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  margin: 0;
}
.viewer3d-hint {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
  margin: 0;
  pointer-events: none;
}
.viewer3d-colors {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 5;
}
.viewer3d-colors__label {
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
  margin: 0;
}
.viewer3d-colors__row {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.viewer3d-color-swatch {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
.viewer3d-color-swatch.active {
  border-color: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.35);
}
.viewer3d-colors__selected {
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  margin: 0;
}
.viewer3d-placeholder {
  text-align: center;
  padding: 32px;
}
.viewer3d-placeholder img {
  max-width: 220px;
  max-height: 220px;
  object-fit: contain;
  opacity: 0.6;
  margin-bottom: 16px;
}
.viewer3d-message {
  color: #ccc;
}
</style>
