var events = require("events");


class GlobalEventEmitter {
    eventEmitter = new events.EventEmitter();
}

export { GlobalEventEmitter }