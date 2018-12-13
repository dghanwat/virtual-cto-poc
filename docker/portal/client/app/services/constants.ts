import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NGXLogger } from 'ngx-logger';

Injectable();
export class Constants {
    public WEBSOCKET_RECONNECT = 'websocket_reconnect';
    public API_URL: string;
    public WEBSOCKET_URL: string;
    public SESSION_IDLE_TIME = 20 * 60; // in seconds
    public SESSION_TIMEOUT = 60; // in seconds // after one minute after SESSION_IDLE_TIME the user will be logged off
    public DATE_FORMAT = 'YYYY-MM-DDTHH:mm';
    public DATE_ONLY_FORMAT = 'YYYY-MM-DD';

    constructor(@Inject(DOCUMENT) private document: Document, private log: NGXLogger) {
        this.log.info('Location information: ' + this.document.location);
        if (this.document.location.hostname === 'localhost') {
            if (this.document.location.port === '4200') {
                this.API_URL = 'http://localhost:3000';
                this.WEBSOCKET_URL = 'ws://localhost:3000';
            } else {
                this.API_URL = 'http://localhost:' + this.document.location.port;
                this.WEBSOCKET_URL = 'ws://localhost:' + this.document.location.port;
            }
        } else {
            if (typeof this.document.location.port !== 'undefined' && this.document.location.port) {
                this.API_URL = this.document.location.protocol
                    .concat('//')
                    .concat(this.document.location.hostname)
                    .concat(':')
                    .concat(this.document.location.port);
                if (this.document.location.protocol === 'http:') {
                    this.WEBSOCKET_URL = 'ws://'.concat(this.document.location.hostname)
                        .concat(':')
                        .concat(this.document.location.port);
                } else {
                    this.WEBSOCKET_URL = 'wss://'.concat(this.document.location.hostname)
                        .concat(':')
                        .concat(this.document.location.port);
                }
            } else {
                this.API_URL = this.document.location.protocol
                    .concat('//')
                    .concat(this.document.location.hostname);
                if (this.document.location.protocol === 'http:') {
                    this.WEBSOCKET_URL = 'ws://'.concat(this.document.location.hostname);
                } else {
                    this.WEBSOCKET_URL = 'wss://'.concat(this.document.location.hostname);
                }
            }
        }

        this.log.info('API Facade URL is: ' + this.API_URL);
        this.log.info('Websocket URL is: ' + this.WEBSOCKET_URL);
    }
}
