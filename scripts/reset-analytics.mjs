// One-off: wipes all analytics data (raw events + the running aggregate) so
// the study can start recording from a clean slate under the new event
// schema. Also clears the accounts directory, since every account in there
// right now is dev/smoke-test data, not a real study participant.
//
// Usage: node scripts/reset-analytics.mjs
import { getStore } from "@netlify/blobs";

const siteID = process.env.NETLIFY_SITE_ID;
const token = process.env.NETLIFY_AUTH_TOKEN;

async function clearStore(name) {
  const store = getStore({ name, siteID, token });
  let count = 0;
  for await (const page of store.list({ paginate: true })) {
    for (const blob of page.blobs) {
      await store.delete(blob.key);
      count++;
    }
  }
  console.log(`${name}: deleted ${count} blob(s)`);
}

await clearStore("interaction-events");
await clearStore("analytics-aggregate");
await clearStore("accounts");
console.log("Done.");
