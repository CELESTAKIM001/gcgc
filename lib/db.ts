import "server-only";
import { MongoClient, Db } from "mongodb";
import { env } from "./env";
let client:MongoClient|undefined; let db:Db|undefined; let initialized=false;
export async function getDb(){
 if(db) return db;
 client=new MongoClient(env.MONGODB_URI,{maxPoolSize:10,serverSelectionTimeoutMS:10000});
 await client.connect(); db=client.db(env.MONGODB_DB_NAME);
 if(!initialized){initialized=true; await Promise.all([
  db.collection("users").createIndex({email:1},{unique:true}),
  db.collection("users").createIndex({status:1,createdAt:-1}),
  db.collection("leads").createIndex({memberId:1,createdAt:-1}),
  db.collection("payments").createIndex({checkoutRequestId:1},{unique:true,sparse:true}),
  db.collection("documents").createIndex({ownerId:1,createdAt:-1}),
  db.collection("document_verifications").createIndex({documentId:1},{unique:true}),
  db.collection("audit_logs").createIndex({createdAt:-1})
 ]).catch(e=>console.error("Index initialization warning",e));}
 return db;
}
