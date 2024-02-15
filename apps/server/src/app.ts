import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import multipart from '@fastify/multipart';
import { FILE_SIZE_LIMIT } from '@whats-that-bird/constants';
import { FastifyPluginAsync } from 'fastify';
import * as path from 'path';
import { fileURLToPath } from 'url';
import upload from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;


// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}



const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
    fastify.register(multipart, {
        limits: {
            fileSize: FILE_SIZE_LIMIT
        }
    });

    fastify.register(upload, { prefix: '/api' })
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: opts,
    forceESM: true
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: opts,
    forceESM: true
  })

};

export default app;
export { app, options };

