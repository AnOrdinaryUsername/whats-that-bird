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

In another terminal window, scrape images from Flickr (or download it [here](https://www.kaggle.com/datasets/anamethatiscreative/southern-california-birds))

```sh
cd apps/model && python3 ./src/scraper.py
```

Annotate and label it (or download it [here](https://www.kaggle.com/datasets/anamethatiscreative/blah-blah))

Train the model

```bash
python3 ./src/train.py
```