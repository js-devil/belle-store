import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "server", "data");
const LOG_FILE = join(DATA_DIR, "interaction-events.jsonl");

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

  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(LOG_FILE, JSON.stringify(record) + "\n", "utf-8");

  return { ok: true };
});
