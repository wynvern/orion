import { NextResponse } from 'next/server';
import path from 'path';
import * as fs from 'fs/promises';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export const GET = async (
    req: Request,
    { params }: { params: { uuid: string; index: string } }
) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                {
                    message: 'Not authorized',
                    type: 'Missing authorization',
                },
                { status: 401 }
            );
        }
        const uuid = params.uuid;

        if (!uuid) {
            return Response.json(
                { message: 'uuid not provided', type: 'uuid-missing' },
                { status: 400 }
            );
        }

        const postFolderPath = path.join(
            process.cwd(),
            'public',
            'uploads',
            'posts',
            uuid,
            'video'
        );
        const videoPath = path.join(postFolderPath, `${params.index}.mp4`); // Adjust file extension as per your video format

        try {
            await fs.access(postFolderPath);
        } catch (error) {
            return Response.json(
                {
                    message: 'Post not found',
                    type: 'post-not-found',
                },
                { status: 404 }
            );
        }

        const videoBuffer = await fs.readFile(videoPath);

        const headers = {
            'Content-Type': 'video/mp4',
            'Content-Range': `bytes 0-${videoBuffer.length - 1}/${
                videoBuffer.length
            }`,
            'Accept-Ranges': 'bytes',
        };

        return new Response(videoBuffer, { headers, status: 200 });
    } catch (e) {
        return Response.json(
            { message: 'Something went wrong...' },
            { status: 500 }
        );
    }
};
