import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const middleware = async (req: NextRequest) => {
    const url = new URL(req.url);
    const session = await getToken({ req });

    if (session) {
        if (!session.emailVerified && !url.pathname.includes('/verify')) {
            return NextResponse.redirect(new URL('/verify', req.url));
        }

        if (session.emailVerified && req.url.includes('/verify')) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        if (
            url.pathname.includes('/login') ||
            url.pathname.includes('/signup')
        ) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        if (url.pathname === '/user') {
            return NextResponse.redirect(
                new URL(`/user/${session.username}`, req.url)
            );
        }
    } else {
        if (
            !url.pathname.includes('/login') &&
            !url.pathname.includes('/signup')
        ) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
};

export const config = {
    matcher: [
        '/',
        '/session/:path*',
        '/user/:path*',
        '/login',
        '/signup',
        '/verify',
    ],
    runtime: 'experimental-edge',
};

export default middleware;
