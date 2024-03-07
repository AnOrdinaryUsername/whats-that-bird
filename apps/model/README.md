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

Train a model (after getting dataset from roboflow)

```bash
python3 ./src/train.py
```

| Original Image                       | Object Detection                                      |
| ------------------------------------ | ----------------------------------------------------- |
| ![Mallards](/apps/model/examples/owl.jpg) | ![Mallards with bounding box](/apps/model/examples/result.jpg) |
