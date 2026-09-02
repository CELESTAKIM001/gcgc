# GLDC production feature manifest

## Registration (18 fields)
1. First name
2. Last name
3. Email
4. Primary phone
5. Alternative phone
6. Date of birth
7. Nationality
8. ID type
9. ID/passport number (encrypted when ENCRYPTION_KEY is configured)
10. Gender
11. Physical address
12. County
13. Town/City
14. Postal code
15. Occupation
16. Organization/company
17. Membership type
18. Password

## Account lifecycle
REGISTERED → EMAIL VERIFICATION → ADMIN APPROVAL → APPROVED → ACTIVE/SUSPENDED

## Lead lifecycle
MEMBER CREATES LEAD → ADMIN APPROVAL → PAYMENT ENABLED → PAYMENT → PROCESSING → COMPLETED

## Payment lifecycle
INITIATED → STK_SENT → PAID / FAILED

## Admin CRUD
Administrators can list, create, edit, approve/suspend, change roles, and delete users through protected server-side endpoints.

## Email
Registration sends a verification email. The verification token is random, stored hashed, expires, and is removed after successful verification.

## M-PESA
The environment exposes the requested Party A shortcode and Party B BuyGoods Till names. The actual STK payload uses the customer phone as PartyA and the BuyGoods Till as PartyB; the GLDC shortcode is the BusinessShortCode. Callback configuration is only `https://api.gldc.co.ke`.

## Documents
Google Drive repository integration, metadata in MongoDB, protected document viewing, PDF proof-of-work generation, SHA-256 document hashes and QR verification records.

## Vercel
Secrets belong in Vercel Production Environment Variables and must not be exposed with `NEXT_PUBLIC_`. Large uploads should use direct object-storage/resumable upload because Vercel Functions impose payload limits.
