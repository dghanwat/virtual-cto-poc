import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { WebSocketService } from './websocket.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { Constants } from './constants';
import { NGXLogger } from 'ngx-logger';

export interface MessageData {
    type: string;
    deviceId: string;
    data: string;
    category: string;
    severity: string;
}

export interface Message {
    author: string;
    message: MessageData;
    newDate?: string;
}

@Injectable()
export class EventNotificationService {
    public messages: Subject<Message> = new Subject<Message>();
    constructor(private wsService: WebSocketService,
        private constants: Constants,
        private log: NGXLogger) {
    }

    public start() {
        this.log.info('Starting event notification service to subscribe to events.');

        // 1. subscribe to Messages
        this.messages = <Subject<Message>>this.wsService
            .connect(this.constants.WEBSOCKET_URL)
            .map((response: MessageEvent): Message => {
                const data = JSON.parse(response.data);
                return {
                    author: data.author,
                    message: data.message,
                    newDate: data.newDate
                };
            });
    }
}
