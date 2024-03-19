# Object Detection using YOLOv8

Python version: 3.10.12

```bash
python3 -m venv venv
```

Activate the virtual environment

```bash
source venv/bin/activate
```

Check location of Python interpreter and make sure its in `venv`

```bash
which python3
```

Install requirements.txt

```bash
python3 -m pip install -r requirements.txt
```

Train a model (after getting dataset from [Kaggle](https://www.kaggle.com/datasets/anamethatiscreative/southern-california-birds))

```bash
python3 ./src/train.py
```

Test model on images in `examples` directory and output prediction results to `results` directory
(doesn't have to exist since the program will create it automatically)

```bash
# Run predictions in examples directory and save output to results directory
python3 ./src/predict.py -f examples results --model ./runs/train/weights/best.pt
# Alternatively, predict on a single image and save results to same directory as image
python3 ./src/predict.py examples/pelican.jpg
```

| Original Image                       | Object Detection                                      |
| ------------------------------------ | ----------------------------------------------------- |
| ![Mallards](/apps/model/examples/pelican.jpg) | ![Mallards with bounding box](/apps/model/examples/pelican_result.jpg) |
