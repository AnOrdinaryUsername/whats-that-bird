from bs4 import BeautifulSoup
import requests
import csv

# List of all Californian birds from the California Bird Records Committee
url = "https://californiabirds.org/checklist.asp"

# Send a GET request to the website
response = requests.get(url)

# Parse the HTML content of the website
soup = BeautifulSoup(response.text, "html.parser")

# Extract all <p> tags with class 'species'
bird_species = soup.find_all("p", class_="species")

birds = []

for bird in bird_species:
    name = [text for text in bird.stripped_strings][0]

    print("Bird species:", name)
    birds.append(name)

# Check to make sure the species count on the website matches the list length
print(f"\nAcquired names of {len(birds)} bird species in California")

# Save all bird species to csv file
with open("california_birds.csv", mode="w+") as file:
    # Create a CSV writer object
    writer = csv.writer(file)
    writer.writerow(birds)

print("\nSaved all species to 'california_birds.csv'")
