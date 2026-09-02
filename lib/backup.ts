import "server-only";
import { ObjectId } from "mongodb";
import { getDb } from "./db";
import { writeBackupTab } from "./google";
import { decrypt } from "./crypto";

const iso = (d: any) => (d ? new Date(d).toISOString() : "");
const money = (n: any) => (typeof n === "number" ? n : Number(n) || 0);

// Masks an encrypted ID number down to its last 4 characters for the backup sheet.
function maskId(v: any) {
  if (!v) return "";
  try {
    const plain = decrypt(String(v));
    return plain.length > 4 ? `****${plain.slice(-4)}` : "****";
  } catch {
    return "****";
  }
}

const USERS_HEADER = [
  "ID", "First Name", "Last Name", "Email", "Phone", "Alt Phone", "Date of Birth",
  "Nationality", "ID Type", "ID Number (masked)", "Gender", "Address", "County",
  "Town", "Postal Code", "Occupation", "Organization", "Member Type", "Role",
  "Status", "Email Verified", "Created At", "Updated At",
];

const LEADS_HEADER = [
  "ID", "Member ID", "Title", "Description", "Location", "Estimated Value (KES)",
  "Status", "Payment Status", "Created At", "Updated At",
];

const PAYMENTS_HEADER = [
  "ID", "Lead ID", "Member ID", "Amount (KES)", "Phone", "Description", "Status",
  "M-Pesa Receipt", "Checkout Request ID", "Merchant Request ID", "Created At", "Updated At",
];

const DOCUMENTS_HEADER = [
  "ID", "Owner ID", "File Name", "Mime Type", "Size (bytes)", "Drive File ID",
  "Drive View URL", "Status", "Created At",
];

const VERIFICATIONS_HEADER = [
  "Document ID", "Project ID", "Member ID", "Status", "Document Hash (SHA-256)",
  "Drive File ID", "Issued At",
];

export async function runFullBackup(triggeredBy: string) {
  const db = await getDb();
  const now = new Date();

  const [users, leads, payments, documents, verifications] = await Promise.all([
    db.collection("users").find({}).sort({ createdAt: -1 }).toArray(),
    db.collection("leads").find({}).sort({ createdAt: -1 }).toArray(),
    db.collection("payments").find({}).sort({ createdAt: -1 }).toArray(),
    db.collection("documents").find({}).sort({ createdAt: -1 }).toArray(),
    db.collection("document_verifications").find({}).sort({ issuedAt: -1 }).toArray(),
  ]);

  const results = await Promise.all([
    writeBackupTab(
      "Users",
      USERS_HEADER,
      users.map((u: any) => [
        String(u._id), u.firstName || "", u.lastName || "", u.email || "", u.phone || "",
        u.alternatePhone || "", u.dateOfBirth || "", u.nationality || "", u.idType || "",
        maskId(u.idNumber), u.gender || "", u.address || "", u.county || "", u.town || "",
        u.postalCode || "", u.occupation || "", u.organization || "", u.memberType || "",
        u.role || "", u.status || "", u.emailVerified ? "Yes" : "No", iso(u.createdAt), iso(u.updatedAt),
      ])
    ),
    writeBackupTab(
      "Leads",
      LEADS_HEADER,
      leads.map((l: any) => [
        String(l._id), String(l.memberId || ""), l.title || "", l.description || "",
        l.location || "", money(l.estimatedValue), l.status || "", l.paymentStatus || "",
        iso(l.createdAt), iso(l.updatedAt),
      ])
    ),
    writeBackupTab(
      "Payments",
      PAYMENTS_HEADER,
      payments.map((p: any) => [
        String(p._id), String(p.leadId || ""), String(p.memberId || ""), money(p.amount),
        p.phone || "", p.description || "", p.status || "", p.mpesaReceiptNumber || "",
        p.checkoutRequestId || "", p.merchantRequestId || "", iso(p.createdAt), iso(p.updatedAt),
      ])
    ),
    writeBackupTab(
      "Documents",
      DOCUMENTS_HEADER,
      documents.map((d: any) => [
        String(d._id), String(d.ownerId || ""), d.fileName || "", d.mimeType || "",
        d.size || 0, d.driveFileId || "", d.driveViewUrl || "", d.status || "", iso(d.createdAt),
      ])
    ),
    writeBackupTab(
      "Document Verifications",
      VERIFICATIONS_HEADER,
      verifications.map((v: any) => [
        v.documentId || "", String(v.projectId || ""), String(v.memberId || ""),
        v.status || "", v.documentHash || "", v.driveFileId || "", iso(v.issuedAt),
      ])
    ),
  ]);

  await db.collection("audit_logs").insertOne({
    action: "ADMIN_BACKUP_TO_SHEETS",
    actorId: ObjectId.isValid(triggeredBy) ? new ObjectId(triggeredBy) : triggeredBy,
    details: { tabs: results, runAt: now },
    createdAt: now,
  });

  return { ok: true, runAt: now.toISOString(), tabs: results };
}
