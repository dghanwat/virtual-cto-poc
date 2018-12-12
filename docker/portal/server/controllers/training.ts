import { ChatResponse } from '../models/chatResponse';
import { CHAT_RESPONSE_TYPES } from '../models/responseTypes';
import { RabbitMQ } from '../rabbitmq/rabbitmq';
import { rabbitConfig } from "../rabbitmq/config";
const OUTGOING_EXCHANGE = "ingestion_exchange";


export default class TrainingCtrl {

    rabbitMQ: RabbitMQ;

    constructor(rabbitMQ) {
        this.rabbitMQ = rabbitMQ;
    }

    appendQuestionAndAnswersSet = (req, res) => {
        console.log("adding question anser",req.body)
        let input = {
            "messageType": "create_kb_item",
            "kbItems": req.body
          }
        console.log("Creating new KB Item" ,input)  
        let id = this.randomid();
        this.rabbitMQ._rabbit.publish(OUTGOING_EXCHANGE, {
            correlationId: id,
            contentType: "application/json",
            body: input
        }, rabbitConfig.connection.name);
        res.status(200).json({ message: "Created Successfully" });
    }

    //Random id generator
    randomid() {
        return new Date().getTime().toString() + Math.random().toString() + Math.random().toString();
    }

}



}