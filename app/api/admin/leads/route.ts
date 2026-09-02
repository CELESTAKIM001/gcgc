import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/admin";
import { backupLead } from "@/lib/backup";

export async function GET(){
  try{
    await requireAdmin(); const db=await getDb();
    const rows=await db.collection("leads").find({}).sort({createdAt:-1}).toArray();
    return NextResponse.json(rows.map(x=>({...x,id:String(x._id)})));
  }catch(e:any){return NextResponse.json({error:e.message==="FORBIDDEN"?"Forbidden":e.message},{status:e.message==="FORBIDDEN"?403:500})}
}
export async function POST(req:Request){
  try{
    const me=await requireAdmin(); const b=await req.json(); const db=await getDb();
    const lead:any={memberId:b.memberId?new ObjectId(b.memberId):null,title:String(b.title||"Untitled project"),description:String(b.description||""),location:String(b.location||""),estimatedValue:Number(b.estimatedValue)||0,status:String(b.status||"pending_admin_approval"),paymentStatus:"unpaid",createdAt:new Date(),updatedAt:new Date()};
    const r=await db.collection("leads").insertOne(lead); lead._id=r.insertedId;
    try{await backupLead(lead)}catch(e){console.error("Sheet lead backup failed",e)}
    await audit("ADMIN_CREATED_LEAD",me.id,{leadId:String(r.insertedId)},String(r.insertedId));
    return NextResponse.json({ok:true,id:String(r.insertedId)},{status:201});
  }catch(e:any){return NextResponse.json({error:e.message},{status:e.message==="FORBIDDEN"?403:400})}
}
