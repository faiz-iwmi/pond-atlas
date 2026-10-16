/**
 * Pond Sensor Atlas — comments backend (Google Apps Script)
 *
 * Saves comments from the website into a "Comments" tab of this Google Sheet,
 * and serves them back to the website. Nobody needs to sign in to comment.
 *
 * Moderation: open the Comments tab and either delete a row, or type "yes"
 * in the "Hidden" column to hide it from the website.
 */
const SHEET_NAME = 'Comments';
const HEADERS = ['Timestamp', 'Sensor Code', 'Name', 'Comment', 'Hidden (type yes to hide)'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Stops spreadsheet formulas being injected through the comment form
function safe_(s) {
  s = String(s || '').trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// GET  → all visible comments
function doGet() {
  const values = sheet_().getDataRange().getValues().slice(1);
  const comments = values
    .filter(r => r[1] !== '' && r[3] !== '' && String(r[4]).trim().toLowerCase() !== 'yes')
    .map(r => ({
      at: new Date(r[0]).getTime(),
      site: String(r[1]),
      name: String(r[2]),
      text: String(r[3]),
    }));
  return json_({ ok: true, comments: comments });
}

// POST → add one comment: {site, name, text}
function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad_request' }); }
  if (d.website) return json_({ ok: true }); // spam trap field, real people leave it empty

  const site = String(d.site || '').slice(0, 40);
  const name = String(d.name || '').trim().slice(0, 80);
  const text = String(d.text || '').trim().slice(0, 2000);
  if (!site || !name || !text) return json_({ ok: false, error: 'missing_fields' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([new Date(), safe_(site), safe_(name), safe_(text), '']);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}
