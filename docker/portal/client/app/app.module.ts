import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA , APP_INITIALIZER } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { ReactiveFormsModule } from '@angular/forms';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { UserService } from './services/user.service';
import { Constants } from './services/constants';
import { EventNotificationService } from './services/notification.service';
import { WebSocketService } from './services/websocket.service';
import { DisplayNotificationService } from './services/display.notification';
import { ApplicationEventService } from './services/application.event.service';
import { PushNotificationsModule, PushNotificationsService } from 'ng-push';
import { WindowRef } from './services/window.ref';
import { Http , HttpModule , ConnectionBackend } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {AngularAutobotModule} from 'angular-autobot';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HumanComponent } from './human/human.component';
import { QnAComponent } from './training/qna/qna.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ChatService } from './services/chat.service';
import { TrainingService } from './services/training.service';
import { from } from 'rxjs';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    QnAComponent,
    HumanComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RoutingModule,
    SharedModule,
    SimpleNotificationsModule.forRoot(),
    PushNotificationsModule,
    NgxDatatableModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // whitelistedDomains: ['localhost:3000', 'localhost:4200']
      }
    }),
    AngularAutobotModule,
    PerfectScrollbarModule,
    ReactiveFormsModule
  ],
  providers: [
    UserService,
    ApplicationEventService,
    Constants,
    EventNotificationService,
    WebSocketService,
    DisplayNotificationService,
    PushNotificationsService,
    NotificationsService,
    WindowRef,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    ChatService,
    TrainingService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
