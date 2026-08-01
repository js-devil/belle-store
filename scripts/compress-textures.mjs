// Standalone texture-compression pass, run separately from `gltf-transform optimize`.
//
// Why this exists: @gltf-transform/cli's own --texture-compress option resolves its
// own nested `sharp` copy (a version range incompatible with the one shared by this
// project's other dependencies), so two different native libvips builds end up
// loaded in the same process. That corrupts libvips' global GObject enum registry
// and throws "colourspace: parameter space not set" on every texture. Calling
// @gltf-transform/functions' compressTexture() directly from here, with the single
// `sharp` instance already deduped into this project's node_modules, avoids ever
// loading a second copy.
import { readFile, writeFile } from "node:fs/promises";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { compressTexture } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import sharp from "sharp";

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/compress-textures.mjs <input.glb> <output.glb>");
  process.exit(1);
}

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "draco3d.decoder": await draco3d.createDecoderModule(),
    "draco3d.encoder": await draco3d.createEncoderModule(),
  });
const doc = await io.readBinary(await readFile(inputPath));

for (const texture of doc.getRoot().listTextures()) {
  await compressTexture(texture, {
    targetFormat: "webp",
    encoder: sharp,
    lossless: false,
    nearLossless: false,
    limitInputPixels: true,
  });
}

await writeFile(outputPath, await io.writeBinary(doc));
