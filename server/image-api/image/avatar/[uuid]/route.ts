import { NextResponse } from 'next/server';
import path from 'path';
import * as fs from 'fs/promises';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

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

        const avatarFolderPath = path.join(
            process.cwd(),
            'public',
            'uploads',
            'avatars',
            uuid
        );
        const imagePath = path.join(avatarFolderPath, 'original.png');

        try {
            await fs.access(avatarFolderPath);
        } catch (error) {
            return Response.json(
                {
                    message: 'User not found',
                    type: 'user-not-found',
                },
                { status: 404 }
            );
        }

        const imageBuffer = await fs.readFile(imagePath);

        const headers = {
            'Content-Type': 'image/png',
        };

        return new Response(imageBuffer, { headers, status: 200 });
    } catch (e) {
        return Response.json(
            { message: 'Someting went wrong...' },
            { status: 500 }
        );
    }
};
