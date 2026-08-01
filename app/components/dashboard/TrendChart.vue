<template>
  <div class="trend-chart">
    <p v-if="!points.length" class="trend-chart__empty">No data yet.</p>
    <svg v-else viewBox="0 0 600 160" preserveAspectRatio="none" class="trend-chart__svg">
      <line x1="0" y1="150" x2="600" y2="150" class="trend-chart__baseline" />
      <polyline :points="areaPoints" class="trend-chart__area" />
      <polyline :points="linePoints" class="trend-chart__line" />
      <circle
        v-for="(p, i) in points"
        :key="i"
        :cx="p.x"
        :cy="p.y"
        r="3.5"
        class="trend-chart__dot"
      >
        <title>{{ p.date }}: {{ p.count }}</title>
      </circle>
    </svg>
    <div v-if="points.length" class="trend-chart__axis">
      <span>{{ points[0].date }}</span>
      <span>{{ points[points.length - 1].date }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // [{ date: "YYYY-MM-DD", count }]
  data: { type: Array, required: true },
});

const points = computed(() => {
  if (!props.data.length) return [];
  const max = Math.max(1, ...props.data.map((d) => d.count));
  const step = props.data.length > 1 ? 600 / (props.data.length - 1) : 0;
  return props.data.map((d, i) => ({
    date: d.date,
    count: d.count,
    x: props.data.length > 1 ? i * step : 300,
    y: 150 - (d.count / max) * 130,
  }));
});

const linePoints = computed(() => points.value.map((p) => `${p.x},${p.y}`).join(" "));
const areaPoints = computed(() => {
  if (!points.value.length) return "";
  const first = points.value[0];
  const last = points.value[points.value.length - 1];
  return `${first.x},150 ${linePoints.value} ${last.x},150`;
});
</script>

<style scoped>
.trend-chart__empty {
  color: var(--text-muted);
  font-size: 13px;
}
.trend-chart__svg {
  width: 100%;
  height: 160px;
}
.trend-chart__baseline {
  stroke: var(--baseline);
  stroke-width: 1;
}
.trend-chart__area {
  fill: var(--series-1-area);
  stroke: none;
}
.trend-chart__line {
  fill: none;
  stroke: var(--series-1);
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.trend-chart__dot {
  fill: var(--series-1);
}
.trend-chart__axis {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}
</style>
