from ultralytics import YOLO
import json
import os
from dotenv import load_dotenv

load_dotenv()

home = os.environ['PROJECT_DIR']
images = ['osprey', 'owl', 'annas', 'mallard', 'pelican']

for bird in images:
    if not os.path.isfile(f"{home}/examples/{bird}.jpg"):
        raise FileNotFoundError(f"File '{home}/examples/{bird}.jpg' does not exist.")

model = YOLO(f'{home}/runs/train2/weights/best.pt')

# Perform object detection on an image using the model
bird_images = [f'{home}/examples/{bird}.jpg' for bird in images]
results = model.predict(bird_images)

for i in range(len(images)):
    result = results[i]

    data = json.loads(result.tojson())
    print(json.dumps(data, indent=2))

    result.save(filename=f'./examples/{images[i]}_result.jpg')

print("\nCompleted predictions")