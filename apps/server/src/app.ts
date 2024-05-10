import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import multipart from '@fastify/multipart';
import ratelimit from '@fastify/rate-limit';
import cors from '@fastify/cors';
import { FILE_SIZE_LIMIT } from '@whats-that-bird/constants';
import { FastifyPluginAsync } from 'fastify';
import * as path from 'path';
import { fileURLToPath } from 'url';
import upload from './routes/upload.js';
import species from './routes/species.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AppOptions = {
    // Place your custom options for app below here.
    logger: Record<string, string>;
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
    logger: {
        level: 'debug',
    },
};

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
    fastify.register(multipart, {
        limits: {
            fileSize: FILE_SIZE_LIMIT,
        },
    });

    await fastify.register(cors, {
        origin: process.env.NODE_ENV === 'development' ? true : process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        exposedHeaders: ['X-Ratelimit-Reset', 'X-Ratelimit-Remaining', 'X-Ratelimit-Limit'],
    });

    await fastify.register(ratelimit, {
        global: false,
        keyGenerator: function (req) {
            if (process.env.NODE_ENV === 'development') {
                return req.ip;
            }

            const userIP = (req.headers['x-forwarded-for'] as string).split(/, /)[0];
            return userIP || req.ip;
        },
    });

    fastify.register(upload, { prefix: '/api' });
    fastify.register(species, { prefix: '/api' });
    // Do not touch the following lines

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application
    void fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: opts,
        forceESM: true,
    });

    // This loads all plugins defined in routes
    // define your routes in one of these
    void fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: opts,
        forceESM: true,
    });
};

export default app;
export { app, options };
