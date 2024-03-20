from ultralytics import YOLO
import os
from dotenv import load_dotenv


load_dotenv()

home = os.environ["PROJECT_DIR"]
model = YOLO(os.path.join(home, "runs", "train", "weights", "best.pt"))

# ONNX is fairly universally supported, offers good performance, and helps streamline deployment
# See: https://docs.ultralytics.com/integrations/onnx/
model.export(format="onnx", dynamic=True)
