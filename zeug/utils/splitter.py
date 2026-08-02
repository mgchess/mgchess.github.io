import csv
import os
import math

INPUT_FILE = "lichess_db_puzzle.csv"
OUTPUT_DIR = "split_puzzles"
NUMBER_OF_FILES = 1000

def count_rows(filename):
    with open(filename, "r", encoding="utf-8") as f:
        return sum(1 for _ in f) - 1   # ohne Kopfzeile

def split_csv():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("Zähle Zeilen...")
    total_rows = count_rows(INPUT_FILE)
    print("Datensätze:", total_rows)
    rows_per_file = math.ceil(
        total_rows / NUMBER_OF_FILES
    )
    print(
        "Zeilen pro Datei:",
        rows_per_file
    )
    with open(
        INPUT_FILE,
        "r",
        encoding="utf-8",
        newline=""
    ) as infile:
        reader = csv.reader(infile)
        header = next(reader)
        file_number = 1
        row_count = 0
        outfile = None
        writer = None
        for row in reader:
            if row_count % rows_per_file == 0:
                if outfile:
                    outfile.close()
                filename = os.path.join(
                    OUTPUT_DIR,
                    f"puzzles_{file_number:04}.csv"
                )
                outfile = open(
                    filename,
                    "w",
                    encoding="utf-8",
                    newline=""
                )
                writer = csv.writer(outfile)
                writer.writerow(header)
                print(
                    "Erstelle:",
                    filename
                )
                file_number += 1
            writer.writerow(row)
            row_count += 1
        if outfile:
            outfile.close()
    print("Fertig!")

if __name__ == "__main__":
    split_csv()
