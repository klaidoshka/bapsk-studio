import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {BehaviorSubject, finalize, Observable, of} from "rxjs";
import {AuthResponse, LoginRequest, RegisterRequest, User} from "../model/auth.model";
import {ApiRouter} from "./api-router.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private apiRouter = inject(ApiRouter);
  private httpClient = inject(HttpClient);
  private accessTokenKey = "__accounting_accessToken__";
  private stateSubject = new BehaviorSubject<boolean>(this.getAccessToken() !== null);
  private userSubject = new BehaviorSubject<User | null>(null);
  private isRefreshing = false;

  acceptAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.accessTokenKey, response.accessToken);
    this.userSubject.next(response.user);
    this.stateSubject.next(true);
  }

  cleanupCredentials(): void {
    localStorage.removeItem(this.accessTokenKey);

    if (this.stateSubject.value) {
      this.stateSubject.next(false);
    }

    if (this.userSubject.value) {
      this.userSubject.next(null);
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  getUserValue(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): Observable<boolean> {
    return this.stateSubject.asObservable();
  }

  isAuthenticatedValue(): boolean {
    return this.stateSubject.value;
  }

  isRefreshingAccess(): boolean {
    return this.isRefreshing;
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(
        this.apiRouter.authLogin(),
        request
    );
  }

  logout(): Observable<void> {
    if (!this.isAuthenticatedValue()) {
      return of();
    }

    return this.httpClient.post<void>(this.apiRouter.authLogout(), {}).pipe(
        finalize(() => {
          this.cleanupCredentials();
        })
    );
  }

  markAsRefreshingAccess(isRefreshing: boolean): void {
    this.isRefreshing = isRefreshing;
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
