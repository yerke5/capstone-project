from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn import linear_model
from sklearn import ensemble
from sklearn import neighbors
from sklearn.externals import joblib
import os
import timeit
import random
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import pickle
from warnings import simplefilter
from matplotlib import style
import argparse
from sklearn import svm
from sklearn.preprocessing import LabelBinarizer, LabelEncoder
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.gaussian_process import GaussianProcessClassifier
from sklearn.gaussian_process.kernels import RBF
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.naive_bayes import GaussianNB

import sys
sys.path.insert(0, os.getcwd() + '\\data_processing\\')

style.use("seaborn-ticks")
simplefilter(action='ignore', category=FutureWarning)

SEPARATOR = "\\"

class Classifier:
	
	COLS = []
	GRAPH_DIR = "graphs"
	PICKLE_DIR = "pickle"
	SEPARATOR = "\\"
	pklExt = 'pkl'
	encoder = None
	
	@classmethod
	def read_data(cls, path, xy=False):
		data = pd.read_csv(path)
		
		#rearrange columns
		cols = data.columns.tolist()
		#print("COLS", cols)
		if 'class' in cols:
			cols.remove('class')
		if 'id' in cols:
			cols.remove('id')
		if 'song_name' in cols:
			cols.remove('song_name')
		if 'filename' in cols:
			cols.remove('filename')
		
		data = data[cols]
		cls.COLS = data.columns.tolist()
		
		x = data.iloc[:, :-1]
		y = data.iloc[:, -1]
		
		if xy:
			return np.array(x), np.array(y)
		return np.array(data)
		
	@classmethod
	def calc_accuracy(cls, original, predicted):
		valid = 0
		for i in range(len(original)):
			if original[i] == predicted[i]:
				valid += 1
		return round(valid * 100 / len(original), 2)

	@classmethod
	def init_plot(cls, num_plots):
		axes = []
		figs = []
		for i in range(num_plots):
			temp_fig, temp_ax = plt.subplots()
			figs.append(temp_fig)
			axes.append(temp_ax)    
		return figs, axes

	@classmethod
	def set_titles(cls, axis, ylabel, xlabel, title):
		axis.set_ylabel(ylabel)
		axis.set_xlabel(xlabel)
		axis.set_title(title)

	@classmethod
	def plot(cls, axis, arr, lb='', color=''):
		axis.plot(arr, color, label=lb)
		axis.legend()
		
	@classmethod
	def save_plot(cls, fig, here):
		fig.savefig(here)

	@classmethod
	def save_model(cls, model, model_name, protocol=3, alg='pickle'):
		if alg == 'pickle':
			pickle.dump(model, open(cls.PICKLE_DIR + cls.SEPARATOR + model_name + "." + cls.pklExt, 'wb'), protocol=protocol)
		elif alg == 'joblib':
			joblib.dump(model, cls.PICKLE_DIR + cls.SEPARATOR + model_name + "_joblib." + cls.pklExt)

	@classmethod
	def load_model(cls, model_name):
		return pickle.load(open(cls.PICKLE_DIR + cls.SEPARATOR + model_name + "." + cls.pklExt, 'rb'))

	@classmethod
	def get_regressor_by_name(cls, model_name):
		if model_name == "ARDRegression":
			return linear_model.ARDRegression()
		if model_name == "TheilSenRegressor":
			return linear_model.TheilSenRegressor()
		if model_name == "PassiveAggressiveRegressor":
			return linear_model.PassiveAggressiveRegressor()
		if model_name == "SGDRegressor":
			return linear_model.SGDRegressor()
		if model_name == "LinearRegression":
			return linear_model.LinearRegression()
		if model_name == "BayesianRidge":
			return linear_model.BayesianRidge()
		if model_name == "LassoLars":
			return linear_model.LassoLars()
		if model_name == "RandomForestRegressor":
			return ensemble.RandomForestRegressor()
		if model_name == "GradientBoostingRegressor":
			return ensemble.GradientBoostingRegressor()
		if model_name == "SVR":
			return svm.SVR()
	
	@classmethod
	def get_model_by_name(cls, model_name):
		if model_name == "RFC":
			return RandomForestClassifier()
		if model_name == "GBC":
			return ensemble.GradientBoostingClassifier()
		if model_name == "SVCL":
			return svm.SVC(kernel="linear", C=0.025)
		if model_name == "SVC":
			return svm.SVC(gamma=2, C=1)
		if model_name == "PAC":
			return linear_model.PassiveAggressiveClassifier()
		if model_name == "ARD":
			return linear_model.ARDClassifier()
		if model_name == "TSC":
			return linear_model.TheilSenClassifier()
		if model_name == "SGD":
			return linear_model.SGDClassifier()
		if model_name == "DTC":
			return DecisionTreeClassifier()
		if model_name == "KNC":
			return KNeighborsClassifier(3)
		if model_name == "GPC":
			return GaussianProcessClassifier(1.0 * RBF(1.0))
		if model_name == "MLP":
			return MLPClassifier(alpha=1, max_iter=1000)
		if model_name == "ABC":
			return AdaBoostClassifier()
		if model_name == "GNB":
			return GaussianNB()   
		if model_name == "SVCP":
			return svm.SVC(kernel="poly")
		if model_name == "SVCS":
			return svm.SVC(kernel="sigmoid")
		
	@classmethod
	def compare_models(cls, X_test, y_test, model_names=None, train_data=None, iters=50, protocol=3, alg='pickle'):
		
		colors = ['#0000FF', '#00FF00', '#FF0000', '#00FFFF', '#FF00FF', '#FFFF00']

		if model_names is None:
			model_names = [
				#"SGDRegressor", 
				#"BayesianRidge", 
				#"LassoLars", 
				#"ARDRegression", 
				#"PassiveAggressiveRegressor", 
				#"LinearRegression", 
				#"TheilSenRegressor"
				"RFC",
				"GBC",
				"KNC",
				"SVCL",
				"SVC",
				"SVCP",
				"DTC",
				"MLP",
				"ABC",
				"GNB"
			]
			
		num_models = len(model_names)

		print("This program compares " + str(num_models) + " different machine learning regression models, namely: ")
		for model_name in model_names:
			print(model_name)
		print("*" * 100)
		figs, axes = cls.init_plot(num_models + 2)

		model_index = 0
		# for each model
		for i in range(len(model_names)):
			accuracies = []
			
			# train once
			if not train_data is None:		
				train_again = train_data["train_again"]
			
			new = train_again or not os.path.exists(model_names[i] + cls.pklExt)
			if new:
				print(model_names[i])
				model = cls.train(model_names[i], train_data)
				cls.save_model(model, model_names[i], protocol=protocol, alg=alg)
			else:
				model = cls.load_model(model_names[i], protocol=protocol)
				
			# test it {iters} times
			for j in range(iters):
				
				y_pred = model.predict(X_test)

				# stats
				accuracy = cls.calc_accuracy(y_test, cls.encoder.inverse_transform(y_pred))
				accuracies.append(accuracy)
				print(str(j + 1) + ".",  str(accuracy) + '%')
				print()

			# plot accuracy scores of the current model
			cls.set_titles(axes[model_index], "Accuracy Scores", "Iterations", model_names[i])
			cls.plot(axes[model_index], accuracies, lb="Average accuracy: " + str(round(sum(accuracies) / len(accuracies), 2)), color=colors[model_index % len(colors)])
			cls.save_plot(figs[model_index], cls.GRAPH_DIR + SEPARATOR + model_names[i] + ".png") 
			model_index += 1

	@classmethod
	def print_results(cls, model, xTest, yPred, yTest=None):
		print(model)
		dataset = pd.DataFrame(data=xTest)
		dataset.columns = cls.COLS.copy()[:-1]
		predictedLabels = cls.encoder.inverse_transform(yPred)
		if yTest is not None:
			dataset["Correct" + cls.COLS[-1]] = yTest
		dataset["Estimated " + cls.COLS[-1]] = predictedLabels
		print("*" * 100)
		print(dataset)

	@classmethod
	def run(cls, X_test, y_test=None, train_data=None, model_name="SVC", alg='pickle', protocol=3):
		
		if not train_data is None:		
			train_again = train_data["train_again"]
		
		new = train_again or not os.path.exists(model_name + cls.pklExt)
		if new:
			print("Started training", model_name)
			model = cls.train(model_name, train_data)
			print("Finished training")
			print()
		else:
			model = cls.load_model(model_name, protocol=protocol)
		y_pred = model.predict(X_test)
		#cls.print_results(model_name, X_test, y_pred, yTest=y_test)
		if new:
			cls.save_model(model, model_name, protocol=protocol, alg=alg)
		#cls.get_importances(model, X_test
		return np.round(y_pred).astype(int)

	@classmethod
	def train(cls, model_name, train_data):
	
		X_train = train_data["X_train"]
		y_train = train_data["y_train"]
		
		cls.encoder = LabelEncoder()
		y_train = cls.encoder.fit_transform(y_train)
		
		model = cls.get_model_by_name(model_name)
		model.fit(X_train, y_train)
		return model
	
	@classmethod
	def get_importances(cls, model, x):
		if model.__class__.__name__ != "RandomForestRegressor":
			return False
		importances = model.feature_importances_
		indices = np.argsort(importances)[::-1]
		feature_names = cls.COLS.copy() 
		f, ax = plt.subplots(figsize=(11, 9))
		plt.title("Feature ranking", fontsize = 20)
		plt.bar(range(x.shape[1]), importances[indices], color="b", align="center")
		plt.xticks(range(x.shape[1]), feature_names, rotation='vertical') # indices instead of feature_names
		plt.xlim([-1, x.shape[1]])
		plt.ylabel("importance", fontsize = 18)
		plt.xlabel("index of the feature", fontsize = 18)
		plt.show()
		# list feature importance
		important_features = pd.Series(data=model.feature_importances_,index=x.columns)
		important_features.sort_values(ascending=False,inplace=True)
		print(important_features.head(10))

