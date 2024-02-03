import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const middleware = async (req: NextRequest) => {
    const session = await getToken({ req });

    if (session) {
        if (!session.emailVerified && !req.url.includes('/verify')) {
            return NextResponse.redirect(new URL('/verify', req.url));
        }

        if (session.emailVerified && req.url.includes('/verify')) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        if (req.url.includes('/login') || req.url.includes('/signup')) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    } else {
        if (!req.url.includes('/login') && !req.url.includes('/signup')) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
};

export const config = {
    matcher: ['/', '/session/:path*', '/login', '/signup', '/verify'],
    runtime: 'experimental-edge',
};

export default middleware;
