import { NextResponse } from "next/server";
import { requireAdmin, audit } from "@/lib/admin";
import { runFullBackup } from "@/lib/backup";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

// Admin manually triggers a full snapshot backup of MongoDB into the configured Google Sheet.
export async function POST() {
  try {
    const me = await requireAdmin();
    const result = await runFullBackup(me.id);
    await audit("ADMIN_TRIGGERED_BACKUP", me.id, { tabs: result.tabs });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Backup failed" }, { status: e.message === "FORBIDDEN" ? 403 : 500 });
  }
}

// Returns the timestamp/details of the most recent backup run, for display in the admin UI.
export async function GET() {
  try {
    await requireAdmin();
    const db = await getDb();
    const last = await db
      .collection("audit_logs")
      .findOne({ action: "ADMIN_BACKUP_TO_SHEETS" }, { sort: { createdAt: -1 } });
    return NextResponse.json({ last: last ? { runAt: last.details?.runAt, tabs: last.details?.tabs } : null });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "FORBIDDEN" ? 403 : 500 });
  }
}
