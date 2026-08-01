<template>
  <div class="compare-chart">
    <div class="compare-chart__legend">
      <span v-for="(item, i) in items" :key="item.label" class="compare-chart__legend-item">
        <span class="compare-chart__swatch" :style="{ background: colors[i] }"></span>
        {{ item.label }}
      </span>
    </div>
    <div v-for="(item, i) in items" :key="item.label" class="compare-chart__row">
      <div class="compare-chart__track">
        <div
          class="compare-chart__fill"
          :style="{ width: `${(item.value / maxValue) * 100}%`, background: colors[i] }"
        ></div>
      </div>
      <div class="compare-chart__value">{{ item.value }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // [{ label, value }] - exactly two items expected
  items: { type: Array, required: true },
});

// Fixed categorical order (slot 1 blue, slot 2 orange) - never cycled.
const colors = ["#2a78d6", "#eb6834"];

const maxValue = computed(() => Math.max(1, ...props.items.map((item) => item.value)));
</script>

<style scoped>
.compare-chart__legend {
  display: flex;
  gap: 16px;
  margin-bottom: 10px;
  font-size: 12px;
  color: var(--text-secondary);
}
.compare-chart__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.compare-chart__swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
}
.compare-chart__row {
  display: grid;
  grid-template-columns: 1fr 40px;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}
.compare-chart__track {
  background: var(--gridline);
  border-radius: 4px;
  height: 14px;
  overflow: hidden;
}
.compare-chart__fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.2s ease-out;
}
.compare-chart__value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
