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

        const user = await db.user.findUnique({
            where: {
                id: params.uuid,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    message: 'User not found',
                    type: 'user-not-found',
                },
                { status: 404 }
            );
        }

        // Find the users that the specified user is following
        const followingUsers = await db.user.findMany({
            where: {
                following: {
                    some: {
                        followerId: params.uuid,
                    },
                },
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                biography: true,
                status: true,
            },
        });

        return NextResponse.json(
            {
                data: followingUsers,
                message: 'Following users retrieved successfully',
                type: 'following-users',
            },
            { status: 200 }
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { message: 'Something went wrong...' },
            { status: 500 }
        );
    }
};
