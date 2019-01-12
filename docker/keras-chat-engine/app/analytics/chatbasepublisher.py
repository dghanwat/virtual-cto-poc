import time
import traceback
import os
from chatbase import Message, MessageSet, MessageTypes, InvalidMessageTypeError


class ChatBasePublisher:

    def __init__(self):
        self.api_key=os.environ["CHAT_BASE_API_KEY"] # Chatbase API key
        self.platform = 'lord_lewin_chatbot' # Chat platform name
        # message_user = 'Do you know the time, please?' # User message
        # message_bot = 'It's 12 o'clock!' # Bot response message
        self.version = '1' # Bot version, useful if you want to mark them for A/B testing or compare results across versions
        # time_stamp = int(round(time.time() * 1e3)) # Mandatory

    def publish(self,userQuery,botResponse,not_handled,userId,intent):
        time_stamp = int(round(time.time() * 1e3)) # Mandatory
       
        # Create an instance of MessageSet to collect all the messages
        message_set = MessageSet(api_key=str(self.api_key), platform=self.platform,
                    version=self.version, user_id=userId)
        # Create an instance of Message for the user message and set values in the constructor
        msg1 = Message(api_key=self.api_key, platform=self.platform, message=userQuery,
                    intent=intent, version=self.version, user_id=userId,
                    type=MessageTypes.USER, not_handled=not_handled,
                    time_stamp=time_stamp)
        # Set the message as "handled" because the NLP was able to successfully decode the intent
        msg1.set_as_feedback()

        # Create an instance of Message for the bot response message and set values in the constructor
        msg2 = Message(api_key=self.api_key, platform=self.platform, message=botResponse,
                    version=self.version, user_id=userId,
                    type=MessageTypes.AGENT)

        print("User id",userId)
        # Push messages into the collection (MessageSet)
        message_set.append_message(msg1)
        message_set.append_message(msg2)

        
        # Send the messages
        response = message_set.send()
        print('Response code for sending Chatbase Message', response.content)
        # response.status_code will be 200 if sending worked