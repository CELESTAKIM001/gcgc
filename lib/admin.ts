import "server-only";
import { currentUser } from "./auth";
import { getDb } from "./db";
import { ObjectId } from "mongodb";
import { backupAudit } from "./backup";

export async function requireAdmin(){
  const me=await currentUser();
  if(!me || !["admin","manager"].includes(me.role)) throw new Error("FORBIDDEN");
  return me;
}
export async function audit(action:string,actorId:string,details:any={}, entityId?:string){
  const db=await getDb();
  const doc:any={action,actorId:new ObjectId(actorId),details,entityId:entityId||null,createdAt:new Date()};
  const r=await db.collection("audit_logs").insertOne(doc);
  try { await backupAudit({...doc,_id:r.insertedId}); } catch(e) { console.error("Sheet audit backup failed",e); }
}
