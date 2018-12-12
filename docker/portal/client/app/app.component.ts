import { AfterViewChecked, ChangeDetectorRef, Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { ApplicationEventService, ApplicationEventType } from './services/application.event.service';
import { EventNotificationService, Message } from './services/notification.service';
import { DisplayNotificationService } from './services/display.notification';
import { NGXLogger } from 'ngx-logger';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewChecked {
  subscription: Subscription;
  webSocketSubscription: Subject<Message>;
  message: any;
  messages: Message[] = [];
  public options = {
    position: ['bottom', 'right'],
    timeOut: 15000,
    lastOnBottom: false,
    rtl: false
  };

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;


  constructor(private changeDetector: ChangeDetectorRef,
    private _router: Router,
    private applicationEventService: ApplicationEventService,
    private eventNotificationService: EventNotificationService,
    private _displayNotificationService: DisplayNotificationService,
    private log: NGXLogger) {

    this._router.events.subscribe(() => {
      // During constructor of this component if the user is already signed in then create a new Websocket connection
      // this normally happens when user will do Page Refresh by pressing F5 or Ctrl + R
    });

    this.subscription = applicationEventService.applicationEvents.subscribe(applicationEvent => {
      if (applicationEvent.type === ApplicationEventType.WEBSOCKET_RECONNECT) {
        
      }
    });
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

 

  ngOnDestroy() {
    // Unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
    this.webSocketSubscription.unsubscribe();
  }

  reset() {
    this.idleState = 'Started.';
    this.timedOut = false;
  }

}
