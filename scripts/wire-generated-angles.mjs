// Appends the angle images from scripts/generated-angles.json into each
// matching product's images.gallery array, across all 6 category data
// files. Text-based edit (not JSON parse/stringify) since these are hand
// -formatted JS modules with comments - this only touches the gallery
// array's contents, nothing else in the file.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DRY_RUN = process.argv.includes("--dry-run");

const manifest = JSON.parse(await readFile(join(ROOT, "scripts/generated-angles.json"), "utf8"));
const categories = ["bikes", "electronics", "furniture", "jewelry", "shoes", "toys"];

let totalUpdated = 0;

for (const category of categories) {
  const filePath = join(ROOT, `app/data/products/${category}.js`);
  let content = await readFile(filePath, "utf8");
  let updatedInFile = 0;

  const regex = /(slug:\s*"([^"]+)"[\s\S]*?gallery:\s*\[)([^\]]*)(\])/g;
  content = content.replace(regex, (full, prefix, slug, galleryInner, suffix) => {
    const angles = manifest[slug];
    if (!angles || !angles.length) return full;
    // Idempotent: skip if these paths are already wired in (re-running
    // this script after adding more angles later shouldn't duplicate).
    if (galleryInner.includes("generated-angles")) return full;

    const extra = angles.map((p) => `"${p}"`).join(", ");
    const trimmed = galleryInner.trim();
    const newInner = trimmed ? `${trimmed}, ${extra}` : extra;
    updatedInFile++;
    return `${prefix}${newInner}${suffix}`;
  });

  console.log(`${category}.js: ${updatedInFile} product(s) updated`);
  totalUpdated += updatedInFile;

  if (!DRY_RUN && updatedInFile > 0) {
    await writeFile(filePath, content);
  }
}

console.log(`\nTotal: ${totalUpdated} product(s) updated${DRY_RUN ? " (dry run - nothing written)" : ""}.`);
