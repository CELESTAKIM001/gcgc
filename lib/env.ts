import "server-only";
import { z } from "zod";

const schema = z.object({
  NODE_ENV:z.enum(["development","test","production"]).default("production"),
  APP_NAME:z.string().default("Gavin Land & Design Consultants"),
  APP_URL:z.string().url().optional().default("http://localhost:3000"),
  API_URL:z.string().url().optional().default("http://localhost:3000/api"),
  TIMEZONE:z.string().default("Africa/Nairobi"),
  CURRENCY:z.string().default("KES"),
  ADMIN_PATH:z.string().startsWith("/").default("/admin"),
  
  MONGODB_URI:z.string().min(1).optional().default(""),
  MONGODB_DB_NAME:z.string().min(1).optional().default("gldc"),
  
  JWT_ACCESS_SECRET:z.string().min(32).optional().default("build-time-secret-minimum-32-chars!"),
  JWT_REFRESH_SECRET:z.string().min(32).optional().default("build-time-secret-minimum-32-chars!"),
  JWT_ACCESS_EXPIRES:z.string().default("15m"),
  JWT_REFRESH_EXPIRES:z.string().default("7d"),
  PASSWORD_MIN_LENGTH:z.coerce.number().min(8).default(12),
  EMAIL_VERIFICATION_EXPIRES_HOURS:z.coerce.number().default(24),
  
  DARAJA_ENV:z.enum(["sandbox","production"]).default("sandbox"),
  DARAJA_CONSUMER_KEY:z.string().min(1).optional().default(""),
  DARAJA_CONSUMER_SECRET:z.string().min(1).optional().default(""),
  DARAJA_PARTY_A_SHORTCODE:z.string().min(1).optional().default(""),
  DARAJA_PARTY_B_BUYGOODS_TILL:z.string().min(1).optional().default(""),
  DARAJA_PASSKEY:z.string().min(1).optional().default(""),
  DARAJA_CALLBACK_URL:z.string().url().optional().default("http://localhost:3000/api/payments/mpesa/callback"),
  DARAJA_TIMEOUT_SECONDS:z.coerce.number().default(30),
  
  SMTP_HOST:z.string().optional().default(""),
  SMTP_PORT:z.coerce.number().default(587),
  SMTP_SECURE:z.coerce.boolean().default(false),
  SMTP_USER:z.string().email().optional().default("noreply@example.com"),
  SMTP_PASSWORD:z.string().min(1).optional().default(""),
  EMAIL_FROM_NAME:z.string().optional().default("GLDC"),
  EMAIL_FROM_ADDRESS:z.string().email().optional().default("noreply@gldc.com"),
  EMAIL_REPLY_TO:z.string().email().optional(),
  
  GOOGLE_DRIVE_ENABLED:z.coerce.boolean().default(true),
  GOOGLE_DRIVE_FOLDER_ID:z.string().min(1).optional().default(""),
  GOOGLE_SERVICE_ACCOUNT_EMAIL:z.string().email().optional().default("service@example.com"),
  GOOGLE_PRIVATE_KEY:z.string().min(1).optional().default(""),
  GOOGLE_SHEETS_ENABLED:z.coerce.boolean().default(true),
  GOOGLE_SPREADSHEET_ID:z.string().min(1).optional().default(""),
  
  MAX_FILE_SIZE_MB:z.coerce.number().default(25),
  ALLOWED_FILE_TYPES:z.string().default("pdf,jpg,jpeg,png,webp,doc,docx,xls,xlsx"),
  DOCUMENT_STORAGE:z.string().default("google_drive"),
  PDF_ENABLED:z.coerce.boolean().default(true),
  PDF_QR_ENABLED:z.coerce.boolean().default(true),
  PDF_VERIFICATION_URL:z.string().url().optional().default("http://localhost:3000/verify"),
  SIGNATURE_ENABLED:z.coerce.boolean().default(true),
  
  CORS_ORIGIN:z.string().url().optional().default("http://localhost:3000"),
  COOKIE_SECURE:z.coerce.boolean().default(true),
  COOKIE_HTTP_ONLY:z.coerce.boolean().default(true),
  COOKIE_SAME_SITE:z.enum(["strict","lax","none"]).default("strict"),
  RATE_LIMIT_ENABLED:z.coerce.boolean().default(true),
  AUDIT_LOG_ENABLED:z.coerce.boolean().default(true),
  
  MEMBERSHIP_ENABLED:z.coerce.boolean().default(true),
  MEMBERSHIP_APPROVAL_REQUIRED:z.coerce.boolean().default(true),
  PAYMENTS_ENABLED:z.coerce.boolean().default(true),
  PAYMENT_APPROVAL_REQUIRED:z.coerce.boolean().default(true),
  PROJECT_DEPOSIT_ENABLED:z.coerce.boolean().default(true),
  EMAIL_NOTIFICATIONS_ENABLED:z.coerce.boolean().default(true),
  ADMIN_NOTIFICATIONS_ENABLED:z.coerce.boolean().default(true)
});

export const env = schema.parse(process.env);
