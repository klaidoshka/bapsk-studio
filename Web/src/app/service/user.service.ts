import {computed, Injectable, Signal, signal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {toUserIdentity, User, UserCreateRequest, UserEditRequest, UserIdentity} from '../model/user.model';
import {first, Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {toEnumOrThrow} from '../util/enum.util';
import {Role} from '../model/role.model';
import {IsoCountryCode} from '../model/iso-country.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private storeUsers = signal<User[]>([]);
  private storeIdentities = signal<UserIdentity[]>([]);

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
  ) {
  }

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

  readonly create = (request: UserCreateRequest): Observable<User> => {
    return this.httpClient
    .post<User>(this.apiRouter.userCreate(), {
      ...request,
      birthDate: request.birthDate.toISOString() as any
    } as UserCreateRequest)
    .pipe(tap(user => this.updateCachedUser(user)));
  };

  readonly delete = (id: number): Observable<void> => {
    return this.httpClient.delete<void>(this.apiRouter.userDelete(id)).pipe(
      tap(() => {
        this.storeUsers.set(this.storeUsers().filter(user => user.id !== id));
        this.storeIdentities.set(this.storeIdentities().filter(identity => identity.id !== id));
      })
    );
  };

  readonly edit = (request: UserEditRequest): Observable<void> => {
    return this.httpClient.put<void>(this.apiRouter.userEdit(request.userId), {
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

  readonly get = (): Observable<User[]> => {
    return this.httpClient.get<User[]>(this.apiRouter.userGet()).pipe(
      tap(users => {
        this.storeUsers.set(users.map(this.updateProperties));
        this.storeIdentities.set(users.map(toUserIdentity));
      })
    );
  };

  readonly getById = (id: number): Observable<User> => {
    return this.httpClient.get<User>(this.apiRouter.userGetById(id)).pipe(
      tap(user => this.updateCachedUser(user))
    );
  };

  readonly getIdentityById = (id: number): Observable<UserIdentity> => {
    return this.httpClient.get<UserIdentity>(this.apiRouter.userGetById(id, true)).pipe(
      tap(identity => this.updateCachedUserIdentity(identity))
    );
  };

  readonly getAsSignal = (): Signal<User[]> => {
    if (this.storeUsers().length === 0) {
      new Promise((resolve) => this.get().pipe(first()).subscribe(resolve));
    }

    return this.storeUsers.asReadonly();
  };

  readonly getByIdAsSignal = (id: number): Signal<User | undefined> => {
    const index = this.storeUsers().findIndex(user => user.id === id);

    if (index === -1) {
      new Promise((resolve) => this.getById(id).pipe(first()).subscribe(resolve));
    }

    return computed(() =>
      index !== -1
        ? this.storeUsers().at(index)!
        : (this.storeUsers().find(user => user.id === id))
    );
  };

  readonly getIdentityByIdAsSignal = (id: number): Signal<UserIdentity | undefined> => {
    const index = this.storeIdentities().findIndex(identity => identity.id === id);

    if (index === -1) {
      new Promise((resolve) => this.getIdentityById(id).pipe(first()).subscribe(resolve));
    }

    return computed(() =>
      index !== -1
        ? this.storeIdentities().at(index)!
        : (this.storeIdentities().find(it => it.id === id))
    );
  };

  private updateProperties = (user: User): User => {
    return {
      ...user,
      birthDate: new Date(user.birthDate),
      country: toEnumOrThrow(user.country, IsoCountryCode),
      role: toEnumOrThrow(user.role, Role)
    };
  };
}
