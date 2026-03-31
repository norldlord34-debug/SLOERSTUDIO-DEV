import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.passwordHash) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) {
          await prisma.auditLog.create({
            data: { userId: user.id, action: "LOGIN", entity: "User", entityId: user.id, metadata: JSON.stringify({ success: false }) }
          });
          return null;
        }
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        await prisma.auditLog.create({
          data: { userId: user.id, action: "LOGIN", entity: "User", entityId: user.id, metadata: JSON.stringify({ success: true }) }
        });
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role as string,
          plan: user.plan as string,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
        token.plan = (user as { plan?: string }).plan ?? "free";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { plan?: string }).plan = token.plan as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
