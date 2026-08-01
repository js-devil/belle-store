<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <div>
        <h1>Interaction Analytics</h1>
        <p class="dashboard__subtitle">
          Anonymous usage data for the 3D-visualization study. Not linked from any page.
        </p>
      </div>
      <button type="button" class="dashboard__refresh" @click="refresh()">Refresh</button>
    </header>

    <p v-if="pending" class="dashboard__loading">Loading&hellip;</p>
    <p v-else-if="error" class="dashboard__loading">
      Couldn't load analytics data. If this is the first load after adding the
      analytics endpoint, restart the dev server and refresh.
    </p>

    <template v-else-if="data">
      <section class="dashboard__stats">
        <StatTile label="Total Visits" :value="data.totalVisits" sublabel="unique anonymous sessions" />
        <StatTile label="Page Views" :value="data.totalPageViews" />
        <StatTile label="Add to Cart Clicks" :value="data.totalAddToCart" />
        <StatTile
          label="3D Viewer Interactions"
          :value="data.total3dInteractions"
          :sublabel="`${data.totalRotate} rotations, ${data.totalZoom} zooms`"
        />
      </section>

      <div class="dashboard__grid">
        <section class="dashboard__panel">
          <h2>Most Viewed Pages</h2>
          <BarChart :data="pageRows" />
        </section>

        <section class="dashboard__panel">
          <h2>Most Viewed Products</h2>
          <BarChart :data="productRows(data.topProductViews)" />
        </section>

        <section class="dashboard__panel">
          <h2>3D Viewer: Rotate vs. Zoom</h2>
          <CategoryCompareChart
            :items="[
              { label: 'Rotate gestures', value: data.totalRotate },
              { label: 'Zoom gestures', value: data.totalZoom },
            ]"
          />
        </section>

        <section class="dashboard__panel">
          <h2>Most 3D-Interacted Products</h2>
          <BarChart :data="productRows(data.top3dProducts)" />
        </section>

        <section class="dashboard__panel">
          <h2>Most Added to Cart</h2>
          <BarChart :data="productRows(data.topAddToCart)" />
        </section>

        <section class="dashboard__panel dashboard__panel--wide">
          <h2>Daily Activity (all events)</h2>
          <TrendChart :data="dailyRows" />
        </section>
      </div>
    </template>
  </div>
</template>

<script setup>
import { getProductBySlug } from "@/data/index.js";

definePageMeta({ layout: "dashboard" });
useHead({ title: "Interaction Analytics" });

const { data, pending, error, refresh } = await useFetch("/api/analytics/summary");

function productRows(entries) {
  return (entries ?? []).map((entry) => ({
    key: entry.key,
    label: getProductBySlug(entry.key)?.title ?? entry.key,
    count: entry.count,
  }));
}

const pageRows = computed(() =>
  (data.value?.topPages ?? []).map((entry) => ({
    key: entry.key,
    label: entry.key,
    count: entry.count,
  }))
);

const dailyRows = computed(() =>
  Object.entries(data.value?.eventsByDay ?? {})
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }))
);
</script>

<style scoped>
.dashboard {
  max-width: 1100px;
  margin: 0 auto;
}
.dashboard__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}
.dashboard__header h1 {
  font-size: 24px;
  margin: 0 0 4px;
}
.dashboard__subtitle {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0;
}
.dashboard__refresh {
  background: var(--surface-1);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
}
.dashboard__refresh:hover {
  background: var(--gridline);
}
.dashboard__loading {
  color: var(--text-muted);
}
.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}
.dashboard__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.dashboard__panel {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 20px 22px;
}
.dashboard__panel--wide {
  grid-column: 1 / -1;
}
.dashboard__panel h2 {
  font-size: 15px;
  margin: 0 0 14px;
  color: var(--text-primary);
}

@media (max-width: 720px) {
  .dashboard__stats {
    grid-template-columns: 1fr 1fr;
  }
  .dashboard__grid {
    grid-template-columns: 1fr;
  }
}
</style>
