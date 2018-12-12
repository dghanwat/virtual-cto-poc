import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';
import { Router } from '@angular/router';
import { ApplicationEventService, ApplicationEventType } from './application.event.service';
import { NGXLogger } from 'ngx-logger';
import { DisplayNotificationService } from './display.notification';


@Injectable()
export class WebSocketService {
    private subject: Subject<MessageEvent>;
    private subjectData: Subject<number>;
    private retryCounter = 0;
    private ws: WebSocket;
    private userLoggedOut = false;
    private locationId: string;

    constructor(private _router: Router,
        private displayNotificationService: DisplayNotificationService,
        private applicationEventService: ApplicationEventService,
        private log: NGXLogger) {
        this._router = _router;
        this.applicationEventService.applicationEvents.subscribe(applicationEvent => {
            if (applicationEvent.type === ApplicationEventType.LOGOUT) {
                this.log.debug('Websocket service - received logout event');
                this.disconnect();
            }
            if (applicationEvent.type === ApplicationEventType.LOCATION_CHANGED) {
                this.log.debug('Websocket service - received location Changed event');
                let locationData = applicationEvent.data;
                if (locationData && locationData.locationId) {
                    let location = {
                        'locationId': locationData.locationId,
                        'action': 'location_changed',
                    };
                    this.locationId = locationData.locationId;
                    this.log.debug('Websocket service - Sending new location message to websocket server:', JSON.stringify(location));
                    if (this.ws.readyState === WebSocket.OPEN) {
                        this.ws.send(JSON.stringify(location));
                    }
                }
            }
        });
    }

    public connect(url: string): Subject<MessageEvent> {
        this.log.info('Websocket service - trying to connect to Websocket url', url);
        if (!this.subject) {
            this.subject = this.create(url);
        } else {
            this.log.info('Websocket service - subject already exists. Will unsubscribe and start new.');
            this.subject.unsubscribe();
            this.subject = this.create(url);
        }
        return this.subject;
    }

    public connectData(url: string): Subject<number> {
        if (!this.subjectData) {
            this.subjectData = this.createData(url);
        }
        return this.subjectData;
    }

    public disconnect() {
        this.userLoggedOut = true;
        this.log.info('Websocket service - disconnecting websocket connection');
        const message = {
            'action': 'logout',
            'locationId': this.locationId
        };
        this.log.debug('Websocket service - Sending logout message to websocket server:', JSON.stringify(message));
        this.ws.send(JSON.stringify(message));
        this.ws.close();
    }



    private create(url: string): Subject<MessageEvent> {
        this.log.info('Websocket service - creating new Websocket connection at: ' + url);
        this.ws = new WebSocket(url);
        const that = this;
        this.ws.onopen = function () {
            that.log.info('Websocket service - connected to the websocket successfully');
            const message = {
                'action': 'open_new_connection'
            };
            that.log.debug('Websocket service - message to be sent to websocket server:', JSON.stringify(message));
            that.ws.send(JSON.stringify(message));
            if (that.locationId) {
                let location = {
                    'locationId': that.locationId,
                    'action': 'location_changed',
                };
                that.log.debug('Websocket service - Sending new location message to websocket server:', JSON.stringify(location));
                if (that.ws.readyState === WebSocket.OPEN) {
                    that.ws.send(JSON.stringify(location));
                }
            }

        };

        this.ws.onerror = function () {
            if (that.userLoggedOut) {
                that.retryCounter++;
                that.log.error('Websocket service - error occurred while connecting to Websocket server', url);
            }
        };

        this.ws.onclose = function () {
            // Check if user is logged out
            if (!that.userLoggedOut) {
                that.retryCounter++;
                that.log.warn('Websocket service - lost connection to server', url);
                if (that.retryCounter <= 50) {
                    that.log.info('Websocket service - connection retry', that.retryCounter);
                    setInterval(that.applicationEventService.sendApplicationEvent(ApplicationEventType.WEBSOCKET_RECONNECT), 5000);
                } else {
                    that.displayNotificationService.showToastNotification('Unable to make live connections with server ' +
                        'You will not get real time notifications. Please contact your administrator.', 'info');
                }
            }
        };

        const observable = Observable.create(
            (obs: Observer<MessageEvent>) => {
                this.ws.onmessage = obs.next.bind(obs);
                this.ws.onerror = obs.error.bind(obs);
                return this.ws.close.bind(this.ws);
            });

        const observer = {
            next: (data: Object) => {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify(data));
                }
            }
        };

        return Subject.create(observer, observable);
    }

    private createData(url: string): Subject<number> {
        const ws = new WebSocket(url);

        const observable = Observable.create(
            (obs: Observer<number>) => {
                ws.onmessage = obs.next.bind(obs);
                ws.onerror = obs.error.bind(obs);
                ws.onclose = obs.complete.bind(obs);

                return ws.close.bind(ws);
            });

        const observer = {
            next: (data: Object) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        };

        return Subject.create(observer, observable);
    }
}
