import { NextResponse } from 'next/server'; import type { NextRequest } from 'next/server';
export function middleware(req:NextRequest){const p=process.env.ADMIN_PATH||'/gldc-management-portal-7f3x';if(req.nextUrl.pathname===p){const u=req.nextUrl.clone();u.pathname='/admin';return NextResponse.rewrite(u)}return NextResponse.next()}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
