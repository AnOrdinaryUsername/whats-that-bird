from flickrapi import FlickrAPI
import os
import requests
from dotenv import load_dotenv
from typing import Generator, List, Any
import click
import csv
import itertools
import asyncio
import filetype

load_dotenv()
images_per_species = 100


class MissingEnvironmentVariable(Exception):
    pass


def check_env_var(var: str) -> str:
    try:
        env_var = os.environ[var]
    except KeyError:
        raise MissingEnvironmentVariable(
            f"Missing environment variable: {var}. "
            "Make sure to add your Flickr API key and Secret to .env file. "
            "See .env.example for .env format."
        )

    return env_var


def get_photos(image_tag: str) -> Generator[Any, Any, None]:
    PUBLIC_PHOTOS = 1
    PHOTOS_ONLY = 0

    api_key = check_env_var("FLICKR_API_KEY")
    secret = check_env_var("FLICKR_SECRET")

    flickr = FlickrAPI(api_key, secret)

    """
    All license values according to flickr.photos.licenses.getInfo.
    See: https://www.flickr.com/services/api/flickr.photos.licenses.getInfo.htm

    <licenses>
        <license id="0" name="All Rights Reserved" url="" />
        <license id="4" name="Attribution License" url="https://creativecommons.org/licenses/by/2.0/" />
        <license id="6" name="Attribution-NoDerivs License" url="https://creativecommons.org/licenses/by-nd/2.0/" />
        <license id="3" name="Attribution-NonCommercial-NoDerivs License" url="https://creativecommons.org/licenses/by-nc-nd/2.0/" />
        <license id="2" name="Attribution-NonCommercial License" url="https://creativecommons.org/licenses/by-nc/2.0/" />
        <license id="1" name="Attribution-NonCommercial-ShareAlike License" url="https://creativecommons.org/licenses/by-nc-sa/2.0/" />
        <license id="5" name="Attribution-ShareAlike License" url="https://creativecommons.org/licenses/by-sa/2.0/" />
        <license id="7" name="No known copyright restrictions" url="https://www.flickr.com/commons/usage/" />
        <license id="8" name="United States Government Work" url="http://www.usa.gov/copyright.shtml" />
        <license id="9" name="Public Domain Dedication (CC0)" url="https://creativecommons.org/publicdomain/zero/1.0/" />
        <license id="10" name="Public Domain Mark" url="https://creativecommons.org/publicdomain/mark/1.0/" />
    </licenses>
    """
    photos = flickr.walk(
        text=f"{image_tag} -plane -aircraft -military -art -cat -dog",
        privacy_filter=PUBLIC_PHOTOS,
        per_page=images_per_species,
        sort="relevance",
        license="1,2,3,4,5,6,7,8,9,10",
        content_types=PHOTOS_ONLY,
    )

    return photos


def get_bird_species() -> List[str]:
    csv_file_path = "california_birds.csv"

    rows = []

    with open(csv_file_path, mode="r") as file:
        reader = csv.reader(file)
        rows.extend(reader)

    flat_list = list(itertools.chain(*rows))

    return flat_list


def get_total_photos(image_tag: str) -> int:
    """
    Perform the initial search to get the total number of photos.

    NOTE: The total photos count changes with every call, even with
    the same inputs.

    I am not sure why, but you can test it here yourself:
    https://www.flickr.com/services/api/explore/flickr.photos.search
    """
    PUBLIC_PHOTOS = 1
    PHOTOS_ONLY = 0

    api_key = check_env_var("FLICKR_API_KEY")
    secret = check_env_var("FLICKR_SECRET")

    flickr = FlickrAPI(api_key, secret, format="parsed-json")

    # Set your search parameters
    search_params = {
        "text": f"{image_tag} -plane -aircraft -military -art -cat -dog",
        "privacy_filter": PUBLIC_PHOTOS,
        "per_page": images_per_species,
        "sort": "relevance",
        "license": "1,2,3,4,5,6,7,8,9,10",
        "content_types": PHOTOS_ONLY,
    }

    search_result = flickr.photos.search(**search_params)
    total = search_result["photos"]["total"]

    return total


