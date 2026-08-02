// Converts a model from the legacy KHR_materials_pbrSpecularGlossiness
// workflow to standard metallic-roughness, preserving the diffuse texture as
// a real baseColorTexture. Needed because model-viewer's bundled three.js
// GLTFLoader has no support for KHR_materials_pbrSpecularGlossiness at all -
// affected models rendered as flat, textureless white/grey (the loader
// silently ignores the unsupported extension and falls back to glTF core
// defaults), even though a real photo texture was sitting right there in
// the file the whole time.
import { readFile, writeFile } from "node:fs/promises";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { metalRough } from "@gltf-transform/functions";

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/fix-specgloss.mjs <input.glb> <output.glb>");
  process.exit(1);
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.readBinary(await readFile(inputPath));
await doc.transform(metalRough());
await writeFile(outputPath, await io.writeBinary(doc));
