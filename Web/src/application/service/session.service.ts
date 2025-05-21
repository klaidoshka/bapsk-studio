import {inject, Injectable, signal} from '@angular/core';
import Session from '../model/session.model';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {map, Observable, switchMap, tap} from 'rxjs';
import {DateUtil} from '../util/date.util';
import {CacheService} from './cache.service';
import {EventService} from './event.service';
import {events} from '../model/event.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly eventService = inject(EventService);
  private readonly httpClient = inject(HttpClient);
  private readonly cacheService = new CacheService<string, Session>(s => s.id);
  private readonly userFetched = signal<boolean>(false);

  constructor() {
    this.eventService.subscribe(events.loggedOut, () => {
      this.userFetched.set(false);
      this.cacheService.deleteAll();
    });
  }

  getByUser(): Observable<Session[]> {
    if (this.userFetched()) {
      return this.cacheService.getAll();
    }

    return this.httpClient
      .get<Session[]>(this.apiRouter.session.getByUser())
      .pipe(
        map(sessions => sessions
          .map(session => this.updateProperties(session))
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        ),
        tap(sessions => {
          this.userFetched.set(true);
          sessions.forEach(session => this.cacheService.set(session));
        }),
        // No other way to get sessions, only for current user. So it means all sessions are user's.
        switchMap(_ => this.cacheService.getAll())
      );
  }

  revoke(id: string): Observable<void> {
    return this.httpClient
      .delete<void>(this.apiRouter.session.revoke(id))
      .pipe(
        tap(() => this.cacheService.delete(id))
      );
  }

  updateProperties(session: Session): Session {
    return {
      ...session,
      createdAt: DateUtil.adjustToLocalDate(session.createdAt)
    };
  }
}
