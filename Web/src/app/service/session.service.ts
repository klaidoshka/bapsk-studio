import {Injectable} from '@angular/core';
import Session from '../model/session.model';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
  ) {
  }

  getByUser(): Observable<Session[]> {
    return this.httpClient.get<Session[]>(this.apiRouter.sessionGetByUser());
  }

  revoke(id: string): Observable<void> {
    return this.httpClient.delete<void>(this.apiRouter.sessionRevoke(id));
  }
}
