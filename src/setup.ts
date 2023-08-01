import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Server
const app = express();
const server = createServer(app);

// Socket
const io = new Server(server, {
    path: '/karikariyaki/ws',
    cors: {
        credentials: true,
        origin: process.env.ORIGIN_ADDRESS
            ? process.env.ORIGIN_ADDRESS.split(' ')
            : ['http://localhost'],
    },
});

export { app, server, io };
