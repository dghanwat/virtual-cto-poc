export const exchanges = [
  {
    "name": "bot_response_exchange",
    "vhost": "/",
    "type": "fanout",
    "durable": true,
    "auto_delete": false,
    "internal": false,
    "arguments": {}
  }
];

export const queues = [
  {
    "name": "bot_response_queue",
    "vhost": "/",
    "durable": true,
    "auto_delete": false,
    "arguments": {}
  }
];

export const bindings = [
  {
    exchange: "bot_response_exchange",
    target: "bot_response_queue",
  },
];
