import { getStore } from "@netlify/blobs";
import { applyEventToAggregate, withDefaults } from "./analyticsAggregate";

function randomSuffix() {
  return Math.random().toString(36).slice(2, 10);
}

// Shared by events.post.ts (client-reported gestures/page views) and
// account/purchase.post.ts (server-side, once a wallet debit actually
// succeeds) so both write through the same one-blob-per-event +
// running-aggregate path instead of duplicating it.
export async function logAnalyticsEvent(type: string, sessionId: string, payload: Record<string, unknown> = {}) {
  const eventsStore = getStore({
    name: "interaction-events",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_AUTH_TOKEN,
  });
  const aggregateStore = getStore({
    name: "analytics-aggregate",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_AUTH_TOKEN,
  });

  const record = { sessionId, type, payload, timestamp: new Date().toISOString() };
  const key = `${record.timestamp}-${randomSuffix()}`;
  await eventsStore.setJSON(key, record);

  const current = withDefaults(await aggregateStore.get("summary", { type: "json" }));
  await aggregateStore.setJSON("summary", applyEventToAggregate(current, record));
}
