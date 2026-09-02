import "server-only";
import nodemailer from "nodemailer";
import { env } from "./env";
import {
  verificationEmailTemplate,
  memberApprovedEmailTemplate,
  leadApprovedEmailTemplate,
  paymentConfirmedEmailTemplate,
  paymentFailedEmailTemplate,
  adminNewLeadNotificationTemplate,
  adminNewRegistrationNotificationTemplate,
} from "./email-templates";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
});

export async function sendEmail(to: string, subject: string, html: string) {
  if (!env.EMAIL_NOTIFICATIONS_ENABLED) return { skipped: true };
  return transporter.sendMail({
    from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM_ADDRESS}>`,
    to,
    replyTo: env.EMAIL_REPLY_TO,
    subject,
    html,
  });
}

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const url = `${env.APP_URL}/verify-email?token=${encodeURIComponent(token)}`;
  const t = verificationEmailTemplate(name, url, env.EMAIL_VERIFICATION_EXPIRES_HOURS);
  return sendEmail(to, t.subject, t.html);
}

export async function sendMemberApprovedEmail(to: string, name: string) {
  const t = memberApprovedEmailTemplate(name);
  return sendEmail(to, t.subject, t.html);
}

export async function sendLeadApprovedEmail(to: string, name: string, leadTitle: string) {
  const t = leadApprovedEmailTemplate(name, leadTitle);
  return sendEmail(to, t.subject, t.html);
}

export async function sendPaymentConfirmedEmail(to: string, name: string, amount: number, receipt: string, leadTitle?: string) {
  const t = paymentConfirmedEmailTemplate(name, amount, receipt, leadTitle);
  return sendEmail(to, t.subject, t.html);
}

export async function sendPaymentFailedEmail(to: string, name: string, reason?: string) {
  const t = paymentFailedEmailTemplate(name, reason);
  return sendEmail(to, t.subject, t.html);
}

async function adminEmails(): Promise<string[]> {
  // Falls back to the bootstrap admin mailbox if no explicit list is configured.
  return [env.ADMIN_EMAIL || env.EMAIL_FROM_ADDRESS].filter(Boolean) as string[];
}

export async function notifyAdminsNewLead(memberName: string, leadTitle: string) {
  if (!env.ADMIN_NOTIFICATIONS_ENABLED) return;
  const t = adminNewLeadNotificationTemplate(memberName, leadTitle);
  for (const to of await adminEmails()) await sendEmail(to, t.subject, t.html);
}

export async function notifyAdminsNewRegistration(memberName: string, email: string) {
  if (!env.ADMIN_NOTIFICATIONS_ENABLED) return;
  const t = adminNewRegistrationNotificationTemplate(memberName, email);
  for (const to of await adminEmails()) await sendEmail(to, t.subject, t.html);
}
