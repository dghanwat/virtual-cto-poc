import { bindings } from "./queues";
import { queues } from "./queues";
import { rabbitConfig } from "./config";
const rabbit = require("rabbot");
var events = require("events");


import logger from "../winston-logger-config";

let retryCounter = 0;
const log = logger();

class RabbitMQ {
    _rabbit;
    eventEmitter = new events.EventEmitter();
    init() {
        // Configure the rabbit mq connection, queues and bindings
        rabbit.handle({}, (message) => {
            const body = JSON.parse(message.content.toString("ascii"));
            this.eventEmitter.emit(message.properties.correlationId, message.body)
            message.ack();
        });
        rabbit.configure(rabbitConfig);

        /**
         * Perform retry in case Rabbit MQ is not reachable.
         */
        rabbit.on("unreachable", () => {
            log.error("RabbitMq: Host unreachable. Trying again -- %d", ++retryCounter);
            if (process.env.COEUS_ENVIRONMENT !== "development") {
                rabbit.retry();
            }
        });

        /**
         * Perform retry in case Rabbit MQ connection is failed.
         */
        rabbit.on("failed", () => {
            log.error("RabbitMq: Connection failed. Trying again -- %d", ++retryCounter);
            if (process.env.COEUS_ENVIRONMENT !== "development") {
                rabbit.retry();
            }
        });

        /**
         * Start processing of messages when Rabbit MQ connection is successfull.
         */
        rabbit.on("connected", () => {
            log.info("RabbitMq: Portal connected");
        });

        rabbit.on(rabbitConfig.connection.name + ".connection.opened", (c) => {
            log.info("RabbitMq: Connection " + rabbitConfig.connection.name + " opened");
            queues.forEach((q, index) => {
                if (!rabbit.getQueue(q.name, rabbitConfig.connection.name)) {
                    rabbit.addQueue(q.name, q, rabbitConfig.connection.name).then((s) => {
                        rabbit.bindQueue(bindings[index].exchange, bindings[index].target, "",
                            rabbitConfig.connection.name);
                        rabbit.startSubscription(q.name, false, rabbitConfig.connection.name);
                    });
                } else {
                    log.info("RabbitMq: Connection Queue already exists");
                }
            });
            this._rabbit = rabbit;
        });

        rabbit.on(rabbitConfig.connection.name + ".connection.closed", () => {
            log.info("RabbitMq: Connection " + rabbitConfig.connection.name + " closed");
        });

        rabbit.on(rabbitConfig.connection.name + ".connection.failed", (c) => {
            log.error("RabbitMq: Connection " + rabbitConfig.connection.name + " failed");
            queues.forEach((q, index) => {
                if (rabbit.getQueue(q.name, rabbitConfig.connection.name)) {
                    rabbit.stopSubscription(q.name, rabbitConfig.connection.name);
                    rabbit.deleteQueue(q.name, rabbitConfig.connection.name);
                }
            });
            if (process.env.COEUS_ENVIRONMENT !== "development") {
                rabbit.retry();
            }
        });

        rabbit.on(rabbitConfig.connection.name + ".connection.configured", (connection) => {
            Object.entries(connection.definitions.bindings).forEach(([key, value]) => {
                log.debug(`RabbitMq: Queue ${value} bound to exchange ${value}`);
            });
        });

    }


}

/**
 * Handles incoming messages.
 *
 * @param message
 */



process.on("SIGINT", () => {
    // After we recive any Interrupt
    rabbit.shutdown();
});


export { RabbitMQ }