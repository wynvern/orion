import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
    const url = new URL(req.url);

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

        const userId = url.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                {
                    user: null,
                    message: 'userId not provided',
                    type: 'userId-not-provided',
                },
                { status: 400 }
            );
        }

        const fetchedPosts = await db.post.findMany({
            where: {
                likes: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                bookmarks: true,
                likes: true,
                user: true,
            },
        });

        if (!fetchedPosts) {
            return NextResponse.json(
                {
                    user: null,
                    message: 'No post not found',
                    type: 'no-post-not-found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { posts: fetchedPosts, message: 'Posts retreived succsessfully' },
            { status: 200 }
        );
    } catch (e) {
        return Response.json(
            { message: 'Someting went wrong...' },
            { status: 500 }
        );
    }
};
