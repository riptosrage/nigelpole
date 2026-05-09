# How To Update The Nigel Pole

The site is connected to GitHub. Drag-and-drop to Netlify is no longer used.

---

## To deploy a new version

1. Edit any file in this folder on your computer (or just drop a photo into `photos/gallery/`)
2. Open **GitHub Desktop**
3. Type a quick summary at the bottom (e.g., "added photos from polly")
4. Click **"Commit to main"**
5. Click **"Push origin"** at the top
6. Wait ~90 seconds. Netlify auto-rebuilds and deploys.
7. Hard refresh nigelpole.com (Cmd+Shift+R)

---

## To add a photo to the gallery

1. Save the photo into `photos/gallery/` with a structured filename
2. Commit + push in GitHub Desktop
3. Photo appears on the site automatically with caption + credit + date

### Filename convention

```
YYYY-MM-DD_photographer_description-with-dashes.jpg
```

Examples:

- `2026-05-09_polly_pole-from-below.jpg`
  → caption: "pole from below"
  → credit: "photo by polly · may 2026"

- `2026-05-09_anonymous_winter-shrine.jpg`
  → caption: "winter shrine"
  → credit: "photo by anonymous · may 2026"

- `2026-05-09_unknown_random-pole-shot.jpg`
  → caption: "random pole shot"
  → credit: "may 2026" (no photographer line when "unknown")

### Rules

- Date format: `YYYY-MM-DD` (4-digit year, 2-digit month, 2-digit day, dashes)
- Underscores `_` separate the three parts
- Within the description, words are separated by **dashes** `-` (no spaces)
- Use lowercase letters, numbers, and dashes only
- Use `unknown` as the photographer if you don't know or don't want to credit
- Photos are sorted newest-first by date

### What if I don't follow the convention?

Filenames that don't match still work — they fall back to a simple caption from the filename, no credit line. So `cool-photo.jpg` becomes caption "cool photo" with no credit.

This means you can be lazy when you want, structured when it matters.

### Removing a photo

Delete the file from `photos/gallery/` in Finder, commit, push.

### Renaming a photo (changing caption or credit)

Rename the file in Finder, commit, push.

---

## The guestbook auto-publishes

Visitors sign, entries appear immediately. Spam protection built in.

To remove a bad entry: Netlify dashboard → Blobs → guestbook → entries → edit JSON.

---

## Contact form submissions

Email notification + viewable in Netlify dashboard → Forms → contact.

---

## Other site edits (text, links, news, lore)

Open `index.html` in VS Code, edit, save, commit, push.

---

## What NOT to delete

- `netlify.toml`, `package.json`, `scripts/build-gallery-manifest.mjs` — required for the build
- `netlify/functions/` folder — auto-publishing guestbook
- `photos/01.jpg`, `photos/avatar.jpg`, `photos/nigel.jpg` — used outside gallery
- `.gitignore` — keeps junk files out of git
- The hidden contact form at top of `<body>`
- The `<script>` block at the bottom of `<body>`

#TeamNigel
