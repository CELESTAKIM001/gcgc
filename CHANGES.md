# What was added/fixed in this pass

## Security (read this first)
- The .env values pasted in chat are LIVE production secrets (MongoDB, Daraja/M-PESA, Gmail app password,
  Google service-account private key, JWT/encryption secrets, admin password). Rotate every one of them.
  None of the real values were placed in this codebase — `.env.example` only has placeholders.

## Fixed
- The M-PESA callback handler (`lib/mpesa-callback.ts`) existed but was never wired to a route, so Daraja
  had nowhere to POST results. Added `app/api/payments/mpesa/callback/route.ts` and made `stkPush()` build
  the callback URL as `${DARAJA_CALLBACK_URL}/api/payments/mpesa/callback` automatically.

## Added
- **Email designs**: `lib/email-templates.ts` — branded HTML templates (GLDC brown/cream theme) for
  verification, membership approval, lead approval, payment confirmed/failed, and admin notifications.
  Wired into registration, email verification, admin user approval, admin lead approval, and the M-PESA
  callback.
- **PDF keeping**: unchanged generation logic, confirmed every generated PDF and every member upload is
  persisted to Google Drive + recorded in MongoDB (`documents` / `document_verifications`), so it survives
  redeploys (Vercel functions are ephemeral).
- **Drive/Sheets backup**: `lib/google.ts` gained `ensureSheetTab`, `clearSheetRange`, `writeSheetRange`,
  `writeBackupTab`. `lib/backup.ts` snapshots Users, Leads, Payments, Documents and Document Verifications
  from MongoDB into named tabs with a fixed, documented column set (ID numbers are masked). Exposed at
  `POST /api/admin/backup` (also `GET` for last-run info) and a "RUN BACKUP NOW" button on
  Admin → Backup in `app/admin/page.tsx`. Every run overwrites the previous snapshot per tab and logs to
  `audit_logs`.
- `.env.example` — was missing; added with placeholders only, matching every key `lib/env.ts` reads.
- `ADMIN_EMAIL` / `ADMIN_NAME` added to the validated env schema (previously only read by the seed script).

## Verified
- `npx tsc --noEmit` — clean.
- `npm run build` — clean production build, all routes compile including the two new ones.

## Still on you
- Rotate every credential above before deploying.
- Create the Drive folder + Sheet, share both with the service-account email, put the *rotated* creds into
  Vercel envs (never into `.env` files in git).
- Run `node scripts-seed-admin.mjs` once with production env available, then delete/rotate
  `ADMIN_INITIAL_PASSWORD`.
