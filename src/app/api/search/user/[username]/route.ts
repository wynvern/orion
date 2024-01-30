import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const GET = async (
    req: Request,
    { params }: { params: { username: string } }
) => {
    try {
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

        const username = params.username;

        if (!username) {
            return NextResponse.json(
                {
                    user: null,
                    message: 'username not provided',
                    type: 'username-not-provided',
                },
                { status: 400 }
            );
        }

        const userFetched = await db.user.findUnique({
            where: {
                username: username,
            },
            include: {
                followers: true,
                following: true,
            },
        });
        if (!userFetched) {
            return NextResponse.json(
                {
                    user: null,
                    message: 'User not found',
                    type: 'user-not-found',
                },
                { status: 404 }
            );
        }
        const { password: newUserPassword, ...rest } = userFetched;

        return NextResponse.json(
            { user: rest, message: 'User retreived succsessfully' },
            { status: 200 }
        );
    } catch (e) {
        return Response.json(
            { message: 'Someting went wrong...' },
            { status: 500 }
        );
    }
};
