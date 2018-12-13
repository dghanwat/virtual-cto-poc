import traceback
import os
import pymongo


class MongoDBDAO:

    def __init__(self):
        self.client = pymongo.MongoClient(
            'mongodb://'+os.environ["MONGODB_USER"]+':'+os.environ["MONGODB_PASSWORD"]+'@'+os.environ["MONGODB_SERVER"]+':'+os.environ["MONGODB_PORT"]+'/')
        dblist = self.client.list_database_names()
        if "knowledge_base" in dblist:
           print("The database exists.")
           self.db = self.client["knowledge_base"]
           print("Self db is ",self.db)
        else:
           self.db = self.client["knowledge_base"]

        print("Checking for Collections")
        cols = self.db.list_collection_names()

        if "kb_items" in cols:
            print("The collection exists.")
            self.collection = self.db["kb_items"]
        else:
            print("The collection does not exists .")
            self.collection = self.db["kb_items"]

    
    def selectAllKBItems(self):
        try:
            kb = []
            for x in self.collection.find({},{ "_id": 0, "question": 1, "answer": 1 }):
                kb.append(x["question"])
                kb.append(x["answer"])

            return kb
        except Exception as e:
            print(repr(e))
            traceback.print_exc()
            raise e

    def createKBItem(self,kbItems):
        try:
            x = self.collection.insert_many(kbItems)
            print(x.inserted_ids)
        except Exception as e:
            print(repr(e))
            traceback.print_exc()
            raise e
