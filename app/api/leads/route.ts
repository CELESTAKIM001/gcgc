import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth"; import { getDb } from "@/lib/db"; import { ObjectId } from "mongodb"; import { backupLead } from "@/lib/backup";
export async function GET(){
 try{const me=await currentUser(); if(!me||me.role!=="member")return NextResponse.json({error:"Member authentication required"},{status:403});
 const db=await getDb(); const rows=await db.collection("leads").find({memberId:new ObjectId(me.id)}).sort({createdAt:-1}).toArray();
 return NextResponse.json(rows.map(x=>({...x,id:String(x._id)})));
 }catch(e:any){return NextResponse.json({error:e.message},{status:400})}
}
export async function POST(req:Request){
 try{const me=await currentUser();if(!me||me.role!=="member")return NextResponse.json({error:"Member authentication required"},{status:403});
 const b=await req.json();const db=await getDb();const u=await db.collection("users").findOne({_id:new ObjectId(me.id),status:"approved",emailVerified:true});
 if(!u)return NextResponse.json({error:"Your member account must be approved and email verified before creating a lead."},{status:403});
 const lead:any={memberId:u._id,title:String(b.title||"").trim(),description:String(b.description||"").trim(),location:String(b.location||"").trim(),estimatedValue:Number(b.estimatedValue)||0,status:"pending_admin_approval",paymentStatus:"unpaid",createdAt:new Date(),updatedAt:new Date()};
 if(!lead.title||!lead.description)return NextResponse.json({error:"Project title and description are required."},{status:400});
 const r=await db.collection("leads").insertOne(lead);lead._id=r.insertedId;try{await backupLead(lead)}catch(e){console.error("Sheet lead backup failed",e)}
 await db.collection("notifications").insertOne({type:"NEW_MEMBER_LEAD",leadId:r.insertedId,memberId:u._id,read:false,createdAt:new Date()});
 return NextResponse.json({ok:true,id:String(r.insertedId),status:lead.status},{status:201});
 }catch(e:any){return NextResponse.json({error:e.message},{status:400})}
}
