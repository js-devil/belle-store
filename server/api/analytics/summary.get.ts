import { readFile } from "node:fs/promises";
import { join } from "node:path";

const LOG_FILE = join(process.cwd(), "server", "data", "interaction-events.jsonl");

function topEntries(counts: Record<string, number>, limit = 10) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

export default defineEventHandler(async () => {
  let raw = "";
  try {
    raw = await readFile(LOG_FILE, "utf-8");
  } catch {
    // No events logged yet.
  }

  const events = raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const sessions = new Set();
  const pageViewsByPath = {};
  const productViewsBySlug = {};
  const addToCartBySlug = {};
  const rotateBySlug = {};
  const zoomBySlug = {};
  const timeOnPageBySlug = {};
  const eventsByDay = {};

  let totalPageViews = 0;
  let totalRotate = 0;
  let totalZoom = 0;
  let totalAddToCart = 0;

  for (const event of events) {
    sessions.add(event.sessionId);

    const day = (event.timestamp || "").slice(0, 10);
    if (day) eventsByDay[day] = (eventsByDay[day] || 0) + 1;

    const slug = event.payload?.slug;

    switch (event.type) {
      case "page_view":
        totalPageViews++;
        if (event.payload?.path) {
          pageViewsByPath[event.payload.path] = (pageViewsByPath[event.payload.path] || 0) + 1;
        }
        if (slug) productViewsBySlug[slug] = (productViewsBySlug[slug] || 0) + 1;
        break;
      case "add_to_cart":
        totalAddToCart++;
        if (slug) addToCartBySlug[slug] = (addToCartBySlug[slug] || 0) + 1;
        break;
      case "rotate_gesture":
        totalRotate++;
        if (slug) rotateBySlug[slug] = (rotateBySlug[slug] || 0) + 1;
        break;
      case "zoom_event":
        totalZoom++;
        if (slug) zoomBySlug[slug] = (zoomBySlug[slug] || 0) + 1;
        break;
      case "time_on_page":
        if (slug && typeof event.payload?.seconds === "number") {
          if (!timeOnPageBySlug[slug]) timeOnPageBySlug[slug] = { total: 0, count: 0 };
          timeOnPageBySlug[slug].total += event.payload.seconds;
          timeOnPageBySlug[slug].count += 1;
        }
        break;
    }
  }

  const viewer3dBySlug = {};
  for (const slug of new Set([...Object.keys(rotateBySlug), ...Object.keys(zoomBySlug)])) {
    viewer3dBySlug[slug] = (rotateBySlug[slug] || 0) + (zoomBySlug[slug] || 0);
  }

  const avgTimeOnPageBySlug = Object.fromEntries(
    Object.entries(timeOnPageBySlug).map(([slug, { total, count }]) => [
      slug,
      Math.round(total / count),
    ])
  );

  return {
    totalEvents: events.length,
    totalVisits: sessions.size,
    totalPageViews,
    totalAddToCart,
    totalRotate,
    totalZoom,
    total3dInteractions: totalRotate + totalZoom,
    topPages: topEntries(pageViewsByPath, 10),
    topProductViews: topEntries(productViewsBySlug, 10),
    topAddToCart: topEntries(addToCartBySlug, 10),
    top3dProducts: topEntries(viewer3dBySlug, 10),
    rotateBySlug,
    zoomBySlug,
    avgTimeOnPageBySlug,
    eventsByDay,
  };
});
