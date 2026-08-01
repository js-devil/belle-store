#!/usr/bin/env bash
# One-off batch compression of public/models/**/*.glb.
#
# Runs in two passes per file rather than a single `gltf-transform optimize`
# call, because the CLI's own --texture-compress option loads a *different*
# nested `sharp` build than the one this project shares with @gltf-transform's
# other dependencies. Two different native libvips copies loaded in one
# process corrupt libvips' global colourspace enum registry and every texture
# conversion fails ("colourspace: parameter space not set"). Splitting into
# (1) geometry-only CLI pass, no sharp involved, and (2) a custom script
# (scripts/compress-textures.mjs) that does the texture pass with the single
# deduped `sharp` instance, avoids that entirely. See compress-textures.mjs.
set -euo pipefail

STAGING=$(mktemp -d)
trap 'rm -rf "$STAGING"' EXIT

total_before=0
total_after=0
count=0
failed=()

while IFS= read -r -d '' src; do
  count=$((count + 1))
  rel="${src#public/models/}"
  step1="$STAGING/step1.glb"
  step2="$STAGING/step2.glb"

  before=$(stat -c%s "$src")

  if ! node_modules/.bin/gltf-transform optimize "$src" "$step1" \
      --compress draco --texture-compress false --palette false >/tmp/gltf-optimize.log 2>&1; then
    echo "FAILED (geometry): $rel"
    cat /tmp/gltf-optimize.log
    failed+=("$rel")
    continue
  fi

  if ! node scripts/compress-textures.mjs "$step1" "$step2" >/tmp/gltf-textures.log 2>&1; then
    echo "FAILED (textures): $rel"
    cat /tmp/gltf-textures.log
    failed+=("$rel")
    continue
  fi

  after=$(stat -c%s "$step2")
  if [ "$after" -lt 1000 ]; then
    echo "FAILED (suspiciously small output, $after bytes): $rel"
    failed+=("$rel")
    continue
  fi

  cp "$step2" "$src"
  total_before=$((total_before + before))
  total_after=$((total_after + after))
  printf '[%3d] %-60s %8d KB -> %8d KB\n' "$count" "$rel" "$((before / 1024))" "$((after / 1024))"
done < <(find public/models -name "*.glb" -print0)

echo ""
echo "Done: $count models processed."
echo "Total: $((total_before / 1024 / 1024)) MB -> $((total_after / 1024 / 1024)) MB"
if [ "${#failed[@]}" -gt 0 ]; then
  echo "Failed (left untouched):"
  printf '  %s\n' "${failed[@]}"
fi
