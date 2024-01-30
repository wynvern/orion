import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import timeDifference from '@/utils/timeDifference';
import { Post } from '@prisma/client';
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

        if (content.length > 200) {
            return Response.json(
                { message: 'Message content too long...' },
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
        console.log(e);
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

        const categorizedPosts = categorizePosts(posts);

        return NextResponse.json(
            {
                posts: categorizedPosts,
                message: 'Post retreived succsessfully',
            },
            { status: 201 }
        );
    } catch (e) {
        return Response.json(
            { message: 'Someting went wrong...' },
            { status: 500 }
        );
    }
};

const categorizePosts = (posts: Post[]) => {
    const categorizedPosts: Record<string, Post[]> = {
        hoje: [],
        ontem: [],
        diasAtras: [],
        semanasAtras: [],
        mesesAtras: [],
        anosAtras: [],
    };

    posts.forEach((post: Post) => {
        const timeDiffString = timeDifference(String(post.createdAt));

        switch (timeDiffString) {
            case 'Hoje':
                categorizedPosts.hoje.push(post);
                break;
            case 'Ontem':
                categorizedPosts.ontem.push(post);
                break;
            case 'Na última semana':
                categorizedPosts.semanasAtras.push(post);
                break;
            case 'No último mês':
                categorizedPosts.mesesAtras.push(post);
                break;
            case 'No último ano':
                categorizedPosts.anosAtras.push(post);
                break;
            case 'Há muito tempo':
                categorizedPosts.anosAtras.push(post); // Or categorize as needed
                break;
            default:
                break;
        }
    });

    return categorizedPosts;
};
