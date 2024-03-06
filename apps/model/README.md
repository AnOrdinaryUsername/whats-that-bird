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

Train a model

```bash
python3 train.py
```

| Original Image                       | Object Detection                                      |
| ------------------------------------ | ----------------------------------------------------- |
| ![Mallards](/apps/model/mallard.jpg) | ![Mallards with bounding box](/apps/model/result.jpg) |
