import {Injectable, Signal, signal, WritableSignal} from '@angular/core';
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
  // TODO: Just make two instead of three signals. Use arrays.
  private storeUsers = signal(new Map<number, WritableSignal<User | null>>());
  private storeIdentities = signal(new Map<number, WritableSignal<UserIdentity | null>>());
  private store = signal<User[]>([]);

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
  ) {
    // Load initial data. Block until the data is loaded.
    this.get().subscribe();
  }

  private readonly updateCachedUser = (user: User): Signal<User | null> => {
    let candidate = this.storeUsers().get(user.id);

    if (candidate != null) {
      candidate.update(_ => this.updateProperties(user));
    } else {
      this.storeUsers().set(user.id, signal(this.updateProperties(user)));
    }

    this.updateUsersSignal();
    this.updateCachedUserIdentity(toUserIdentity(user));

    return this.storeUsers().get(user.id)!;
  }

  private readonly updateCachedUserIdentity = (userIdentity: UserIdentity): Signal<UserIdentity | null> => {
    let candidateIdentity = this.storeIdentities().get(userIdentity.id);

    if (candidateIdentity != null) {
      candidateIdentity.update(_ => userIdentity);
    } else {
      this.storeIdentities().set(userIdentity.id, signal(userIdentity));
    }

    return this.storeIdentities().get(userIdentity.id)!;
  }

  private readonly updateUsersSignal = () => {
    this.store.update(() =>
      Array.from(this.storeUsers().values())
      .map(user => user())
      .filter(user => user !== null) as User[]
    );
  };

  readonly create = (request: UserCreateRequest): Observable<User> => {
    return this.httpClient
    .post<User>(this.apiRouter.userCreate(), request)
    .pipe(tap((user: User) => this.updateCachedUser(user)));
  }

  readonly delete = (id: number): Observable<void> => {
    return this.httpClient
    .delete<void>(this.apiRouter.userDelete(id))
    .pipe(
      tap(() => {
        // Updating both signals to null to notify subscribers that the user is deleted.
        const user = this.storeUsers().get(id);

        if (user != null) {
          user.update(_ => null);
          this.storeUsers().delete(id);
          this.updateUsersSignal();
        }

        const userIdentity = this.storeIdentities().get(id);

        if (userIdentity != null) {
          userIdentity.update(_ => null);
          this.storeIdentities().delete(id);
        }
      })
    );
  }

  readonly edit = (request: UserEditRequest): Observable<void> => {
    return this.httpClient
    .put<void>(this.apiRouter.userEdit(request.userId), request)
    .pipe(
      tap(() => {
        const user = this.storeUsers().get(request.userId)?.();

          // Must exist, if edit is called.
          if (user != null) {
            this.updateCachedUser({
              ...user,
              birthDate: request.birthDate,
              country: request.country,
              email: request.email,
              firstName: request.firstName,
              lastName: request.lastName
            });
          }
        }
      )
    );
  }

  readonly get = (): Observable<User[]> => {
    return this.httpClient
    .get<User[]>(this.apiRouter.userGet())
    .pipe(tap((users: User[]) => users.forEach(this.updateCachedUser)));
  }

  readonly getAsSignal = (): Signal<User[]> => {
    return this.store.asReadonly();
  }

  readonly getById = (id: number): Observable<User> => {
    return this.httpClient
    .get<User>(this.apiRouter.userGetById(id))
    .pipe(tap((user: User) => this.updateCachedUser(user)));
  }

  readonly getByIdAsSignal = (id: number): Signal<User | null> => {
    const candidate = this.storeUsers().get(id);

    if (candidate != null) {
      return candidate;
    }

    this.storeUsers().set(id, signal(null));

    // Fetch the user identity from the server. It is cached in the signal by underlying call.
    new Promise((resolve) => this.getById(id).pipe(first()).subscribe(resolve));

    return this.storeUsers().get(id)!.asReadonly();
  }

  readonly getIdentityById = (id: number): Observable<UserIdentity> => {
    return this.httpClient
    .get<UserIdentity>(this.apiRouter.userGetById(id, true))
    .pipe(tap((user: UserIdentity) => this.updateCachedUserIdentity(user)));
  }

  readonly getIdentityByIdAsSignal = (id: number): Signal<UserIdentity | null> => {
    const candidate = this.storeIdentities().get(id);

    if (candidate != null) {
      return candidate;
    }

    this.storeIdentities().set(id, signal(null));

    // Fetch the user identity from the server. It is cached in the signal by underlying call.
    new Promise((resolve) => this.getIdentityById(id).pipe(first()).subscribe(resolve));

    return this.storeIdentities().get(id)!.asReadonly();
  }

  readonly updateProperties = (user: User): User => {
    return {
      ...user,
      birthDate: new Date(user.birthDate),
      country: toEnumOrThrow(user.country, IsoCountryCode),
      role: toEnumOrThrow(user.role, Role)
    }
  }
}
