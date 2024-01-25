import { db } from '@/lib/db';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import path from 'path';

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { email, username, password } = body;

        const existingEmail = await db.user.findUnique({
            where: {
                email: email,
            },
        });
        if (existingEmail) {
            return NextResponse.json(
                {
                    user: null,
                    message: 'Email already in use.',
                    type: 'email-in-use',
                },
                { status: 409 }
            );
        }

        const existingUsername = await db.user.findUnique({
            where: {
                username: username,
            },
        });
        if (existingUsername) {
            return NextResponse.json(
                {
                    user: null,
                    message: 'Username already in use.',
                    type: 'username-in-use',
                },
                { status: 409 }
            );
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await db.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        const { password: newUserPassword, ...rest } = newUser;

        // Create user folder for image avatar
        const avatarFolderPath = path.join(
            process.cwd(),
            'public',
            'uploads',
            'avatars',
            rest.id
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

        // Create user folder for image banner
        const bannerFolderPath = path.join(
            process.cwd(),
            'public',
            'uploads',
            'banners',
            rest.id
        );
        await fs.mkdir(bannerFolderPath, { recursive: true });

        const defaultBannerImagePath = path.join(
            process.cwd(),
            'public',
            'static',
            'default',
            'bannerDefault.png'
        );
        const userBannerImagePath = path.join(bannerFolderPath, 'original.png');
        await fs.copyFile(defaultBannerImagePath, userBannerImagePath);

        return NextResponse.json(
            { user: rest, message: 'User created succsessfully' },
            { status: 201 }
        );
    } catch (e) {
        return Response.json(
            { message: 'Someting went wrong...' },
            { status: 500 }
        );
    }
};
