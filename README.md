# whats-that-bird

Download [pnpm](https://pnpm.io/installation) and [Node.js](https://nodejs.org/en/download)
then run the following commands in your terminal.

Recursively install dependencies

```sh
pnpm i -r
```

Start the fastify and Next server

```sh
pnpm exec lerna run dev
```

Open [http://localhost:3000](http://localhost:3000) for fastify back-end  
Open [http://localhost:8000](http://localhost:8000) for Next front-end

In another terminal window, scrape images from Flickr

```sh
cd apps/model && python3 ./src/scraper.py
```

Go to roboflow, start a new project, upload images, annotate them, and export the dataset.  

[Bird dataset](https://universe.roboflow.com/kyle-masa-vvvcu/southern-california-birds)

Train the model

```bash
python3 ./src/train.py
```