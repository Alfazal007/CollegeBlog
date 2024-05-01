import prisma from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials: any) {
                try {
                    console.log("HERE");
                    const userFromDb = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: credentials.identifier },
                                { username: credentials.identifier },
                            ],
                        },
                    });
                    if (!userFromDb) {
                        return null;
                    }
                    if (!userFromDb.isVerified) {
                        return null;
                    }
                    const passwordSame = await bcrypt.compare(
                        credentials.password,
                        userFromDb?.password
                    );
                    if (!passwordSame) {
                        return null;
                    }
                    return userFromDb;
                } catch (error) {
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.isVerified = token.isVerified;
                session.user.email = token.email;
                session.user.username = token.username;
            }
            return session;
        },
    },
};
