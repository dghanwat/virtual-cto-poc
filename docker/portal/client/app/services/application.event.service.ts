import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/Rx';

export class ApplicationEvent {
    type: ApplicationEventType = ApplicationEventType.NONE;
    data: any;
    constructor(type?: ApplicationEventType, data?: any) {
        if (type) { this.type = type; }
        if (data) { this.data = data; }
    }
}

export enum ApplicationEventType {
    NONE = 0,
    WEBSOCKET_RECONNECT = 1,
    LOGOUT = 2,
    LOCATION_CHANGED = 3,
    COMMS_FAILURE = 4,
    SERVICES_AMENDED = 5
}

@Injectable()
export class ApplicationEventService {
    private _applicationEvent: BehaviorSubject<ApplicationEvent> = new BehaviorSubject(new ApplicationEvent());
    public readonly applicationEvents: Observable<ApplicationEvent> = this._applicationEvent.asObservable();

    public sendApplicationEvent(eventType: ApplicationEventType, data?: any) {
        this._applicationEvent.next(new ApplicationEvent(eventType, data));
    }
}
