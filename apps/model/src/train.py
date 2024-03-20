from ultralytics import YOLO
from dotenv import load_dotenv
import os


load_dotenv()
home = os.environ["PROJECT_DIR"]

# Good middleground between inference speed and prediction accuracy
model = YOLO("yolov8m.pt")

# Previously used 2x RTX 4090 to train model 
# (takes ~13 hours at 10 epochs per hour)
result = model.train(
    data=os.path.join(home, "data.yaml"),
    epochs=125,
    device=[0, 1],
    cache=True,
    batch=80,
    save_period=5,
)

# Validate the model
model = YOLO(os.path.join(home, "runs", "train", "weights", "best.pt"))
model.val()
