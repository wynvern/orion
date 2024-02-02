import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from './db';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('missing-data');
                }

                const existingUser = await db.user.findUnique({
                    where: {
                        email: credentials?.email,
                    },
                });
                if (!existingUser) {
                    throw new Error('email-not-found');
                }

                const passwordMatch = await compare(
                    credentials.password,
                    existingUser.password
                );
                if (!passwordMatch) {
                    throw new Error('password-not-match');
                }

                return {
                    id: existingUser.id,
                    username: existingUser.username,
                    email: existingUser.email,
                    emailVerified: existingUser.emailVerified,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                return {
                    ...token,
                    username: user.username,
                    id: user.id,
                    emailVerified: user.emailVerified,
                };
            }

            if (trigger === 'update') {
                token.emailVerified = session.emailVerified;
            }

            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                    id: token.id,
                    emailVerified: token.emailVerified,
                },
            };
        },
    },
};
