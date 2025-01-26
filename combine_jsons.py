import json


def combine_json_files(file1_path, file2_path, output_path):
    # Read the first JSON file
    with open(file1_path, 'r') as f1:
        data1 = json.load(f1)

    # Read the second JSON file
    with open(file2_path, 'r') as f2:
        data2 = json.load(f2)

    # Combine the lists
    combined_data = data1 + data2

    # Create a set of words to check for duplicates
    word_set = set()
    unique_entries = []

    # Remove duplicates while preserving the entry with more forbidden words
    for entry in combined_data:
        word = entry['word'].lower()
        if word in word_set:
            # Find existing entry
            existing_entry = next(x for x in unique_entries if x['word'].lower() == word)
            # Keep entry with more forbidden words
            if len(entry['forbiddenWords']) > len(existing_entry['forbiddenWords']):
                unique_entries.remove(existing_entry)
                unique_entries.append(entry)
        else:
            word_set.add(word)
            unique_entries.append(entry)

    # Sort alphabetically by word
    sorted_data = sorted(unique_entries, key=lambda x: x['word'].lower())

    # Write to output file
    with open(output_path, 'w') as outfile:
        json.dump(sorted_data, indent=2, ensure_ascii=False)

    print(f"Combined JSON saved to {output_path}")
    print(f"Total entries: {len(sorted_data)}")


# Usage
if __name__ == "__main__":
    combine_json_files('words1.json', 'words2.json', 'combined_words.json')
