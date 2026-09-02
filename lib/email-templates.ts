import "server-only";
import { env } from "./env";

const BRAND = "#8a4724";
const INK = "#2b211b";
const BG = "#f6f1eb";

function layout(preheader: string, title: string, bodyHtml: string, ctaLabel?: string, ctaUrl?: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BG};font-family:Arial,Helvetica,sans-serif;color:${INK};">
    <span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:${BRAND};padding:22px 32px;">
              <span style="color:#fff;font-weight:800;letter-spacing:.08em;font-size:14px;">GAVIN LAND &amp; DESIGN CONSULTANTS</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-size:22px;color:${INK};">${title}</h1>
              <div style="font-size:15px;line-height:1.6;color:#3a2f27;">${bodyHtml}</div>
              ${
                ctaLabel && ctaUrl
                  ? `<div style="margin-top:26px;"><a href="${ctaUrl}" style="background:${BRAND};color:#fff;text-decoration:none;font-weight:800;padding:13px 22px;border-radius:8px;display:inline-block;">${ctaLabel}</a></div>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background:#f4eadf;font-size:12px;color:#6b5c50;">
              GLDC · ${env.APP_URL} · This is an automated message, please do not reply directly unless instructed.
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export function verificationEmailTemplate(name: string, verifyUrl: string, hours: number) {
  return {
    subject: "Verify your GLDC account",
    html: layout(
      "Verify your email to activate your GLDC account.",
      `Welcome, ${name}`,
      `<p>Thank you for registering with Gavin Land &amp; Design Consultants. Please verify your email address to continue — your application will then move to admin review.</p><p>This link expires in <strong>${hours} hours</strong>.</p>`,
      "VERIFY EMAIL",
      verifyUrl
    ),
  };
}

export function memberApprovedEmailTemplate(name: string) {
  return {
    subject: "Your GLDC membership has been approved",
    html: layout(
      "Your GLDC membership is now active.",
      `Welcome aboard, ${name}`,
      `<p>Your GLDC membership account has been reviewed and <strong>approved</strong>. You can now sign in, submit project leads, and track payments from your member dashboard.</p>`,
      "SIGN IN",
      `${env.APP_URL}/login`
    ),
  };
}

export function leadApprovedEmailTemplate(name: string, leadTitle: string) {
  return {
    subject: "Your project lead has been approved",
    html: layout(
      "Your project lead was approved — payment is now available.",
      `Good news, ${name}`,
      `<p>Your submitted project <strong>"${leadTitle}"</strong> has been reviewed and approved by GLDC. You may now proceed with the project deposit payment via M-PESA from your member dashboard.</p>`,
      "MAKE PAYMENT",
      `${env.APP_URL}/member`
    ),
  };
}

export function paymentConfirmedEmailTemplate(name: string, amount: number, receipt: string, leadTitle?: string) {
  return {
    subject: "Payment received — GLDC",
    html: layout(
      "Your M-PESA payment has been confirmed.",
      `Payment confirmed, ${name}`,
      `<p>We have received your payment of <strong>KES ${amount.toLocaleString()}</strong>${
        leadTitle ? ` for <strong>${leadTitle}</strong>` : ""
      }.</p><p>M-PESA Receipt Number: <strong>${receipt}</strong></p><p>A proof-of-work / receipt document will be made available in your member dashboard.</p>`,
      "VIEW DASHBOARD",
      `${env.APP_URL}/member`
    ),
  };
}

export function paymentFailedEmailTemplate(name: string, reason?: string) {
  return {
    subject: "Payment could not be completed — GLDC",
    html: layout(
      "Your M-PESA payment attempt was not completed.",
      `Payment not completed, ${name}`,
      `<p>Your recent M-PESA payment attempt was not completed${reason ? ` (${reason})` : ""}. No funds were retained. Please try again from your member dashboard, or contact us if the issue persists.</p>`,
      "TRY AGAIN",
      `${env.APP_URL}/member`
    ),
  };
}

export function adminNewLeadNotificationTemplate(memberName: string, leadTitle: string) {
  return {
    subject: `New lead submitted: ${leadTitle}`,
    html: layout(
      "A member has submitted a new project lead for review.",
      "New project lead",
      `<p>Member <strong>${memberName}</strong> submitted a new lead: <strong>${leadTitle}</strong>. It is pending approval.</p>`,
      "REVIEW IN ADMIN",
      `${env.APP_URL}${env.ADMIN_PATH}`
    ),
  };
}

export function adminNewRegistrationNotificationTemplate(memberName: string, email: string) {
  return {
    subject: `New member registration: ${memberName}`,
    html: layout(
      "A new member registered and verified their email.",
      "New member awaiting approval",
      `<p><strong>${memberName}</strong> (${email}) has verified their email and is awaiting membership approval.</p>`,
      "REVIEW IN ADMIN",
      `${env.APP_URL}${env.ADMIN_PATH}`
    ),
  };
}
