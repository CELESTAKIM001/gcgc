import "server-only";
import { google } from "googleapis";
import { Readable } from "node:stream";
import { env } from "./env";

function auth() {
  return new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });
}

export async function uploadToDrive(
  buffer: Buffer,
  name: string,
  mimeType: string,
  parentId = env.GOOGLE_DRIVE_FOLDER_ID
) {
  const a = auth();
  const drive = google.drive({ version: "v3", auth: a });
  const r = await drive.files.create({
    requestBody: { name, mimeType, parents: [parentId] },
    media: { mimeType, body: Readable.from(buffer) },
    fields: "id,name,mimeType,webViewLink,createdTime",
  });
  return r.data;
}

export async function appendSheet(row: string[], range = "Sheet1!A:Z") {
  const a = auth();
  const sheets = google.sheets({ version: "v4", auth: a });
  return sheets.spreadsheets.values.append({
    spreadsheetId: env.GOOGLE_SPREADSHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

/** Returns the list of existing sheet/tab titles in the configured spreadsheet. */
export async function listSheetTitles(): Promise<string[]> {
  const a = auth();
  const sheets = google.sheets({ version: "v4", auth: a });
  const meta = await sheets.spreadsheets.get({ spreadsheetId: env.GOOGLE_SPREADSHEET_ID });
  return (meta.data.sheets || [])
    .map((s) => s.properties?.title)
    .filter((t): t is string => !!t);
}

/** Creates the tab if it does not already exist. Safe to call repeatedly. */
export async function ensureSheetTab(title: string) {
  const existing = await listSheetTitles();
  if (existing.includes(title)) return;
  const a = auth();
  const sheets = google.sheets({ version: "v4", auth: a });
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: env.GOOGLE_SPREADSHEET_ID,
    requestBody: { requests: [{ addSheet: { properties: { title } } }] },
  });
}

/** Clears all values in a tab (used before writing a fresh backup snapshot). */
export async function clearSheetRange(range: string) {
  const a = auth();
  const sheets = google.sheets({ version: "v4", auth: a });
  return sheets.spreadsheets.values.clear({
    spreadsheetId: env.GOOGLE_SPREADSHEET_ID,
    range,
  });
}

/** Overwrites a tab starting at A1 with the given 2D array (header row + data rows). */
export async function writeSheetRange(range: string, values: (string | number)[][]) {
  const a = auth();
  const sheets = google.sheets({ version: "v4", auth: a });
  return sheets.spreadsheets.values.update({
    spreadsheetId: env.GOOGLE_SPREADSHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
}

/** Full snapshot write for one tab: ensures the tab exists, clears it, writes header + rows. */
export async function writeBackupTab(title: string, header: string[], rows: (string | number)[][]) {
  await ensureSheetTab(title);
  await clearSheetRange(`${title}!A:ZZ`);
  await writeSheetRange(`${title}!A1`, [header, ...rows]);
  return { title, rows: rows.length };
}
