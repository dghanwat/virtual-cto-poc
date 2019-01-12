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
import os



# create a data structure to hold user context
context = {}
ERROR_THRESHOLD = 0.75
DEFAULT_RESPONSE = 'I am sorry, but I am not aware of this. I am still learning.'
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
class Predict:

    def init(self):
        print("[INFO] Loading Model from disk")
        
        print("Location",__location__)
        self.model = load_model(__location__ + '\\model_ChatBot.h5')
        with open(__location__ + '\\vars.pkl', 'rb') as f:
            self.vocabulary, self.classes, self.ignored, self.kbItems = load(f)
            self.intentsDict = {i['intent']: i['responses'] for i in self.kbItems['kbItems']}

    def __init__(self):
        self.init()

    def loadModel(self):
        self.init()
        
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
        confidence = round(self.model.predict(queryBag)[0][idx], 2)
        if self.model.predict(queryBag)[0][idx] >= ERROR_THRESHOLD:
            print(choice(self.intentsDict[self.classes[idx]]))
            return (choice(self.intentsDict[self.classes[idx]]),confidence,self.classes[idx])
        else:
            return (DEFAULT_RESPONSE,confidence,self.classes[idx])

    