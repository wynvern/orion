import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import * as fs from 'fs/promises';

import { NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';

export const POST = async (req: Request) => {
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

        const body = await req.json();
        const { image } = body;

        const imageData = Buffer.from(image, 'base64');

        const pngImageData = await sharp(imageData).toFormat('png').toBuffer();

        const filePath = `./public/uploads/avatars/${session.user.id}/original.png`;

        try {
            await fs.access(filePath);
        } catch (error) {
            // Folder does not exist
            return Response.json(
                {
                    message: 'User not found',
                    type: 'user-not-found',
                },
                { status: 404 }
            );
        }

        await sharp(pngImageData)
            .rotate()
            .resize({
                width: 500,
                height: 500,
                fit: 'cover',
                position: 'centre',
            })
            .toFile(filePath);

        return NextResponse.json(
            {
                uuid: session.user.id,
                message: 'Avatar image updated successfully',
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

export const DELETE = async (req: Request) => {
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

        const avatarFolderPath = path.join(
            process.cwd(),
            'public',
            'uploads',
            'avatars',
            session.user.id
        );
        await fs.mkdir(avatarFolderPath, { recursive: true });

        const defaultImagePath = path.join(
            process.cwd(),
            'public',
            'static',
            'default',
            'avatarDefault.png'
        );
        const userImagePath = path.join(avatarFolderPath, 'original.png');
        await fs.copyFile(defaultImagePath, userImagePath);

        return NextResponse.json(
            {
                uuid: session.user.id,
                message: 'Avatar restored to default successfully',
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
