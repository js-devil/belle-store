import { getStore } from "@netlify/blobs";
import { backfillAggregate } from "../../utils/analyticsAggregate";

// Rebuilds the live aggregate from every raw event using the CURRENT
// classification rules in analyticsAggregate.ts - unlike reset.post.ts
// (which zeroes the aggregate), this replays real history through
// whatever the rules are today, so a definition fix (e.g. counting
// "checked reviews" as active 2D browsing) applies retroactively to
// already-collected visits instead of only affecting new ones.
export default defineEventHandler(async () => {
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

  const aggregate = await backfillAggregate(eventsStore);
  await aggregateStore.setJSON("summary", aggregate);

  return { ok: true, totalEvents: aggregate.totalEvents };
});
