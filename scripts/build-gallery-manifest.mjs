#!/usr/bin/env node
// Generates photos/gallery/manifest.json by listing files in photos/gallery/
// Runs automatically on every Netlify build (see netlify.toml -> build.command)

import { readdir, writeFile, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const GALLERY_DIR = 'photos/gallery';
const MANIFEST_PATH = 'photos/gallery/manifest.json';

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function filenameToCaption(filename) {
  // 'submitted-by-alex.jpg' -> 'submitted by alex'
  // 'just-numbers-01.jpg' -> 'just numbers 01'
  // '01.jpg' -> '' (no caption for plain numeric)
  const name = basename(filename, extname(filename));
  if (/^[0-9]+$/.test(name)) return '';
  return name.replace(/-/g, ' ').toLowerCase().trim();
}

async function main() {
  let files;
  try {
    files = await readdir(GALLERY_DIR);
  } catch (err) {
    console.warn(`No ${GALLERY_DIR} folder found, writing empty manifest.`);
    files = [];
  }

  const photos = [];
  for (const f of files) {
    if (f.startsWith('.')) continue;
    if (f === 'manifest.json') continue;
    const ext = extname(f).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;

    let mtime = 0;
    try {
      const s = await stat(join(GALLERY_DIR, f));
      mtime = s.mtimeMs;
    } catch {}

    photos.push({
      src: `photos/gallery/${f}`,
      caption: filenameToCaption(f),
      mtime,
    });
  }

  // Sort: oldest first (so new photos appear at the end of the gallery)
  photos.sort((a, b) => a.mtime - b.mtime);

  // Strip mtime from output (only used for sort)
  const out = photos.map(({ src, caption }) => ({ src, caption }));

  await writeFile(MANIFEST_PATH, JSON.stringify({ photos: out }, null, 2));
  console.log(`Wrote ${MANIFEST_PATH} with ${out.length} photos.`);
}

main().catch(err => {
  console.error('Manifest generation failed:', err);
  process.exit(1);
});
