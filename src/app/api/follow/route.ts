import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
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

        const body = await req.json();
        const { userIdToFollow } = body;

        const userToFollow = await db.user.findUnique({
            where: {
                id: userIdToFollow,
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
                    id: userIdToFollow,
                },
            });

        if (isAlreadyFollowing) {
            if (isAlreadyFollowing.length > 0) {
                return NextResponse.json(
                    {
                        message: 'Already following this user',
                        type: 'already-following',
                    },
                    { status: 400 }
                );
            }
        } else {
            return null;
        }

        await db.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                following: {
                    connect: {
                        id: userIdToFollow,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                uuid: session.user.id,
                message: 'User followed succsessfully',
            },
            { status: 200 }
        );
    } catch (e) {
        return Response.json(
            { message: 'Something went wrong...' },
            { status: 500 }
        );
    }
};
