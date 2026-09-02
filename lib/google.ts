import "server-only";
import { google } from "googleapis"; import { Readable } from "node:stream";
import { env } from "./env";
function auth(){return new google.auth.JWT({email:env.GOOGLE_SERVICE_ACCOUNT_EMAIL,key:env.GOOGLE_PRIVATE_KEY.replace(/\\n/g,"\n"),scopes:["https://www.googleapis.com/auth/drive","https://www.googleapis.com/auth/spreadsheets"]})}
export async function uploadToDrive(buffer:Buffer,name:string,mimeType:string,parentId=env.GOOGLE_DRIVE_FOLDER_ID){const a=auth();const drive=google.drive({version:"v3",auth:a});const r=await drive.files.create({requestBody:{name,mimeType,parents:[parentId]},media:{mimeType,body:Readable.from(buffer)},fields:"id,name,mimeType,webViewLink"});return r.data}
export async function appendSheet(row:string[],range="Sheet1!A:Z"){const a=auth();const sheets=google.sheets({version:"v4",auth:a});return sheets.spreadsheets.values.append({spreadsheetId:env.GOOGLE_SPREADSHEET_ID,range,valueInputOption:"USER_ENTERED",requestBody:{values:[row]}})}
