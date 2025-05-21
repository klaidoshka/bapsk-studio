import {inject, Injectable, signal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {toUserIdentity, User, UserCreateRequest, UserEditRequest, UserIdentity} from '../model/user.model';
import {first, map, Observable, of, switchMap, tap} from 'rxjs';
import {EnumUtil} from '../util/enum.util';
import {Role} from '../model/role.model';
import {IsoCountryCode} from '../model/iso-country.model';
import {DateUtil} from '../util/date.util';
import {CacheService} from './cache.service';
import {EventService} from './event.service';
import {events} from '../model/event.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly httpClient = inject(HttpClient);
  private readonly eventService = inject(EventService);
  private readonly cacheIdentityService = new CacheService<number, UserIdentity>(identity => identity.id);
  private readonly cacheUserService = new CacheService<number, User>(user => user.id);
  private readonly usersFetched = signal<boolean>(false);

  constructor() {
    this.eventService.subscribe(events.loggedOut, () => {
      this.cacheIdentityService.deleteAll();
      this.cacheUserService.deleteAll();
      this.usersFetched.set(false);
    });
  }

  private adjustRequestDateToISO<T extends UserCreateRequest | UserEditRequest>(request: T): T {
    return {
      ...request,
      birthDate: request.birthDate?.toISOString() as any
    };
  }

  create(request: UserCreateRequest): Observable<User> {
    return this.httpClient
      .post<User>(this.apiRouter.user.create(), this.adjustRequestDateToISO(request))
      .pipe(
        map(user => this.updateProperties(user)),
        tap(user => {
          this.cacheUserService.set(user);
          this.cacheIdentityService.set(toUserIdentity(user));
        }),
        switchMap(user => this.cacheUserService.get(user.id))
      );
  };

  delete(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.apiRouter.user.delete(id))
      .pipe(
        tap(() => {
          this.cacheUserService.delete(id);
          this.cacheIdentityService.delete(id);
        })
      );
  };

  edit(request: UserEditRequest): Observable<void> {
    return this.httpClient
      .put<void>(this.apiRouter.user.edit(request.userId), this.adjustRequestDateToISO(request))
      .pipe(
        tap(() => {
            this.cacheUserService.invalidate(request.userId);

            this
              .getById(request.userId)
              .pipe(first())
              .subscribe();
          }
        )
      );
  };

  getAll(): Observable<User[]> {
    if (this.usersFetched()) {
      return this.cacheUserService.getAll();
    }

    return this.httpClient
      .get<User[]>(this.apiRouter.user.getAll())
      .pipe(
        map(users => users.map(user => this.updateProperties(user))),
        tap(users => {
          this.usersFetched.set(true);
          users.forEach(user => {
            this.cacheUserService.set(user);
            this.cacheIdentityService.set(toUserIdentity(user));
          });
        }),
        switchMap(_ => this.cacheUserService.getAll())
      );
  };

  getById(id: number): Observable<User> {
    if (this.cacheUserService.has(id)) {
      return this.cacheUserService.get(id);
    }

    return this.httpClient
      .get<User>(this.apiRouter.user.getById(id))
      .pipe(
        map(user => this.updateProperties(user)),
        tap(user => {
          this.cacheUserService.set(user);
          this.cacheIdentityService.set(toUserIdentity(user));
        }),
        switchMap(user => this.cacheUserService.get(user.id))
      );
  };

  getIdentityById(id: number): Observable<UserIdentity> {
    if (this.cacheIdentityService.has(id)) {
      return this.cacheIdentityService.get(id);
    }

    return this.httpClient
      .get<UserIdentity>(this.apiRouter.user.getById(id, true))
      .pipe(
        tap(identity => this.cacheIdentityService.set(identity)),
        switchMap(identity => this.cacheIdentityService.get(identity.id))
      );
  };

  getIdentityByEmail(email: string): Observable<UserIdentity | undefined> {
    const candidate = this.cacheUserService.execute(values => {
      const user = Array
        .from(values.values())
        .find(user => user.email.toLowerCase() === email.toLowerCase());

      if (user) {
        return toUserIdentity(user);
      }

      return undefined;
    });

    if (candidate) {
      return this.cacheUserService
        .getAllWhere(user => user.email.toLowerCase() === email.toLowerCase())
        .pipe(
          map(users => users.length > 0 ? toUserIdentity(users[0]) : undefined),
          switchMap(identity => identity ? this.cacheIdentityService.get(identity.id) : of(undefined))
        );
    }

    return this.httpClient
      .get<UserIdentity[]>(this.apiRouter.user.getByEmail(email, true))
      .pipe(
        map(identities => identities.length > 0 ? identities[0] : undefined),
        tap(identity => {
          if (identity) {
            this.cacheIdentityService.set(identity);
          }
        }),
        switchMap(identity => identity ? this.cacheIdentityService.get(identity.id) : of(undefined))
      );
  }

  updateProperties(user: User): User {
    return {
      ...user,
      birthDate: DateUtil.adjustToLocalDate(user.birthDate),
      country: EnumUtil.toEnumOrThrow(user.country, IsoCountryCode),
      role: EnumUtil.toEnumOrThrow(user.role, Role)
    };
  };
}
