import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { FastifyPluginAsync } from "fastify";

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

const upload: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/upload', async function (request, reply) {
    const image = await request.file();

    if (!image) {
        reply
            .status(400)
            .header('Content-Type', 'application/json')
            .send({ result: 'error'});
        return;
    }

    if (image.file.truncated) {
        console.debug(`Size: ${image.file.bytesRead}`);
        reply.send(new fastify.multipartErrors.FilesLimitError());    
    }

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET, 
        Key: image.filename,
        Body: await image.toBuffer(),
        ContentType: image.mimetype,
    });

    await s3.send(putObjectCommand);

    reply
        .status(200)
        .header('Content-Type', 'application/json')
        .send({ result: 'ok'});
  })
}

export default upload;
