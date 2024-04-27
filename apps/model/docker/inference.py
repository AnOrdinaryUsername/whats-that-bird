from ultralytics import YOLO
from runpod import serverless
from dotenv import load_dotenv
import uuid
import boto3
import os


load_dotenv()
model = YOLO("best.onnx")


def run_inference(job):
    try:
        url = job["input"]["url"]
    except KeyError:
        return {"error": "URL does not exist."}

    # Generate url to save in S3 bucket
    file_name = f'{uuid.uuid4()}.png'

    # Run prediction on uploaded image
    results = model.predict(source=url)

    # Load credentials to S3 bucket
    s3 = boto3.client('s3', 
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'], 
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'], 
        region_name=os.environ['AWS_REGION']
    )

    bucket_name = os.environ['AWS_BUCKET']
    cloudfront_url = os.environ['CLOUDFRONT_URL']

    # Save file with annotations
    results[0].save(filename=file_name)

    url = f'https://{cloudfront_url}/{file_name}'

    # Upload file to S3 bucket
    s3.upload_file(f'./{file_name}', Bucket=bucket_name, Key=file_name)

    # Delete local file with annotations
    try:
        os.remove(file_name)
    except OSError:
        pass

    return { 'url': url, 'predictions': results[0].tojson() }


serverless.start({"handler": run_inference})
