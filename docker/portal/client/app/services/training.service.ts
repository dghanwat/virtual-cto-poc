import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QnA } from '../shared/models/qna.model';

@Injectable()
export class TrainingService {

  private apiURL: string;

  constructor(private http: HttpClient) { 
      this.apiURL = environment.API_ENDPOINT;
      console.log('API URL is ',this.apiURL);
  }

  
  getQnASet(): Observable<any> {
    return this.http.get('/api/training/data/qna');
  }

  putQnA(qna: Array<QnA>): Observable<any> {
    return this.http.put('/api/training/data/qna',qna);
  }

  train(): Observable<any> {
    return this.http.post('/api/train',{});
  }

  

}
