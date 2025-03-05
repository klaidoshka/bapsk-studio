import {HttpClient} from "@angular/common/http";
import {computed, Injectable, Signal, signal} from "@angular/core";
import {finalize, Observable, of} from "rxjs";
import {AuthResponse, LoginRequest, RegisterRequest, User} from "../model/auth.model";
import {ApiRouter} from "./api-router.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private accessKey = "__accounting_access__";
  private access = signal<AuthResponse | null>(this.getAccess());
  private user = computed(() => this.access()?.user || null);
  private userAuthenticated = computed(() => this.access() !== null);
  private userRefreshing = signal<boolean>(false);
  private userSessionId = computed(() => this.access()?.sessionId || null);

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
  ) {
  }

  acceptAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.accessKey, JSON.stringify(response));
    this.access.set(response);
  }

  cleanupCredentials(): void {
    localStorage.removeItem(this.accessKey);

    if (this.access() !== null) {
      this.access.set(null);
    }
  }

  private getAccess(): AuthResponse | null {
    const access = localStorage.getItem(this.accessKey);
    return access !== null ? JSON.parse(access) : null;
  }

  getAccessToken(): string | null {
    return this.access()?.accessToken || null;
  }

  getSessionId(): Signal<string | null> {
    return this.userSessionId;
  }

  getUser(): Signal<User | null> {
    return this.user;
  }

  isAuthenticated(): Signal<boolean> {
    return this.userAuthenticated;
  }

  isRefreshingAccess(): Signal<boolean> {
    return this.userRefreshing.asReadonly();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(
      this.apiRouter.authLogin(),
      request
    );
  }

  logout(): Observable<void> {
    if (!this.userAuthenticated()) {
      return of();
    }

    return this.httpClient.post<void>(this.apiRouter.authLogout(), {}).pipe(
      finalize(() => {
        this.cleanupCredentials();
      })
    );
  }

  markAsRefreshingAccess(isRefreshing: boolean): void {
    if (this.userRefreshing() !== isRefreshing) {
      this.userRefreshing.set(isRefreshing);
    }
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(
      this.apiRouter.authRegister(),
      request
    );
  }

  renewAccess(): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(this.apiRouter.authRefresh(), {});
  }
}
