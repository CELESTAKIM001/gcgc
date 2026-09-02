import "server-only";
import { google } from "googleapis";
import { Readable } from "node:stream";
import { env } from "./env";

function auth() {
  if (!env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_PRIVATE_KEY) throw new Error("Google service account is not configured");
  return new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function uploadToDrive(buffer: Buffer, name: string, mimeType: string, parentId = env.GOOGLE_DRIVE_FOLDER_ID) {
  if (!env.GOOGLE_DRIVE_ENABLED) throw new Error("Google Drive integration is disabled");
  const drive = google.drive({ version: "v3", auth: auth() });
  const r = await drive.files.create({
    requestBody: { name, mimeType, parents: parentId ? [parentId] : undefined },
    media: { mimeType, body: Readable.from(buffer) },
    fields: "id,name,mimeType,webViewLink,size,createdTime",
  });
  return r.data;
}

async function ensureTab(sheets:any, sheetName:string){
  const meta=await sheets.spreadsheets.get({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,fields:"sheets.properties"});
  const exists=meta.data.sheets?.some((x:any)=>x.properties?.title===sheetName);
  if(!exists) await sheets.spreadsheets.batchUpdate({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,requestBody:{requests:[{addSheet:{properties:{title:sheetName}}}]}});
}
export async function appendSheet(row:string[],range="Sheet1!A:Z",headers?:string[]){
  if(!env.GOOGLE_SHEETS_ENABLED) return null;
  if(!env.GOOGLE_SPREADSHEET_ID) throw new Error("Google Spreadsheet is not configured");
  const sheets=google.sheets({version:"v4",auth:auth()});
  const sheetName=range.split("!")[0].replace(/^'|'$/g,"");
  await ensureTab(sheets,sheetName);
  if(headers){
    const current=await sheets.spreadsheets.values.get({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,range:`'${sheetName}'!1:1`});
    if(!current.data.values?.length) await sheets.spreadsheets.values.update({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,range:`'${sheetName}'!A1`,valueInputOption:"RAW",requestBody:{values:[headers]}});
  }
  return sheets.spreadsheets.values.append({
    spreadsheetId:env.GOOGLE_SPREADSHEET_ID,range,valueInputOption:"USER_ENTERED",
    insertDataOption:"INSERT_ROWS",requestBody:{values:[row]}
  });
}

export async function ensureSheetHeaders(sheetName: string, headers: string[]) {
  if (!env.GOOGLE_SHEETS_ENABLED || !env.GOOGLE_SPREADSHEET_ID) return;
  const sheets = google.sheets({ version: "v4", auth: auth() });
  const safe = sheetName.replace(/'/g, "''");
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.GOOGLE_SPREADSHEET_ID,
    range: `'${safe}'!A1:${String.fromCharCode(64 + Math.min(headers.length, 26))}1`,
    valueInputOption: "RAW",
    requestBody: { values: [headers] },
  });
}

export const SHEET_COLUMNS = {
  users: ["timestamp","user_id","first_name","last_name","email","phone","county","town","member_type","role","status","email_verified","created_at","updated_at"],
  leads: ["timestamp","lead_id","member_id","title","location","estimated_value","status","payment_status","created_at","updated_at"],
  payments: ["timestamp","payment_id","lead_id","member_id","amount","phone","status","mpesa_receipt","checkout_request_id","transaction_date","created_at","updated_at"],
  documents: ["timestamp","document_id","owner_id","file_name","mime_type","size_bytes","drive_file_id","status","created_at"],
  audit: ["timestamp","audit_id","action","actor_id","entity_id","details","created_at"],
} as const;
