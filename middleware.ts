import { NextResponse } from "next/server"; import type { NextRequest } from "next/server";
export function middleware(req:NextRequest){
  const adminPath=process.env.ADMIN_PATH||"/gldc-management-portal-7f3x";
  if(req.nextUrl.pathname===adminPath){const u=req.nextUrl.clone();u.pathname="/admin";return NextResponse.rewrite(u)}
  // Daraja is configured with a base callback URL. Route POST requests arriving at the API host to the callback handler.
  if(req.method==="POST" && req.nextUrl.hostname==="api.gldc.co.ke" && req.nextUrl.pathname==="/"){
    const u=req.nextUrl.clone(); u.pathname="/api/payments/mpesa/callback"; return NextResponse.rewrite(u);
  }
  return NextResponse.next();
}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico).*)"]};
