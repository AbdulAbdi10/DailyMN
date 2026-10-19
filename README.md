# Daily Digest MN

A newspaper-inspired personal journal for Minneapolis, Minnesota, and the world. Plain HTML, CSS and JavaScript; no build, paid service, backend, or GitHub credentials required in the website.

## First upload to GitHub Pages
1. Create a repository named `daily-digest-mn`.
2. Upload all files from this ZIP directly to the repository root. Do not nest them in another folder.
3. In **Settings → Pages**, choose **Deploy from a branch**, **main**, and **/ (root)**, then Save.
4. Open the URL GitHub provides after deployment.
5. Select **Write an entry**. Remove sample entries using the editor, add your own writing, and download the updated file.

## Your daily routine — no HTML changes
1. Open `https://YOUR-USERNAME.github.io/daily-digest-mn/editor.html`.
2. The editor loads existing entries. If you downloaded a newer file but have not published it, import that file first.
3. Enter the title, date, topic and summary. Around 300 words is suggested, not enforced.
4. Click **Add to journal**. An existing date requires confirmation before replacement.
5. Click **Download entries.json**. Keep this file as a backup.
6. Open your GitHub repository → **Add file → Upload files**. Upload the downloaded file to the repository root, replacing `entries.json`, and commit the change.
7. After GitHub Pages finishes deploying, refresh your journal. Newest entries appear first.

Only `entries.json` changes each day. GitHub still redeploys the site after the commit; you do not need to upload index.html, CSS or JavaScript again. If your browser renames the download to `entries (1).json`, rename it to exactly `entries.json` before uploading. Always start with the latest complete file so earlier entries are preserved. Avoid editing from two devices at once without reloading/importing the latest version.

## Understanding the editor
This is a public static writing utility, not a private admin area. Anyone can use its local editor, but only someone with repository write access can publish changes. It does not write to GitHub or send your draft to a server. Its form draft is stored in the current browser when local storage is available. The working collection of entries lives in memory until downloaded; keep backups. Downloading does not publish. Do not place unpublished or sensitive content in your public repository.

The optional Google Fonts request goes to Google; all rendering still works with fallback fonts offline. Entries and drafts are rendered as plain text, never executable HTML.

## Editing the data directly (optional)
`entries.json` is an array, one entry per date:

```json
[
  {
    "date": "2026-10-18",
    "title": "Your headline for the day",
    "topic": "Minneapolis",
    "body": "Your roughly 300-word daily summary.\n\nAn optional second paragraph."
  }
]
```

Topics: `Minneapolis`, `Minnesota`, `World`. Dates: `YYYY-MM-DD`. The editor handles quotes, commas and newlines automatically. For a day covering multiple places, choose its main topic and discuss the rest in the summary.

## Preview on your computer
The reader fetches entries.json, so double-clicking index.html may be blocked by your browser. In this folder run `python3 -m http.server 8000`, then open `http://localhost:8000`. Alternatively, use the hosted GitHub Pages version. The editor can be opened directly and supplied a local JSON file with Import.

## Included
- Responsive journal with dated full-length entries, newest first.
- Topic filters, full-text search, earlier-entry pagination and date permalinks.
- Writing desk with live preview, approximate word count, import/export, local form draft, and sample removal.
- Accessible labels, keyboard focus, reduced-motion support and clear loading/error states.
- Clearly labeled illustrative samples, not current news reporting.

No automatic news gathering, scheduled posts, email delivery or authenticated dashboard is included. You write and publish each day's summary yourself.
