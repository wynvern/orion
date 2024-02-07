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

        const content = url.searchParams.get('content');

        if (!content) {
            return NextResponse.json(
                {
                    user: null,
                    message: 'content not provided',
                    type: 'content-not-provided',
                },
                { status: 400 }
            );
        }

        const fetchedPosts = await db.post.findMany({
            where: {
                content: { contains: content },
            },
            include: {
                likes: true,
                bookmarks: true,
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
            { posts: fetchedPosts, message: 'User retreived succsessfully' },
            { status: 200 }
        );
    } catch (e) {
        return Response.json(
            { message: 'Someting went wrong...' },
            { status: 500 }
        );
    }
};
