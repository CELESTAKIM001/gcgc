import "server-only";
import nodemailer from "nodemailer";
import { env } from "./env";
const transporter=nodemailer.createTransport({host:env.SMTP_HOST,port:env.SMTP_PORT,secure:env.SMTP_SECURE,auth:{user:env.SMTP_USER,pass:env.SMTP_PASSWORD}});
export async function sendEmail(to:string,subject:string,html:string){return transporter.sendMail({from:`${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM_ADDRESS}>`,to,replyTo:env.EMAIL_REPLY_TO,subject,html})}
export async function sendVerificationEmail(to:string,name:string,token:string){const url=`${env.APP_URL}/verify-email?token=${encodeURIComponent(token)}`;return sendEmail(to,"Verify your GLDC account",`<h2>Welcome ${name}</h2><p>Please verify your email.</p><p><a href="${url}">Verify email</a></p><p>This link expires in ${env.EMAIL_VERIFICATION_EXPIRES_HOURS} hours.</p>`)}
