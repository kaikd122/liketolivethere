import NextAuth, { NextAuthOptions } from 'next-auth'
import Email from 'next-auth/providers/email'

import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'
import generateUsername from '../../../lib/util/generate-username'
import { redirect } from 'next/dist/server/api-utils'

const authOptions: NextAuthOptions = {

    callbacks: {
        // async signIn({ user, email}){
        //     if (!email?.verificationRequest){
        //         if (!user.name){
        //             await prisma.user.update({
        //                 where: {
        //                     email: user.email!
        //                 },
        //                 data: {
        //                     name: generateUsername()
        //                 }
        //             })
        //         }
                

        //     }
        //     return true
        // },
        async session({session, user}){
            if (user?.email){
                session.user.id = user.id
            }
            return session
        },
    
    },

    providers: [

        Email({
            server: {
              host: process.env.SMTP_HOST,
              port: Number(process.env.SMTP_PORT),
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
              },
            },
            from: process.env.SMTP_FROM
          })
    ],
    
    adapter: PrismaAdapter(prisma)
}


export default NextAuth(authOptions)

