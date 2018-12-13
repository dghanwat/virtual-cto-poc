from nltk import word_tokenize
from nltk.stem.lancaster import LancasterStemmer
from numpy import array, argmax
from keras import models
from pickle import load
from random import choice


with open('vars.pkl', 'rb') as f:
    vocabulary, classes, ignored, intents = load(f)
intentsDict = {i['tag']: i['responses'] for i in intents['intents']}
model = models.load_model('FAQbot_model.h5')
stemmer = LancasterStemmer()


def getQueryFeatures(query):
    queryTokens = word_tokenize(query)
    queryStems = sorted(
        list(set([stemmer.stem(w.lower()) for w in queryTokens if w not in ignored])))
    queryBag = []
    for w in vocabulary:
        queryBag.append(1) if w in queryStems else queryBag.append(0)
    queryBag = array(queryBag)
    return queryBag.reshape(1, len(vocabulary))


def startProcessing():
    # print("Type something to begin...")
    # query = input('Ask me a question? ')
    query = "hello"
    queryBag = getQueryFeatures(query)
    print(model.predict(queryBag)[0])
    print(argmax(model.predict(queryBag)))
    idx = argmax(model.predict(queryBag))
    print(model.predict_proba(queryBag))
    print(choice(intentsDict[classes[idx]]))
   
    


if __name__ == '__main__':
    startProcessing()
