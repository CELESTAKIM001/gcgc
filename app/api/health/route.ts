import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json({ok:true,service:'gldc',time:new Date().toISOString()})}
