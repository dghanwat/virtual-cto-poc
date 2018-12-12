import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChatMessage } from '../shared/models/chatMessage.model';

@Injectable()
export class ChatService {

  private apiURL: string;

  constructor(private http: HttpClient) { 
      this.apiURL = environment.API_ENDPOINT;
      console.log('API URL is ',this.apiURL);
  }

  
  chat(message:ChatMessage): Observable<any> {
    return this.http.post('/api/chat', message);
  }

  

}
