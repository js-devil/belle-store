<template>
  <Teleport to="body">
    <div class="viewer3d-overlay" @click.self="$emit('close')">
      <div class="viewer3d-panel">
        <button type="button" class="viewer3d-close" @click="$emit('close')">
          <i class="anm anm-times-l"></i>
        </button>
        <!--
          RESERVED: when modelData is populated with a real GLB/USDZ asset, this panel
          should render an actual 3D viewer (e.g. <model-viewer> or a three.js canvas)
          instead of this placeholder. No 3D rendering is implemented yet.
        -->
        <div v-if="!modelData" class="viewer3d-placeholder">
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
defineProps({
  modelData: { type: Object, default: null },
  posterImage: { type: String, required: true },
  productTitle: { type: String, required: true },
});
defineEmits(["close"]);
</script>

<style scoped>
.viewer3d-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.viewer3d-panel {
  position: relative;
  background: #fff;
  border-radius: 4px;
  max-width: 90vw;
  width: 480px;
  padding: 32px;
}
.viewer3d-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.viewer3d-placeholder {
  text-align: center;
}
.viewer3d-placeholder img {
  max-width: 220px;
  max-height: 220px;
  object-fit: contain;
  opacity: 0.6;
  margin-bottom: 16px;
}
.viewer3d-message {
  color: #555;
}
</style>
