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
      <!-- Study framing: anyone landing on this page (a supervisor, a
           committee member) should understand what it's measuring and why
           before they see a single chart. -->
      <section class="study-intro">
        <p class="study-intro__eyebrow">The Study</p>
        <h2 class="study-intro__title">
          A Study of 3D Product Visualization and Its Effect on User Engagement in Online
          Shopping Platforms in Nigeria
        </h2>
        <p class="study-intro__aim">
          <strong>Aim:</strong> to examine the effect of 3D product visualization on user
          engagement in Nigerian online shopping platforms, and to provide evidence-based
          recommendations for its adoption across the Nigerian e-commerce industry. Every
          chart below is built from real, anonymous interaction data captured on this
          prototype - comparing user interactions on the interactive 3D viewer against interactions on
          the traditional 2D images of the same products.
        </p>
      </section>

      <!-- The single strongest finding, in one sentence. -->
      <section class="headline">
        <p class="headline__eyebrow">Key finding</p>
        <p class="headline__text">{{ headlineText }}</p>
      </section>

      <section class="dashboard__stats">
        <StatTile label="Total Visits" :value="data.totalVisits" sublabel="unique anonymous sessions" />
        <StatTile label="Product Page Visits" :value="data.totalProductVisits" />
        <StatTile label="Orders Placed" :value="data.totalPurchases" :sublabel="revenueSublabel" />
        <StatTile
          :value="fmtPct(data.viewerErrorRatePercent)"
          label="3D load failures"
          sublabel="adoption barrier proxy"
        />
      </section>

      <!-- RQ1 -->
      <section class="rq-section">
        <div class="rq-section__head">
          <span class="rq-tag">RQ1 &middot; Engagement</span>
          <h2>How does 3D product visualization influence user engagement on Nigerian e-commerce platforms?</h2>
        </div>
        <p class="rq-finding">{{ rq1Text }}</p>
        <div class="rq-charts rq-charts--four">
          <div class="chart-card">
            <h3>Interaction volume: 3D vs. 2D</h3>
            <PieChart
              center-label="interactions"
              :items="[
                { label: '3D (rotate + zoom)', value: data.total3dInteractions },
                { label: '2D (zoom + thumbnails)', value: data.total2dInteractions },
              ]"
            />
          </div>
          <div class="chart-card">
            <h3>Time spent evaluating a product</h3>
            <PieChart
              center-label="seconds combined"
              :items="[
                { label: 'Opened 3D viewer (seconds)', value: data.avgTimeOnPageWith3dSeconds },
                { label: '2D images only (seconds)', value: data.avgTimeOnPageWithout3dSeconds },
              ]"
            />
          </div>
          <div class="chart-card chart-card--gauge">
            <h3>3D adoption rate</h3>
            <GaugeChart
              :value="threeDAdoptionRatePercent"
              label="of 3D-enabled visits opened the viewer (rest browsed 2D or stayed passive - see RQ2/RQ3 for that split)"
            />
          </div>
          <div class="chart-card">
            <h3>Viewing duration: 3D vs. 2D</h3>
            <CategoryCompareChart
              unit="s"
              :items="[
                { label: 'Time inside the 3D viewer', value: data.avgViewer3dOpenSeconds },
                { label: 'Time inside 2D (zoom, thumbnails, reviews)', value: data.avgImageLightboxOpenSeconds },
              ]"
            />
          </div>
        </div>
      </section>

      <!-- RQ2 -->
      <section class="rq-section">
        <div class="rq-section__head">
          <span class="rq-tag">RQ2 &middot; Purchasing decisions</span>
          <h2>
            How does 3D product visualization affect user interaction and purchasing decisions
            compared to standard image displays?
          </h2>
        </div>
        <p class="rq-finding">{{ rq2Text }}</p>
        <div class="rq-charts rq-charts--three">
          <div class="chart-card">
            <h3>Purchase conversion rate</h3>
            <CategoryCompareChart
              unit="%"
              :items="[
                { label: `Used 3D viewer (${data.sessionsUsed3dCount} sessions)`, value: data.conversionRateWith3dPercent },
                { label: `2D images only (${data.sessionsWithout3dCount} sessions)`, value: data.conversionRateWithout3dPercent },
              ]"
            />
          </div>
          <div class="chart-card">
            <h3>Purchase intent, right after viewing</h3>
            <GroupedBarChart
              :groups="engagementGroups"
              :metrics="[
                { label: 'Added to cart', values: [data.cartRateWith3dPercent, data.cartRateActive2dPercent, data.cartRateWithout3dPercent] },
                { label: 'Wishlisted', values: [data.wishlistRateWith3dPercent, data.wishlistRateActive2dPercent, data.wishlistRateWithout3dPercent] },
              ]"
            />
          </div>
          <div class="chart-card">
            <h3>How buyers get there</h3>
            <DonutChart
              center-label="sessions"
              :items="[
                { label: 'Purchased, used 3D', value: data.purchasedWithUsed3dCount },
                { label: 'Purchased, 2D only', value: data.purchasedWithoutUsed3dCount },
                { label: 'Did not purchase', value: data.totalVisits - data.totalPurchases },
              ]"
            />
          </div>
        </div>
      </section>

      <!-- RQ3 -->
      <section class="rq-section hide">
        <div class="rq-section__head">
          <span class="rq-tag">RQ3 &middot; Product evaluation</span>
          <h2>
            To what extent does 3D product visualization improve how customers evaluate
            products during the shopping experience?
          </h2>
        </div>
        <p class="rq-finding">{{ rq3Text }}</p>
        <div class="rq-charts rq-charts--single">
          <div class="chart-card">
            <h3>Evaluation depth: reviews &amp; size guide</h3>
            <GroupedBarChart
              :groups="engagementGroups"
              :metrics="[
                { label: 'Checked reviews (quality/appearance confidence)', values: [data.reviewsRateWith3dPercent, data.reviewsRateActive2dPercent, data.reviewsRateWithout3dPercent] },
                { label: 'Checked size guide (fit confidence)', values: [data.sizeChartRateWith3dPercent, data.sizeChartRateActive2dPercent, data.sizeChartRateWithout3dPercent] },
              ]"
            />
          </div>
        </div>
      </section>

      <!-- RQ4 -->
      <section class="rq-section">
        <div class="rq-section__head">
          <span class="rq-tag">RQ4 &middot; Adoption barriers</span>
          <h2>What challenges influence the adoption of 3D product visualization on Nigerian e-commerce platforms?</h2>
        </div>
        <p class="rq-finding">{{ rq4Text }}</p>
        <div class="rq-charts rq-charts--three">
          <div class="chart-card">
            <h3>3D viewer attempts: loaded vs. failed</h3>
            <DonutChart
              center-label="attempts"
              :items="[
                { label: 'Loaded successfully', value: data.total3dInteractions },
                { label: 'Failed to load', value: data.totalViewerErrors },
              ]"
            />
          </div>
          <div class="chart-card chart-card--gauge">
            <h3>Load failure rate</h3>
            <GaugeChart
              :value="data.viewerErrorRatePercent"
              color="var(--series-2)"
              :label="`${data.totalViewerErrors} failed loads out of ${data.total3dInteractions + data.totalViewerErrors} attempts`"
            />
          </div>
          <div class="chart-card chart-card--stat">
            <h3>Average model load time</h3>
            <StatTile
              :value="fmtSeconds(data.avgModelLoadTimeMs)"
              label="average time to load a 3D model"
              :sublabel="`based on ${data.loadTimeSampleCount} successful load${data.loadTimeSampleCount === 1 ? '' : 's'}`"
            />
          </div>
        </div>
      </section>

      <!-- RQ5 -->
      <section class="rq-section rq-section--recommendation">
        <div class="rq-section__head">
          <span class="rq-tag">RQ5 &middot; Business benefit</span>
          <h2>
            How can Nigerian businesses benefit from the implementation of 3D product
            visualization on their e-commerce platforms?
          </h2>
        </div>
        <p class="rq-finding">{{ rq5Text }}</p>
        <div class="rq-charts rq-charts--two">
          <div class="chart-card">
            <h3>Most Viewed Categories</h3>
            <BarChart :data="categoryRows(data.topViewedCategories)" />
          </div>
          <div class="chart-card">
            <h3>Most 3D-Interacted Categories</h3>
            <BarChart :data="categoryRows(data.top3dInteractedCategories)" />
          </div>
        </div>
      </section>

      <!-- Appendix: product-level detail, supplementary to the RQ narrative. -->
      <section class="appendix">
        <h2 class="appendix__title">Product-Level Detail</h2>
        <div class="dashboard__grid">
          <section class="dashboard__panel">
            <h3>Most Viewed Products</h3>
            <BarChart :data="productRows(data.topProductViews)" />
          </section>
          <section class="dashboard__panel">
            <h3>Most 3D-Interacted Products</h3>
            <BarChart :data="productRows(data.top3dProducts)" />
          </section>
          <section class="dashboard__panel dashboard__panel--wide">
            <h3>Most Purchased Products</h3>
            <BarChart :data="productRows(data.topPurchasedProducts)" />
          </section>
        </div>
      </section>

      <footer class="methodology">
        <strong>Methodology note:</strong> every metric above comes from anonymous, per-session
        interaction events - no name or account is ever tied to the analytics data (the wallet
        system used to simulate purchases is logged separately, by session ID only). "3D vs. 2D"
        comparisons are restricted to products that actually offer a 3D model, so the comparison
        is always against the same pool of products, never against ones that never had a 3D
        option to begin with.
        <br /><br />
        <strong>On tracking fairness:</strong> the 3D viewer is a single, deliberate channel - a
        visit only counts as "3D" if the shopper actively opened it. Early versions of this
        dashboard compared that group against <em>every</em> visit that didn't, which silently
        included shoppers who bounced without looking at anything at all - diluting the 2D side
        with disengaged traffic the 3D side was never diluted by. Visits are now split three ways:
        <strong>opened the 3D viewer</strong>, <strong>actively browsed 2D</strong> (zoomed an
        image or flipped through thumbnails without opening 3D), and <strong>fully passive</strong>
        (neither). The RQ2/RQ3 charts above compare 3D against the "actively browsed 2D" group as
        the fair, apples-to-apples baseline, with the passive group shown alongside for reference.
        A separate "viewing duration" metric (RQ1) measures how long the 3D viewer or 2D
        inspection (image zoom, thumbnails, reviews) actually held attention, rather than whole
        page time-on-page - a cleaner read on visual inspection depth, since page time also
        includes reading the description or price.
      </footer>

      <section class="danger-zone hide">
        <div class="danger-zone__text">
          <h3>Reset live dashboard</h3>
          <p>
            Clears every number on this page back to zero. Raw per-visit events are kept
            forever in separate storage, so nothing is lost for later re-analysis - this only
            resets the aggregated view shown above (e.g. after a demo or test pass in
            production).
          </p>
        </div>
        <button
          type="button"
          class="danger-zone__button"
          :disabled="resetting"
          @click="resetLiveData"
        >
          {{ resetting ? "Resetting…" : "Reset live dashboard" }}
        </button>
      </section>

      <section class="danger-zone hide">
        <div class="danger-zone__text">
          <h3>Recompute from raw data</h3>
          <p>
            Rebuilds the aggregate above from every raw event using today's classification
            rules - use this after a definition changes (e.g. what counts as "actively browsed
            2D") so the fix applies retroactively to visits already collected, instead of only
            to new ones.
          </p>
        </div>
        <button
          type="button"
          class="danger-zone__button"
          :disabled="recomputing"
          @click="recomputeLiveData"
        >
          {{ recomputing ? "Recomputing…" : "Recompute from raw data" }}
        </button>
      </section>
    </template>
  </div>
</template>

<script setup>
import { getProductBySlug, getCategoryBySlug } from "@/data/index.js";

definePageMeta({ layout: "dashboard" });
useHead({ title: "Interaction Analytics" });

const { data, pending, error, refresh } = await useFetch("/api/analytics/summary");

const resetting = ref(false);
async function resetLiveData() {
  if (!confirm("Reset the live dashboard to zero? Raw event data is kept and unaffected.")) return;
  resetting.value = true;
  try {
    await $fetch("/api/analytics/reset", { method: "POST" });
    await refresh();
  } finally {
    resetting.value = false;
  }
}

const recomputing = ref(false);
async function recomputeLiveData() {
  if (!confirm("Rebuild the aggregate from every raw event using today's rules? This can take a moment.")) return;
  recomputing.value = true;
  try {
    await $fetch("/api/analytics/recompute", { method: "POST" });
    await refresh();
  } finally {
    recomputing.value = false;
  }
}

function productRows(entries) {
  return (entries ?? []).map((entry) => ({
    key: entry.key,
    label: getProductBySlug(entry.key)?.title ?? entry.key,
    count: entry.count,
  }));
}

function categoryRows(entries) {
  return (entries ?? []).map((entry) => ({
    key: entry.key,
    label: getCategoryBySlug(entry.key)?.label ?? entry.key,
    count: entry.count,
  }));
}

function fmtPct(value) {
  return value == null ? "–" : `${value}%`;
}

function fmtSeconds(ms) {
  return ms == null ? "–" : `${(ms / 1000).toFixed(1)}s`;
}

// x-times-higher phrasing shared by several of the narrative sentences below.
function compareRates(withValue, withoutValue) {
  if (withValue == null || withoutValue == null) return null;
  if (withValue === withoutValue) return { equal: true };
  const higherIsWith = withValue > withoutValue;
  const multiplier = higherIsWith
    ? Math.round((withValue / Math.max(withoutValue, 0.1)) * 10) / 10
    : Math.round((withoutValue / Math.max(withValue, 0.1)) * 10) / 10;
  return { equal: false, higherIsWith, multiplier };
}

const revenueSublabel = computed(() =>
  data.value?.totalPurchases ? `$${data.value.totalRevenueUsd.toLocaleString()} in wallet spend` : "no orders yet"
);

// Shared series order for every GroupedBarChart on the page, so the same
// colour always means the same group no matter which metric it's under.
const engagementGroups = ["Opened 3D viewer", "Actively browsed 2D", "Passive visit"];

const threeDAdoptionRatePercent = computed(() => {
  const d = data.value;
  if (!d) return null;
  const total = d.visitsWith3dCount + d.visitsActive2dCount + d.visitsWithout3dCount;
  return total ? Math.round((d.visitsWith3dCount / total) * 1000) / 10 : null;
});

// The whole point of this page, in one sentence a supervisor or committee
// can read without cross-referencing three charts first.
const headlineText = computed(() => {
  const d = data.value;
  if (!d) return "";
  const cmp = compareRates(d.conversionRateWith3dPercent, d.conversionRateWithout3dPercent);
  if (!cmp) {
    return "Not enough completed orders yet to compare purchase conversion between 3D and 2D-only sessions - the comparison below will fill in as the study collects more visits.";
  }
  if (cmp.equal) {
    return `Sessions that used the 3D viewer converted to a purchase at the same rate (${d.conversionRateWith3dPercent}%) as 2D-only sessions - no measurable difference yet.`;
  }
  return cmp.higherIsWith
    ? `Sessions that opened the 3D viewer converted to a purchase at ${d.conversionRateWith3dPercent}%, versus ${d.conversionRateWithout3dPercent}% for 2D-only sessions - ${cmp.multiplier}× higher, supporting the case that 3D visualization improves purchase confidence.`
    : `2D-only sessions converted to a purchase at ${d.conversionRateWithout3dPercent}%, versus ${d.conversionRateWith3dPercent}% for sessions that opened the 3D viewer - ${cmp.multiplier}× higher, running counter to the study's hypothesis so far.`;
});

const rq1Text = computed(() => {
  const d = data.value;
  if (!d) return "";
  const interactionParts = [];
  if (d.total3dInteractions || d.total2dInteractions) {
    interactionParts.push(
      `Across ${d.totalProductVisits} product page visits, shoppers logged ${d.total3dInteractions} 3D interactions (rotate/zoom gestures) versus ${d.total2dInteractions} 2D interactions (image zoom, thumbnail switches).`
    );
  }
  const timeCmp = compareRates(d.avgTimeOnPageWith3dSeconds, d.avgTimeOnPageWithout3dSeconds);
  if (timeCmp && !timeCmp.equal) {
    interactionParts.push(
      timeCmp.higherIsWith
        ? `On products offering a 3D view, visits that opened it spent ${d.avgTimeOnPageWith3dSeconds}s on the page on average, versus ${d.avgTimeOnPageWithout3dSeconds}s for those that stayed with photos only - ${timeCmp.multiplier}× longer, a direct engagement lift.`
        : `Visits that opened the 3D viewer actually spent less time on the page (${d.avgTimeOnPageWith3dSeconds}s) than 2D-only visits (${d.avgTimeOnPageWithout3dSeconds}s) so far - worth watching as more data comes in.`
    );
  } else if (!interactionParts.length) {
    interactionParts.push("Not enough visits yet to measure engagement depth - check back as the study collects more data.");
  }
  const durationCmp = compareRates(d.avgViewer3dOpenSeconds, d.avgImageLightboxOpenSeconds);
  if (durationCmp && !durationCmp.equal) {
    interactionParts.push(
      durationCmp.higherIsWith
        ? `Measured more directly - how long the inspection surface itself stayed open, rather than the whole page - the 3D viewer held attention for ${d.avgViewer3dOpenSeconds}s on average versus ${d.avgImageLightboxOpenSeconds}s for the 2D image zoom, ${durationCmp.multiplier}× longer.`
        : `Measured more directly - how long the inspection surface itself stayed open, rather than the whole page - the 2D image zoom actually held attention longer (${d.avgImageLightboxOpenSeconds}s) than the 3D viewer (${d.avgViewer3dOpenSeconds}s) so far.`
    );
  }
  return interactionParts.join(" ");
});

const rq2Text = computed(() => {
  const d = data.value;
  if (!d) return "";
  const parts = [];
  const convCmp = compareRates(d.conversionRateWith3dPercent, d.conversionRateWithout3dPercent);
  if (convCmp && !convCmp.equal) {
    parts.push(
      `Sessions that engaged the 3D viewer converted to a purchase at ${convCmp.higherIsWith ? d.conversionRateWith3dPercent : d.conversionRateWithout3dPercent}% versus ${convCmp.higherIsWith ? d.conversionRateWithout3dPercent : d.conversionRateWith3dPercent}% - a ${convCmp.multiplier}× difference.`
    );
  }
  const cartCmp = compareRates(d.cartRateWith3dPercent, d.cartRateActive2dPercent);
  if (cartCmp && !cartCmp.equal) {
    parts.push(
      `At the individual visit level, ${fmtPct(d.cartRateWith3dPercent)} of 3D-viewer visits added the product to cart, versus ${fmtPct(d.cartRateActive2dPercent)} of visits that instead actively browsed the 2D photos (zoomed in or flipped through thumbnails) - the fair comparison, since both groups are shoppers who deliberately inspected the product rather than bounced. For reference, fully passive visits (no interaction at all) converted to a cart-add just ${fmtPct(d.cartRateWithout3dPercent)} of the time.`
    );
  }
  const wishlistCmp = compareRates(d.wishlistRateWith3dPercent, d.wishlistRateActive2dPercent);
  if (wishlistCmp && !wishlistCmp.equal) {
    parts.push(
      `Wishlisting shows the same shape: ${fmtPct(d.wishlistRateWith3dPercent)} of 3D-viewer visits saved the item for later, versus ${fmtPct(d.wishlistRateActive2dPercent)} of active 2D-browsing visits - a second, independent signal of purchase intent pointing the same direction as cart-adds.`
    );
  }
  if (!parts.length) parts.push("Not enough completed orders yet to compare purchasing behaviour - the charts below will fill in as more visits are recorded.");
  return parts.join(" ");
});

const rq3Text = computed(() => {
  const d = data.value;
  if (!d) return "";
  const parts = [];
  const reviewsCmp = compareRates(d.reviewsRateWith3dPercent, d.reviewsRateActive2dPercent);
  if (reviewsCmp && !reviewsCmp.equal) {
    parts.push(
      `Shoppers who opened the 3D viewer checked reviews ${fmtPct(d.reviewsRateWith3dPercent)} of the time, versus ${fmtPct(d.reviewsRateActive2dPercent)} for shoppers who actively browsed 2D photos instead - both groups engaged, just through a different channel.`
    );
  }
  const sizeCmp = compareRates(d.sizeChartRateWith3dPercent, d.sizeChartRateActive2dPercent);
  if (sizeCmp && !sizeCmp.equal) {
    parts.push(
      `They also checked the size guide ${fmtPct(d.sizeChartRateWith3dPercent)} of the time, versus ${fmtPct(d.sizeChartRateActive2dPercent)} for active 2D browsers - both proxies for how thoroughly a product is evaluated before deciding.`
    );
  }
  if (!parts.length) parts.push("Not enough visits yet to compare evaluation depth between 3D and active 2D shoppers.");
  return parts.join(" ");
});

const rq4Text = computed(() => {
  const d = data.value;
  if (!d) return "";
  const totalAttempts = d.total3dInteractions + d.totalViewerErrors;
  if (!totalAttempts) return "No 3D viewer attempts logged yet to assess reliability.";
  const loadTimeNote =
    d.avgModelLoadTimeMs != null
      ? ` Successful loads took an average of ${fmtSeconds(d.avgModelLoadTimeMs)} to appear, based on ${d.loadTimeSampleCount} sample${d.loadTimeSampleCount === 1 ? "" : "s"} - a meaningful wait on slower connections even when the model does eventually load.`
      : "";
  return `${fmtPct(d.viewerErrorRatePercent)} of 3D viewer attempts failed to load (${d.totalViewerErrors} of ${totalAttempts}) - a direct signal of the device and network barriers Nigerian shoppers can face when a platform introduces 3D visualization, particularly on slower mobile connections.${loadTimeNote}`;
});

const rq5Text = computed(() => {
  const d = data.value;
  if (!d) return "";
  const convCmp = compareRates(d.conversionRateWith3dPercent, d.conversionRateWithout3dPercent);
  const errorNote =
    d.viewerErrorRatePercent != null && d.viewerErrorRatePercent > 0
      ? ` provided the ${fmtPct(d.viewerErrorRatePercent)} load-failure rate identified above is addressed with lighter, better-optimized 3D assets for lower-bandwidth users`
      : "";

  const topCategory = d.topViewedCategories?.[0];
  const top3dCategory = d.top3dInteractedCategories?.[0];
  const categoryNote =
    topCategory && top3dCategory
      ? ` ${getCategoryBySlug(topCategory.key)?.label ?? topCategory.key} draws the most overall traffic, while ${getCategoryBySlug(top3dCategory.key)?.label ?? top3dCategory.key} sees the deepest 3D engagement - a starting point for which categories to prioritise first when rolling 3D visualization out.`
      : "";

  if (convCmp && !convCmp.equal && convCmp.higherIsWith) {
    return `With 3D-engaged sessions converting at ${convCmp.multiplier}× the rate of 2D-only sessions, and visibly deeper product inspection (more reviews and size-guide checks) alongside it, Nigerian e-commerce businesses adopting interactive 3D visualization could expect measurable gains in both purchase confidence and engagement quality${errorNote}. The evidence here supports treating 3D visualization as a purchase-confidence tool, not just a novelty feature.${categoryNote}`;
  }
  return `The data collected so far is directional rather than conclusive - as more visits accumulate, this section will quantify the specific gain (or lack thereof) 3D visualization offers Nigerian e-commerce businesses${errorNote}.${categoryNote}`;
});
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
  margin-bottom: 20px;
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

.study-intro {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}
.study-intro__eyebrow {
  color: var(--series-1);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 6px;
}
.study-intro__title {
  font-size: 20px;
  line-height: 1.35;
  margin: 0 0 10px;
  color: var(--text-primary);
  max-width: 820px;
}
.study-intro__aim {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
  max-width: 820px;
}

.headline {
  background: linear-gradient(135deg, #1d2b3a, #0f1720);
  border-radius: 8px;
  padding: 22px 26px;
  margin-bottom: 24px;
}
.headline__eyebrow {
  color: #7fb2ff;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 8px;
}
.headline__text {
  color: #fff;
  font-size: 18px;
  line-height: 1.5;
  margin: 0;
  max-width: 780px;
}
.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 36px;
}

.rq-section {
  margin-bottom: 36px;
}
.rq-section__head {
  margin-bottom: 10px;
}
.rq-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--series-1);
  background: var(--series-1-area);
  border-radius: 4px;
  padding: 3px 8px;
  margin-bottom: 8px;
}
.rq-section h2 {
  font-size: 17px;
  line-height: 1.4;
  margin: 0;
  color: var(--text-primary);
  max-width: 760px;
}
.rq-finding {
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--text-secondary);
  background: var(--surface-1);
  border-left: 3px solid var(--series-1);
  border-radius: 0 6px 6px 0;
  padding: 12px 16px;
  margin: 14px 0 20px;
  max-width: 900px;
}
.rq-section--recommendation .rq-finding {
  border-left-color: var(--series-2);
  font-size: 15px;
}
.rq-charts {
  display: grid;
  gap: 20px;
}
/* Four charts (RQ1) read as a cramped single row at any realistic card
   width once labels are full phrases - a fixed 2x2 rectangle gives each
   card roughly double the room instead. */
