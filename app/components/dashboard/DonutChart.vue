<template>
  <p v-if="!total" class="donut-chart__empty">No data yet.</p>
  <div v-else class="donut-chart">
    <div class="donut-chart__ring" :style="{ background: gradient }">
      <div class="donut-chart__hole">
        <div class="donut-chart__center-value">{{ total }}</div>
        <div v-if="centerLabel" class="donut-chart__center-label">{{ centerLabel }}</div>
      </div>
    </div>
    <ul class="donut-chart__legend">
      <li v-for="(item, i) in itemsWithPercent" :key="item.label">
        <span class="donut-chart__swatch" :style="{ background: colors[i % colors.length] }"></span>
        <span class="donut-chart__legend-label">{{ item.label }}</span>
        <span class="donut-chart__legend-value">{{ item.value }} ({{ item.percent }}%)</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  // [{ label, value }] - up to 3 categories (fixed colour order, never cycled)
  items: { type: Array, required: true },
  centerLabel: { type: String, default: "" },
});

const colors = ["var(--series-1)", "var(--series-2)", "var(--series-3)"];

const total = computed(() => props.items.reduce((sum, item) => sum + item.value, 0));

const itemsWithPercent = computed(() =>
  props.items.map((item) => ({
    ...item,
    percent: total.value ? Math.round((item.value / total.value) * 1000) / 10 : 0,
  }))
);

const gradient = computed(() => {
  if (!total.value) return "none";
  let angle = 0;
  const stops = props.items.map((item, i) => {
    const start = angle;
    angle += (item.value / total.value) * 360;
    return `${colors[i % colors.length]} ${start}deg ${angle}deg`;
  });
  return `conic-gradient(${stops.join(", ")})`;
});
</script>

<style scoped>
.donut-chart__empty {
  color: var(--text-muted);
  font-size: 13px;
}
.donut-chart {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.donut-chart__ring {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.donut-chart__hole {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: var(--surface-1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.donut-chart__center-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}
.donut-chart__center-label {
  font-size: 10px;
  color: var(--text-muted);
  text-align: center;
  margin-top: 2px;
}
.donut-chart__legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* Lets the legend wrap to its own row below the ring on a narrow card
     instead of being squeezed into a sliver of space beside a
     fixed-120px ring, which is what forced long labels to wrap hard. */
  flex: 1 1 170px;
  min-width: 170px;
}
.donut-chart__legend li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 1.4;
}
.donut-chart__swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
  margin-top: 4px;
}
.donut-chart__legend-label {
  color: var(--text-secondary);
}
.donut-chart__legend-value {
  color: var(--text-primary);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  margin-left: auto;
  padding-left: 12px;
}
</style>
