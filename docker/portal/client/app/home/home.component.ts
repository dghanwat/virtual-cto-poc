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
  THRESHOLD:number = 0.60;
  userId: string;

  constructor(private botService: AngularAutobotService,
    private chatService: ChatService,
    public toast: ToastComponent) {
      this.userId = '_' + Math.random().toString(36).substr(2, 9);
     }


  ngOnInit() {
    setTimeout(() => {
      this.showWelcomeMessages('Hello There', this.BOT);
    }, 1000);
    setTimeout(() => {
      this.showWelcomeMessages('This is Lord Lewin here. I am your Virtual CTO Bot', this.BOT)
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
          chatMessage.userId = this.userId
          this.chatService.chat(chatMessage).subscribe(
            res => {
              // Once we get the Response from the server 
              this.doneLoading(botId, asyncMesgId, 1);
              let formattedContent = res.message.content.replace(/(\.(\s+))/g, '\$1 <br /><br />');
              formattedContent = this.linkify(formattedContent);
              // let formattedContent = res.message.content.replace("([^\.]*?)",)
              this.updateContent(botId, asyncMesgId, formattedContent, 1);
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

  linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}
}

