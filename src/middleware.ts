import { getSession } from 'next-auth/react';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: ['/', '/user/:path*', '/login', '/signup', '/verify'],
};

const middleware = async (req: NextRequest) => {
    const requestForNextAuth = {
        headers: {
            cookie: req.headers.get('cookie'),
        },
    };
    //@ts-ignore
    const token = await getSession({ req: requestForNextAuth });
    console.log(req.url, token);

    if (token !== null) {
        if (!token?.user.emailVerified && !req.url.includes('/verify')) {
            return NextResponse.redirect(new URL('/verify', req.url));
        }

        if (token?.user.emailVerified && req.url.includes('/verify')) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        console.log(req.url);
        if (req.url.includes('/login') || req.url.includes('/signup')) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    } else {
        if (!req.url.includes('/login') && !req.url.includes('/signup')) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
};

export default middleware;
