# GLDC Vercel Production Foundation

Next.js + MongoDB + Daraja + SMTP + Google Drive/Sheets foundation for Gavin Land & Design Consultants.

## Key production rules
- Copy `.env.example` to `.env.local` for local development only. Never commit real secrets.
- On Vercel, put secrets in Project Settings → Environment Variables, scoped to Production as required. Do not use `NEXT_PUBLIC_` for secrets.
- `DARAJA_CALLBACK_URL` holds the **base URL only** (e.g. `https://your-deployment.vercel.app`). The app appends `/api/payments/mpesa/callback` itself when it builds the STK push request, and Safaricom POSTs the result to the route handler at `app/api/payments/mpesa/callback/route.ts`, which updates the payment/lead status and emails the member.
- Daraja configuration follows the requested convention: `DARAJA_PARTY_A_SHORTCODE` is the GLDC shortcode and `DARAJA_PARTY_B_BUYGOODS_TILL` is the BuyGoods Till. The STK request still sends the customer's phone as PartyA, while the GLDC BuyGoods Till is PartyB, because those are the transaction fields expected by the M-PESA API.
- Email registration sends a verification email before admin approval.
- Registration captures 18 profile fields, including location and ID type/number.
- Admin API supports user list/create/update/delete and approval status changes.
- Sensitive ID numbers can be encrypted when `ENCRYPTION_KEY` is configured.
- Document uploads through a Vercel Function are capped below 4 MB in this sample because Vercel documents a 4.5 MB function payload limit. For larger files, use direct object storage/resumable uploads; Google Drive remains the document repository target.
- All transactional emails (verification, membership approval, lead approval, payment confirmed/failed, admin new-lead/new-registration notifications) render from branded HTML templates in `lib/email-templates.ts` and send through `lib/email.ts`.
- Every generated project-proof PDF (`/api/documents/project-proof`) and every member document upload (`/api/documents/upload`) is written to Google Drive and recorded in MongoDB (`documents` / `document_verifications`), so "PDF keeping" survives redeploys.
- An admin can trigger `/api/admin/backup` (also a button on the Admin → Backup panel) at any time to snapshot Users, Leads, Payments, Documents and Document Verifications from MongoDB into named tabs in the configured Google Sheet, each with a fixed, documented column set. Every run overwrites the previous snapshot per tab and is recorded in `audit_logs`.

## Vercel setup
1. Import this folder into a Vercel project and choose Next.js.
2. Add the variables in `.env.example` to Production in Vercel.
3. Add the custom domains `www.gldc.co.ke` and `api.gldc.co.ke` as required by your DNS setup.
4. Ensure `APP_URL=https://www.gldc.co.ke`, `API_URL=https://api.gldc.co.ke`, and `DARAJA_CALLBACK_URL=https://api.gldc.co.ke`.
5. Run the one-time seed with the production env available: `node scripts-seed-admin.mjs`.
6. Delete/rotate `ADMIN_INITIAL_PASSWORD` after the initial administrator is created.
7. Create the Daraja production application and configure the approved callback/domain with Safaricom.
8. Create a Google service account, share the Drive folder and Sheet with it, and set its credentials in Vercel.
9. Use a dedicated SMTP mailbox and App Password (or transactional email provider).

## Member workflow
Register → verify email → admin approval → login → submit lead → admin approves lead → payment becomes available → Daraja BuyGoods STK → callback confirms payment → payment/audit records.

## Verification
Project PDFs should use a random document ID and server-side verification record. QR scans should resolve to the GLDC verification page, require authentication, and check document validity/revocation before showing protected details.
