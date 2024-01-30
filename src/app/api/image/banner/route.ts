import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import path from 'path';

import sharp from 'sharp';

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
        console.log(session);
        const imageData = Buffer.from(image, 'base64');

        const pngImageData = await sharp(imageData).toFormat('png').toBuffer();

        const filePath = `./public/uploads/banners/${session.user.id}/original.png`;
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

        // Use the fs module to write the PNG image data to the file
        require('fs').writeFileSync(filePath, pngImageData);

        return NextResponse.json(
            {
                uuid: session.user.id,
                message: 'Avatar image updated successfully',
            },
            { status: 200 }
        );
    } catch (e) {
        console.log(e);
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

        const bannerFolderPath = path.join(
            process.cwd(),
            'public',
            'uploads',
            'banners',
            session.user.id
        );
        await fs.mkdir(bannerFolderPath, { recursive: true });

        const defaultImagePath = path.join(
            process.cwd(),
            'public',
            'static',
            'default',
            'bannerDefault.png'
        );
        const userImagePath = path.join(bannerFolderPath, 'original.png');
        await fs.copyFile(defaultImagePath, userImagePath);

        return NextResponse.json(
            {
                uuid: session.user.id,
                message: 'Banner restored to default successfully',
            },
            { status: 200 }
        );
    } catch (e) {
        console.log(e);
        return Response.json(
            { message: 'Something went wrong...' },
            { status: 500 }
        );
    }
};
