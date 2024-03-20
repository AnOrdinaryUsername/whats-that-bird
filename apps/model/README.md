# Object Detection using YOLOv8

## Running It Locally

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

Get the bird list from the [California Bird Records Committee](https://californiabirds.org/checklist.asp)

```bash
python3 ./src/bird_list.py
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

## Deploying to RunPod



[Create a repository on Docker Hub](https://docs.docker.com/docker-hub/repos/create/#create-a-repository)

Change directory to `docker/`

```sh
cd docker
```

Login to Docker to push to Docker Hub

```sh
docker login --username=<your-username>
```

Build a Docker image

```sh
docker build . -t <hub-user>/<repo-name>
```

Push to Docker Hub

```sh
docker push <hub-user>/<repo-name>
```

Then follow this [guide](https://blog.runpod.io/serverless-create-a-basic-api/) 
starting at `RunPod Serverless Template`.

After it finishes initialization, you can now interact with the endpoints. 
