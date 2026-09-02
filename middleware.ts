import {NextRequest,NextResponse} from 'next/server';
export function middleware(req:NextRequest){if(req.method==='POST' && req.nextUrl.hostname==='api.gldc.co.ke' && req.nextUrl.pathname==='/'){const url=req.nextUrl.clone();url.pathname='/api/payments/mpesa/callback';return NextResponse.rewrite(url)}return NextResponse.next()}
export const config={matcher:['/']};
