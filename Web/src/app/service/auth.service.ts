import {HttpClient} from "@angular/common/http";
import {computed, Injectable, Signal, signal, WritableSignal} from "@angular/core";
import {finalize, Observable, of} from "rxjs";
import {AuthResponse, LoginRequest, RegisterRequest} from "../model/auth.model";
import {User} from "../model/user.model";
import {ApiRouter} from "./api-router.service";
import {UserService} from './user.service';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly accessKey: string = "__accounting_access__";
  private readonly userKey: string = "__accounting_user__";
  private readonly access!: WritableSignal<AuthResponse | null>;
  private readonly user!: Signal<User | undefined>;
  private readonly userAuthenticated!: Signal<boolean>;
  private readonly userSessionId!: Signal<string | undefined>;

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient,
    private userService: UserService
  ) {
    this.access = signal<AuthResponse | null>(this.getAccess());
    this.user = this.toUser();
    this.userAuthenticated = computed(() => this.access() !== null);
    this.userSessionId = computed(() => this.access()?.sessionId);
  }

  readonly acceptAuthResponse = (response: AuthResponse): void => {
    localStorage.setItem(this.accessKey, JSON.stringify(response));

    this.access.set(response);
  }

  readonly cleanupCredentials = (): void => {
    localStorage.removeItem(this.accessKey);

    if (this.access() !== null) {
      this.access.set(null);
    }
  }

  private readonly getAccess = (): AuthResponse | null => {
    const access = localStorage.getItem(this.accessKey);

    return access !== null ? JSON.parse(access) : null;
  }

  readonly getAccessToken = (): string | null => {
    return this.access()?.accessToken || null;
  }

  readonly getSessionId = (): Signal<string | undefined> => {
    return this.userSessionId;
  }

  readonly getUser = (): Signal<User | undefined> => {
    return this.user;
  }

  readonly isAuthenticated = (): Signal<boolean> => {
    return this.userAuthenticated;
  }

  readonly login = (request: LoginRequest): Observable<AuthResponse> => {
    return this.httpClient.post<AuthResponse>(
      this.apiRouter.authLogin(),
      request
    );
  }

  readonly logout = (): Observable<void> => {
    if (!this.userAuthenticated()) {
      return of();
    }

    return this.httpClient.post<void>(this.apiRouter.authLogout(), {}).pipe(
      finalize(() => {
        this.cleanupCredentials();
      })
    );
  }

  readonly register = (request: RegisterRequest): Observable<AuthResponse> => {
    return this.httpClient.post<AuthResponse>(
      this.apiRouter.authRegister(),
      {
        ...request,
        birthDate: request.birthDate.toISOString() as any
      } as RegisterRequest
    );
  }

  readonly renewAccess = (): Observable<AuthResponse> => {
    return this.httpClient.post<AuthResponse>(this.apiRouter.authRefresh(), {});
  }

  private readonly toUser = (): Signal<User | undefined> => {
    return computed(() => {
      const userId = this.access()?.userId;

      if (userId == null) {
        const value = localStorage.getItem(this.userKey);

        return value !== null ? JSON.parse(value) : undefined;
      }

      const user = this.userService.getByIdAsSignal(userId)();

      if (user == null) {
        const value = localStorage.getItem(this.userKey);

        return value !== null ? JSON.parse(value) : undefined;
      }

      localStorage.setItem(this.userKey, JSON.stringify(user));

      return user;
    })
  }
}
