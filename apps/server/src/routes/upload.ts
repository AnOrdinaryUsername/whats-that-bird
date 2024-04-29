import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { FastifyPluginAsync } from "fastify";
import { parse } from 'secure-json-parse';


dotenv.config();


const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

const options = {
    rateLimit: {
        max: 5,
        timeWindow: '24 hours'
    }
};


const upload: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.post('/upload', { config: options }, async function (request, reply) {
        fastify.log.debug(request.headers['x-forwarded-for']);
        fastify.log.debug(request.ip);

        const image = await request.file();

        if (!image) {
            reply
                .status(400)
                .header('Content-Type', 'application/json')
                .send({ result: 'error' });
            return;
        }

        const [_, extension] = image.filename.split('.')
        const filename = `${crypto.randomUUID()}.${extension}`;

        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: filename,
            Body: await image.toBuffer(),
            ContentType: image.mimetype,
        });

        await s3.send(putObjectCommand);

        let model_predictions: RunPodResponse;

        try {
            model_predictions = await runPredictions(filename);
        } catch (error) {
            reply
                .status(500)
                .header('Content-Type', 'application/json')
                .send({ result: 'error', error })

            return;
        }


        if ('output' in model_predictions) {
            const { predictions, url } = model_predictions.output;
            const annotations: Array<Prediction> = parse(predictions);

            // Remove class number and bounding box coordinates from response
            const simplified_details = annotations.map(
                ({ class: a, box: b, ...rest }: Prediction) => rest
            );

            const results = {
                info: simplified_details,
                url
            };

            reply
                .status(200)
                .header('Content-Type', 'application/json')
                .send({ result: 'ok', ...results });
        }
    })
}

interface BoundingBox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

interface Prediction {
    class: number;
    box: BoundingBox;
    confidence: number;
    name: string;
}


interface JobStatus {
    id: string;
    status: string;
}

interface ProcessingTime {
    delayTime: number;
    executionTime: number;
}

interface SuccessResponse extends JobStatus, ProcessingTime {
    output: {
        url: string,
        predictions: string;
    }
}

export interface ErrorResponse extends JobStatus, ProcessingTime {
    error: string;
}

type RunPodResponse = SuccessResponse | ErrorResponse;


async function runPredictions(key: string): Promise<RunPodResponse> {

    const { CLOUDFRONT_URL, RUNPOD_ENDPOINT, RUNPOD_API_KEY } = process.env;

    const url = `https://${CLOUDFRONT_URL}/${key}`;

    const data = {
        input: {
            url
        }
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RUNPOD_API_KEY}`
    }

    const current_run = await fetch(`https://api.runpod.ai/v2/${RUNPOD_ENDPOINT}/run`, {
        method: 'POST',
        headers: new Headers(headers),
        body: JSON.stringify(data)
    });
    const run = await current_run.json() as JobStatus;

    const { id } = run;

    /*
        Since it takes some time to get the prediction results, we have to poll the
        RunPod API until it gives us a result.
    */
    const run_status = () => fetch(`https://api.runpod.ai/v2/${RUNPOD_ENDPOINT}/status/${id}`, {
        headers: new Headers(headers)
    });
    const validate = (result: RunPodResponse) => result.status !== 'COMPLETED';
    const handleError = (result: RunPodResponse) => {
        if ('error' in result) {
            throw new Error(result.error);
        }
    }

    const TWO_SECONDS = 2000;
    const predictions = await poll<RunPodResponse>(run_status, validate, handleError, TWO_SECONDS);

    return predictions;
}


async function poll<T>(
    fn: () => Promise<Response>,
    fnCondition: (res: T) => boolean,
    errorFn: (res: T) => void,
    ms: number
) {
    let response = await fn();
    let result = await response.json() as T;

    while (fnCondition(result)) {
        errorFn(result);
        await wait(ms);
        response = await fn()
        result = await response.json() as T;
    }
    return result;
};


function wait(ms = 1000) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

export default upload;