<template>
  <div class="compare-chart">
    <div v-for="(item, i) in items" :key="item.label" class="compare-chart__row">
      <div class="compare-chart__label">
        <span class="compare-chart__swatch" :style="{ background: colors[i] }"></span>
        <span>{{ item.label }}</span>
      </div>
      <div class="compare-chart__track">
        <div
          class="compare-chart__fill"
          :style="{ width: `${(item.value / maxValue) * 100}%`, background: colors[i] }"
        ></div>
      </div>
      <div class="compare-chart__value">{{ item.value == null ? "–" : `${item.value}${unit}` }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // [{ label, value }] - value may be null when there isn't enough data yet
  // (e.g. no purchases logged at all).
  items: { type: Array, required: true },
  unit: { type: String, default: "" },
});

// Fixed categorical order, sourced from the same --series-1/2/3 vars the
// rest of the dashboard uses (so this respects dark mode too) - never
// cycled, regardless of how many items are passed in.
const colors = ["var(--series-1)", "var(--series-2)", "var(--series-3)"];

const maxValue = computed(() => Math.max(1, ...props.items.map((item) => item.value || 0)));
</script>

<style scoped>
/* Each row carries its own label (rather than a separate legend strip above
   the bars) - a legend that wraps independently from the bars it describes
   is exactly what broke alignment once comparison labels grew to full
   phrases ("Actively browsed 2D photos" etc.). Grid + align-items:start
   keeps the bar/value columns steady even when a label wraps to 2-3 lines. */
.compare-chart__row {
  display: grid;
  grid-template-columns: minmax(120px, 36%) 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 9px 0;
}
.compare-chart__row + .compare-chart__row {
  border-top: 1px solid var(--gridline);
}
.compare-chart__label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12.5px;
  line-height: 1.4;
  color: var(--text-secondary);
}
.compare-chart__swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
  margin-top: 4px;
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
  white-space: nowrap;
}
</style>
