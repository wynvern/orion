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
                    user: null,
                    message: 'Not authorized',
                    type: 'Missing authorization',
                },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { content } = body;

        if (!content) {
            return Response.json(
                { message: 'Missing variables...' },
                { status: 400 }
            );
        }

        const newPost = await db.post.create({
            data: {
                content: content,
                userId: session.user.id,
            },
        });

        return NextResponse.json(
            { post: newPost, message: 'Post created succsessfully' },
            { status: 201 }
        );
    } catch (e) {
        return Response.json(
            { message: 'Someting went wrong...' },
            { status: 500 }
        );
    }
};

export const GET = async (req: Request) => {
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

        const posts = await db.post.findMany({
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(
            { posts: posts, message: 'Post retreived succsessfully' },
            { status: 201 }
        );
    } catch (e) {
        return Response.json(
            { message: 'Someting went wrong...' },
            { status: 500 }
        );
    }
};
