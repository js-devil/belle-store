<template>
  <div class="grouped-bar">
    <div class="grouped-bar__legend">
      <span v-for="(group, i) in groups" :key="group" class="grouped-bar__legend-item">
        <span class="grouped-bar__swatch" :style="{ background: colors[i] }"></span>
        {{ group }}
      </span>
    </div>
    <div class="grouped-bar__plot">
      <div v-for="metric in metrics" :key="metric.label" class="grouped-bar__cluster">
        <div class="grouped-bar__bars">
          <div v-for="(value, i) in metric.values" :key="i" class="grouped-bar__bar-wrap">
            <span class="grouped-bar__bar-value">{{ value == null ? "–" : `${value}${unit}` }}</span>
            <div
              class="grouped-bar__bar"
              :style="{ height: `${clampPct(value)}%`, background: colors[i] }"
            ></div>
          </div>
        </div>
        <p class="grouped-bar__cluster-label">{{ metric.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Several rate metrics (cart/wishlist/reviews/size-guide) x several groups
// (3D/active-2D/passive) told a fragmented story as four separate
// horizontal compare-bars - one clustered vertical bar chart puts the whole
// "does 3D lead to more action" comparison in a single, denser view. Values
// are expected 0-100 (percentages), sharing one fixed 0-100 scale rather
// than an auto-fit max, per the "one axis, never misrepresent the ceiling"
// rule - two 40% bars must look identical whichever metric they're under.
const props = defineProps({
  groups: { type: Array, required: true }, // series labels, fixed order
  metrics: { type: Array, required: true }, // [{ label, values: [n, n, n] }]
  unit: { type: String, default: "%" },
});

const colors = ["var(--series-1)", "var(--series-2)", "var(--series-3)"];

function clampPct(value) {
  if (value == null) return 0;
  return Math.max(0, Math.min(100, value));
}
</script>

<style scoped>
.grouped-bar__legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  font-size: 12px;
  color: var(--text-secondary);
}
.grouped-bar__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.grouped-bar__swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}
.grouped-bar__plot {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 170px;
  border-bottom: 1px solid var(--gridline);
}
.grouped-bar__cluster {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  min-width: 0;
}
.grouped-bar__bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
  height: 100%;
  width: 100%;
}
.grouped-bar__bar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  width: 22px;
}
.grouped-bar__bar-value {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.grouped-bar__bar {
  width: 100%;
  border-radius: 3px 3px 0 0;
  min-height: 2px;
  transition: height 0.2s ease-out;
}
.grouped-bar__cluster-label {
  margin: 10px 0 0;
  font-size: 11.5px;
  line-height: 1.35;
  color: var(--text-secondary);
  text-align: center;
}
</style>
