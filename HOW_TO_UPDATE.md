# How To Update The Nigel Pole

The site is now connected to GitHub. Drag-and-drop to Netlify is no longer needed (and shouldn't be used — it'll bypass the build step and break the guestbook).

---

## To deploy a new version

1. Edit any file in this folder on your computer
2. Open **GitHub Desktop**
3. You'll see your changes listed under "Changes"
4. Type a quick summary at the bottom (e.g., "added new gallery photo")
5. Click **"Commit to main"**
6. Click **"Push origin"** (top of window)
7. Wait ~60 seconds — Netlify auto-rebuilds and deploys
8. Hard refresh nigelpole.com (Cmd+Shift+R)

---

## The guestbook auto-publishes now

You don't need to do anything to publish entries. Visitors sign, entries appear on the site immediately. Spam protection is built in (rate limiting, banned word list, honeypot).

If you ever need to remove a bad entry: that's stored in Netlify Blobs, accessible via the Netlify dashboard under **Blobs → guestbook → entries**. Edit the JSON there.

---

## Contact form submissions

Still go to your inbox via email notifications you set up in Netlify. View all submissions in **Netlify dashboard → Forms → contact**.

---

## To add a photo to the gallery

Save your photo (JPG, ideally under 500KB) into `photos/`, e.g. `05.jpg`. Then in `index.html` find the gallery section and add a `<div class="photo">...</div>` block. Commit and push.

---

## To add another news link

Find the news section, copy a `<li>` line, edit URL and title, commit, push.

---

## What NOT to delete

- `netlify.toml`, `package.json` — required for the build
- `netlify/functions/` folder — that's the auto-publishing guestbook
- `.gitignore` — keeps junk files out of git
- The hidden contact form at top of `<body>` — without it, contact form breaks
- The `<script>` block at bottom of `<body>`

---

## Common breakage

- **Site not updating?** Check GitHub Desktop — did you actually push? Check Netlify deploy log
- **Guestbook says "could not load entries"?** Function probably failed. Check Netlify → Functions → guestbook-read for logs
- **Site looks weird after edit?** You probably broke a closing tag. Use GitHub Desktop's history to revert

#TeamNigel
