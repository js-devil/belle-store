// Anonymous interaction logging for the research study: time-on-page,
// rotation/zoom gesture counts, and add-to-cart clicks. The session id is a
// random string kept only in sessionStorage - it resets when the tab/browser
// closes, so it never becomes a persistent identity. No name, account, or
// payment data is ever collected.
function getSessionId() {
  if (typeof sessionStorage === "undefined") return "server";
  let id = sessionStorage.getItem("belle-analytics-session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("belle-analytics-session", id);
  }
  return id;
}

export function useAnalytics() {
  function logEvent(type, payload = {}) {
    if (typeof window === "undefined") return;
    $fetch("/api/events", {
      method: "POST",
      body: { sessionId: getSessionId(), type, payload },
      // Without this, a request fired from a beforeunload/unmount handler
      // (i.e. every "product_engagement" flush - see useProductEngagement.js)
      // can get silently cancelled mid-flight by the browser once real page
      // unload begins, dropping that visit's data entirely. keepalive tells
      // the browser to let it finish in the background instead.
      keepalive: true,
    }).catch(() => {
      // Analytics failures must never surface to the shopper.
    });
  }

  return { logEvent, getSessionId };
}
