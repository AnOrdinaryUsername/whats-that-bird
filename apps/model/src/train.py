from ultralytics import YOLO
import json
import os

"""
TODO: Make a flask server that accepts images
        Save image with bounding boxes to AWS bucket
"""

# Load a pretrained YOLO model
model = YOLO('yolov8s.pt')

# Train the model using the 'coco8.yaml' dataset for 3 epochs
model.train(
    data='data.yaml', 
    epochs=100,
    imgsz=256,
    batch=4,
    project=os.path.join(os.getcwd(), 'runs')
)

# Evaluate the model's performance on the validation set
model.val()