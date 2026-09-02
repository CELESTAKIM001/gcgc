import "server-only";
import { getDb } from "./db";
import { appendSheet, SHEET_COLUMNS } from "./google";
import { env } from "./env";

const iso = (v:any) => v ? new Date(v).toISOString() : "";
const str = (v:any) => v == null ? "" : String(v);

export async function backupUser(u:any) {
  if (!env.GOOGLE_SHEETS_ENABLED || !env.SHEET_BACKUP_ENABLED) return;
  await appendSheet([
    new Date().toISOString(), str(u._id || u.id), str(u.firstName), str(u.lastName), str(u.email),
    str(u.phone), str(u.county), str(u.town), str(u.memberType), str(u.role), str(u.status),
    str(u.emailVerified), iso(u.createdAt), iso(u.updatedAt)
  ], "Users!A:N", [...SHEET_COLUMNS.users]);
}
export async function backupLead(l:any) {
  if (!env.GOOGLE_SHEETS_ENABLED || !env.SHEET_BACKUP_ENABLED) return;
  await appendSheet([
    new Date().toISOString(), str(l._id || l.id), str(l.memberId), str(l.title), str(l.location),
    str(l.estimatedValue), str(l.status), str(l.paymentStatus), iso(l.createdAt), iso(l.updatedAt)
  ], "Leads!A:J", [...SHEET_COLUMNS.leads]);
}
export async function backupPayment(p:any) {
  if (!env.GOOGLE_SHEETS_ENABLED || !env.SHEET_BACKUP_ENABLED) return;
  await appendSheet([
    new Date().toISOString(), str(p._id || p.id), str(p.leadId), str(p.memberId), str(p.amount),
    str(p.phone), str(p.status), str(p.mpesaReceiptNumber), str(p.checkoutRequestId),
    str(p.transactionDate), iso(p.createdAt), iso(p.updatedAt)
  ], "Payments!A:L", [...SHEET_COLUMNS.payments]);
}
export async function backupDocument(d:any) {
  if (!env.GOOGLE_SHEETS_ENABLED || !env.SHEET_BACKUP_ENABLED) return;
  await appendSheet([
    new Date().toISOString(), str(d._id || d.id), str(d.ownerId), str(d.fileName), str(d.mimeType),
    str(d.size), str(d.driveFileId), str(d.status), iso(d.createdAt)
  ], "Documents!A:I", [...SHEET_COLUMNS.documents]);
}
export async function backupAudit(a:any) {
  if (!env.GOOGLE_SHEETS_ENABLED || !env.SHEET_BACKUP_ENABLED) return;
  await appendSheet([
    new Date().toISOString(), str(a._id || a.id), str(a.action), str(a.actorId), str(a.entityId),
    JSON.stringify(a.details || {}), iso(a.createdAt)
  ], "Audit!A:G", [...SHEET_COLUMNS.audit]);
}

export async function backupAllToSheets() {
  if (!env.GOOGLE_SHEETS_ENABLED || !env.SHEET_BACKUP_ENABLED) return { enabled: false };
  const db = await getDb();
  const [users, leads, payments, documents, audit] = await Promise.all([
    db.collection("users").find({}, {projection:{passwordHash:0,emailVerificationTokenHash:0}}).sort({createdAt:1}).toArray(),
    db.collection("leads").find({}).sort({createdAt:1}).toArray(),
    db.collection("payments").find({}).sort({createdAt:1}).toArray(),
    db.collection("documents").find({}).sort({createdAt:1}).toArray(),
    db.collection("audit_logs").find({}).sort({createdAt:1}).toArray(),
  ]);
  for (const u of users) await backupUser(u);
  for (const l of leads) await backupLead(l);
  for (const p of payments) await backupPayment(p);
  for (const d of documents) await backupDocument(d);
  for (const a of audit) await backupAudit(a);
  return { enabled: true, users:users.length, leads:leads.length, payments:payments.length, documents:documents.length, audit:audit.length };
}
