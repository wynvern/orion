import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import timeDifference from '@/utils/timeDifference';
import { Post } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import * as fs from 'fs/promises';

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
        const { text, images, videos } = body; // Extract videos from request body

        if (!text) {
            return Response.json(
                { message: 'Missing text...' },
                { status: 400 }
            );
        }

        if (text.length > 200) {
            return Response.json(
                { message: 'Message text too long...' },
                { status: 400 }
            );
        }

        const newPost = await db.post.create({
            data: {
                content: text,
                images: images.length,
                videos: videos.length,
                userId: session.user.id,
            },
        });

        await fs.mkdir(`./public/uploads/posts/${newPost.id}`, {
            recursive: true,
        });
        await fs.mkdir(`./public/uploads/posts/${newPost.id}/video`, {
            recursive: true,
        });

        // Handle image uploads
        images.map(async (element: string, index: number) => {
            const imageData = Buffer.from(element, 'base64');

            const pngImageData = await sharp(imageData)
                .rotate()
                .toFormat('png')
                .toBuffer();

            const filePath = `./public/uploads/posts/${newPost.id}/${
                index + 1
            }.png`;
            require('fs').writeFileSync(filePath, pngImageData);
        });

        // Handle video uploads
        videos.map(async (element: string, index: number) => {
            const videoData = Buffer.from(element, 'base64');

            const filePath = `./public/uploads/posts/${newPost.id}/video/${
                index + 1
            }.mp4`;
            require('fs').writeFileSync(filePath, videoData);
        });

        return NextResponse.json(
            { post: newPost, message: 'Post created successfully' },
            { status: 201 }
        );
    } catch (e) {
        return Response.json(
            { message: 'Something went wrong...' },
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
                likes: true,
                bookmarks: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
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
