from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
from rabbitmq.publisher import Publisher
from rabbitmq.consumer import Consumer
import json
from mongodb.dao import MongoDBDAO

chatbot = ChatBot('Ben')
chatbot.set_trainer(ListTrainer)
# chatbot.train(['What is your name?', 'My name is Ben'])
# print(chatbot.get_response('What is your name?'))


def handleRabbitMQMessage(ch, method, properties, body):
    print(" [x] %r" % body)
    incomingMessage = json.loads(body)
    print("Message Type is %r" % incomingMessage["messageType"])
    # check if message type in body is "bot_request"
    # if bot_request then get chatbot.get_response()
    #   get the message correlation Id from the incoming message
    #   publish the message to output queue with the correlation id and the response from the bot
    # else if message type in body is "bot_train"
    # invoke elastic search to get the KB items
    # train with bot with KB items


def startProcessing():
    # publisher = Publisher()
    # publisher.publish("hello message","correlation_id")

    mongoDBDAO = MongoDBDAO()
    # mongoDBDAO.createTestKBItem()
    kbItems = mongoDBDAO.selectAllKBItems()
    print(kbItems)
    chatbot.train(kbItems)
    print(chatbot.get_response('What is ODC?'))
    # Start the consumer with call back as handleRabbitMQMessage()
    # consumer = Consumer()
    # consumer.__enter__()
    # consumer.consume(handleRabbitMQMessage)





if __name__ == '__main__':
    startProcessing()