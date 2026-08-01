<template>
  <div class="stat-tile">
    <div class="stat-tile__value">{{ value }}</div>
    <div class="stat-tile__label">{{ label }}</div>
    <div v-if="sublabel" class="stat-tile__sublabel">{{ sublabel }}</div>
  </div>
</template>

<script setup>
defineProps({
  value: { type: [String, Number], required: true },
  label: { type: String, required: true },
  sublabel: { type: String, default: "" },
});
</script>

<style scoped>
.stat-tile {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 20px 22px;
}
.stat-tile__value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
}
.stat-tile__label {
  margin-top: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}
.stat-tile__sublabel {
  margin-top: 2px;
  font-size: 12px;
  color: var(--text-muted);
}
</style>
