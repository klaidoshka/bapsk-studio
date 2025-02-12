import {inject, Injectable} from '@angular/core';
import Session from '../model/session.model';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiRouter = inject(ApiRouter);
  private httpClient = inject(HttpClient);

  getByUserId(userId: number): Observable<Session[]> {
    return this.httpClient.get<Session[]>(this.apiRouter.instanceGetByUserId(userId));
  }
}
