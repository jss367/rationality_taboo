import csv
import json

# Read the CSV file and store the data in a list of dictionaries
with open('/Users/julius/Rationality Taboo - Sheet1.csv', mode='r') as csvfile:
    csv_reader = csv.DictReader(csvfile)
    data = []
    for row in csv_reader:
        word = row['Guess Word']
        taboo_words = row['Taboo Words'].split(', ')
        data.append({"word": word.title(), "forbiddenWords": [x.title() for x in taboo_words]})

# Convert the list of dictionaries to JSON format
json_data = json.dumps(data, indent=2)

# Write the JSON data to a file
with open('words2.json', 'w') as jsonfile:
    jsonfile.write(json_data)