from ultralytics import YOLO
import json
import os

"""
TODO: Make a flask server that accepts images
        Save image with bounding boxes to AWS bucket
"""

# Load a pretrained YOLO model
model = YOLO("yolov8s.pt")

# Train the model using bird dataset from roboflow
model.train(
    data="data.yaml",
    epochs=200,
    batch=16,
    project=os.path.join(os.getcwd(), "runs"),
)

# Evaluate the model's performance on the validation set
model.val()
