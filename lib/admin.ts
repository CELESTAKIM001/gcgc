import "server-only"; import { currentUser } from "./auth"; import { getDb } from "./db"; import { ObjectId } from "mongodb";
export async function requireAdmin(){const me=await currentUser();if(!me||!['admin','manager'].includes(me.role))throw new Error('FORBIDDEN');return me}
export async function audit(action:string,actorId:string,details:any={}){const db=await getDb();await db.collection('audit_logs').insertOne({action,actorId:new ObjectId(actorId),details,createdAt:new Date()})}
