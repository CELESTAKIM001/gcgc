import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { env } from "./env";
const accessKey=new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshKey=new TextEncoder().encode(env.JWT_REFRESH_SECRET);
export async function hashPassword(p:string){return bcrypt.hash(p,12)}
export async function verifyPassword(p:string,h:string){return bcrypt.compare(p,h)}
export async function signAccess(sub:string,role:string){return new SignJWT({role}).setProtectedHeader({alg:"HS256"}).setSubject(sub).setIssuedAt().setExpirationTime(env.JWT_ACCESS_EXPIRES).sign(accessKey)}
export async function signRefresh(sub:string){return new SignJWT({}).setProtectedHeader({alg:"HS256"}).setSubject(sub).setIssuedAt().setExpirationTime(env.JWT_REFRESH_EXPIRES).sign(refreshKey)}
export async function currentUser(){const c=await cookies(); const token=c.get("gldc_access")?.value; if(!token)return null; try{const {payload}=await jwtVerify(token,accessKey); return {id:String(payload.sub),role:String(payload.role||"member")}}catch{return null}}
export function authCookies(access:string,refresh:string){return [{name:"gldc_access",value:access,opts:{httpOnly:true,secure:env.COOKIE_SECURE,sameSite:env.COOKIE_SAME_SITE,path:"/",maxAge:900}},{name:"gldc_refresh",value:refresh,opts:{httpOnly:true,secure:env.COOKIE_SECURE,sameSite:env.COOKIE_SAME_SITE,path:"/",maxAge:604800}}]}
