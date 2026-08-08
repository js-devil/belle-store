import { logAnalyticsEvent } from "../utils/analyticsLog";

// Just two event types: one consolidated "product_engagement" event per
// product-page visit (see useProductEngagement.js), rather than a separate
// network call per gesture/click, plus "purchase" at actual checkout.
const VALID_TYPES = new Set(["product_engagement", "purchase"]);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body || typeof body.sessionId !== "string" || !VALID_TYPES.has(body.type)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid event payload" });
  }

  // Anonymous by design: only a random per-session id (see useAnalytics.js),
  // an event type, and a small payload are ever recorded - no name, no
  // account, no IP, no payment data. Even once accounts/wallets exist
  // (see account/purchase.post.ts), that "purchase" event is logged the same
  // anonymous way - it never carries a username, just the session id.
  await logAnalyticsEvent(body.type, body.sessionId, body.payload ?? {});

  return { ok: true };
});
