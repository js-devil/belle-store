import { getStore } from "@netlify/blobs";

const VALID_TYPES = new Set([
  "page_view",
  "time_on_page",
  "rotate_gesture",
  "zoom_event",
  "add_to_cart",
]);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body || typeof body.sessionId !== "string" || !VALID_TYPES.has(body.type)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid event payload" });
  }

  // Anonymous by design: only a random per-session id (see useAnalytics.js),
  // an event type, and a small payload are ever recorded - no name, no
  // account, no IP, no payment data.
  const record = {
    sessionId: body.sessionId,
    type: body.type,
    payload: body.payload ?? {},
    timestamp: new Date().toISOString(),
  };

  // One blob per event (keyed uniquely) rather than appending to a single
  // growing blob - Netlify's serverless functions have no shared/writable
  // filesystem between invocations, and a single-blob read-modify-write
  // would lose events under concurrent traffic. The analytics/summary
  // endpoint lists and aggregates every blob in this store.
  const store = getStore("interaction-events");
  const key = `${record.timestamp}-${crypto.randomUUID()}`;
  await store.setJSON(key, record);

  return { ok: true };
});
