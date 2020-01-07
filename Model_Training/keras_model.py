import librosa
import pandas as pd
import numpy as np
import os
import csv

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

import keras
from classifier import Classifier
import os

from tensorflow.keras.models import Model
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import Activation

# loading data
X, y = Classifier.read_data(os.getcwd() + "\\csv\\train.csv", xy=True)

# transforming data
encoder = LabelEncoder()
scaler = StandardScaler()
X = scaler.fit_transform(X)
y = encoder.fit_transform(y)

X_val = X[:200]
y_val = y[:200]
X_train, X_test, y_train, y_test = train_test_split(X[200:], y[200:], test_size=0.2)

# building the model
model = Sequential()
model.add(Dense(512, activation='relu', input_shape=(X_train.shape[1],)))
model.add(Dense(256, activation='relu'))
model.add(Dense(128, activation='relu'))
model.add(Dense(64, activation='relu'))
model.add(Dense(10, activation='softmax'))

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# training
model.fit(X_train,
          y_train,
          epochs=250,
          batch_size=512,
          validation_data=(X_val, y_val))
results = model.evaluate(X_test, y_test)
print(results)