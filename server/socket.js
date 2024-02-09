const getDB = require('./db');

const { Server } = require('socket.io'),
    io = new Server(8000);

let authorizedUsers = new Map();
let userTimeouts = new Map(); // Map to store timeout IDs for each user

io.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);

    socket.on('authorize', async (data) => {
        authorizedUsers.set(socket, data.auth.user);
        await setUserStatus('Online', data.auth.user.id);
    });

    socket.on('disconnect', async () => {
        const user = authorizedUsers.get(socket);
        if (user) {
            // Clear previous timeout if exists
            const timeoutId = userTimeouts.get(user.id);
            if (timeoutId) {
                clearTimeout(timeoutId);
                userTimeouts.delete(user.id);
            }

            // Set new timeout for 1 minute before setting user offline
            const newTimeoutId = setTimeout(async () => {
                await setUserStatus('Offline', user.id);
                authorizedUsers.delete(socket);
            }, 30000); // 1 minute delay

            // Store new timeout ID
            userTimeouts.set(user.id, newTimeoutId);
        }
        console.info(`Client gone [id=${socket.id}]`);
    });

    socket.on('reconnect', () => {
        const user = authorizedUsers.get(socket);
        if (user) {
            // Clear previous timeout if exists
            const timeoutId = userTimeouts.get(user.id);
            if (timeoutId) {
                clearTimeout(timeoutId);
                userTimeouts.delete(user.id);
            }
        }
        console.info(`Client reconnected [id=${socket.id}]`);
    });
});

const setUserStatus = async (status, userId) => {
    const db = getDB();

    const user = await db.user.update({
        where: { id: userId },
        data: { status },
    });

    console.log(user);
};
