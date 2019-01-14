import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../../models';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';

@Component({
  selector: 'lib-embed-message',
  templateUrl: './embed-message.component.html',
  styleUrls: ['./embed-message.component.css']
})
export class EmbedMessageComponent implements OnInit {

  @Input() msg: Message;
  url: SafeResourceUrl;
  constructor(public sanitizer:DomSanitizer) { }

  ngOnInit() {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.msg.content);      
  }

}
