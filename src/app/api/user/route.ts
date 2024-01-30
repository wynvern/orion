import { db } from '@/lib/db';
import { compare, hash } from 'bcrypt';
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

export const PATCH = async (req: Request) => {
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
        const {
            email,
            username,
            fullName,
            biography,
            birthDate,
            location,
            newPassword,
            oldPassword,
        } = body;

        const existingUser = await db.user.findUnique({
            where: {
                id: session.user.id,
            },
        });

        if (!existingUser) {
            return NextResponse.json(
                { user: null, message: 'User was not found' },
                { status: 404 }
            );
        }

        if (oldPassword) {
            const isPasswordValid = await compare(
                oldPassword,
                existingUser.password
            );

            if (!isPasswordValid) {
                return NextResponse.json(
                    {
                        user: null,
                        message: 'Old password is incorrect',
                        type: 'invalid-old-password',
                    },
                    { status: 401 }
                );
            }
        }

        let hashedNewPassword;
        if (newPassword) {
            hashedNewPassword = await hash(newPassword, 10);
        }

        const updatedUser = await db.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                email: email || existingUser.email,
                username: username || existingUser.username,
                fullName: fullName || existingUser.fullName,
                biography: biography || existingUser.biography,
                birthDate: birthDate || existingUser.birthDate,
                location: location || existingUser.location,
                ...(newPassword && { password: hashedNewPassword }),
            },
        });

        return NextResponse.json(
            { user: updatedUser, message: 'User updated succsessfully' },
            { status: 201 }
        );
    } catch (e) {
        return Response.json(
            { message: 'Someting went wrong...' },
            { status: 500 }
        );
    }
};
