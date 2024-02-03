import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const POST = async (
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

        const { uuid: userIdToFollow } = params;

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
            .findUnique({ where: { id: userIdToFollow } })
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
            return Response.json(
                { message: 'Something went wrong...' },
                { status: 500 }
            );
        }

        await db.follower.create({
            data: {
                followerId: session.user.id,
                followingId: userIdToFollow,
            },
        });

        return NextResponse.json(
            {
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

export const DELETE = async (
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

        const { uuid: userIdToUnfollow } = params;

        const userToUnfollow = await db.user.findUnique({
            where: {
                id: userIdToUnfollow,
            },
        });

        if (!userToUnfollow) {
            return NextResponse.json(
                {
                    message: 'User to unfollow not found',
                    type: 'user-not-found',
                },
                { status: 404 }
            );
        }

        const isAlreadyFollowing = await db.follower.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: params.uuid,
                },
            },
        });

        if (!isAlreadyFollowing) {
            return NextResponse.json(
                {
                    message: 'Not following this user',
                    type: 'not-following',
                },
                { status: 400 }
            );
        }

        await db.follower.delete({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: params.uuid,
                },
            },
        });

        return NextResponse.json(
            {
                message: 'User unfollowed successfully',
            },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            { message: 'Something went wrong...' },
            { status: 500 }
        );
    }
};
