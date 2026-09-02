# GLDC Vercel Production Foundation

Next.js + MongoDB + Daraja + SMTP + Google Drive/Sheets foundation for Gavin Land & Design Consultants.

## Key production rules
- Copy `.env.example` to `.env.local` for local development only. Never commit real secrets.
- On Vercel, put secrets in Project Settings → Environment Variables, scoped to Production as required. Do not use `NEXT_PUBLIC_` for secrets.
- `DARAJA_CALLBACK_URL` may be set to `https://api.gldc.co.ke`. A host-aware middleware rewrite sends POST requests arriving at that domain root to the internal `/api/payments/mpesa/callback` handler.
- Daraja configuration follows the requested convention: `DARAJA_PARTY_A_SHORTCODE` is the GLDC shortcode and `DARAJA_PARTY_B_BUYGOODS_TILL` is the BuyGoods Till. The STK request still sends the customer's phone as PartyA, while the GLDC BuyGoods Till is PartyB, because those are the transaction fields expected by the M-PESA API.
- Email registration sends a verification email before admin approval.
- Registration captures 18 profile fields, including location and ID type/number.
- Admin API supports user list/create/update/delete and approval status changes.
- Sensitive ID numbers can be encrypted when `ENCRYPTION_KEY` is configured.
- Document uploads through a Vercel Function are capped below 4 MB in this sample because Vercel documents a 4.5 MB function payload limit. For larger files, use direct object storage/resumable uploads; Google Drive remains the document repository target.

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
