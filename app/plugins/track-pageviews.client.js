// Logs an anonymous page_view event on every route change, so the analytics
// dashboard can break interactions down by page/product.
export default defineNuxtPlugin((nuxtApp) => {
  const { logEvent } = useAnalytics();

  nuxtApp.$router.afterEach((to) => {
    logEvent("page_view", { path: to.path, slug: to.params?.slug ?? null });
  });
});
