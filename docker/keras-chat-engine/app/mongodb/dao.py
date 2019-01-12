import traceback
import os
import pymongo
import json


class MongoDBDAO:

    def __init__(self):
        self.client = pymongo.MongoClient(
            'mongodb://'+os.environ["MONGODB_USER"]+':'+os.environ["MONGODB_PASSWORD"]+'@'+os.environ["MONGODB_SERVER"]+':'+os.environ["MONGODB_PORT"]+'/')
        dblist = self.client.list_database_names()
        if "knowledge_base" in dblist:
           print("The database exists.")
           self.db = self.client["knowledge_base"]
        else:
           self.db = self.client["knowledge_base"]

        cols = self.db.list_collection_names()

        if "kb_items" in cols:
            print("The collection exists.")
            self.collection = self.db["kb_items"]
        else:
            self.collection = self.db["kb_items"]

    
    def selectAllKBItems(self):
        try:
            kbItems = []
            for x in self.collection.find({},{ "_id": 0, "intent": 1, "patterns": 1 ,"responses":1}):
                item = {
                    "intent": x["intent"],
                    "patterns": x["patterns"],
                    "responses": x["responses"]
                }
                kbItems.append(item)
            return json.dumps({"kbItems":kbItems})
        except Exception as e:
            print(repr(e))
            traceback.print_exc()
            raise e

    def createTestKBItem(self):
        try:
            mydict = [
                { "question": "What is your name", "answer": "Dhananjay Ghanwat" },
                { "question": "Who is Sachin", "answer": "He is the best player" },
                { "question": "What is ODC", "answer": "Its a Offshore Development center for Worldline" },
            ]
            x = self.collection.insert_many(mydict)
            print(x.inserted_ids)
        except Exception as e:
            print(repr(e))
            traceback.print_exc()
            raise e
    
    def clearTrainingData(self): 
        try:
           dblist = self.client.list_database_names()
           if "bot_database" in dblist:
                print("The database exists.")
                self.client.drop_database("bot_database")
        except Exception as e:
            print(repr(e))
            traceback.print_exc()
            raise e