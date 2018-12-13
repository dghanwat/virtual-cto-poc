export const rabbitConfig = {
  connection: {
    name: "virtualctorabbitmq",
    user: process.env.RABBITMQ_USER,
    pass: process.env.RABBITMQ_PASSWORD,
    server: process.env.RABBITMQ_SERVER,
    vhost: "/",
    port: process.env.RABBITMQ_PORT,
    heartbeat: 20,
    replyQueue: false,
  },
  exchanges: [
    {
      "name": "bot_request_exchange",
      "vhost": "/",
      "type": "fanout",
      "durable": true,
      "auto_delete": false,
      "internal": false,
      "arguments": {}
    },
    {
      "name": "ingestion_exchange",
      "vhost": "/",
      "type": "fanout",
      "durable": true,
      "auto_delete": false,
      "internal": false,
      "arguments": {}
    },
  ]
};
