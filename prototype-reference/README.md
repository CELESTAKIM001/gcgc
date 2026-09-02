# GLDC Website + Management Console — Static Simulation

This package is a complete front-end website/design simulation based on the supplied GLDC Product Requirements Document.

## Included

### Public website
- Home
- About
- Services
- Service detail
- Projects / Portfolio
- Project detail
- Team
- Testimonials
- Service Areas
- Contact
- Request a Quote
- Privacy
- Terms

### GLDC Management Console
- Dashboard
- CRM / Leads
- Clients
- Projects
- Tasks
- Quotations
- Invoices
- Payments
- Documents
- Website CMS
- Services
- Portfolio
- Team
- Testimonials
- Calendar
- Notifications
- Reports
- Users & Roles
- Audit Logs
- Brand Settings
- System Settings

## Important demo behavior

This is a browser-based simulation/prototype, so it runs without a server/database.

The Management Console uses `localStorage` to demonstrate connected CRUD-style workflows:
- edit and save website content
- DEFAULT content badges
- add/update leads, clients, projects and tasks
- create quotation/invoice/payment records
- generate in-app notifications
- prepare email/WhatsApp/SMS actions
- upload document metadata into the demo library
- export demo data as JSON or XML
- record audit/activity events
- reset demo data

### Demo login
Email: `admin@gldc.local`
Password: `GLDC-DEMO-2026`

The login is intentionally demo-only. It is NOT a production authentication system.

## Online placeholder images

The design uses remote Unsplash image URLs as placeholders. Replace these with approved GLDC project/site/team photography before production.

For production use, follow the image provider's API/hotlinking/attribution rules and replace placeholders with GLDC-owned or properly licensed media.

## Running locally

Option 1:
Open `index.html` directly in a modern browser.

Option 2 (recommended):
Run a local HTTP server from this folder:

```bash
python -m http.server 8080
```

Then open:

`http://localhost:8080/`

## Production implementation note

A real commercial deployment must connect the UI to a secure backend/database and real services for:
- authentication/MFA
- email delivery
- WhatsApp/SMS
- secure document storage
- payment gateway/webhooks
- database persistence
- backups
- audit logging
- rate limiting
- server-side validation
- monitoring

The supplied requirements explicitly distinguish the professional Management Console from a simple admin page and require security, permissions, auditability, finance controls and testing.
