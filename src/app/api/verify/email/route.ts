import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import sendMail from '@/lib/mail';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';

interface OpenCodes {
    [email: string]: { code: string; timeoutId: NodeJS.Timeout };
}
const openCodes: OpenCodes = {};

const generateVerificationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const GET = async (req: Request) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {
                user: null,
                message: 'Not authorized',
                type: 'Missing authorization',
            },
            { status: 401 }
        );
    }

    if (session.user.emailVerified) {
        return NextResponse.json(
            {
                return: false,
                message: 'Email already verified',
                type: 'already-verified',
            },
            { status: 200 }
        );
    }

    const code = generateVerificationCode();

    if (session.user.email && openCodes[session.user.email]) {
        const existingCode = openCodes[session.user.email].code;

        return NextResponse.json(
            {
                user: null,
                message: `Verification code already sent: ${existingCode}`,
                type: 'code-already-sent',
            },
            { status: 200 }
        );
    }

    if (session.user.email) {
        openCodes[session.user.email] = {
            code,
            timeoutId: setTimeout(() => {
                if (session.user.email) {
                    delete openCodes[session.user.email];
                }
            }, 5 * 60 * 1000), // 5 minutes in milliseconds
        };
    }

    let html = await fs.readFile('./public/email/verifyEmailCode.html', {
        encoding: 'utf-8',
    });
    html = html.replace('{{code}}', code);
    html = html.replace('{{username}}', session.user.username);

    await sendMail(session.user.email, 'Verificação de Email', html);

    return NextResponse.json(
        {
            user: null,
            message: 'Email for verification send succsessfully',
            type: 'email-sent',
        },
        { status: 200 }
    );
};

export const POST = async (req: Request) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {
                user: null,
                message: 'Not authorized',
                type: 'Missing authorization',
            },
            { status: 401 }
        );
    }

    if (session.user.emailVerified) {
        return NextResponse.json(
            {
                return: false,
                message: 'Email already verified',
                type: 'already-verified',
            },
            { status: 200 }
        );
    }

    const { code } = await req.json();

    if (!code) {
        return NextResponse.json(
            {
                user: null,
                message: 'Verification code is required',
                type: 'missing-code',
            },
            { status: 400 }
        );
    }

    if (session.user.email && openCodes[session.user.email]) {
        const storedCode = openCodes[session.user.email].code;

        if (code === storedCode) {
            clearTimeout(openCodes[session.user.email].timeoutId);
            delete openCodes[session.user.email];

            await db.user.update({
                where: {
                    email: session.user.email,
                },
                data: {
                    emailVerified: true,
                },
            });

            return NextResponse.json(
                {
                    user: null,
                    message: 'Email verified successfully',
                    type: 'email-verified',
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                {
                    user: null,
                    message: 'Invalid verification code',
                    type: 'invalid-code',
                },
                { status: 400 }
            );
        }
    } else {
        return NextResponse.json(
            {
                user: null,
                message: 'No verification code found',
                type: 'no-code-found',
            },
            { status: 400 }
        );
    }
};
