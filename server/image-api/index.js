const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = 3005;

app.get('/image/avatar/:uuid', async (req, res) => {
    const uuid = req.params.uuid;

    try {
        if (!uuid) {
            return res.status(400).json({
                message: 'UUID not provided',
                type: 'uuid-missing',
            });
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
        } catch (e) {
            return res.status(404).json({
                message: 'User not found',
                type: 'user-not-found',
            });
        }

        const imageBuffer = await fs.readFile(imagePath);

        res.set('Content-Type', 'image/png');
        return res.status(200).send(imageBuffer);
    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong...',
        });
    }
});

app.post('/image/avatar', async (req, res) => {
    const authorizationHeader = req.headers['authorization'];
    console.log(authorizationHeader);
    res.sendStatus(200);
    return;

    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return res.status(401).json({
                message: 'Not authorized',
                type: 'Missing authorization',
            });
        }

        const body = req.body;
        const { image } = body;

        const imageData = Buffer.from(image, 'base64');

        const pngImageData = await sharp(imageData).toFormat('png').toBuffer();

        const filePath = `./public/uploads/avatars/${session.user.id}/original.png`;

        try {
            await fs.access(filePath);
        } catch (error) {
            // Folder does not exist
            return res.status(404).json({
                message: 'User not found',
                type: 'user-not-found',
            });
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

        return res.status(200).json({
            uuid: session.user.id,
            message: 'Avatar image updated successfully',
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: 'Something went wrong...',
        });
    }
});

app.delete('/image/avatar/:uuid', async (req, res) => {
    const uuid = req.params.uuid;

    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return res.status(401).json({
                message: 'Not authorized',
                type: 'Missing authorization',
            });
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

        return res.status(200).json({
            uuid: session.user.id,
            message: 'Avatar restored to default successfully',
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: 'Something went wrong...',
        });
    }
});

// Route to fetch banner image
app.get('/image/banner/:uuid', async (req, res) => {
    const uuid = req.params.uuid;

    try {
        if (!uuid) {
            return res.status(400).json({
                message: 'UUID not provided',
                type: 'uuid-missing',
            });
        }

        const avatarFolderPath = path.join(
            process.cwd(),
            'public',
            'uploads',
            'banners',
            uuid
        );
        const imagePath = path.join(avatarFolderPath, 'original.png');

        try {
            await fs.access(avatarFolderPath);
        } catch (e) {
            return res.status(404).json({
                message: 'Banner not found',
                type: 'banner-not-found',
            });
        }

        const imageBuffer = await fs.readFile(imagePath);

        res.set('Content-Type', 'image/png');
        return res.status(200).send(imageBuffer);
    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong...',
        });
    }
});

// Route to fetch post image
app.get('/image/post/:uuid/:index', async (req, res) => {
    const uuid = req.params.uuid;
    const index = req.params.index;

    try {
        if (!uuid) {
            return res.status(400).json({
                message: 'UUID not provided',
                type: 'uuid-missing',
            });
        }

        const avatarFolderPath = path.join(
            process.cwd(),
            'public',
            'uploads',
            'posts',
            uuid
        );
        const imagePath = path.join(avatarFolderPath, `${index}.png`);

        try {
            await fs.access(avatarFolderPath);
        } catch (e) {
            return res.status(404).json({
                message: 'Post image not found',
                type: 'post-image-not-found',
            });
        }

        const imageBuffer = await fs.readFile(imagePath);

        res.set('Content-Type', 'image/png');
        return res.status(200).send(imageBuffer);
    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong...',
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
