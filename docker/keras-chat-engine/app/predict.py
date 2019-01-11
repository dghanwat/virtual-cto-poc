import nltk
from nltk import word_tokenize
from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()
from pickle import load
import numpy as np
import random
from tensorflow import keras
from keras.models import load_model
from numpy import array, argmax
from random import choice



# create a data structure to hold user context
context = {}
ERROR_THRESHOLD = 0.75

class Predict:
    def __init__(self):
        print("[INFO] Loading Model from disk")
        self.model = load_model('model_ChatBot.h5')
        with open('vars.pkl', 'rb') as f:
            self.vocabulary, self.classes, self.ignored, self.kbItems = load(f)
            self.intentsDict = {i['intent']: i['responses'] for i in self.kbItems['kbItems']}

    def getQueryFeatures(self,query):
        queryTokens = word_tokenize(query)
        queryStems = sorted(
            list(set([stemmer.stem(w.lower()) for w in queryTokens if w not in self.ignored])))
        queryBag = []
        for w in self.vocabulary:
            queryBag.append(1) if w in queryStems else queryBag.append(0)
        queryBag = array(queryBag)
        return queryBag.reshape(1, len(self.vocabulary))

    def predict(self,sentence):
        queryBag = self.getQueryFeatures(sentence)
        idx = argmax(self.model.predict(queryBag))
        print("Mapped to Intent" , self.classes[idx])
        print("Prediction Probablity", self.model.predict(queryBag)[0][idx])
        if self.model.predict(queryBag)[0][idx] >= ERROR_THRESHOLD:
            print(choice(self.intentsDict[self.classes[idx]]))
        else:
            print("Sorry, I am not able to answer this question")

    