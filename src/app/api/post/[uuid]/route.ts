import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';

export const DELETE = async (
    req: Request,
    { params }: { params: { uuid: string } }
) => {
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

        const post = await db.post.findUnique({
            where: { id: params.uuid },
        });

        if (!post || post.userId !== session.user.id) {
            return NextResponse.json(
                { message: 'Post not found' },
                { status: 404 }
            );
        }

        const folderPath = `./public/uploads/posts/${params.uuid}`;

        await fs.rmdir(folderPath, { recursive: true });

        await db.post.delete({
            where: { id: params.uuid },
        });

        return NextResponse.json(
            { message: 'Post deleted successfully' },
            { status: 200 }
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { message: 'Something went wrong...' },
            { status: 500 }
        );
    }
};
