import passport from 'passport'; import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; import { PrismaClient } from '@prisma/client'; import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
passport.use(new GoogleStrategy({ clientID: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET!, callbackURL: process.env.GOOGLE_CALLBACK_URL! },
async (_a,_r,profile,done)=>{const email=profile.emails?.[0]?.value; if(!email) return done(new Error('Missing email'));
let user=await prisma.user.findUnique({where:{email}}); if(!user){user=await prisma.user.create({data:{email,googleId:profile.id,name:profile.displayName,role:'VIEWER'}});}
const token=jwt.sign({id:user.id,email:user.email,role:user.role},process.env.JWT_SECRET!,{expiresIn:process.env.JWT_EXPIRES_IN||'7d'}); done(null,{token});}));
export default passport;
