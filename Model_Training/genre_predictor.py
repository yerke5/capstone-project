from classifier import Classifier
from feature_extraction import extract_features
import os
import pandas as pd
import argparse
from sklearn.preprocessing import LabelEncoder
import numpy as np

def main():
	parser = argparse.ArgumentParser()
	parser.add_argument("--model_name", default="SVC", help="The name of the classifier without spaces")
	parser.add_argument("--input_path", default=os.getcwd() + "\\dataset\\genre", help="The folder with audio to classify")
	parser.add_argument("--features_file", default=os.getcwd() + "\\csv\\features.csv", help="The csv file with features")
	parser.add_argument("--features", default=False, help="Whether you have the features already")
	parser.add_argument("--features_output_file", default=os.getcwd() + "\\csv\\features.csv", help="A full path to the features output file")
	parser.add_argument("--labels_output_file", default=os.getcwd() + "\\csv\\labels_output.csv", help="A full path to the output file")
	
	args = parser.parse_args()
	model_name = args.model_name
	input_path = args.input_path
	features = args.features
	features_file = args.features_file
	features_output_file = args.features_output_file
	labels_output_file = args.labels_output_file
	
	
	# 1. get the model
	model = Classifier.load_model(model_name)

	# 2. read the labels
	labels = np.array(pd.read_csv(os.getcwd() + "\\csv\\labels.csv", header=None))
	enc = LabelEncoder()
	encoded_labels = enc.fit_transform(labels)
	
	
	# 3. extract features
	if not features:
		extract_features(input_path, features_output_file, labelled=False)
		x_test = Classifier.read_data(features_output_file, xy=False)
	else:
		x_test = Classifier.read_data(features_file, xy=False)
                
	
	# 4. get predictions
	print("X: ", x_test[0:10])
	y_pred = model.predict(x_test)
	y_pred = enc.inverse_transform(y_pred)
	output = open(labels_output_file, 'w')
	output.write("\n".join(y_pred))
	print(y_pred)
	#print("The accuracy of", model_name, "is", Classifier.calc_accuracy(y_pred, encoded_labels), "%")
	
if __name__ == "__main__":
	main()
