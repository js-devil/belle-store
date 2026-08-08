// Accumulates one product-page visit's worth of engagement signals client-side
// and sends a SINGLE "product_engagement" event when the visit ends, instead
// of a network call per gesture/click. What the study actually needs isn't a
// firehose of individual rotate/zoom/click events - it's, per visit: how long
// did they stay, did they open the 3D viewer, and afterward did that lead to
// a cart add, a wishlist add, checking reviews or the size guide (proxies for
// "product inspection" and "confidence in fit/appearance").
export function useProductEngagement(product) {
  const { logEvent } = useAnalytics();
  const startedAt = Date.now();

  const counts = {
    rotateCount: 0,
    zoomCount: 0,
    imageZoomCount: 0,
    thumbnailSwitchCount: 0,
    viewerError: false,
    used3d: false,
    addedToCart: false,
    addedToWishlist: false,
    viewedReviews: false,
    viewedSizeChart: false,
    // Set once, from the first successful load - this is the RQ4
    // adoption-barrier metric (slow loads are a direct proxy for
    // device/network barriers Nigerian shoppers may face).
    loadTimeMs: null,
    // How long the 3D viewer / image lightbox actually stayed open - a more
    // direct "looking duration" than whole-page time-on-page, which also
    // includes time spent reading the description or price and so isn't a
    // clean read on visual inspection specifically. Summed in case either is
    // opened more than once in a visit.
    viewer3dOpenMs: 0,
    imageLightboxOpenMs: 0,
  };

  function flush() {
    const seconds = Math.round((Date.now() - startedAt) / 1000);
    logEvent("product_engagement", {
      slug: product.slug,
      category: product.category,
      has3d: !!product.model3d,
      seconds,
      ...counts,
    });
  }

  return {
    recordRotate: () => counts.rotateCount++,
    recordZoom: () => counts.zoomCount++,
    recordImageZoom: () => counts.imageZoomCount++,
    recordThumbnailSwitch: () => counts.thumbnailSwitchCount++,
    recordViewerError: () => (counts.viewerError = true),
    recordViewer3dOpened: () => (counts.used3d = true),
    recordAddedToCart: () => (counts.addedToCart = true),
    recordAddedToWishlist: () => (counts.addedToWishlist = true),
    recordViewedReviews: () => (counts.viewedReviews = true),
    recordViewedSizeChart: () => (counts.viewedSizeChart = true),
    recordLoadTime: (ms) => {
      if (counts.loadTimeMs == null) counts.loadTimeMs = ms;
    },
    recordViewer3dOpenMs: (ms) => (counts.viewer3dOpenMs += ms),
    recordImageLightboxOpenMs: (ms) => (counts.imageLightboxOpenMs += ms),
    flush,
  };
}
