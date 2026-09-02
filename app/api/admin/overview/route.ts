import { NextResponse } from "next/server";
import { getDb } from "@/lib/db"; import { requireAdmin } from "@/lib/admin";
export async function GET(){
 try{await requireAdmin(); const db=await getDb();
  const [users,leads,payments,documents,audit] = await Promise.all([
   db.collection("users").countDocuments(), db.collection("leads").countDocuments(),
   db.collection("payments").countDocuments(), db.collection("documents").countDocuments(),
   db.collection("audit_logs").find({}).sort({createdAt:-1}).limit(12).toArray()
  ]);
  const approved=await db.collection("users").countDocuments({status:"approved"});
  const paid=await db.collection("payments").countDocuments({status:"paid"});
  return NextResponse.json({users,approved,leads,payments,documents,paid,audit:audit.map(x=>({...x,id:String(x._id),actorId:x.actorId?String(x.actorId):""}))});
 }catch(e:any){return NextResponse.json({error:e.message==="FORBIDDEN"?"Forbidden":e.message},{status:e.message==="FORBIDDEN"?403:500})}
}
