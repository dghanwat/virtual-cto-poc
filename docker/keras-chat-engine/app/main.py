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

ERROR_THRESHOLD = 0.70
training = Training()
predict = Predict(ERROR_THRESHOLD)


def processTraining():
    mongoDBDAO = MongoDBDAO()
    kbItems = mongoDBDAO.selectAllKBItems()
    kbArray = json.loads(kbItems)
    print("KB items",kbArray['kbItems'])
    if len(kbArray['kbItems']) > 0:
        training.train(kbItems)
        predict.loadModel()
        print("[INFO] Training Completed")
    else:
        print("[INFO] No KB to train")

def getAllKBItems(correlation_id):
    mongoDBDAO = MongoDBDAO()
    kbItems = mongoDBDAO.selectAllKBItems()
    publisher.publish(kbItems, correlation_id)

def handleRabbitMQMessage(ch, method, properties, body):
    print(" [x] %r" % body)
    incomingMessage = json.loads(body)
    print("Message Type is %r" % incomingMessage["messageType"])
    print("Properties %r" % properties.correlation_id )
    if incomingMessage["messageType"] == "train":
        processTraining()
    elif incomingMessage["messageType"] == "get_all_kb":
        getAllKBItems(properties.correlation_id)
    elif incomingMessage["messageType"] == "chat":
        try:
            (chatResponse,confidence,intent) = predict.predict(incomingMessage["message"])
            if confidence >= ERROR_THRESHOLD:
                json_response = json.dumps({'response': {"text": chatResponse, "in_response_to": [], "extra_data": {},"intent":intent}, 'confidence': confidence.item()})
                try:
                    chatbasepublisher.publish(incomingMessage["message"],chatResponse,False,incomingMessage["userId"],intent)
                except Exception as e1:
                    print("[ERROR] error in publishing to Chatbase" , e1)
                print("******************Eveything done")
            else: 
                json_response = json.dumps({'response': {"text": chatResponse, "in_response_to": [], "extra_data": {},"intent":intent}, 'confidence': confidence.item()})
                notifyMessage = '{"messageType":"notify_via_gmail","query":"'+incomingMessage["message"]+'"}'
                publisher.publishNotifyMessage(notifyMessage, '')
                try:
                    chatbasepublisher.publish(incomingMessage["message"],chatResponse,True,incomingMessage["userId"],intent)
                except Exception as e2:
                    print("[ERROR] error in publishing to Chatbase" , e2)
                print("*********************Eveything done")
        except Exception as e:
            print("[ERROR]" , e)
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
