import {HttpClient} from "@angular/common/http";
import {computed, inject, Injectable, Signal, signal} from "@angular/core";
import {finalize, Observable, of} from "rxjs";
import {AuthResponse, ChangePasswordRequest, LoginRequest, RegisterRequest} from "../model/auth.model";
import {User} from "../model/user.model";
import {ApiRouter} from "./api-router.service";
import {UserService} from './user.service';
import {Router} from "@angular/router";
import {LocalStorageKeys} from '../constant/local-storage.keys';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  private readonly access = signal<AuthResponse | null>(this.getAccess());
  private readonly user = this.toUser();
  private readonly userAuthenticated = computed(() => this.access() !== null);
  private readonly userSessionId = computed(() => this.access()?.sessionId);

  constructor() {
    if (!this.isAuthenticated()()) {
      return;
    }

    this.renewAccess().subscribe({
      next: (response) => {
        this.acceptAuthResponse(response);
      },
      error: (response) => {
        if (response.status === 401) {
          this.cleanupCredentials();
          this.router.navigate(["/auth/login"]);
        }
      }
    });
  }

  private toUser(): Signal<User | undefined> {
    return computed(() => {
      const userId = this.access()?.userId;

      if (userId == null) {
        const value = localStorage.getItem(LocalStorageKeys.userKey);

        return value !== null ? this.userService.updateProperties(JSON.parse(value)) : undefined;
      }

      const user = this.userService.getByIdAsSignal(userId)();

      if (user == null) {
        const value = localStorage.getItem(LocalStorageKeys.userKey);

        return value !== null ? this.userService.updateProperties(JSON.parse(value)) : undefined;
      }

      localStorage.setItem(LocalStorageKeys.userKey, JSON.stringify(user));

      return user;
    })
  }

  acceptAuthResponse(response: AuthResponse) {
    localStorage.setItem(LocalStorageKeys.accessKey, JSON.stringify(response));

    this.access.set(response);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.httpClient.post<void>(this.apiRouter.auth.changePassword(), request);
  }

  cleanupCredentials() {
    localStorage.removeItem(LocalStorageKeys.accessKey);
    localStorage.removeItem(LocalStorageKeys.userKey);

    if (this.access() != null) {
      this.access.set(null);
    }
  }

  private getAccess(): AuthResponse | null {
    const access = localStorage.getItem(LocalStorageKeys.accessKey);

    return access !== null ? JSON.parse(access) : null;
  }

  getAccessToken(): string | null {
    return this.access()?.accessToken || null;
  }

  getSessionId(): Signal<string | undefined> {
    return this.userSessionId;
  }

  getUser(): Signal<User | undefined> {
    return this.user;
  }

  isAuthenticated(): Signal<boolean> {
    return this.userAuthenticated;
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(
      this.apiRouter.auth.login(),
      request
    );
  }

  logout(): Observable<void> {
    if (!this.userAuthenticated()) {
      return of();
    }

    return this.httpClient.post<void>(this.apiRouter.auth.logout(), {}).pipe(
      finalize(() => {
        this.cleanupCredentials();
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(
      this.apiRouter.auth.register(),
      {
        ...request,
        birthDate: request.birthDate.toISOString() as any
      } as RegisterRequest
    );
  }

  renewAccess(): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(this.apiRouter.auth.refresh(), {});
  }

  resetPassword(email: string): Observable<void> {
    return this.httpClient.post<void>(this.apiRouter.auth.resetPassword(), { email });
  }
}
