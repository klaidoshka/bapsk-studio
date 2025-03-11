import {HttpClient} from "@angular/common/http";
import {computed, Injectable, Signal, signal, WritableSignal} from "@angular/core";
import {finalize, Observable, of} from "rxjs";
import {AuthResponse, LoginRequest, RegisterRequest} from "../model/auth.model";
import {User} from "../model/user.model";
import {ApiRouter} from "./api-router.service";
import {toEnumOrThrow} from '../util/enum.util';
import {Role} from '../model/role.model';
import {IsoCountryCode} from '../model/iso-country.model';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private accessKey = "__accounting_access__";
  private access!: WritableSignal<AuthResponse | null>;
  private user = computed(() => this.access()?.user || null);
  private userAuthenticated = computed(() => this.access() !== null);
  private userRefreshing = signal<boolean>(false);
  private userSessionId = computed(() => this.access()?.sessionId || null);

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
  ) {
    this.access = signal<AuthResponse | null>(this.getAccess());
  }

  readonly acceptAuthResponse = (response: AuthResponse): void => {
    response = {
      ...response,
      user: {
        ...response.user,
        country: toEnumOrThrow(response.user.country, IsoCountryCode),
        role: toEnumOrThrow(response.user.role, Role)
      }
    };

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

  readonly getSessionId = (): Signal<string | null> => {
    return this.userSessionId;
  }

  readonly getUser = (): Signal<User | null> => {
    return this.user;
  }

  readonly isAuthenticated = (): Signal<boolean> => {
    return this.userAuthenticated;
  }

  readonly isRefreshingAccess = (): Signal<boolean> => {
    return this.userRefreshing.asReadonly();
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

  readonly markAsRefreshingAccess = (isRefreshing: boolean): void => {
    if (this.userRefreshing() !== isRefreshing) {
      this.userRefreshing.set(isRefreshing);
    }
  }

  readonly register = (request: RegisterRequest): Observable<AuthResponse> => {
    return this.httpClient.post<AuthResponse>(
      this.apiRouter.authRegister(),
      request
    );
  }

  readonly renewAccess = (): Observable<AuthResponse> => {
    return this.httpClient.post<AuthResponse>(this.apiRouter.authRefresh(), {});
  }
}
