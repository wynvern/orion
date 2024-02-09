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

        const { uuid } = params;
        const body = await req.json();
        const { text, images } = body;

        if (!uuid) {
            return NextResponse.json(
                {
                    message: 'Missing uuid',
                    type: 'missing-uuid',
                },
                { status: 400 }
            );
        }

        const post = await db.post.findUnique({
            where: {
                id: uuid,
            },
        });

        if (!post) {
            return NextResponse.json(
                {
                    message: 'Post not found',
                    type: 'post-not-found',
                },
                { status: 404 }
            );
        }

        const comment = await db.comment.create({
            data: {
                content: text,
                postId: post.id,
                userId: session.user.id,
            },
        });

        return NextResponse.json(
            {
                message: 'Comment created succsessfully',
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

        const { uuid } = params;
        const body = await req.json();
        const { commentId } = body;

        if (!uuid) {
            return NextResponse.json(
                {
                    message: 'Missing uuid',
                    type: 'missing-uuid',
                },
                { status: 400 }
            );
        }

        const postToDeleteComment = await db.post.findUnique({
            where: {
                id: uuid,
            },
        });

        if (!postToDeleteComment) {
            return NextResponse.json(
                {
                    message: 'Post not liked',
                    type: 'post-not-liked',
                },
                { status: 404 }
            );
        }

        await db.comment.delete({
            where: {
                id: commentId,
            },
        });

        return NextResponse.json(
            {
                message: 'Comment deleted successfully',
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
