<template>
  <div class="bar-chart">
    <p v-if="!data.length" class="bar-chart__empty">No data yet.</p>
    <div v-for="row in data" :key="row.key" class="bar-chart__row">
      <div class="bar-chart__label" :title="row.key">{{ row.label }}</div>
      <div class="bar-chart__track">
        <div
          class="bar-chart__fill"
          :style="{ width: `${(row.count / maxCount) * 100}%` }"
        ></div>
      </div>
      <div class="bar-chart__value">{{ row.count }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // [{ key, label, count }]
  data: { type: Array, required: true },
});

const maxCount = computed(() => Math.max(1, ...props.data.map((row) => row.count)));
</script>

<style scoped>
.bar-chart__empty {
  color: var(--text-muted);
  font-size: 13px;
}
.bar-chart__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2fr 36px;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
}
.bar-chart__label {
  font-size: 13px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bar-chart__track {
  background: var(--gridline);
  border-radius: 4px;
  height: 10px;
  overflow: hidden;
}
.bar-chart__fill {
  height: 100%;
  background: var(--series-1);
  border-radius: 4px;
  transition: width 0.2s ease-out;
}
.bar-chart__row:hover .bar-chart__fill {
  background: var(--series-1-hover);
}
.bar-chart__value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
