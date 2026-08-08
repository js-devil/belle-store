// Generates extra 2D gallery photos for every product that has a 3D model,
// by screenshotting that SAME model from a few different camera angles
// (front, 3/4, side, back) via a headless browser. This exists because the
// study's 2D-vs-3D comparison was unfair while most products only had 1-2
// real photos to click through - these angle shots are real renders of the
// actual product asset, not stock photos, so 2D shoppers get a comparable
// "look at it from multiple sides" experience to what 3D rotation gives for
// free, without fabricating anything about the product itself.
//
// Resumable by design: any product whose 4 angle files already exist on
// disk is skipped rather than re-rendered, and the manifest is rebuilt from
// whatever's actually on disk at the end - so a crash partway through (a
// stuck screenshot, a hung model load) only costs the one in-flight product,
// not the whole batch.
import { createServer } from "node:http";
import { readFile, stat, mkdir, readdir, writeFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUBLIC_DIR = join(ROOT, "public");
const MODEL_VIEWER_PATH = join(ROOT, "node_modules/@google/model-viewer/dist/model-viewer-umd.min.js");
const HARNESS_PATH = join(ROOT, "scripts/render-harness.html");
const PORT = 8842;

const MIME = { ".glb": "model/gltf-binary", ".jpg": "image/jpeg", ".js": "text/javascript", ".html": "text/html" };

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      // url.pathname keeps percent-escapes as-is (e.g. "male%20shoes"),
      // which never matches a real folder named "male shoes" on disk -
      // decode before touching the filesystem.
      const pathname = decodeURIComponent(url.pathname);
      let filePath;
      if (pathname === "/harness.html") filePath = HARNESS_PATH;
      else if (pathname === "/vendor/model-viewer.min.js") filePath = MODEL_VIEWER_PATH;
      else filePath = join(PUBLIC_DIR, pathname);

      const body = await readFile(filePath);
      res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

const ANGLES = [
  { suffix: "front", orbit: "0deg 75deg 105%" },
  { suffix: "three-quarter", orbit: "45deg 70deg 105%" },
  { suffix: "side", orbit: "90deg 75deg 105%" },
  { suffix: "back", orbit: "180deg 75deg 105%" },
];

async function allAnglesExist(outputBase) {
  for (const angle of ANGLES) {
    try {
      await stat(`${outputBase}-${angle.suffix}.jpg`);
    } catch {
      return false;
    }
  }
  return true;
}

async function renderProductAngles(page, modelSrc, outputBase) {
  const saved = [];
  for (const angle of ANGLES) {
    const url = `http://localhost:${PORT}/harness.html?src=${encodeURIComponent(modelSrc)}&orbit=${encodeURIComponent(angle.orbit)}`;
    try {
      await page.goto(url, { waitUntil: "load" });
      await page.waitForSelector("body[data-ready]", { timeout: 20000 });
      const ready = await page.getAttribute("body", "data-ready");
      if (ready === "error") {
        console.log(`  MODEL LOAD ERROR: ${modelSrc}`);
        break;
      }
      const outputPath = `${outputBase}-${angle.suffix}.jpg`;
      await page.locator("#mv").screenshot({ path: outputPath, type: "jpeg", quality: 88, timeout: 15000 });
      saved.push(outputPath);
    } catch (err) {
      console.log(`  FAILED (${angle.suffix}): ${err.message.split("\n")[0]}`);
      break;
    }
  }
  return saved;
}

async function rebuildManifestFromDisk(categories) {
  const results = {};
  for (const category of categories) {
    const outDir = join(PUBLIC_DIR, "models", "generated-angles", category);
    let files;
    try {
      files = await readdir(outDir);
    } catch {
      continue;
    }
    for (const file of files) {
      const match = file.match(/^(.+)-(front|three-quarter|side|back)\.jpg$/);
      if (!match) continue;
      const slug = match[1];
      const publicPath = `/models/generated-angles/${category}/${file}`;
      (results[slug] ??= []).push(publicPath);
    }
  }
  return results;
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 800 } });

  const categories = ["bikes", "electronics", "furniture", "jewelry", "shoes", "toys"];

  for (const category of categories) {
    const mod = await import(`../app/data/products/${category}.js?t=${Date.now()}`);
    const products = mod[category];
    for (const product of products) {
      if (!product.model3d) continue;
      const modelPublicPath = product.model3d.startsWith("/") ? product.model3d.slice(1) : product.model3d;
      const modelDiskPath = join(PUBLIC_DIR, modelPublicPath);
      try {
        await stat(modelDiskPath);
      } catch {
        console.log(`SKIP (file missing): ${product.slug} -> ${product.model3d}`);
        continue;
      }

      const outDir = join(PUBLIC_DIR, "models", "generated-angles", category);
      await mkdir(outDir, { recursive: true });
      const outputBase = join(outDir, product.slug);

      if (await allAnglesExist(outputBase)) {
        console.log(`SKIP (already rendered): ${product.slug}`);
        continue;
      }

      console.log(`Rendering: ${product.slug}`);
      const saved = await renderProductAngles(page, product.model3d, outputBase);
      console.log(`  -> ${saved.length} angle(s) saved`);
    }
  }

  await browser.close();
  server.close();

  const results = await rebuildManifestFromDisk(categories);
  await writeFile(join(ROOT, "scripts/generated-angles.json"), JSON.stringify(results, null, 2));
  console.log(`\nDone. Wrote scripts/generated-angles.json with ${Object.keys(results).length} product(s).`);
}

main();
