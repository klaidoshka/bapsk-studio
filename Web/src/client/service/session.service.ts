import {inject, Injectable, signal} from '@angular/core';
import Session from '../model/session.model';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {finalize, map, Observable, tap} from 'rxjs';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {DateUtil} from '../util/date.util';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly authService = inject(AuthService);
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly store = signal<Session[]>([]);

  constructor() {
    this.getByUser().subscribe();
  }

  getByUser(): Observable<Session[]> {
    return this.httpClient.get<Session[]>(this.apiRouter.session.getByUser()).pipe(
      map((sessions: Session[]) => sessions
        .map(s => {
          return {
            ...s,
            createdAt: DateUtil.adjustToLocalDate(s.createdAt)
          };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      ),
      tap(sessions => this.store.set(sessions))
    );
  }

  getByUserAsSignal() {
    return this.store.asReadonly();
  }

  revoke(id: string): Observable<void> {
    return this.httpClient.delete<void>(this.apiRouter.session.revoke(id))
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
