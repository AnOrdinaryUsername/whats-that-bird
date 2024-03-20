FROM runpod/base:0.4.0-cuda11.8.0

WORKDIR /
COPY . .

# Install dependencies and get the latest model from GH releases
RUN python3.11 -m pip install -r requirements.txt --no-cache-dir  && \
    rm requirements.txt && \
    wget https://github.com/AnOrdinaryUsername/whats-that-bird/releases/download/v1.0.0/best.onnx

CMD python3.11 -u /inference.py
