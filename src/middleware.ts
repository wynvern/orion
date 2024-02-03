import { NextRequest, NextResponse } from 'next/server';

const middleware = async (req: NextRequest) => {
    const resSession = await fetch(
        process.env.NEXTAUTH_URL + '/api/auth/session',
        {
            headers: {
                'Content-Type': 'application/json',
                Cookie: req.headers.get('cookie') || '',
            },
            method: 'GET',
        }
    );
    const session = await resSession.json();

    if (session) {
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

export default middleware;
