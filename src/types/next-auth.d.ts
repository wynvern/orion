import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface User {
        username: string;
        emailVerified: boolean;
    }
    interface Session {
        user: User & {
            username: string;
            emailVerified: boolean;
        };
        token: {
            username: string;
            emailVerified: boolean;
        };
    }
}
