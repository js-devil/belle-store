import { getStore } from "@netlify/blobs";
import { backfillAggregate, withDefaults, type Aggregate } from "../../utils/analyticsAggregate";

function topEntries(counts: Record<string, number>, limit = 10) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

const ratio = (numerator: number, denominator: number) =>
  denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : null;

export default defineEventHandler(async () => {
  // Mirrors events.post.ts: outside Netlify's own runtime (i.e. plain
  // `npm run dev`, not `netlify dev`), getStore has no ambient context to
  // read credentials from, and the bare `getStore("name")` shorthand throws.
  // Passing siteID/token explicitly makes it work locally too, as long as
  // NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN are set in .env.
  const aggregateStore = getStore({
    name: "analytics-aggregate",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_AUTH_TOKEN,
  });

  let aggregate = await aggregateStore.get("summary", { type: "json" });
  if (!aggregate) {
    const eventsStore = getStore({
      name: "interaction-events",
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });
    aggregate = await backfillAggregate(eventsStore);
    await aggregateStore.setJSON("summary", aggregate);
  } else {
    aggregate = withDefaults(aggregate);
  }

  const a = aggregate as Aggregate;

  const viewer3dBySlug: Record<string, number> = {};
  for (const slug of new Set([...Object.keys(a.rotateBySlug), ...Object.keys(a.zoomBySlug)])) {
    viewer3dBySlug[slug] = (a.rotateBySlug[slug] || 0) + (a.zoomBySlug[slug] || 0);
  }

  const totalVisits = Object.keys(a.sessionIds).length;
  const used3dSessionKeys = Object.keys(a.sessionsUsed3d);
  const purchasedSessionKeys = Object.keys(a.purchaseSessionIds);
  const purchasedAndUsed3dCount = used3dSessionKeys.filter((id) => a.purchaseSessionIds[id]).length;
  const purchasedWithout3dCount = purchasedSessionKeys.length - purchasedAndUsed3dCount;
  const sessionsWithout3dCount = totalVisits - used3dSessionKeys.length;

  return {
    totalVisits,
    totalProductVisits: a.totalProductVisits,
    totalPurchases: a.totalPurchases,
    totalRevenueUsd: Math.round(a.totalRevenueUsd * 100) / 100,

    total3dInteractions: a.totalRotate + a.totalZoom,
    totalRotate: a.totalRotate,
    totalZoom: a.totalZoom,
    total2dInteractions: a.totalImageZoom + a.totalThumbnailSwitch,
    totalImageZoom: a.totalImageZoom,
    totalThumbnailSwitch: a.totalThumbnailSwitch,

    totalViewerErrors: a.totalViewerErrors,
    viewerErrorRatePercent: ratio(a.totalViewerErrors, a.totalRotate + a.totalZoom + a.totalViewerErrors),
    avgModelLoadTimeMs: a.loadTimeSampleCount
      ? Math.round(a.totalLoadTimeMs / a.loadTimeSampleCount)
      : null,
    loadTimeSampleCount: a.loadTimeSampleCount,

    // Session-level: did using the 3D viewer anywhere correlate with
    // completing an actual purchase?
    sessionsUsed3dCount: used3dSessionKeys.length,
    sessionsWithout3dCount,
    purchasedWithUsed3dCount: purchasedAndUsed3dCount,
    purchasedWithoutUsed3dCount: purchasedWithout3dCount,
    conversionRateOverallPercent: ratio(purchasedSessionKeys.length, totalVisits),
    conversionRateWith3dPercent: ratio(purchasedAndUsed3dCount, used3dSessionKeys.length),
    conversionRateWithout3dPercent: ratio(purchasedWithout3dCount, sessionsWithout3dCount),

    // Per-visit: on a product that offers a 3D view, opening it vs. not -
    // what happened next, on that SAME visit. This is the "does 3D
    // interaction convince the user to act" comparison.
    visitsWith3dCount: a.visitsWith3d,
    visitsWithout3dCount: a.visitsWithout3d,
    cartRateWith3dPercent: ratio(a.visitsWith3dAddedCart, a.visitsWith3d),
    cartRateWithout3dPercent: ratio(a.visitsWithout3dAddedCart, a.visitsWithout3d),
    wishlistRateWith3dPercent: ratio(a.visitsWith3dAddedWishlist, a.visitsWith3d),
    wishlistRateWithout3dPercent: ratio(a.visitsWithout3dAddedWishlist, a.visitsWithout3d),
    reviewsRateWith3dPercent: ratio(a.visitsWith3dCheckedReviews, a.visitsWith3d),
    reviewsRateWithout3dPercent: ratio(a.visitsWithout3dCheckedReviews, a.visitsWithout3d),
    sizeChartRateWith3dPercent: ratio(a.visitsWith3dCheckedSizeChart, a.visitsWith3d),
    sizeChartRateWithout3dPercent: ratio(a.visitsWithout3dCheckedSizeChart, a.visitsWithout3d),

    avgTimeOnPageWith3dSeconds: a.timeOnPageWith3d.count
      ? Math.round(a.timeOnPageWith3d.total / a.timeOnPageWith3d.count)
      : null,
    avgTimeOnPageWithout3dSeconds: a.timeOnPageWithout3d.count
      ? Math.round(a.timeOnPageWithout3d.total / a.timeOnPageWithout3d.count)
      : null,

    // Fair-comparison group: "without3d" above includes visits that did
    // nothing at all (never zoomed a photo, never flipped a thumbnail) -
    // that's not a fair opponent for "opened the 3D viewer", which is
    // itself an active gesture. "active2d" restricts the 2D side to visits
    // that also did something deliberate - zoomed in or browsed thumbnails
    // - so both sides of the comparison are equally-engaged shoppers, just
    // using a different inspection channel.
    visitsActive2dCount: a.visitsActive2d,
    cartRateActive2dPercent: ratio(a.visitsActive2dAddedCart, a.visitsActive2d),
    wishlistRateActive2dPercent: ratio(a.visitsActive2dAddedWishlist, a.visitsActive2d),
    reviewsRateActive2dPercent: ratio(a.visitsActive2dCheckedReviews, a.visitsActive2d),
    sizeChartRateActive2dPercent: ratio(a.visitsActive2dCheckedSizeChart, a.visitsActive2d),
    avgTimeOnPageActive2dSeconds: a.timeOnPageActive2d.count
      ? Math.round(a.timeOnPageActive2d.total / a.timeOnPageActive2d.count)
      : null,

    // "Looking duration": how long the 3D viewer vs. the image lightbox
    // actually stayed open - tracked identically on both sides, so unlike
    // time-on-page (which also includes reading the description/price) this
    // isolates time spent specifically inspecting the product visually.
    avgViewer3dOpenSeconds: a.viewer3dOpenMsSampleCount
      ? Math.round((a.totalViewer3dOpenMs / a.viewer3dOpenMsSampleCount / 100)) / 10
      : null,
    avgImageLightboxOpenSeconds: a.imageLightboxOpenMsSampleCount
      ? Math.round((a.totalImageLightboxOpenMs / a.imageLightboxOpenMsSampleCount / 100)) / 10
      : null,
    viewer3dOpenSampleCount: a.viewer3dOpenMsSampleCount,
    imageLightboxOpenSampleCount: a.imageLightboxOpenMsSampleCount,

    topProductViews: topEntries(a.productViewsBySlug, 10),
    top3dProducts: topEntries(viewer3dBySlug, 10),
    topPurchasedProducts: topEntries(a.purchasesBySlug, 10),

    // RQ5 (business benefit): which product categories draw the most
    // traffic and the most 3D engagement, so a recommendation can point at
    // specific categories rather than staying purely abstract.
    topViewedCategories: topEntries(a.viewsByCategory, 10),
    top3dInteractedCategories: topEntries(a.interactionsByCategory, 10),
  };
});
