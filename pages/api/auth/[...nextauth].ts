import NextAuth, { NextAuthOptions } from "next-auth";
import Email from "next-auth/providers/email";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";
import generateUsername from "../../../lib/util/generate-username";
import { redirect } from "next/dist/server/api-utils";
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
  ],

  adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);
