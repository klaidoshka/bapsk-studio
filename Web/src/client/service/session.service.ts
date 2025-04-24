import {inject, Injectable} from '@angular/core';
import Session from '../model/session.model';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {catchError, finalize, map, Observable, of, switchMap, tap, timeout} from 'rxjs';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {DateUtil} from '../util/date.util';
import {CacheService} from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly authService = inject(AuthService);
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly cacheService = new CacheService<string, Session>(s => s.id);
  private readonly userFetched = false;

  constructor() {
    this.getByUser().subscribe();
  }

  getByUser(): Observable<Session[]> {
    if (this.userFetched) {
      return this.cacheService.getAll();
    }

    return this.httpClient
      .get<Session[]>(this.apiRouter.session.getByUser())
      .pipe(
        map(sessions => sessions
          .map(session => this.updateProperties(session))
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        ),
        tap(sessions => sessions.forEach(session => this.cacheService.set(session)))
      );
  }

  revoke(id: string): Observable<void> {
    return this.httpClient
      .delete<void>(this.apiRouter.session.revoke(id))
      .pipe(
        tap(() => this.cacheService.delete(id)),
        switchMap(() =>
          this.authService.getSessionId().pipe(
            timeout(1000),
            catchError(() => of(null)),
            switchMap(sessionId => {
              if (id === sessionId) {
                return this.authService
                  .logout()
                  .pipe(
                    finalize(() => this.router.navigate(['/auth/login']))
                  );
              }
              return of();
            })
          )
        )
      );
  }

  updateProperties(session: Session): Session {
    return {
      ...session,
      createdAt: DateUtil.adjustToLocalDate(session.createdAt)
    };
  }
}
