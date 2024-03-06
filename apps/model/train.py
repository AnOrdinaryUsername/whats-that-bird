from ultralytics import YOLO
import json
import os

"""
TODO: Make a flask server that accepts images
        Create and annotate own dataset
        Transfer learning stuff
        Save image with bounding boxes to AWS bucket
"""

model = None

# Load a pretrained YOLO model
model = YOLO('yolov8n.pt')

# Train the model using the 'coco8.yaml' dataset for 3 epochs
model.train(
    data='coco8.yaml', 
    epochs=3, 
    imgsz=640, 
    project=os.path.join(os.getcwd(), 'runs')
)

# Evaluate the model's performance on the validation set
model.val()

# Export model to ONNX (up to 3x CPU speedup)
# See: https://docs.ultralytics.com/modes/export/#key-features-of-export-mode
model_path = model.export(format='onnx', int8=True, dynamic=True)

print("Loading YOLO model...")
model = YOLO(model_path)

# Perform object detection on an image using the model
results = model('mallard.jpg')

for result in results:
    data = json.loads(result.tojson())
    print(json.dumps(data, indent=2))
    result.save(filename='result.jpg')

print("Result file saved")