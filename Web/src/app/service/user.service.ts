import {Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {
  toUserIdentity,
  User,
  UserCreateRequest,
  UserEditRequest,
  UserIdentity
} from '../model/user.model';
import {first, Observable, of, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {toEnumOrThrow} from '../util/enum.util';
import {Role} from '../model/role.model';
import {getIsoCountryByCode} from '../model/iso-country.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users = signal(new Map<number, WritableSignal<User | null>>());
  private userIdentities = signal(new Map<number, WritableSignal<UserIdentity | null>>());
  private usersSignal = signal<User[]>([]);

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
  ) {
    // Load initial data. Block until the data is loaded.
    this.get().subscribe();
  }

  private readonly updateCachedUser = (user: User): Signal<User | null> => {
    let candidate = this.users().get(user.id);

    if (candidate != null) {
      candidate.update(_ => ({
        ...user,
        country: getIsoCountryByCode(user.country as unknown as string),
        role: toEnumOrThrow(user.role, Role)
      }));
    } else {
      this.users().set(user.id, signal({
        ...user,
        country: getIsoCountryByCode(user.country as unknown as string),
        role: toEnumOrThrow(user.role, Role)
      }));
    }

    this.updateUsersSignal();
    this.updateCachedUserIdentity(toUserIdentity(user));

    return this.users().get(user.id)!;
  }

  private readonly updateCachedUserIdentity = (userIdentity: UserIdentity): Signal<UserIdentity | null> => {
    let candidateIdentity = this.userIdentities().get(userIdentity.id);

    if (candidateIdentity != null) {
      candidateIdentity.update(_ => userIdentity);
    } else {
      this.userIdentities().set(userIdentity.id, signal(userIdentity));
    }

    return this.userIdentities().get(userIdentity.id)!;
  }

  private readonly updateUsersSignal = () => {
    this.usersSignal.update(() =>
      Array.from(this.users().values())
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
        const user = this.users().get(id);

        if (user != null) {
          user.update(_ => null);
          this.users().delete(id);
          this.updateUsersSignal();
        }

        const userIdentity = this.userIdentities().get(id);

        if (userIdentity != null) {
          userIdentity.update(_ => null);
          this.userIdentities().delete(id);
        }
      })
    );
  }

  readonly edit = (request: UserEditRequest): Observable<void> => {
    return this.httpClient
    .put<void>(this.apiRouter.userEdit(request.userId), request)
    .pipe(
      tap(() => {
          const user = this.users().get(request.userId)?.();

          // Must exist, if edit is called.
          if (user != null) {
            this.updateCachedUser({
              ...user,
              birthDate: request.birthDate,
              // Will be updated to correct enum within #updateCachedUser.
              country: request.country as any,
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
    return this.usersSignal.asReadonly();
  }

  readonly getById = (id: number): Observable<User> => {
    let candidate = this.users().get(id)?.();

    if (candidate != null) {
      return of(candidate);
    }

    return this.httpClient
    .get<User>(this.apiRouter.userGetById(id))
    .pipe(tap((user: User) => this.updateCachedUser(user)));
  }

  readonly getByIdAsSignal = (id: number): Signal<User | null> => {
    const candidate = this.users().get(id);

    if (candidate != null) {
      return candidate;
    }

    this.users().set(id, signal(null));

    // Fetch the user identity from the server. It is cached in the signal by underlying call.
    new Promise((resolve) => this.getById(id).pipe(first()).subscribe(resolve));

    return this.users().get(id)!;
  }

  readonly getIdentityById = (id: number): Observable<UserIdentity> => {
    let candidate = this.userIdentities().get(id)?.();

    if (candidate != null) {
      return of(candidate);
    }

    return this.httpClient
    .get<UserIdentity>(this.apiRouter.userGetById(id, true))
    .pipe(tap((user: UserIdentity) => this.updateCachedUserIdentity(user)));
  }

  readonly getIdentityByIdAsSignal = (id: number): Signal<UserIdentity | null> => {
    const candidate = this.userIdentities().get(id);

    if (candidate != null) {
      return candidate;
    }

    this.userIdentities().set(id, signal(null));

    // Fetch the user identity from the server. It is cached in the signal by underlying call.
    new Promise((resolve) => this.getIdentityById(id).pipe(first()).subscribe(resolve));

    return this.userIdentities().get(id)!;
  }
}
