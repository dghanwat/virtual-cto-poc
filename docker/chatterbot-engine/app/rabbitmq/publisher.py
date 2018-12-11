import pika
import traceback
import os
 
class Publisher:
    
 
    def publish(self, message,correlation_id):
        connection = None
        try:
            connection = self._create_connection()
            channel = connection.channel()
 
            channel.exchange_declare(exchange=os.environ['RABBITMQ_EXCHANGE'],
                                         passive=True)
            channel.basic_publish(exchange=os.environ['RABBITMQ_EXCHANGE'],
                                      routing_key="message",
                                      properties=pika.BasicProperties(correlation_id = correlation_id),
                                      body=message)
 
            print(" [x] Sent message %r" % message)
        except Exception as e:
            print(repr(e))
            traceback.print_exc()
            raise e
        finally:
            if connection:
                connection.close()
 
    def _create_connection(self):
        credentials = pika.PlainCredentials(os.environ['RABBITMQ_USER'], os.environ['RABBITMQ_PASSWORD'])
        parameters = pika.ConnectionParameters(os.environ['RABBITMQ_SERVER'], os.environ['RABBITMQ_PORT'],
                                               os.environ['RABBITMQ_VIRTUALHOST'], credentials, ssl=False)
        return pika.BlockingConnection(parameters)