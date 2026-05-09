#!/usr/bin/env node
// Generates photos/gallery/manifest.json by listing files in photos/gallery/
// Runs automatically on every Netlify build (see netlify.toml -> build.command)
//
// FILENAME CONVENTION (preferred):
//   YYYY-MM-DD_photographer_description-with-dashes.jpg
//   e.g. 2026-05-09_polly_pole-from-below.jpg
//
// Renders as a 2-line caption:
//   "pole from below"
//   "photo by polly · may 2026"
//
// Filenames that don't match this pattern fall back gracefully:
//   submitted-by-alex.jpg  -> caption: "submitted by alex"
//   01.jpg                 -> no caption
//
// Photos are sorted by date (newest first if dated, then by file mtime).

import { readdir, writeFile, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const GALLERY_DIR = 'photos/gallery';
const MANIFEST_PATH = 'photos/gallery/manifest.json';

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

// Matches: 2026-05-09_polly_pole-from-below
//          ^date          ^photographer  ^description (rest)
const STRUCTURED = /^(\d{4})-(\d{2})-(\d{2})_([a-z0-9]+)_(.+)$/i;

function dashesToWords(s) {
  return s.replace(/-/g, ' ').toLowerCase().trim();
}

function parseFilename(filename) {
  const name = basename(filename, extname(filename));

  // Plain numbers like "01" -> no caption
  if (/^[0-9]+$/.test(name)) {
    return { caption: '', credit: '', sortKey: name };
  }

  const m = name.match(STRUCTURED);
  if (m) {
    const [, year, month, day, photographer, description] = m;
    const monthIdx = parseInt(month, 10) - 1;
    const monthName = MONTHS[monthIdx] || '';
    const caption = dashesToWords(description);
    const photographerLower = photographer.toLowerCase();
    let credit = '';
    if (photographerLower !== 'unknown') {
      credit = monthName
        ? `photo by ${photographerLower} \u00B7 ${monthName} ${year}`
        : `photo by ${photographerLower}`;
    } else if (monthName) {
      // Just show the date if photographer unknown
      credit = `${monthName} ${year}`;
    }
    return {
      caption,
      credit,
      sortKey: `${year}-${month}-${day}`,
    };
  }

  // Unstructured fallback
  return {
    caption: dashesToWords(name),
    credit: '',
    sortKey: '0000-00-00',
  };
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

    const { caption, credit, sortKey } = parseFilename(f);

    photos.push({
      src: `photos/gallery/${f}`,
      caption,
      credit,
      sortKey,
      mtime,
    });
  }

  // Sort newest first by date prefix, falling back to mtime
  photos.sort((a, b) => {
    if (a.sortKey !== b.sortKey) return b.sortKey.localeCompare(a.sortKey);
    return b.mtime - a.mtime;
  });

  const out = photos.map(({ src, caption, credit }) => ({ src, caption, credit }));

  await writeFile(MANIFEST_PATH, JSON.stringify({ photos: out }, null, 2));
  console.log(`Wrote ${MANIFEST_PATH} with ${out.length} photos.`);
}

main().catch(err => {
  console.error('Manifest generation failed:', err);
  process.exit(1);
});
