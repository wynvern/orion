import { NextRequest, NextResponse } from 'next/server';

const middleware = async (req: NextRequest) => {
    const url = new URL(req.url);

    const resSession = await fetch(
        `${url.protocol}//${url.host}//api/auth/session`,
        {
            headers: {
                'Content-Type': 'application/json',
                Cookie: req.headers.get('cookie') || '',
            },
            method: 'GET',
        }
    );
    const session = await resSession.json();

    if (Object.keys(session).length !== 0) {
        const { user } = session;

        if (!user.emailVerified && !req.url.includes('/verify')) {
            return NextResponse.redirect(new URL('/verify', req.url));
        }

        if (user.emailVerified && req.url.includes('/verify')) {
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
    matcher: ['/', '/user/:path*', '/login', '/signup', '/verify'],
    runtime: 'experimental-edge',
};

export default middleware;
