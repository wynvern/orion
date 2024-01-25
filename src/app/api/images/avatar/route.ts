import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import * as fs from 'fs/promises';

import { NextResponse } from 'next/server';
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

        // Assuming 'image' contains the base64-encoded image data
        const imageData = Buffer.from(image, 'base64');

        // Convert the image to PNG using sharp
        const pngImageData = await sharp(imageData).toFormat('png').toBuffer();

        // Specify the file path with a .png extension
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
        return Response.json(
            { message: 'Something went wrong...' },
            { status: 500 }
        );
    }
};
