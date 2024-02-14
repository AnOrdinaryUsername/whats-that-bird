import { FastifyPluginAsync } from "fastify";
import fs from 'fs';
import { pipeline } from 'stream';
import util from 'util';


const pump = util.promisify(pipeline)

const upload: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/upload', async function (request, reply) {
    const image = await request.file();

    if (!image) {
        reply.status(400).send({ result: 'error'});
        return;
    }

    await pump(image.file, fs.createWriteStream(image.filename));
    reply.status(200).send({ result: 'ok'});
  })
}

export default upload;
