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

        const alreadyBookmarkedPost = await db.postBookmarks.findUnique({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId: uuid,
                },
            },
        });

        if (alreadyBookmarkedPost) {
            return NextResponse.json(
                {
                    message: 'Already bookmarked this post',
                    type: 'already-bookmarked',
                },
                { status: 400 }
            );
        }

        await db.postBookmarks.create({
            data: {
                postId: uuid,
                userId: session.user.id,
            },
        });

        return NextResponse.json(
            {
                message: 'Post bookmarked succsessfully',
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

        const postToUnbookmark = await db.postBookmarks.findUnique({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId: uuid,
                },
            },
        });

        if (!postToUnbookmark) {
            return NextResponse.json(
                {
                    message: 'Post not bookmarked',
                    type: 'post-not-bookmarked',
                },
                { status: 404 }
            );
        }

        await db.postBookmarks.delete({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId: uuid,
                },
            },
        });

        return NextResponse.json(
            {
                message: 'Post unbookmarked successfully',
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

        const postToCheck = await db.postBookmarks.findUnique({
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
                    message: 'Post bookmarked',
                    type: 'post-bookmarked',
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
