require('module-alias/register');

import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

// Setup
import { app, server } from './setup';

// Routes
import routes from '@routes';

// Socket Setup
import { ClientSocket, PrompterSocket, RejiSocket } from '@sockets';

const allowedDomains = process.env.ORIGIN_ADDRESS
    ? process.env.ORIGIN_ADDRESS.split(' ')
    : ['http://localhost'];

// Add-ons
app.use(morgan('dev'));
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }

            if (allowedDomains.indexOf(origin) === -1) {
                const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;

                return callback(new Error(msg), false);
            }

            return callback(null, true);
        },
        credentials: true,
    }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '5mb' }));

app.use('/karikariyaki', routes);

// Sockets

ClientSocket.setup();
PrompterSocket.setup();
RejiSocket.setup();

server.listen(process.env.PORT || 9003);
