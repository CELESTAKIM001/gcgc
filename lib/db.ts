import "server-only";
import { MongoClient, Db } from "mongodb";
import { env } from "./env";
let client:MongoClient|undefined; let db:Db|undefined;
export async function getDb(){ if(db) return db; client=new MongoClient(env.MONGODB_URI); await client.connect(); db=client.db(env.MONGODB_DB_NAME); return db; }
