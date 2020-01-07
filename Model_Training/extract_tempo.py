import librosa
import numpy as np
import pandas as pd
from os import listdir
from os.path import isfile, join
import csv

def extract_tempo(path_to_song):
	y, sr = librosa.load(path_to_song, offset=60, duration=60)
	tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
	return tempo
	
def main():
	path = "./test_audio"
	output = "tempos.csv"
	files = [f for f in listdir(path) if isfile (join(path, f))]
	output_file = open(output, 'a')
	writer = csv.writer(output_file)
	writer.writerow(["filename", "tempo", "label"])
	
	count = 0
	for f in files:
		tempo = extract_tempo(path + "\\" + f)
		count += 1
		print(count, "files processed")
		if tempo < 108:
			label = "slow"
		elif tempo >= 108 and tempo < 120:
			label = "medium"
		else:
			label = "fast"
		writer.writerow([f, tempo, label])
	
if __name__ == "__main__":
	main()