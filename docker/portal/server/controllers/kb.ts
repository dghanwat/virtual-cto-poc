import { ChatResponse } from '../models/chatResponse';
import { CHAT_RESPONSE_TYPES } from '../models/responseTypes';
import { RabbitMQ } from '../rabbitmq/rabbitmq';
import { rabbitConfig } from "../rabbitmq/config";
const OUTGOING_EXCHANGE = "bot_request_exchange";

export default class KBCtrl {

    rabbitMQ: RabbitMQ;

    constructor(rabbitMQ) {
        this.rabbitMQ = rabbitMQ;
    }

    getAllKBItems = (req, res) => {
        console.log('Request for KB Item', req.body);
        let input = {
            "messageType": "get_all_kb"
        }
        let id = this.randomid();
        this.rabbitMQ.eventEmitter.once(id, msg => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ message: msg })

        });

        this.rabbitMQ._rabbit.publish(OUTGOING_EXCHANGE, {
            correlationId: id,
            contentType: "application/json",
            body: input
        }, rabbitConfig.connection.name);

    }

   //Random id generator
    randomid() {
        return new Date().getTime().toString() + Math.random().toString() + Math.random().toString();
    }

}