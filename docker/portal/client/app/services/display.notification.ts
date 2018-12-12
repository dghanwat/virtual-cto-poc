import { Injectable } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { PushNotificationsService } from 'ng-push';
import { WindowRef } from './window.ref';
import { Message } from './notification.service';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class DisplayNotificationService {
    isWindowActive: boolean;
    iconPath: string;
    constructor(private _notificationService: NotificationsService,
        private _pushNotifications: PushNotificationsService,
        private winRef: WindowRef,
        private log: NGXLogger) {
            
        this.winRef.nativeWindow.onfocus = function () {
            this.isWindowActive = true;
        };
        this.winRef.nativeWindow.onblur = function () {
            this.isWindowActive = false;
        };
    }

    /**
     * displays either Push or toast notification depending on focus
     * if focus is on window then show Toast else Push
     * @param  {Message} msg message to be displayed
     * @return {boolean}     return true
     */
    showNotification(msg: Message): boolean {
        this.log.debug('Window is active: ', this.isWindowActive);
        this.log.debug('Showing notification', msg.message.data);
        if (!this.isWindowActive) {
            if (msg.message.severity.length > 0) {
                if (msg.message.severity.toUpperCase() === 'CRITICAL') {
                    this.iconPath = '/assets/images/critical-icon.png';
                } else if (msg.message.severity.toUpperCase() === 'HIGH') {
                    this.iconPath = '/assets/images/high-icon.png';
                } else if (msg.message.severity.toUpperCase() === 'LOW') {
                    this.iconPath = '/assets/images/low-icon.png';
                } else if (msg.message.severity.toUpperCase() === 'OK') {
                    this.iconPath = '/assets/images/ok-icon.png';
                } else {
                    this.iconPath = '/assets/images/bell-icon.png';
                }
            } else {
                this.iconPath = '/assets/images/bell-icon.png';
            }
            const options = {
                body: msg.message.deviceId.length > 0 ?
                    this.chunk(msg.message.deviceId.concat(' - ').concat(msg.message.data), 30) :
                    this.chunk(msg.message.data, 30),
                icon: this.iconPath,
                tag: msg.message.category,
                renotify: true,
                silent: false,
                sound: '/assets/sounds/appointed.mp3',
                noscreen: true,
                sticky: true,
                lang: 'en',
                vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500]
            };
            this._pushNotifications.create('', options).subscribe(
                res => this.log.log(res),
                err => this.log.log(err)
            );
        } else {
            if (msg.message.type.toUpperCase() === 'NOTIFY') {
                if (msg.message.category === 'warning') {
                    this._notificationService.warn('Warning', msg.message.data);
                } else if (msg.message.category === 'error') {
                    this._notificationService.error('Error', msg.message.data);
                } else {
                    this._notificationService.info('Info', msg.message.data);
                }
            }
        }

        return true;
    }

    /**
     * Display notification on screen
     * @param  {string} message Message to be displayed
     * @param  {string} type    Type of messages, allowed values are 'info', 'success','error','warning'
     * @return {[type]}         [description]
     */
    showToastNotification(message: string,
        type: string) {
            console.log("in showing notification",message,type);
        switch (type.toLowerCase()) {
            case 'info': this._notificationService.info('Info:', message);
                break;
            case 'success': this._notificationService.success('Success:', message);
                break;
            case 'error': this._notificationService.error('Error:', message);
                break;
            case 'warning': this._notificationService.warn('Warning:', message);
                break;
            default: this._notificationService.info('Info:', message);
                break;
        }
        console.log("Creating")
        this._notificationService.create("title", "content", NotificationType.Success, "temp")
        console.log("after creating")
    }

    private chunk(str, n) {
        const ret = [];
        let i;
        let len;
        for (i = 0, len = str.length; i < len; i += n) {
            if (i === 0) {
                const x = str.substr(i, n);
                ret.push(x);
            } else {
                const x = str.substr(i, n).replace(' ', '\n');
                ret.push(x);
            }
        }
        return ret.join('');
    }
}
