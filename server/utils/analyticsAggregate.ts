// Shared shape for the running analytics aggregate blob (see events.post.ts
// and summary.get.ts). Kept as plain counters/maps rather than Sets, since
// the whole point is that this gets JSON-serialized into a single blob.
//
// Schema v2: instead of one network event per gesture (rotate, zoom, thumb
// switch, ...), the client accumulates counts for an entire product-page
// visit and fires ONE "product_engagement" event on leaving the page (see
// useProductEngagement.js). This is both cheaper and the right shape for
// what the study actually asks: not "how many rotate events happened
// anywhere", but "on a visit where someone opened the 3D viewer, what did
// they do next - did it lead to a cart add, a wishlist add, an actual
// purchase, compared to a visit that only ever saw flat images."
export function EMPTY_AGGREGATE() {
  return {
    totalEvents: 0,
    sessionIds: {} as Record<string, true>,
    totalProductVisits: 0,
    productViewsBySlug: {} as Record<string, number>,
    viewsByCategory: {} as Record<string, number>,
    interactionsByCategory: {} as Record<string, number>,

    // RQ4 (adoption barriers): how long a model actually takes to load, not
    // just whether it eventually failed - a slow-but-successful load is
    // still a real barrier on Nigerian mobile networks.
    totalLoadTimeMs: 0,
    loadTimeSampleCount: 0,

    // "Looking duration": how long the 3D viewer / image lightbox actually
    // stayed open, as a more direct read on visual-inspection depth than
    // whole-page time-on-page (which also counts time spent reading the
    // description, price, reviews, etc. - not specific to looking at the
    // product itself). Tracked the same way on both sides so the comparison
    // is apples-to-apples.
    totalViewer3dOpenMs: 0,
    viewer3dOpenMsSampleCount: 0,
    totalImageLightboxOpenMs: 0,
    imageLightboxOpenMsSampleCount: 0,

    // Raw totals - not fired as separate events, just summed from each
    // visit's accumulated counts. Kept for "most 3D-interacted products"
    // and the engagement-depth comparison, not for a per-event feed.
    totalRotate: 0,
    totalZoom: 0,
    totalImageZoom: 0,
    totalThumbnailSwitch: 0,
    rotateBySlug: {} as Record<string, number>,
    zoomBySlug: {} as Record<string, number>,
    totalViewerErrors: 0,
    viewerErrorBySlug: {} as Record<string, number>,
    totalAddToCart: 0,
    totalAddToWishlist: 0,

    // The core comparison: for visits to a product that HAS a 3D model,
    // split by whether that visit actually opened it. Everything below is
    // bucketed into "with3d" (has3d && used3d) vs "without3d" (has3d &&
    // !used3d) so the two are always an apples-to-apples comparison against
    // the same pool of 3D-capable products, never against products that
    // never had a 3D option in the first place.
    visitsWith3d: 0,
    visitsWith3dAddedCart: 0,
    visitsWith3dAddedWishlist: 0,
    visitsWith3dCheckedReviews: 0,
    visitsWith3dCheckedSizeChart: 0,
    timeOnPageWith3d: { total: 0, count: 0 },

    // "without3d" used to mean EVERY visit that didn't open the viewer,
    // including someone who bounced in two seconds without even zooming a
    // photo - that diluted the 2D side with disengaged traffic the 3D side
    // never had a chance to be diluted by (opening the viewer is itself an
    // active gesture). "active2d" carves out the fair comparison group:
    // visits that skipped 3D but DID deliberately inspect the 2D images
    // (zoomed or flipped through thumbnails). "without3d" is kept as-is
    // (now effectively "passive/no 3D") for the coarser, original view.
    visitsWithout3d: 0,
    visitsWithout3dAddedCart: 0,
    visitsWithout3dAddedWishlist: 0,
    visitsWithout3dCheckedReviews: 0,
    visitsWithout3dCheckedSizeChart: 0,
    timeOnPageWithout3d: { total: 0, count: 0 },

    visitsActive2d: 0,
    visitsActive2dAddedCart: 0,
    visitsActive2dAddedWishlist: 0,
    visitsActive2dCheckedReviews: 0,
    visitsActive2dCheckedSizeChart: 0,
    timeOnPageActive2d: { total: 0, count: 0 },

    // Session-level purchase comparison (did this session ever use the 3D
    // viewer anywhere, did it ever complete a purchase) - coarser than the
    // per-visit funnel above, but purchases happen at checkout, potentially
    // after visiting several products, so this is the only fair way to
    // relate "used 3D at all" to "became a buyer".
    sessionsUsed3d: {} as Record<string, true>,
    purchaseSessionIds: {} as Record<string, true>,
    totalPurchases: 0,
    totalRevenueUsd: 0,
    purchasesBySlug: {} as Record<string, number>,
  };
}

export type Aggregate = ReturnType<typeof EMPTY_AGGREGATE>;

// The aggregate blob's shape has grown over the life of this study - a
// stored blob from before some field existed won't have it at all, and
// assigning into a missing nested object (aggregate.newField[key] = ...)
// throws. Shallow-merging onto a fresh EMPTY_AGGREGATE() backfills any
// field the stored blob predates, while keeping every value it already has.
export function withDefaults(loaded: Partial<Aggregate> | null | undefined): Aggregate {
  return { ...EMPTY_AGGREGATE(), ...loaded };
}

