import json
import sys
from pathlib import Path


def combine_json_files(input_files, output_path):
    """
    Combine multiple JSON files containing word lists into a single alphabetized file.

    Args:
        input_files (list): List of paths to input JSON files
        output_path (str): Path for the output combined JSON file
    """
    # Initialize empty list for all data
    combined_data = []

    # Read all input files
    for file_path in input_files:
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                combined_data.extend(data)
                print(f"Successfully loaded {file_path}")
        except FileNotFoundError:
            print(f"Warning: File {file_path} not found, skipping...")
        except json.JSONDecodeError:
            print(f"Warning: File {file_path} is not valid JSON, skipping...")

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
    try:
        with open(output_path, 'w') as outfile:
            json.dump(sorted_data, outfile, indent=2, ensure_ascii=False)
            print(f"\nSuccessfully combined {len(input_files)} files.")
            print(f"Combined JSON saved to {output_path}")
            print(f"Total unique entries: {len(sorted_data)}")
    except Exception as e:
        print(f"Error writing output file: {e}")


def main():
    # Get all json files in current directory that start with 'words'
    input_files = sorted(Path('.').glob('words*.json'))

    if not input_files:
        print("No input files found. Please ensure files are named 'words1.json', 'words2.json', etc.")
        return

    # Convert Path objects to strings and print found files
    input_files = [str(f) for f in input_files]
    print("Found input files:", ", ".join(input_files))

    output_path = 'combined_words.json'
    combine_json_files(input_files, output_path)


if __name__ == "__main__":
    main()
