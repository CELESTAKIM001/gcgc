import { NextResponse } from "next/server";
import { requireAdmin, audit } from "@/lib/admin";
import { backupAllToSheets } from "@/lib/backup";
export async function POST(){
  try{const me=await requireAdmin(); const result=await backupAllToSheets(); await audit("ADMIN_SHEET_BACKUP",me.id,result); return NextResponse.json({ok:true,...result});}
  catch(e:any){return NextResponse.json({error:e.message},{status:e.message==="FORBIDDEN"?403:500})}
}
