from ultralytics import YOLO
import json
import os
from dotenv import load_dotenv

load_dotenv()

home = os.environ['PROJECT_DIR']

# Load a pretrained YOLO model
model = YOLO(f'{home}/runs/train/weights/best.pt')

# Perform object detection on an image using the model
results = model('./examples/owl.jpg')

for result in results:
    data = json.loads(result.tojson())
    print(json.dumps(data, indent=2))
    result.save(filename='./examples/result.jpg')

print("Result file saved")