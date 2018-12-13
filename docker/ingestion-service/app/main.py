from rabbitmq.consumer import Consumer
from rabbitmq.publisher import Publisher
import json
import os
from mongodb.dao import MongoDBDAO

mongoDBDAO = MongoDBDAO()
consumer = Consumer()
consumer.__enter__()
publisher = Publisher()


   
def handleRabbitMQMessage(ch, method, properties, body):
    print(" [x] %r" % body)
    incomingMessage = json.loads(body)
    print("Message Type is %r" % incomingMessage["messageType"])
    if incomingMessage["messageType"] == "create_kb_item":
        mongoDBDAO.createKBItem(incomingMessage["kbItems"])
        publisher.publish('{"messageType":"train"}', '')


def startProcessing():
    consumer.consume(handleRabbitMQMessage)


if __name__ == '__main__':
    startProcessing()