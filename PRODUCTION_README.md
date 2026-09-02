# GLDC — Full Production Web + Management Platform

This package is the deployable Next.js application, not the HTML prototype. The prototype-reference folder is retained only as a visual/content reference and is not used as the application database.

## Architecture
- Next.js 15 / React 19
- MongoDB Atlas — primary system of record
- Safaricom Daraja — M-PESA STK + callback reconciliation
- SMTP — verification and notification email
- Google Drive — document/PDF binary repository
- Google Sheets — operational backup / export
- SHA-256 + QR — PDF/document verification
- HTTP-only JWT cookies + RBAC + audit logging

## Main production flows
1. Member registration → verification email → administrator approval → login.
2. Approved member submits a project lead → administrator approves → deposit payment becomes available.
3. M-PESA STK request is recorded before the request and updated from the Daraja callback.
4. Documents are uploaded to Drive; metadata remains in MongoDB and is backed up to the Documents sheet.
5. Project proof PDFs receive a unique GLDC ID, QR verification URL and SHA-256 hash, then are archived in Drive.
6. Administrator actions create audit records and attempt Sheet backup.
7. Management Console → Backup & Controls can run a full MongoDB-to-Sheets operational backup.

## Required Google Sheet tabs
Create these tabs in the configured spreadsheet before production:
- `Users`
- `Leads`
- `Payments`
- `Documents`
- `Audit`

The first row in each tab should use the column order documented in `lib/google.ts` / `lib/backup.ts`. The QR verification endpoint is public and exposes only authenticity status, ID, issue time and hash.

## Daraja callback
The configured value is the base URL:
`https://api.gldc.co.ke`

The middleware routes POST requests received at `/` on that hostname to the internal callback handler. If you use a different domain, update the middleware host condition and Vercel/DNS configuration.

## File uploads
The included Vercel upload route deliberately rejects files above 4 MB because Vercel Function request limits make large multipart uploads unsuitable. For larger production files, add a direct/resumable upload flow to Drive or an object-storage service and save only the resulting file ID/metadata in MongoDB.

## Security
Never put real secrets in Git. The provided `.env.example` contains placeholders only. Because credentials were pasted into a chat during setup, rotate the exposed MongoDB password, JWT secrets, encryption key, Daraja credentials/passkey and SMTP/app password before production deployment.

## Deploy
1. Import this folder into Vercel.
2. Add all values from `.env.example` under Production Environment Variables.
3. Configure the MongoDB network/user.
4. Share the Google Drive folder and spreadsheet with the service account.
5. Create the five Sheet tabs.
6. Configure Daraja production callback/domain.
7. Configure SMTP.
8. Run the admin seed once using the production environment.
9. Delete/rotate `ADMIN_INITIAL_PASSWORD`.
10. Test registration, email verification, approval, lead approval, STK, callback, Drive upload, PDF verification and Sheet backup.

## Local
`npm install`
`npm run dev`

Production:
`npm run build`
`npm start`
