from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
from rabbitmq.publisher import Publisher
from rabbitmq.consumer import Consumer
import json
import os
from mongodb.dao import MongoDBDAO
import logging
logging.basicConfig(level=logging.INFO)




DEFAULT_RESPONSE = 'I am sorry, but I am not aware of this. I am still learning.'
THRESHOLD = 0.65
publisher = Publisher()
chatbot = ChatBot('Terminal',
                  storage_adapter='chatterbot.storage.MongoDatabaseAdapter',
                  logic_adapters=[
                      {
                          'import_path': 'chatterbot.logic.BestMatch'
                      },
                      {
                          'import_path': 'chatterbot.logic.MathematicalEvaluation'
                      }
                  ],
                  database='bot_database',
                  database_uri='mongodb://'+os.environ["MONGODB_USER"]+':'+os.environ["MONGODB_PASSWORD"] +
                  '@'+os.environ["MONGODB_SERVER"] +
                  ':'+os.environ["MONGODB_PORT"]+'/'
                  )
chatbot.set_trainer(ListTrainer)
# chatbot.train(['What is your name?', 'My name is Ben'])
# print(chatbot.get_response('What is your name?'))


def handleRabbitMQMessage(ch, method, properties, body):
    print(" [x] %r" % body)
    incomingMessage = json.loads(body)
    print("Message Type is %r" % incomingMessage["messageType"])
    print("Properties %r" % properties.correlation_id )
    # check if message type in body is "chat"
    # if bot_request then get chatbot.get_response()
    #   get the message correlation Id from the incoming message
    #   publish the message to output queue with the correlation id and the response from the bot
    # else if message type in body is "bot_train"
    # invoke elastic search to get the KB items
    # train with bot with KB items
    if incomingMessage["messageType"] == "train":
        mongoDBDAO = MongoDBDAO()
        kbItems = mongoDBDAO.selectAllKBItems()
        chatbot.train(kbItems)
        print("Training Completed")
    elif incomingMessage["messageType"] == "chat":
        try:
            chatResponse = chatbot.get_response(incomingMessage["message"],properties.correlation_id)
            confidence = chatResponse.confidence
            print("Confidence " , confidence)
            if confidence >= THRESHOLD:
                json_response = json.dumps({'response': chatResponse.serialize(), 'confidence': confidence})
            else: 
                json_response = json.dumps({'response': {"text": DEFAULT_RESPONSE, "in_response_to": [], "extra_data": {}}, 'confidence': 0})
                notifyMessage = '{"messageType":"notify_via_gmail","query":"'+incomingMessage["message"]+'"}'
                publisher.publishNotifyMessage(notifyMessage, '')
        except IndexError:
            json_response = json.dumps({'response': {"text": DEFAULT_RESPONSE, "in_response_to": [], "extra_data": {}}, 'confidence': 0})
       
        publisher.publish(json_response, properties.correlation_id)
    else:
        print("Unkown Message type")



def startProcessing():
    # Start the consumer with call back as handleRabbitMQMessage()
    consumer = Consumer()
    consumer.__enter__()
    consumer.consume(handleRabbitMQMessage)


if __name__ == '__main__':
    startProcessing()
