import NextAuth, { NextAuthOptions } from "next-auth";
import Email from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";

import { sendVerificationRequestCustom } from "../../../lib/util/sendVerificationRequest";

const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      if (user?.email) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-request",
    signOut: "/signout",
    error: "/signin",
  },

  providers: [
    Email({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.SMTP_FROM,
      sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        sendVerificationRequestCustom({
          identifier: email,
          url,
          provider: { server, from },
          theme: "light",
        });
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: null,
          image: null,
          email: profile.email,
        };
      },
    }),
  ],

  adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);
