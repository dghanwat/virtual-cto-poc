from rabbitmq.consumer import Consumer
import json
import os
import logging
logging.basicConfig(level=logging.INFO)
import smtplib

from_address = "lord.lewin.test@gmail.com"
to_addr_list = ['dhananjay.ghanwat@gmail.com'] # list of addresses
subject = 'Unanswered Query in Lord Lewin' # subject of email
login = os.environ["GMAIL_USER"] # username of SMTP server account used
password = os.environ["GMAIL_PASSWORD"] # password of SMTP server account

def handleRabbitMQMessage(ch, method, properties, body):
    print(" [x] %r" % body)
    incomingMessage = json.loads(body)
    print("Message Type is %r" % incomingMessage["messageType"])

    if incomingMessage["messageType"] == "notify_via_gmail":
        query = incomingMessage["query"]
        sendEmail(query)
    else:
        print("Unknown incoming message type")


def sendEmail(query):
    header  = 'From: %s\n' % from_address
    header += 'To: %s\n' % ','.join(to_addr_list)
    if(len(query) > 30):
        header += 'Subject: %s\n\n' % (subject + ": " + query[:30] + "..")
    else:
        header += 'Subject: %s\n\n' % (subject + ": " + query[:20] + "..")
    
    message = 'Hello,\n\nCan you please help me in answering the below query from user\n\nQuery:'+ query +'\n\nRegards\n\nLord Lewin'
    message = header + message
    server = smtplib.SMTP('smtp.gmail.com:587')
    server.starttls()
    server.login(login,password)
    print('Logged in to: '+login)
    problems = server.sendmail(from_address, to_addr_list, message)
    if problems:
        print("Problem in sending emaiil",problems)
    print('sent email to: ', to_addr_list)
    server.quit()


def startProcessing():
    # Start the consumer with call back as handleRabbitMQMessage()
    consumer = Consumer()
    consumer.__enter__()
    consumer.consume(handleRabbitMQMessage)
    

if __name__ == '__main__':
    startProcessing()
