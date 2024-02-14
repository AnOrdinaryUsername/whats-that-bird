import { FastifyPluginAsync } from "fastify";

const ping: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/ping', async function (request, reply) {
    reply
        .status(200)
        .header('Content-Type', 'text/plain')
        .send("pong")
  })
}

export default ping;
