import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {BehaviorSubject, filter, finalize, map, Observable, of, switchMap, tap} from "rxjs";
import {AuthResponse, ChangePasswordRequest, LoginRequest, RegisterRequest} from "../model/auth.model";
import {User} from "../model/user.model";
import {ApiRouter} from "./api-router.service";
import {UserService} from './user.service';
import {Router} from "@angular/router";
import {LocalStorageKeys} from '../constant/local-storage.keys';
import {EventService} from './event.service';
import {events} from '../model/event.model';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly eventService = inject(EventService);
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly access = new BehaviorSubject<AuthResponse | undefined>(this.getAccess());

  constructor() {
    if (this.access.value?.accessToken) {
      // Authenticated
      return;
    }

    this
      .renewAccess()
      .subscribe({
        next: (response) => this.acceptAuthResponse(response),
        error: (response) => {
          if (response.status === 401) {
            this.cleanupCredentials();
            this.router.navigate(["/auth/login"]);
          }
        }
      });
  }

  private resolveUser(userId?: number): Observable<User | undefined> {
    if (userId === undefined) {
      return of(this.resolveUserFromStorage());
    }

    return this.userService
      .getById(userId)
      .pipe(
        tap(user => localStorage.setItem(LocalStorageKeys.userKey, JSON.stringify(user)))
      );
  }

  private resolveUserFromStorage(): User | undefined {
    const value = localStorage.getItem(LocalStorageKeys.userKey);
    return value != null ? this.userService.updateProperties(JSON.parse(value)) : undefined;
  }

  acceptAuthResponse(response: AuthResponse) {
    localStorage.setItem(LocalStorageKeys.accessKey, JSON.stringify(response));

    this.access.next(response);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.httpClient.post<void>(this.apiRouter.auth.changePassword(), request);
  }

  cleanupCredentials() {
    localStorage.removeItem(LocalStorageKeys.accessKey);
    localStorage.removeItem(LocalStorageKeys.userKey);

    if (this.access.value !== undefined) {
      this.access.next(undefined);
    }

    this.eventService.call(events.loggedOut);
  }

  private getAccess(): AuthResponse | undefined {
    const access = localStorage.getItem(LocalStorageKeys.accessKey);

    return access != null ? JSON.parse(access) : undefined;
  }

  getAccessToken(): string | undefined {
    return this.access.value?.accessToken;
  }

  getSessionId(): Observable<string> {
    return this.access
      .asObservable()
      .pipe(
        filter(access => !!access?.sessionId),
        map(access => access!.sessionId)
      );
  }

  getUser(): Observable<User> {
    return this.access
      .asObservable()
      .pipe(
        switchMap(access => this.resolveUser(access?.userId)),
        filter(user => user != null)
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.access
      .asObservable()
      .pipe(
        map(access => access?.accessToken !== undefined)
      );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(
      this.apiRouter.auth.login(),
      request
    );
  }

  logout(): Observable<void> {
    if (this.access.value?.accessToken === undefined) {
      return of();
    }

    return this.httpClient
      .post<void>(this.apiRouter.auth.logout(), {})
      .pipe(
        finalize(() => this.cleanupCredentials())
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
