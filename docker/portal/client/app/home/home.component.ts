import { Component, OnInit } from '@angular/core';
import { AngularAutobotService } from 'angular-autobot';
import * as uuidv1 from 'uuid/v1';
import * as _ from 'lodash';
import { ChatService } from '../services/chat.service';
import { ChatMessage } from '../shared/models/chatMessage.model';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  botId: string = 'bot1';
  BOT: string = "BOT";
  HUMAN: string = "HUMAN";
  asyncMesgId:any;
  THRESHOLD:number = 0.65;

  constructor(private botService: AngularAutobotService,
    private chatService: ChatService,
    public toast: ToastComponent) { }


  ngOnInit() {
    setTimeout(() => {
      this.showWelcomeMessages('Hello There', this.BOT);
    }, 1000);
    setTimeout(() => {
      this.showWelcomeMessages('Welcome to Virtual CTO Bot', this.BOT)
    }, 2000);
    setTimeout(() => {
      this.showWelcomeMessages('I can help you with answers for general queries regarding WL UK CTO Group ', this.BOT)
    }, 3000);
    this.askTextInputQuestion(this.botId, 4000);
  }

  showWelcomeMessages(content, from) {
    const asyncMesgId = this.botService.bot(this.botId).addBotMessage({
      id: uuidv1(),
      type: 'text',
      visible: true,
      loading: true,
      content: content,
      human: false,
      created_date: new Date()
    });
    this.doneLoading(this.botId, asyncMesgId, 500);
  }

  showBotResponse(content) {
    const asyncMesgId = this.botService.bot(this.botId).addBotMessage({
      id: uuidv1(),
      type: 'text',
      visible: true,
      loading: true,
      content: content,
      human: false,
      created_date: new Date()
    });
    return asyncMesgId;
  }

  askAnyQuestion(botId, timeout) {
    return _.sample([this.askButtonQuestion.bind(this), this.askTextInputQuestion.bind(this)])(
      botId,
      timeout
    );
  }

  askTextInputQuestion(botId, timeout) {
    setTimeout(() => {
      this.botService
        .bot(botId)
        .addAction('text', {}, { show: true, freeze: true })
        .then((res: any) => {
          this.botService.bot(botId).addHumanMessage({
            id: uuidv1(),
            type: 'text',
            visible: true,
            loading: false,
            content: res,
            human: false,
            created_date: new Date()
            // freeze: true,
            // freezeUntilLoad: true
          });
          // Make a rest call tp API with what the user types
          const asyncMesgId = this.showBotResponse("");
          const chatMessage: ChatMessage = new ChatMessage();
          chatMessage._id = uuidv1();
          chatMessage.message = res;
          chatMessage.messageType="chat"
          this.chatService.chat(chatMessage).subscribe(
            res => {
              // Once we get the Response from the server 
              this.doneLoading(botId, asyncMesgId, 1);
              this.updateContent(botId, asyncMesgId, res.message.content, 1);
              if(res.message.confidence < this.THRESHOLD) {
                this.showWelcomeMessages('<a href="/human" target="_blank">Click here to speak to a real person</a>', this.BOT);
                this.showWelcomeMessages('I promise, I would have learnt the response when you come here next time', this.BOT);
              }
              this.askTextInputQuestion(botId, 1);
              setTimeout(() => {
                let inputField = <NodeListOf<HTMLElement>>document.querySelectorAll('.botui-actions-text-input');
                inputField[0].focus();
              },100)
              
              // then again ask for next Text Input question
              this.askTextInputQuestion(this.botId, 2500);
              // OR
              // this.askButtonQuestion(this.botId, 2500);
              
            },
            error => this.toast.setMessage('Ooops Something went wrong with the bot', 'danger')
          );

        });
    }
      , timeout);
  }

  askButtonQuestion(botId, timeout) {
    const buttonItems = [
      {
        text: 'Good',
        value: 'good'
      },
      {
        text: 'Really Good',
        value: 'really_good'
      }
    ];

    setTimeout(() => {
      this.botService
        .bot(botId)
        .addAction('button', { items: buttonItems }, { delay: 100, freeze: true })
        .then((res: any) => {
          this.botService.bot(botId).addHumanMessage(res.value);
          const asyncMesgId = this.showBotResponse("");
          // Once we get the Response from the server 
          this.doneLoading(botId, asyncMesgId, 2500);
          this.updateContent(botId, asyncMesgId, 'Response from REST Call', 2500);
          // then again ask for next Text Input question
          this.askTextInputQuestion(this.botId, 2500);
        });
    }, timeout);
  }

  doneLoading(botId, asyncMesgId, timeout) {
    setTimeout(() => {
      this.botService.bot(botId).updateMessageLoaded(botId, asyncMesgId);
    }, timeout);
  }

  updateContent(botId, asyncMesgId, content, timeout) {
    setTimeout(() => {
      this.botService.bot(botId).updateMessageContent(botId, asyncMesgId, content);
    }, timeout);
  }
}

