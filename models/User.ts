import { ObjectId } from "mongodb";
export type UserRole="member"|"admin"|"manager"|"staff";
export const publicUser=(u:any)=>({id:String(u._id),email:u.email,firstName:u.firstName,lastName:u.lastName,phone:u.phone,role:u.role,status:u.status,emailVerified:u.emailVerified,createdAt:u.createdAt,profile:u.profile});
export const userUpdateSchemaFields=["firstName","lastName","email","phone","alternatePhone","dateOfBirth","nationality","idType","idNumber","gender","address","county","town","postalCode","occupation","organization","memberType","role","status"] as const;
