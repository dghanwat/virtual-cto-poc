from mongodb.dao import MongoDBDAO
import logging
logging.basicConfig(level=logging.INFO)

mongoDBDAO = MongoDBDAO()
mongoDBDAO.clearTrainingData()        