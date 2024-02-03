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

        const alreadyLikedPost = await db.postLikes.findUnique({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId: uuid,
                },
            },
        });

        if (alreadyLikedPost) {
            return NextResponse.json(
                {
                    message: 'Already liking this post',
                    type: 'already-liked',
                },
                { status: 400 }
            );
        }

        await db.postLikes.create({
            data: {
                postId: uuid,
                userId: session.user.id,
            },
        });

        return NextResponse.json(
            {
                message: 'Post liked succsessfully',
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

        if (!uuid) {
            return NextResponse.json(
                {
                    message: 'Missing uuid',
                    type: 'missing-uuid',
                },
                { status: 400 }
            );
        }

        const postToDislike = await db.postLikes.findUnique({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId: uuid,
                },
            },
        });

        if (!postToDislike) {
            return NextResponse.json(
                {
                    message: 'Post not liked',
                    type: 'post-not-liked',
                },
                { status: 404 }
            );
        }

        await db.postLikes.delete({
            where: {
                id: session.user.id,
                postId: uuid,
            },
        });

        return NextResponse.json(
            {
                message: 'Post unliked successfully',
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

        const { uuid } = params;

        if (!uuid) {
            return NextResponse.json(
                {
                    message: 'Missing uuid',
                    type: 'missing-uuid',
                },
                { status: 400 }
            );
        }

        const postToCheck = await db.postLikes.findUnique({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId: uuid,
                },
            },
        });

        if (postToCheck) {
            return NextResponse.json(
                {
                    message: 'Post liked',
                    type: 'post-liked',
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                {
                    message: 'Post not liked',
                    type: 'post-not-liked',
                },
                { status: 200 }
            );
        }
    } catch (e) {
        return NextResponse.json(
            { message: 'Something went wrong...' },
            { status: 500 }
        );
    }
};
