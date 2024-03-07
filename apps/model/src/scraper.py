from flickrapi import FlickrAPI
import os
import requests
from dotenv import load_dotenv
from typing import Generator, Any


load_dotenv()


birds = [
    'Mallard', 'American Wigeon', 'Northern Pintail', 'Northern Shoveler', 
    'Cinnamon Teal', 'Ring-necked duck', 'Lesser Scaup', 'Ruddy Duck',
    'Pied-billed Grebe', 'American White Pelican', 'Double-crested Cormorant', 'Black-crowned Night-Heron',
    'Green Heron', 'Snowy Egret', 'Great Egret', 'Great Blue Heron', 
    'Turkey Vulture', 'Osprey', 'Cooper’s Hawk', 'Red-shouldered Hawk',
    'Red-tailed Hawk', 'American Kestrel', 'American Coot', 'Great Horned Owl',
    'Anna’s Hummingbird', 'Allen’s Hummingbird', 'Belted Kingfisher', 'Northern Flicker',
    'Downy Woodpecker', 'Black Phoebe', 'Western Scrub-Jay'
]

images_per_species = 8


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

    api_key = check_env_var('FLICKR_API_KEY')
    secret = check_env_var('FLICKR_SECRET')

    flickr = FlickrAPI(api_key, secret)
    photos = flickr.walk(
        text=image_tag,
        privacy_filter=PUBLIC_PHOTOS,
        per_page=images_per_species,
        sort='relevance'
    )

    return photos


def make_dir(path: str) -> None:
    if not os.path.isdir(path):
        os.makedirs(path)


if __name__=='__main__':
    print("Beginning flickr image scraping")
    
    dataset_dir = 'data'
    make_dir(dataset_dir)

    for bird in birds:
        print(f"\nCreating {bird} directory...")

        bird_dir = os.path.join(os.getcwd(), dataset_dir, bird)
        make_dir(bird_dir)

        photos = get_photos(bird)

        for i, photo in enumerate(photos):
            if i >= images_per_species:
                break

            url = photo.get('url_o')
            
            if not url:
                farm_id = photo.get('farm')
                server = photo.get('server')
                photo_id = photo.get('id')
                secret = photo.get('secret')
                url = f"https://farm{farm_id}.staticflickr.com/{server}/{photo_id}_{secret}.jpg"

            print(f"{i}) {url}")

            image_path = os.path.join(bird_dir, f"{bird}_{i}.jpg")

            with open(image_path, "wb") as file:
                file.write(requests.get(url).content)

            print(f"Saved {bird} image to {image_path}")

    print("\n\nFinished downloading")

            