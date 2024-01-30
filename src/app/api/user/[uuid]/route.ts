import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const GET = async (
    req: Request,
    { params }: { params: { uuid: string } }
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

        const uuid = params.uuid;

        if (!uuid) {
            return NextResponse.json(
                {
                    user: null,
                    message: 'uuid not provided',
                    type: 'uuid-not-provided',
                },
                { status: 400 }
            );
        }

        const userFetched = await db.user.findUnique({
            where: {
                id: uuid,
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
