# things we need for NLP
import nltk
# nltk.download('punkt')
from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()

import numpy as np
import random

from tensorflow import keras
from keras.models import Sequential
from keras.layers import Dense, Activation
from keras import utils
from keras import layers
import matplotlib.pyplot as plt
from keras.optimizers import SGD
import json
from pickle import dump
import os


EPOCHS = 1000
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
class Training:

    def __init__(self):
        print("In constructor")
        self.ignored = ['?']
        
    def train(self,dbKBItems):
        # with open('intents.json') as json_data:
        kbItems = json.loads(dbKBItems)
        words = []
        classes = []
        documents = []
        ignore_words = ['?']
        # loop through each sentence in our intents patterns
        for kbItem in kbItems['kbItems']:
            for pattern in kbItem['patterns']:
                # tokenize each word in the sentence
                w = nltk.word_tokenize(pattern)
                # add to our words list
                words.extend(w)
                # add to documents in our corpus
                documents.append((w, kbItem['intent']))
                # add to our classes list
                if kbItem['intent'] not in classes:
                    classes.append(kbItem['intent'])

                # stem and lower each word and remove duplicates
                words = [stemmer.stem(w.lower()) for w in words if w not in ignore_words]
                words = sorted(list(set(words)))

                # remove duplicates
                classes = sorted(list(set(classes)))

        print (len(documents), "documents")
        print (len(classes), "classes", classes)
        print (len(words), "unique stemmed words", words)

        # create our training data
        training = []
        output = []
        # create an empty array for our output
        output_empty = [0] * len(classes)

        # training set, bag of words for each sentence
        for doc in documents:
            # initialize our bag of words
            bag = []
            # list of tokenized words for the pattern
            pattern_words = doc[0]
            # stem each word
            pattern_words = [stemmer.stem(word.lower()) for word in pattern_words]
            # create our bag of words array
            for w in words:
                bag.append(1) if w in pattern_words else bag.append(0)

            # output is a '0' for each tag and '1' for current tag
            output_row = list(output_empty)
            #print(classes.index(doc[1]))
            output_row[classes.index(doc[1])] = 1

            training.append([bag, output_row])

        # shuffle our features and turn into np.array
        random.shuffle(training)
        training = np.array(training)

        # create train and test lists
        train_x = list(training[:,0])
        train_y = list(training[:,1])

        model = Sequential()
        model.add(Dense(8, input_shape=[len(train_x[0],)]))
        model.add(Dense(8))
        model.add(Dense(8))
        model.add(Dense(len(train_y[0]), activation='softmax'))
        print("INFO training network")
        model.summary()
        sgd = SGD(0.01)
        model.compile(loss="categorical_crossentropy",optimizer=sgd,metrics=["accuracy"])
        H = model.fit(np.array(train_x), np.array(train_y), epochs=EPOCHS, batch_size=8)

        
        plt.style.use("ggplot")
        plt.figure()
        plt.plot(np.arange(0, EPOCHS), H.history["loss"], label="train_loss")
        plt.plot(np.arange(0, EPOCHS), H.history["acc"], label="train_acc")
        plt.title("Training Loss and Accuracy")
        plt.xlabel("# Epoch")
        plt.ylabel("Loss/Accuracy")
        plt.legend()
        plt.savefig(__location__ + "fig.png")

        model.save(__location__ + '//model_ChatBot.h5')
        with open(__location__ + '//vars.pkl', 'wb') as f:
            dump([words, classes, self.ignored, kbItems], f)
