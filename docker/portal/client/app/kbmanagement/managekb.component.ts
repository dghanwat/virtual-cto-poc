import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ToastComponent } from '../shared/toast/toast.component';


@Component({
  selector: 'app-managekb',
  templateUrl: './managekb.component.html',
  styleUrls: ['./managekb.component.css']
})

export class ManageKBComponent implements OnInit {



  title = 'Manage KB';
  currentEvent: string = 'start do something';
  config = {
    showActionButtons: true,
    showAddButtons: true,
    showRenameButtons: true,
    showDeleteButtons: true,
    enableExpandButtons: true,
    enableDragging: true,
    rootTitle: 'Knowledge Base Items',
    validationText: 'Enter valid company',
    minCharacterLength: 5,
    setItemsAsLinks: false,
    setFontSize: 20,
    setIconSize: 10
  };
  kbItems = [
    {
      name: '',
      id: 1,
      options: {},
      childrens: []
    }
  ];

  constructor(private chatService: ChatService,
    private toast: ToastComponent) {
  }

  onDragStart(event) {
    this.currentEvent = ' on drag start';
  }
  onDrop(event) {
    this.currentEvent = 'on drop';
  }
  onAllowDrop(event) {
    this.currentEvent = 'on allow drop';
  }
  onDragEnter(event) {
    this.currentEvent = 'on drag enter';
  }
  onDragLeave(event) {
    this.currentEvent = 'on drag leave';
  }
  onAddItem(event) {
    this.currentEvent = 'on add item';
    console.log(event);
  }
  onStartRenameItem(event) {
    this.currentEvent = 'on start edit item';
  }
  onFinishRenameItem(event) {
    this.currentEvent = 'on finish edit item';
  }
  onDeleteItem(event) {
    this.currentEvent = 'on delete item';
  }



  ngOnInit() {
    this.chatService.getAllKbItems().subscribe(
      res => {
        this.kbItems = [];
        console.log("Response from BE", res)
        res.message.kbItems.forEach(element => {
          let defaultUtterances = {
            name: "Utterances",
            id:this.randomid(),
            options: {
              draggable: false,
              hidden: false,
              edit: false,
              disabled: false,
              showActionButtons: false,
              showDeleteButton: false,
              showRenameButtons: false,
              showExpandButton: true
            },
            childrens: []
          }
          let defaultResponses = {
            name: "Responses",
            id:this.randomid(),
            options: {
              draggable: false,
              hidden: false,
              edit: false,
              disabled: false,
              showActionButtons: false,
              showDeleteButton: false,
              showRenameButtons: false,
              showExpandButton: true
            },
            childrens: []
          }
          let kbItem = {
            name: element.intent,
            id:this.randomid(),
            options: {
              draggable: false,
              hidden: false,
              edit: false,
              disabled: false,
              showActionButtons: true,
              showDeleteButton: true,
              showRenameButtons: true,
              showExpandButton: true
            },
            childrens: [
              defaultUtterances,
              defaultResponses
            ]
          }

          element.patterns.forEach(utterance =>{
            let utter = {
              name: utterance,
              id:this.randomid(),
              options: {
                draggable: true,
                hidden: false,
                edit: false,
                disabled: false,
                showActionButtons: true,
                showDeleteButton: true,
                showRenameButtons: true,
                showExpandButton: true
              },
              childrens: []
            }
            defaultUtterances.childrens.push(utter)
          })

          element.responses.forEach(response =>{
            let res = {
              name: response,
              id:this.randomid(),
              options: {
                draggable: true,
                hidden: false,
                edit: false,
                disabled: false,
                showActionButtons: true,
                showDeleteButton: true,
                showRenameButtons: true,
                showExpandButton: true
              },
              childrens: []
            }
            defaultResponses.childrens.push(res)
          })
          this.kbItems.push(kbItem)
        });

      },
      error => this.toast.setMessage('Ooops Something went wrong with the bot', 'danger')
    );
  }

  randomid() {
    return Math.random()
  }

}

