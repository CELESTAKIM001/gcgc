import {handleMpesaCallback} from '@/lib/mpesa-callback';
export async function POST(req:Request){return handleMpesaCallback(req)}
