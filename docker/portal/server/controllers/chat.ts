import { ChatResponse } from '../models/chatResponse';
import { CHAT_RESPONSE_TYPES } from '../models/responseTypes';
import { RabbitMQ } from '../rabbitmq/rabbitmq';
import { rabbitConfig } from "../rabbitmq/config";
const OUTGOING_EXCHANGE = "bot_request_exchange";

export default class ChatCtrl {

    rabbitMQ: RabbitMQ;

    constructor(rabbitMQ) {
        this.rabbitMQ = rabbitMQ;
    }


    chat = (req, res) => {
        console.log('Request for chat', req.body);
        let input = {
            "messageType": "chat",
            "message": req.body.message,
            "userId":req.body.userId
        }
        let id = this.randomid();
        this.rabbitMQ.eventEmitter.once(id, msg => {
            console.log("Message in the queue is ", msg)
            let chatResponse: ChatResponse = new ChatResponse();
            chatResponse.type = CHAT_RESPONSE_TYPES.TEXT;
            
            if (msg.response.text) {
                chatResponse.content = msg.response.text;
                chatResponse.confidence = msg.confidence
            }
            console.log('msg.response.text', chatResponse);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ message: chatResponse })

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