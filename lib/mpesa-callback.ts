import "server-only";
import { getDb } from "./db";
import { sendPaymentConfirmedEmail, sendPaymentFailedEmail } from "./email";

export async function handleMpesaCallback(req: Request) {
  try {
    const body = await req.json();
    const cb = body?.Body?.stkCallback;
    const db = await getDb();
    const checkout = cb?.CheckoutRequestID;
    const code = cb?.ResultCode;
    const items = cb?.CallbackMetadata?.Item || [];
    const meta: any = {};
    for (const x of items) meta[x.Name] = x.Value;

    const payment = await db.collection("payments").findOneAndUpdate(
      { checkoutRequestId: checkout },
      {
        $set: {
          status: code === 0 ? "paid" : "failed",
          resultCode: code,
          resultDescription: cb?.ResultDesc,
          mpesaReceiptNumber: meta.MpesaReceiptNumber,
          transactionDate: meta.TransactionDate,
          amountConfirmed: meta.Amount,
          phoneConfirmed: meta.PhoneNumber,
          callbackReceivedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    const p = payment?.value || payment; // driver-version tolerant

    if (code === 0) {
      await db.collection("audit_logs").insertOne({
        action: "MPESA_PAYMENT_CONFIRMED",
        checkoutRequestId: checkout,
        receipt: meta.MpesaReceiptNumber,
        createdAt: new Date(),
      });
      if (p?.leadId) {
        await db.collection("leads").updateOne({ _id: p.leadId }, { $set: { paymentStatus: "paid", updatedAt: new Date() } });
      }
      if (p?.memberId) {
        const member = await db.collection("users").findOne({ _id: p.memberId });
        const lead = p.leadId ? await db.collection("leads").findOne({ _id: p.leadId }) : null;
        if (member?.email) {
          sendPaymentConfirmedEmail(
            member.email,
            `${member.firstName} ${member.lastName}`,
            Number(meta.Amount) || Number(p.amount) || 0,
            meta.MpesaReceiptNumber || "",
            lead?.title
          ).catch((e) => console.error("payment confirmed email failed", e));
        }
      }
    } else {
      if (p?.memberId) {
        const member = await db.collection("users").findOne({ _id: p.memberId });
        if (member?.email) {
          sendPaymentFailedEmail(member.email, `${member.firstName} ${member.lastName}`, cb?.ResultDesc).catch((e) =>
            console.error("payment failed email failed", e)
          );
        }
      }
    }

    return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (e) {
    console.error(e);
    // Daraja expects a 200 with ResultCode 0 regardless, or it will keep retrying.
    return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
