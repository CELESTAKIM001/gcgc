import { handleMpesaCallback } from "@/lib/mpesa-callback";
export const runtime = "nodejs";
export async function POST(req: Request) {
  return handleMpesaCallback(req);
}
