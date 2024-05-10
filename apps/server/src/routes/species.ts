import { FastifyPluginAsync } from 'fastify'
import { parse } from 'csv-parse';
import fs from 'node:fs';
import { finished } from 'stream/promises';
import path from 'node:path';


async function getBirdSpecies(): Promise<string[]> {
    const birds: string[][] = [];
    
    const parser = fs.createReadStream(path.resolve('california_birds.csv'))
      .pipe(parse({ delimiter: ','}));
    
    parser.on('readable', () => {
        let record: string[]; 
        while ((record = parser.read()) !== null) {
            birds.push(record);
        }
    });

    await finished(parser);

    return birds[0];
}


const birds: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/birds', async function (request, reply) {
        const birds = await getBirdSpecies();

        reply
            .status(200)
            .header('Content-Type', 'application/json')
            .send({ result: 'ok', total: birds.length, birds: birds });
    });

    fastify.get('/birds/count', async function (request, reply) {
        const birds = await getBirdSpecies();

        reply
            .status(200)
            .header('Content-Type', 'application/json')
            .send({ result: 'ok', total: birds.length});
    });

    fastify.get('/birds/:species', async function (request, reply) {
        const { species } = request.params as { species: string};
        const birds = await getBirdSpecies();

        const normalizedBirds = birds.map((bird: string) => bird.toLowerCase());

        const birdExists = normalizedBirds.includes(species.toLowerCase());

        if (birdExists) {
            reply
                .status(200)
                .header('Content-Type', 'application/json')
                .send({ result: 'ok'});
        } else {
            reply
                .status(422)
                .header('Content-Type', 'application/json')
                .send({ 
                    result: 'error', 
                    reason: `${species} is not on the California Bird Records Committee checklist.`
                });
        }
    });
}


export default birds;