import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const GET = async (
    req: Request,
    { params }: { params: { uuid: string } }
) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                {
                    message: 'Not authorized',
                    type: 'missing-authorization',
                },
                { status: 401 }
            );
        }

        const userToFollow = await db.user.findUnique({
            where: {
                id: params.uuid,
            },
        });

        if (!userToFollow) {
            return NextResponse.json(
                {
                    message: 'User to follow not found',
                    type: 'user-not-found',
                },
                { status: 404 }
            );
        }

        const isAlreadyFollowing = await db.user
            .findUnique({ where: { id: session.user.id } })
            .following({
                where: {
                    id: params.uuid,
                },
            });

        if (isAlreadyFollowing) {
            if (isAlreadyFollowing.length > 0) {
                return NextResponse.json(
                    {
                        message: 'You are following the user',
                        type: 'already-following',
                    },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    {
                        message: 'You are not following the user',
                        type: 'not-following',
                    },
                    { status: 200 }
                );
            }
        }
    } catch (e) {
        return Response.json(
            { message: 'Something went wrong...' },
            { status: 500 }
        );
    }
};
