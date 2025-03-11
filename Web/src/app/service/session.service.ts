import {Injectable, signal} from '@angular/core';
import Session from '../model/session.model';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {finalize, map, Observable, tap} from 'rxjs';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private store = signal<Session[]>([]);

  constructor(
    private apiRouter: ApiRouter,
    private authService: AuthService,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.getByUser().subscribe();
  }

  readonly getByUser = (): Observable<Session[]> => {
    return this.httpClient.get<Session[]>(this.apiRouter.sessionGetByUser()).pipe(
      map((sessions: Session[]) => sessions
        .map(s => {
          return {...s, createdAt: new Date(s.createdAt)};
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      ),
      tap(sessions => this.store.set(sessions))
    );
  }

  readonly getByUserAsSignal = () => {
    return this.store.asReadonly();
  }

  readonly revoke = (id: string): Observable<void> => {
    return this.httpClient.delete<void>(this.apiRouter.sessionRevoke(id))
    .pipe(
      // Remove the session from the client if it's the current session
      tap(() => {
        this.store.update(session => session.filter(s => s.id !== id));

        if (id === this.authService.getSessionId()()) {
          this.authService.logout().pipe(
            finalize(() => this.router.navigate(['/auth/login']))
          )
        }
      })
    );
  }
}
