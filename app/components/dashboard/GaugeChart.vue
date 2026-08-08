<template>
  <div class="gauge-chart">
    <div class="gauge-chart__arc" :style="{ '--pct': clampedPercent, '--gauge-color': color }">
      <div class="gauge-chart__hole">
        <div class="gauge-chart__value">{{ value == null ? "–" : `${value}${unit}` }}</div>
      </div>
    </div>
    <p v-if="label" class="gauge-chart__label">{{ label }}</p>
  </div>
</template>

<script setup>
// A single rate/percentage on a half-circle, for the "how full is this
// 0-100 metric" job a donut over-states (a donut implies parts of a whole
// adding to 100%; a single rate against its own ceiling reads better as a
// gauge) - see choosing-a-form guidance. Value is expected 0-100; anything
// outside that range is clamped so the arc never overflows visually.
const props = defineProps({
  value: { type: Number, default: null },
  unit: { type: String, default: "%" },
  label: { type: String, default: "" },
  color: { type: String, default: "var(--series-1)" },
});

const clampedPercent = computed(() => {
  if (props.value == null) return 0;
  return Math.max(0, Math.min(100, props.value));
});
</script>

<style scoped>
.gauge-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.gauge-chart__arc {
  --pct: 0;
  --gauge-color: var(--series-1);
  width: 180px;
  height: 90px;
  position: relative;
  overflow: hidden;
}
/* The conic-gradient paints a full circle (0-360deg); "from -90deg" shifts
   its 0deg reference to 9 o'clock, so 0-180deg in that shifted frame sweeps
   left-to-right across exactly the top half. The bottom half is painted
   transparent and, redundantly, physically clipped by the half-height
   overflow:hidden wrapper above - belt and suspenders against any rounding
   at the 180deg seam. */
.gauge-chart__arc::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(
    from -90deg,
    var(--gauge-color) 0deg,
    var(--gauge-color) calc(var(--pct) * 1.8deg),
    var(--gridline) calc(var(--pct) * 1.8deg),
    var(--gridline) 180deg,
    transparent 180deg,
    transparent 360deg
  );
}
.gauge-chart__hole {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 126px;
  height: 63px;
  border-radius: 126px 126px 0 0;
  background: var(--surface-1);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
}
.gauge-chart__value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.gauge-chart__label {
  margin: 12px 0 0;
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  max-width: 180px;
}
</style>