export function applyEventToAggregate(aggregate: Aggregate, event: any): Aggregate {
  aggregate.totalEvents++;
  aggregate.sessionIds[event.sessionId] = true;

  const p = event.payload ?? {};
  const slug = p.slug;

  if (event.type === "product_engagement") {
    aggregate.totalProductVisits++;
    if (slug) aggregate.productViewsBySlug[slug] = (aggregate.productViewsBySlug[slug] || 0) + 1;

    const category = p.category;
    if (category) aggregate.viewsByCategory[category] = (aggregate.viewsByCategory[category] || 0) + 1;

    const rotateCount = p.rotateCount || 0;
    const zoomCount = p.zoomCount || 0;
    aggregate.totalRotate += rotateCount;
    aggregate.totalZoom += zoomCount;
    if (slug && rotateCount) aggregate.rotateBySlug[slug] = (aggregate.rotateBySlug[slug] || 0) + rotateCount;
    if (slug && zoomCount) aggregate.zoomBySlug[slug] = (aggregate.zoomBySlug[slug] || 0) + zoomCount;
    if (category && (rotateCount || zoomCount)) {
      aggregate.interactionsByCategory[category] =
        (aggregate.interactionsByCategory[category] || 0) + rotateCount + zoomCount;
    }

    if (typeof p.loadTimeMs === "number") {
      aggregate.totalLoadTimeMs += p.loadTimeMs;
      aggregate.loadTimeSampleCount += 1;
    }
    if (typeof p.viewer3dOpenMs === "number" && p.viewer3dOpenMs > 0) {
      aggregate.totalViewer3dOpenMs += p.viewer3dOpenMs;
      aggregate.viewer3dOpenMsSampleCount += 1;
    }
    if (typeof p.imageLightboxOpenMs === "number" && p.imageLightboxOpenMs > 0) {
      aggregate.totalImageLightboxOpenMs += p.imageLightboxOpenMs;
      aggregate.imageLightboxOpenMsSampleCount += 1;
    }

    aggregate.totalImageZoom += p.imageZoomCount || 0;
    aggregate.totalThumbnailSwitch += p.thumbnailSwitchCount || 0;

    if (p.viewerError) {
      aggregate.totalViewerErrors++;
      if (slug) aggregate.viewerErrorBySlug[slug] = (aggregate.viewerErrorBySlug[slug] || 0) + 1;
    }
    if (p.addedToCart) aggregate.totalAddToCart++;
    if (p.addedToWishlist) aggregate.totalAddToWishlist++;

    if (p.has3d) {
      if (p.used3d) aggregate.sessionsUsed3d[event.sessionId] = true;

      if (p.used3d) {
        aggregate.visitsWith3d++;
        if (p.addedToCart) aggregate.visitsWith3dAddedCart++;
        if (p.addedToWishlist) aggregate.visitsWith3dAddedWishlist++;
        if (p.viewedReviews) aggregate.visitsWith3dCheckedReviews++;
        if (p.viewedSizeChart) aggregate.visitsWith3dCheckedSizeChart++;
        if (typeof p.seconds === "number") {
          aggregate.timeOnPageWith3d.total += p.seconds;
          aggregate.timeOnPageWith3d.count += 1;
        }
      } else {
        // Fair-comparison group: skipped 3D, but still actively inspected
        // the 2D images (zoomed in or flipped thumbnails) rather than just
        // bouncing - see the field comment above for why this exists.
        // Mutually exclusive with the passive "visitsWithout3d" branch below
        // so the two buckets sum to exactly "all visits that didn't open the
        // viewer" without double-counting either way.
        const activelyInspected2d = (p.imageZoomCount || 0) > 0 || (p.thumbnailSwitchCount || 0) > 0;

        if (activelyInspected2d) {
          aggregate.visitsActive2d++;
          if (p.addedToCart) aggregate.visitsActive2dAddedCart++;
          if (p.addedToWishlist) aggregate.visitsActive2dAddedWishlist++;
          if (p.viewedReviews) aggregate.visitsActive2dCheckedReviews++;
          if (p.viewedSizeChart) aggregate.visitsActive2dCheckedSizeChart++;
          if (typeof p.seconds === "number") {
            aggregate.timeOnPageActive2d.total += p.seconds;
            aggregate.timeOnPageActive2d.count += 1;
          }
        } else {
          aggregate.visitsWithout3d++;
          if (p.addedToCart) aggregate.visitsWithout3dAddedCart++;
          if (p.addedToWishlist) aggregate.visitsWithout3dAddedWishlist++;
          if (p.viewedReviews) aggregate.visitsWithout3dCheckedReviews++;
          if (p.viewedSizeChart) aggregate.visitsWithout3dCheckedSizeChart++;
          if (typeof p.seconds === "number") {
            aggregate.timeOnPageWithout3d.total += p.seconds;
            aggregate.timeOnPageWithout3d.count += 1;
          }
        }
      }
    }
  } else if (event.type === "purchase") {
    aggregate.totalPurchases++;
    aggregate.purchaseSessionIds[event.sessionId] = true;
    if (typeof p.amountUsd === "number") aggregate.totalRevenueUsd += p.amountUsd;
    for (const purchasedSlug of p.slugs ?? []) {
      aggregate.purchasesBySlug[purchasedSlug] = (aggregate.purchasesBySlug[purchasedSlug] || 0) + 1;
    }
  }

  return aggregate;
}
