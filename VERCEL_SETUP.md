# GLDC Vercel production setup checklist

## Domains
- `www.gldc.co.ke` (or your `*.vercel.app` deployment URL) → primary web domain
- `DARAJA_CALLBACK_URL` holds the base URL only (no path). The app appends `/api/payments/mpesa/callback` when it sends the STK push request, and Safaricom calls that exact route.

## Environment variables
Add `.env.example` values in Vercel → Project → Settings → Environment Variables. Keep secret values out of Git. Vercel supports Production/Preview/Development scoping; redeploy after changing environment values.

## Daraja
Use the Safaricom Daraja 3.0 portal to create/configure the production application and obtain credentials. The project uses:
- `DARAJA_CONSUMER_KEY`
- `DARAJA_CONSUMER_SECRET`
- `DARAJA_PARTY_A_SHORTCODE` (GLDC shortcode, configuration convention)
- `DARAJA_PARTY_B_BUYGOODS_TILL` (GLDC BuyGoods Till)
- `DARAJA_PASSKEY`
- `DARAJA_CALLBACK_URL=https://api.gldc.co.ke`

For the STK request itself, the customer's phone is the API's PartyA transaction value and the configured BuyGoods Till is PartyB; the shortcode is the BusinessShortCode. This avoids incorrectly putting a shortcode into a customer-phone field.

## Google Drive/Sheets
Create a Google Cloud project, enable Drive and Sheets APIs, create a service account, share the destination Drive folder and spreadsheet with the service-account email, and put the service-account email/private key into Vercel secrets.

## Email
For Gmail SMTP, use a dedicated mailbox with 2-Step Verification and an App Password. Never place the password in a client-side variable.

## Large files
Vercel Functions have a request payload limit; this sample intentionally limits the server upload route to 4 MB. For larger documents/images, use direct-to-object-storage/resumable uploads and store only metadata/IDs in MongoDB.

## Initial admin
Set `ADMIN_INITIAL_PASSWORD` temporarily, run `node scripts-seed-admin.mjs` with production env available, then rotate/delete that bootstrap variable.
