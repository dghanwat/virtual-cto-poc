import pika
import os

class Consumer:

    def __enter__(self):
        self.connection = self._create_connection()
        return self
 
    def __exit__(self, *args):
        self.connection.close()
 
    def consume(self, message_received_callback):
        self.message_received_callback = message_received_callback
 
        channel = self.connection.channel()
 
 
        channel.basic_consume(self._consume_message, queue=os.environ['RABBITMQ_BOT_INCOMING_QUEUE'])
        channel.start_consuming()
 
    
    def _create_connection(self):
        credentials = pika.PlainCredentials(os.environ['RABBITMQ_USER'], os.environ['RABBITMQ_PASSWORD'])
        parameters = pika.ConnectionParameters(os.environ['RABBITMQ_SERVER'], os.environ['RABBITMQ_PORT'],
                                               os.environ['RABBITMQ_VIRTUALHOST'], credentials, ssl=False)
        return pika.BlockingConnection(parameters)
 
    def _consume_message(self, channel, method, properties, body):
        self.message_received_callback(channel, method, properties, body)
        channel.basic_ack(delivery_tag=method.delivery_tag)