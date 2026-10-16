# Pond Sensor Atlas — setup guide

A map of pond and recharge-structure sensor sites with profiles, results, comparison and comments.
It runs as a free website on GitHub Pages. Data comes from a Google Sheet (or the Excel files in `data/`),
and comments are saved to the same Google Sheet. Nobody needs to sign in to view or comment.

**What's in this folder**

| File / folder | What it is |
|---|---|
| `index.html` | The website. You don't need to edit it. |
| `config.js` | Settings: the links to your Google Sheet and comments. **This is the only file you edit.** |
| `data/` | The two Excel files. Used only until you connect Google Sheets. |
| `img/` | Site photos and charts, named `<Sensor Code>_site.jpg` and `<Sensor Code>_chart.jpg`. |
| `apps-script/Code.gs` | The comments script you paste into Google Sheets (step 3). |

Time needed: about 30–45 minutes the first time.

---

## Step 1 — Put the website on GitHub Pages (≈10 min)

After this step the site is live, reading data from the Excel files in `data/`.

1. Unzip `pond-atlas.zip` on your computer.
2. Go to <https://github.com/new>.
   - **Repository name:** `pond-atlas` (this becomes part of the web address).
   - Choose **Public** (free GitHub Pages needs a public repository — see *Privacy* below).
   - Click **Create repository**.
3. On the new repository page, click the link **uploading an existing file**.
4. Open the unzipped `pond-atlas` folder, select **everything inside it** (`index.html`, `config.js`, `README.md`, and the `data`, `img` and `apps-script` folders) and drag it all into the browser window. Use Chrome or Edge so the folders upload with their contents.
5. Wait until all files are listed, then click **Commit changes**.
6. Go to **Settings → Pages** (left menu).
   - **Source:** Deploy from a branch
   - **Branch:** `main`, folder `/ (root)` → **Save**.
7. Wait 1–2 minutes and refresh the Pages settings. It shows the address, e.g.
   `https://YOUR-USERNAME.github.io/pond-atlas/`. Open it — you should see the map with 35 sites.

## Step 2 — Move the data to Google Sheets (≈10 min)

After this step, anyone you give edit access to the Google Sheet can add or correct sites, and the website updates on its own.

1. Go to <https://drive.google.com> → **New → File upload** → choose `data/Pond_Sites_Metadata.xlsx`.
2. Open it. At the top choose **File → Save as Google Sheets**. A new Google Sheet opens; rename it **Pond Atlas Data**. (You can delete the uploaded .xlsx from Drive afterwards.)
3. In Pond Atlas Data: **File → Import → Upload** → choose `data/Pond_Sites_Results.xlsx` → **Import location: Insert new sheet(s)** → **Import data**.
   You now have the tabs **Sites**, **How to use**, **Results** (and possibly a second *How to use*, which you can delete).
4. **Publish the Sites tab:** **File → Share → Publish to web**.
   - First drop-down: **Sites**. Second drop-down: **Comma-separated values (.csv)**.
   - Click **Publish → OK**, then copy the link it shows.
5. **Publish the Results tab:** in the same window change the first drop-down to **Results** (keep .csv), click **Publish**, and copy that link too.
   - Under **Published content and settings**, make sure **Automatically republish when changes are made** is ticked.
   - Do **not** publish the *Comments* tab that step 3 creates.
6. Paste the links into `config.js` on GitHub:
   - In your repository, click `config.js` → the **pencil icon** (Edit).
   - Paste the Sites link between the quotes of `METADATA_URL: ""` and the Results link into `RESULTS_URL: ""`.
   - Optional: put the Google Sheet's normal link in `DATA_LINK` to show a "View data sheet" button (only people you've shared the sheet with can open it).
   - Click **Commit changes**. The website updates within a minute or two.

The site's status line now says **"Live from Google Sheets"**. Edits in the sheet appear on the website within about 5 minutes (Google refreshes published data on its own schedule).

## Step 3 — Switch on comments (≈10 min)

1. In **Pond Atlas Data**, choose **Extensions → Apps Script**.
2. Delete the sample code in the editor, open `apps-script/Code.gs` from the folder, copy all of it and paste it in. Click the **Save** icon.
3. Click **Deploy → New deployment**.
   - Click the gear icon next to *Select type* → **Web app**.
   - **Description:** Comments
   - **Execute as:** Me
   - **Who has access:** **Anyone**  ← important, otherwise visitors can't comment
   - Click **Deploy**.
4. Google asks you to authorise the script: **Authorize access** → choose your account → on "Google hasn't verified this app" click **Advanced → Go to … (unsafe) → Allow**. This warning is normal for a script you wrote yourself; it only gets access to this spreadsheet.
5. Copy the **Web app URL** (it ends in `/exec`).
6. On GitHub, edit `config.js` again and paste it into `COMMENTS_URL: ""`. **Commit changes**.

Open a site on the website, add a comment, and check that a **Comments** tab has appeared in the Google Sheet with your comment.

> If you ever change the script: **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. The URL stays the same.

---

## Everyday tasks

**Add or correct a site** — edit the **Sites** tab (one row per site) and the **Results** tab (one row per sensor). The **Sensor Code** column links them, so keep it identical in both. Keep the header row exactly as it is. Leave Latitude/Longitude blank if unknown; the site will show "No GPS" and appear in the list but not on the map.

**Add or replace a photo or chart** — on GitHub open the `img` folder → **Add file → Upload files**. Name the file with the Sensor Code:
`332_site.jpg` for the site photo, `332_chart.jpg` for the water-level chart (`.png` also works). Uploading a file with an existing name replaces it. Keep photos under about 1 MB (resize phone photos to ~1200 px wide) so pages load quickly in the field.

**Moderate comments** — open the **Comments** tab. Type `yes` in the *Hidden* column to hide a comment, or delete the row.

**Change the heading** — edit `TITLE` and `SUBTITLE` in `config.js`.

**Use your own web address (optional)** — **Settings → Pages → Custom domain** on GitHub, then follow GitHub's instructions for your domain provider.

## Troubleshooting

| What you see | What to check |
|---|---|
| "Could not load site data" | The link in `config.js` is the **Publish to web .csv** link (not the normal share link), the tab is published, and the header row hasn't been renamed. |
| Edits in the sheet don't show | Wait 5 minutes and reload; check *Automatically republish* is ticked. |
| "Comments could not be loaded" | The deployment's **Who has access** is **Anyone**, and the URL ends in `/exec`. |
| Photo shows "No site photo yet" | The file name matches the Sensor Code exactly, ends in `_site.jpg`, and is inside `img/`. |
| Site not on the map | Latitude/Longitude are filled in as decimal numbers (e.g. 27.93649). |

## Privacy

- The GitHub repository is public: anyone can see the files in it, including the Excel files in `data/` and the photos. Once Google Sheets is connected you can delete the `data/` folder from GitHub if you prefer.
- "Publish to web" makes the **Sites** and **Results** tabs readable by anyone with the link. The **Comments** tab is not published; visitors only see comments through the website, and hidden ones never leave the sheet.
- Commenters type their own name; names are not verified.
- Map tiles come from OpenStreetMap (street map) and Esri (satellite).
