import {HttpClient} from "@angular/common/http";
import {Injectable, Signal, signal} from "@angular/core";
import {finalize, Observable, of} from "rxjs";
import {AuthResponse, LoginRequest, RegisterRequest, User} from "../model/auth.model";
import {ApiRouter} from "./api-router.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private accessTokenKey = "__accounting_accessToken__";
  private user = signal<User | null>(null);
  private userAuthenticated = signal<boolean>(this.getAccessToken() !== null);
  private userRefreshing = signal<boolean>(false);

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
  ) {
    if (this.userAuthenticated() && this.user() === null) {
      
    }
  }

  acceptAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.accessTokenKey, response.accessToken);
    this.user.set(response.user);
    this.userAuthenticated.set(true);
  }

  cleanupCredentials(): void {
    localStorage.removeItem(this.accessTokenKey);

    if (this.userAuthenticated()) {
      this.userAuthenticated.set(false);
    }

    if (this.user() !== null) {
      this.user.set(null);
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getUser(): Signal<User | null> {
    return this.user.asReadonly();
  }

  isAuthenticated(): Signal<boolean> {
    return this.userAuthenticated.asReadonly();
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
