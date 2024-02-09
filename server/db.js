const { PrismaClient } = require('@prisma/client');

const prismaClientSingleton = () => {
    return new PrismaClient();
};

global.prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

const getDB = () => global.prisma;

module.exports = getDB;