def make_dir(path: str) -> None:
    if not os.path.isdir(path):
        os.makedirs(path)


def background(f):
    def wrapped(*args, **kwargs):
        return asyncio.get_event_loop().run_in_executor(None, f, *args, **kwargs)

    return wrapped


@background
def download(url: str, bird_dir: str, bird: str, i: int) -> None:
    response = requests.get(url)
    file_name = f"{bird}_{i}.jpg"
    image_path = os.path.join(bird_dir, file_name)

    if response.status_code == 200:
        with open(image_path, "wb") as file:
            file.write(response.content)


def check_broken_images(root_path):
    broken_images = []

    for _, dirs, _ in os.walk(root_path, topdown=False):
        for bird in dirs:
            bird_dir = os.path.join(root_path, bird)

            for file in os.listdir(bird_dir):
                if not filetype.is_image(os.path.join(bird_dir, file)):
                    broken_images.append(bird)
                    break

    return broken_images


def check_empty_dirs(root_path) -> List[str]:
    empty_dirs = []

    for _, dirs, _ in os.walk(root_path, topdown=False):
        for bird in dirs:
            bird_dir = os.path.join(root_path, bird)

            if not os.listdir(bird_dir):
                empty_dirs.append(bird)

    return empty_dirs


def generate_dataset(dir_name: str, birds: List[str]) -> None:
    make_dir(dir_name)

    # If there isn't enough photos for data collection,
    # we don't create a class for them
    excluded_species = []
    INSUFFICIENT_DATA = 40

    for bird in birds:

        total = get_total_photos(bird)

        if total < INSUFFICIENT_DATA:
            click.echo(
                click.style(
                    f"\nInsufficient data for '{bird}'. Skipping downloads...",
                    fg="red",
                ),
            )

            with open("excluded_species.txt", "a") as file:
                file.write(f"Species: {bird}, Images available: {total}\n")

            excluded_species.append(bird)
            continue

        photos = get_photos(bird)

        click.echo(click.style(f"\nCreating {bird} directory...", fg="yellow"))

        bird_dir = os.path.join(os.getcwd(), dir_name, bird)
        make_dir(bird_dir)

        tasks = []

        for i, photo in enumerate(photos):
            if i >= images_per_species:
                break

            url = photo.get("url_o")

            if not url:
                farm_id = photo.get("farm")
                server = photo.get("server")
                photo_id = photo.get("id")
                secret = photo.get("secret")
                url = f"https://farm{farm_id}.staticflickr.com/{server}/{photo_id}_{secret}.jpg"

            # Uses cooperative multitasking for fast downloads
            task = download(url, bird_dir, bird, i)
            tasks.append(task)

        asyncio.get_event_loop().run_until_complete(asyncio.wait(tasks))

    root = os.path.join(os.getcwd(), dir_name)
    empty_dirs = check_empty_dirs(root)

    if empty_dirs:
        click.echo(
            click.style(
                f"Detected {len(empty_dirs)} empty bird directories. Retrying download...",
                fg="red",
            ),
        )
        generate_dataset(empty_dirs)

    broken_images = check_broken_images(root)

    if broken_images:
        click.echo(
            click.style(
                f"Found broken images in {len(broken_images)} bird directories. Retrying download...",
                fg="red",
            ),
        )
        generate_dataset(broken_images)

    click.echo(click.style("\nFinished downloading", fg="green"))

    if len(excluded_species) > 0:
        click.echo(
            click.style(
                "Excluded the following species due to lack of data:",
                fg="red",
            ),
        )

        print(*excluded_species, sep="\n")


if __name__ == "__main__":
    click.echo(
        click.style(
            "Beginning flickr image scraping",
            fg="cyan",
        )
    )

    dataset_dir = "data"
    birds = get_bird_species()

    generate_dataset(dataset_dir, birds)

    asyncio.get_event_loop().close()
