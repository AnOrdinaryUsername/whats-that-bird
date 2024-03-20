from ultralytics import YOLO
from runpod import serverless
import json


model = YOLO("best.onnx")


def run_inference(job):
    try:
        url = job["input"]["url"]
    except KeyError:
        return {"error": "URL does not exist."}

    results = model.predict(source=url)

    return results[0].tojson()


serverless.start({"handler": run_inference})