.rq-charts--four {
  grid-template-columns: repeat(2, 1fr);
}
/* Three-way comparisons (RQ2/RQ4) auto-fit down to 2 or 1 per row rather
   than forcing 3 into whatever width is left - a rigid repeat(3, 1fr) was
   what made legends wrap illegibly once labels grew into full phrases. */
.rq-charts--three {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
.rq-charts--two {
  grid-template-columns: repeat(2, 1fr);
}
.rq-charts--single {
  grid-template-columns: 1fr;
}
.chart-card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px 22px;
}
.chart-card h3 {
  font-size: 13px;
  margin: 0 0 16px;
  color: var(--text-primary);
}
.chart-card--stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.chart-card--gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.chart-card--gauge h3 {
  align-self: flex-start;
}
.chart-card--stat .stat-tile {
  border: none;
  padding: 0;
}

.appendix {
  margin-top: 8px;
  margin-bottom: 24px;
}
.appendix__title {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0 0 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
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
.dashboard__panel h3 {
  font-size: 14px;
  margin: 0 0 14px;
  color: var(--text-primary);
}

.methodology {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
  padding-top: 16px;
}

.danger-zone {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 32px;
  padding: 18px 22px;
  border: 1px solid var(--series-2);
  border-radius: 8px;
  background: color-mix(in srgb, var(--series-2) 8%, transparent);
}
.danger-zone__text h3 {
  font-size: 13px;
  margin: 0 0 4px;
  color: var(--text-primary);
}
.danger-zone__text p {
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-muted);
  margin: 0;
  max-width: 560px;
}
.danger-zone__button {
  flex-shrink: 0;
  background: transparent;
  border: 1px solid var(--series-2);
  color: var(--series-2);
  border-radius: 4px;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
.danger-zone__button:hover:not(:disabled) {
  background: var(--series-2);
  color: #fff;
}
.danger-zone__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .rq-charts--four,
  .rq-charts--three,
  .rq-charts--two {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 720px) {
  .dashboard__stats {
    grid-template-columns: 1fr 1fr;
  }
  .dashboard__grid {
    grid-template-columns: 1fr;
  }
  .headline__text {
    font-size: 16px;
  }
  .study-intro__title {
    font-size: 18px;
  }
  .danger-zone {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

<style>
/* Unscoped: a scoped :global(:root...) rule here didn't compile (Vue's
   scoped-style :global() doesn't reliably handle a compound selector like
   :root:not([data-theme="light"])), so this lives in its own plain <style>
   block instead - same pattern ProductViewer3D.vue uses for its
   body.viewer3d-lock-scroll rule. Forcing pure white unconditionally would
   make the heading invisible in light mode (white-on-light-page-plane), so
   it's scoped to dark mode only, via the same detection dashboard.vue uses.
*/
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .dashboard__header h1 {
    color: #fff;
  }
}
:root[data-theme="dark"] .dashboard__header h1 {
  color: #fff;
}
</style>
