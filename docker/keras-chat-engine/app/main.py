from train import Training
from predict import Predict
from rabbitmq.publisher import Publisher
from rabbitmq.consumer import Consumer
import json
import os
from mongodb.dao import MongoDBDAO
import logging
logging.basicConfig(level=logging.INFO)
from analytics.chatbasepublisher import ChatBasePublisher


publisher = Publisher()
chatbasepublisher = ChatBasePublisher()


training = Training()
predict = Predict()
ERROR_THRESHOLD = 0.75

def processTraining():
    mongoDBDAO = MongoDBDAO()
    kbItems = mongoDBDAO.selectAllKBItems()
    training.train(kbItems)
    predict.loadModel()
    print("[INFO] Training Completed")

def handleRabbitMQMessage(ch, method, properties, body):
    print(" [x] %r" % body)
    incomingMessage = json.loads(body)
    print("Message Type is %r" % incomingMessage["messageType"])
    print("Properties %r" % properties.correlation_id )
    if incomingMessage["messageType"] == "train":
        processTraining()
    elif incomingMessage["messageType"] == "chat":
        try:
            (chatResponse,confidence,intent) = predict.predict(incomingMessage["message"])
            if confidence >= ERROR_THRESHOLD:
                json_response = json.dumps({'response': {"text": chatResponse, "in_response_to": [], "extra_data": {},"intent":intent}, 'confidence': confidence.item()})
                chatbasepublisher.publish(incomingMessage["message"],chatResponse,False,incomingMessage["userId"],intent)
                print("******************Eveything done")
            else: 
                json_response = json.dumps({'response': {"text": chatResponse, "in_response_to": [], "extra_data": {},"intent":intent}, 'confidence': 0})
                notifyMessage = '{"messageType":"notify_via_gmail","query":"'+incomingMessage["message"]+'"}'
                publisher.publishNotifyMessage(notifyMessage, '')
                chatbasepublisher.publish(incomingMessage["message"],chatResponse,True,incomingMessage["userId"],"FAQ")
                print("*********************Eveything done")
        except:
            json_response = json.dumps({'response': {"text": "Something went Wrong in Bot engine", "in_response_to": [], "extra_data": {},"intent":intent}, 'confidence': confidence.item()})
       
        publisher.publish(json_response, properties.correlation_id)
    else:
        print("Unkown Message type")


def startProcessing():
    # Start the consumer with call back as handleRabbitMQMessage()
    processTraining()
    consumer = Consumer()
    consumer.__enter__()
    consumer.consume(handleRabbitMQMessage)


if __name__ == '__main__':
    startProcessing()
