import "server-only";
import nodemailer from "nodemailer";
import { env } from "./env";
const transporter=nodemailer.createTransport({host:env.SMTP_HOST,port:env.SMTP_PORT,secure:env.SMTP_SECURE,auth:{user:env.SMTP_USER,pass:env.SMTP_PASSWORD}});
const layout=(title:string,body:string)=>`<!doctype html><html><body style="margin:0;background:#f3f5f2;font-family:Arial,sans-serif;color:#18231d"><div style="max-width:620px;margin:35px auto;background:#fff;border:1px solid #dfe6df;border-radius:12px;overflow:hidden"><div style="background:#102b20;padding:24px;color:#fff"><strong style="font-size:20px">GAVIN LAND & DESIGN CONSULTANTS</strong><div style="font-size:12px;opacity:.75;margin-top:5px">GLDC · Gets it Done</div></div><div style="padding:30px"><h1 style="font-size:24px;margin:0 0 16px">${title}</h1>${body}<p style="color:#69756d;font-size:12px;margin-top:30px">This is an automated GLDC notification. Please keep your account details secure.</p></div></div></body></html>`;
export async function sendEmail(to:string,subject:string,html:string){if(!env.EMAIL_NOTIFICATIONS_ENABLED)return null;return transporter.sendMail({from:`${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM_ADDRESS}>`,to,replyTo:env.EMAIL_REPLY_TO,subject,html})}
export async function sendVerificationEmail(to:string,name:string,token:string){
 const url=`${env.APP_URL}/verify-email?token=${encodeURIComponent(token)}`;
 return sendEmail(to,"Verify your GLDC account",layout("Verify your GLDC account",`<p>Hello ${name},</p><p>Thank you for registering. Verify your email address to continue.</p><p><a href="${url}" style="display:inline-block;background:#164b31;color:#fff;padding:12px 18px;border-radius:7px;text-decoration:none;font-weight:bold">VERIFY EMAIL</a></p><p>This link expires in ${env.EMAIL_VERIFICATION_EXPIRES_HOURS} hours.</p>`));
}
export async function sendLeadStatusEmail(to:string,name:string,title:string,status:string){
 return sendEmail(to,`GLDC project update: ${status}`,layout("Project status updated",`<p>Hello ${name},</p><p>Your project lead <b>${title}</b> is now <b>${status}</b>.</p><p>Sign in to your GLDC member portal for the next available action.</p>`));
}
export async function sendPaymentConfirmationEmail(to:string,name:string,amount:number,receipt:string){
 return sendEmail(to,"GLDC M-PESA payment confirmed",layout("Payment confirmed",`<p>Hello ${name},</p><p>We have received your M-PESA payment of <b>KES ${amount.toLocaleString("en-KE")}</b>.</p><p>Receipt: <b>${receipt||"Pending"}</b></p><p>Your transaction has been recorded in the GLDC payment ledger.</p>`));
}
