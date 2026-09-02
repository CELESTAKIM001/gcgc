import "server-only";
import { env } from "./env";
function base(){return env.DARAJA_ENV==="sandbox"?"https://sandbox.safaricom.co.ke":"https://api.safaricom.co.ke"}
export async function darajaToken(){const auth=Buffer.from(`${env.DARAJA_CONSUMER_KEY}:${env.DARAJA_CONSUMER_SECRET}`).toString("base64"); const r=await fetch(`${base()}/oauth/v1/generate?grant_type=client_credentials`,{headers:{Authorization:`Basic ${auth}`},cache:"no-store"}); if(!r.ok)throw new Error(`Daraja token failed: ${r.status}`); return (await r.json()).access_token as string}
export async function stkPush(phone:string,amount:number,accountRef:string,description:string){
  const token=await darajaToken(); const timestamp=new Date().toISOString().replace(/[-:TZ.]/g,"").slice(0,14); const password=Buffer.from(`${env.DARAJA_PARTY_A_SHORTCODE}${env.DARAJA_PASSKEY}${timestamp}`).toString("base64");
  const callbackUrl=`${env.DARAJA_CALLBACK_URL.replace(/\/$/,"")}/api/payments/mpesa/callback`;
  const payload={BusinessShortCode:env.DARAJA_PARTY_A_SHORTCODE,Password:password,Timestamp:timestamp,TransactionType:"CustomerBuyGoodsOnline",Amount:Math.round(amount),PartyA:phone,PartyB:env.DARAJA_PARTY_B_BUYGOODS_TILL,PhoneNumber:phone,CallBackURL:callbackUrl,AccountReference:accountRef,TransactionDesc:description};
  const r=await fetch(`${base()}/mpesa/stkpush/v1/processrequest`,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(payload),cache:"no-store"}); if(!r.ok)throw new Error(`STK push failed: ${r.status}`); return r.json();
}