if __name__ == "__main__":
	parser = argparse.ArgumentParser()
	parser.add_argument("--test_file", default=os.getcwd() + "\\csv\\test.csv", help="Where is the .csv testing file?")
	parser.add_argument("--train_file", default=os.getcwd() + "\\csv\\train.csv", help="Where is the .csv training file?")
	args = parser.parse_args()
	test_file = args.test_file
	train_file = args.train_file
	
	#Classifier.compare_models(test_file=test_file, train_file=train_file, train_again=True)
	
	#X_train, y_train = Classifier.read_data(train_file, xy=True)
	#print("train X shape", X_train.shape)
	#print("train Y shape", y_train.shape)
	#X_test, y_test = Classifier.read_data(test_file, xy=True)
	#print("test X shape", X_test.shape)
	
	#print("DATA IS RIGHT HERE")
	#print(X_test)
	#Classifier.train("GradientBoostingClassifier", train_file)
	
	'''Classifier.run(
		X_test, 
		y_test=y_test, 
		model_name="GradientBoostingClassifier", 
		train_again=True, 
		train_file=train_file, 
		protocol=3, 
		alg='joblib'
	)'''
	
	# first, test with an external dataset
	#Classifier.compare_models(train_file=train_file, test_file=test_file, train_again=False)
	
	# next, try to get test data from the training dataset
	X, y = Classifier.read_data(train_file, xy=True);
	X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
	
	train_data = {
		"X_train": X_train,
		"y_train": y_train,
		"train_again": False
	}
	
	model_names = ["GBC", "DTC", "SVCL", "SVC", "RFC", "KNC", "MLP", "ABC", "GNB", "SVCS"]
	
	Classifier.compare_models(X_test, y_test, train_data=train_data, model_names=model_names, iters=5)