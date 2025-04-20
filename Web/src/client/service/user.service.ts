import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {toUserIdentity, User, UserCreateRequest, UserEditRequest, UserIdentity} from '../model/user.model';
import {first, Observable, of, switchMap, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {EnumUtil} from '../util/enum.util';
import {Role} from '../model/role.model';
import {IsoCountryCode} from '../model/iso-country.model';
import {DateUtil} from '../util/date.util';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly httpClient = inject(HttpClient);

  private readonly storeUsers = signal<User[]>([]);
  private readonly storeIdentities = signal<UserIdentity[]>([]);

  private updateCachedUser = (user: User): void => {
    const users = this.storeUsers();
    const index = users.findIndex(u => u.id === user.id);

    if (index !== -1) {
      users[index] = this.updateProperties(user);
    } else {
      users.push(this.updateProperties(user));
    }

    this.storeUsers.set([...users]);
    this.updateCachedUserIdentity(toUserIdentity(user));
  };

  private updateCachedUserIdentity = (userIdentity: UserIdentity): void => {
    const identities = this.storeIdentities();
    const index = identities.findIndex(i => i.id === userIdentity.id);

    if (index !== -1) {
      identities[index] = userIdentity;
    } else {
      identities.push(userIdentity);
    }

    this.storeIdentities.set([...identities]);
  };

  create(request: UserCreateRequest): Observable<User> {
    return this.httpClient
      .post<User>(this.apiRouter.user.create(), {
        ...request,
        birthDate: request.birthDate.toISOString() as any
      } as UserCreateRequest)
      .pipe(tap(user => this.updateCachedUser(user)));
  };

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.apiRouter.user.delete(id)).pipe(
      tap(() => {
        this.storeUsers.set(this.storeUsers().filter(user => user.id !== id));
        this.storeIdentities.set(this.storeIdentities().filter(identity => identity.id !== id));
      })
    );
  };

  edit(request: UserEditRequest): Observable<void> {
    return this.httpClient.put<void>(this.apiRouter.user.edit(request.userId), {
      ...request,
      birthDate: request.birthDate.toISOString() as any
    } as UserEditRequest).pipe(
      tap(() => {
        const users = this.storeUsers();
        const index = users.findIndex(user => user.id === request.userId);

        if (index !== -1) {
          users[index] = {
            ...users[index],
            ...request
          };

          this.storeUsers.set([...users]);
        }
      })
    );
  };

  get(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiRouter.user.get()).pipe(
      tap(users => {
        this.storeUsers.set(users.map(user => this.updateProperties(user)));
        this.storeIdentities.set(users.map(user => toUserIdentity(user)));
      })
    );
  };

  getById(id: number): Observable<User> {
    return this.httpClient.get<User>(this.apiRouter.user.getById(id)).pipe(
      tap(user => this.updateCachedUser(user))
    );
  };

  getIdentityById(id: number): Observable<UserIdentity> {
    return this.httpClient.get<UserIdentity>(this.apiRouter.user.getById(id, true)).pipe(
      tap(identity => this.updateCachedUserIdentity(identity))
    );
  };

  getAsSignal(): Signal<User[]> {
    if (this.storeUsers().length === 0) {
      new Promise((resolve) => this.get().pipe(first()).subscribe(resolve));
    }

    return this.storeUsers.asReadonly();
  };

  getByIdAsSignal(id: number): Signal<User | undefined> {
    const index = this.storeUsers().findIndex(user => user.id === id);

    if (index === -1) {
      new Promise((resolve) => this.getById(id).pipe(first()).subscribe(resolve));
    }

    return computed(() =>
      index !== -1
        ? this.storeUsers().at(index)!
        : this.storeUsers().find(user => user.id === id)
    );
  };

  getIdentityByIdAsSignal(id: number): Signal<UserIdentity | undefined> {
    const index = this.storeIdentities().findIndex(identity => identity.id === id);

    if (index === -1) {
      new Promise((resolve) => this.getIdentityById(id).pipe(first()).subscribe(resolve));
    }

    return computed(() =>
      index !== -1
        ? this.storeIdentities().at(index)!
        : this.storeIdentities().find(it => it.id === id)
    );
  };

  getIdentityByEmail(email: string): Observable<UserIdentity | undefined> {
    const emailNormalized = email.toLowerCase();
    const index = this.storeUsers().findIndex(user => user.email.toLowerCase() === emailNormalized);

    if (index !== -1) {
      return of(toUserIdentity(this.storeUsers().at(index)!));
    }

    return this.httpClient.get<UserIdentity[]>(this.apiRouter.user.getByEmail(email, true)).pipe(
      tap(identities => identities.forEach(this.updateCachedUserIdentity)),
      switchMap(identities => of(identities.length > 0 ? identities[0] : undefined)),
      first()
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
