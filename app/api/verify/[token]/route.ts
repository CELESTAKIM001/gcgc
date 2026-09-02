import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
export async function GET(req:Request,{params}:{params:Promise<{token:string}>}){
 try{const {token}=await params; const db=await getDb(); const d=await db.collection("document_verifications").findOne({documentId:token,status:"valid"});
 if(!d)return NextResponse.json({valid:false,error:"Document not found or revoked"},{status:404});
 return NextResponse.json({valid:true,documentId:d.documentId,issuedAt:d.issuedAt,documentHash:d.documentHash});
 }catch(e:any){return NextResponse.json({valid:false,error:e.message},{status:500})}
}
