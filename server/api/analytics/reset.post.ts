import { getStore } from "@netlify/blobs";
import { EMPTY_AGGREGATE } from "../../utils/analyticsAggregate";

// Resets only the LIVE aggregate (what the insights dashboard displays) -
// deliberately does not touch the "interaction-events" store, which keeps
// every raw event forever so the study's underlying data survives even if
// the live view is cleared (e.g. after a demo/test pass) and stays
// available for re-aggregation if analysis requirements change later.
//
// Sets the aggregate to a real empty object rather than deleting the blob -
// summary.get.ts treats a MISSING blob as "never aggregated yet" and
// rebuilds it from every raw event on the next request, which would undo
// the reset immediately.
export default defineEventHandler(async () => {
  const aggregateStore = getStore({
    name: "analytics-aggregate",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_AUTH_TOKEN,
  });

  await aggregateStore.setJSON("summary", EMPTY_AGGREGATE());

  return { ok: true };
});
