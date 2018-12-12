import { Component, OnInit } from '@angular/core';
import { AngularAutobotService } from 'angular-autobot';
import * as uuidv1 from 'uuid/v1';
import * as _ from 'lodash';
import { ChatService } from '../services/chat.service';
import { TrainingService } from '../services/training.service';
import { ChatMessage } from '../shared/models/chatMessage.model';
import { ToastComponent } from '../shared/toast/toast.component';
import { QnA } from '../shared/models/qna.model';

@Component({
  selector: 'app-human',
  templateUrl: './human.component.html',
  styleUrls: ['./human.component.css']
})

export class HumanComponent implements OnInit {
  botId: string = 'bot1';
  BOT: string = "BOT";
  HUMAN: string = "HUMAN";
  asyncMesgId: any;

  constructor(private botService: AngularAutobotService,
    private chatService: ChatService,
    public toast: ToastComponent,
    private trainingService: TrainingService) { }


  ngOnInit() {
    setTimeout(() => {
      this.showWelcomeMessages('Hello There', this.BOT);
    }, 1000);
    setTimeout(() => {
      this.showWelcomeMessages('This Emy, your human agent', this.BOT)
    }, 2000);
    setTimeout(() => {
      this.showWelcomeMessages('I can help you with answers for general queries regarding WL UK CTO Group ', this.BOT)
    }, 3000);


    // setTimeout(() => {
    //   this.showHumanQuestionByDefault('My Question is', this.BOT)
    // }, 4000);

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

  showHumanQuestionByDefault(content, from) {
    const asyncMesgId = this.botService.bot(this.botId).addHumanMessage({
      id: uuidv1(),
      type: 'text',
      visible: true,
      loading: true,
      content: content,
      human: true,
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
          chatMessage.messageType = "chat"

          var humanResponse = prompt("Agent Response", "");
          console.log("HUman response",humanResponse)
          if (humanResponse) {
            console.log("humanResponse", humanResponse)
            this.doneLoading(botId, asyncMesgId, 1);
            this.updateContent(botId, asyncMesgId, humanResponse, 1);
            this.askTextInputQuestion(botId, 1);
            setTimeout(() => {
              let inputField = <NodeListOf<HTMLElement>>document.querySelectorAll('.botui-actions-text-input');
              inputField[0].focus();
            }, 100)
            let qna = new QnA()
            qna.question = chatMessage.message
            qna.answer = humanResponse
            let qnas = []
            qnas.push(qna)
            this.trainingService.putQnA(qnas).subscribe(
              res => {
                // Once we get the Response from the server 
                console.log("response from Training Service",res)
                
              },
              error => { 
                this.toast.setMessage('Ooops Something went wrong with the bot', 'danger')
                console.error("error in updating traing",error)
              }
            );

            
            console.log("Calling Training Serivice to putQnA",qnas)
            // then again ask for next Text Input question
            this.askTextInputQuestion(this.botId, 2500);
          }



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

