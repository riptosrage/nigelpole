# How To Update The Nigel Pole

The site is connected to GitHub. Drag-and-drop to Netlify is no longer used.

---

## To deploy a new version

1. Edit any file in this folder on your computer (or just drop a photo into `photos/gallery/`)
2. Open **GitHub Desktop**
3. Type a quick summary at the bottom (e.g., "added photo from alex")
4. Click **"Commit to main"**
5. Click **"Push origin"** at the top
6. Wait ~60 seconds. Netlify auto-rebuilds and deploys.
7. Hard refresh nigelpole.com (Cmd+Shift+R)

---

## To add a photo to the gallery (THE EASY WAY)

1. Save the photo into `photos/gallery/` with a descriptive filename
2. Commit + push in GitHub Desktop
3. Done. Photo appears on the site automatically with a caption.

### Filename → caption rules

The filename becomes the caption. Words separated by dashes.

- `submitted-by-alex.jpg` → "submitted by alex"
- `from-maria-on-woodland.jpg` → "from maria on woodland"
- `nigel-pooped-on-the-met-gala.jpg` → "nigel pooped on the met gala"
- `01.jpg` → no caption (plain numbers = no caption)

Use `.jpg`, `.jpeg`, `.png`, `.webp`, or `.gif`. Don't use spaces or special characters in filenames — only lowercase letters, numbers, and dashes.

Photos appear in the order they're added to the folder (oldest first).

### To remove a photo

Delete the file from `photos/gallery/` in Finder, commit, push.

### To rename a caption

Rename the file in Finder, commit, push.

---

## The guestbook auto-publishes

You don't need to do anything to publish entries. Visitors sign, entries appear immediately. Spam protection built in.

Bad entries can be removed via Netlify dashboard → Blobs → guestbook → entries (edit the JSON).

---

## Contact form submissions

Email notification + viewable in Netlify dashboard → Forms → contact.

---

## Other site edits (text, links, news, lore, etc.)

Open `index.html` in VS Code, edit, save, commit, push.

---

## What NOT to delete

- `netlify.toml`, `package.json`, `scripts/build-gallery-manifest.mjs` — required for the build
- `netlify/functions/` folder — auto-publishing guestbook
- `photos/01.jpg`, `photos/avatar.jpg`, `photos/nigel.jpg` — used outside the gallery (hero, IG link, portrait)
- `.gitignore` — keeps junk files out of git
- The hidden contact form at top of `<body>`
- The `<script>` block at the bottom of `<body>`

#TeamNigel
