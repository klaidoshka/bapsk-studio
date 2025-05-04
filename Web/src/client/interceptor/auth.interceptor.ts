import {HttpErrorResponse, HttpEvent, HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  concatAll,
  finalize,
  Observable,
  Subject,
  switchMap,
  tap,
  throwError
} from "rxjs";
import {ApiRouter} from "../service/api-router.service";
import {AuthService} from "../service/auth.service";

let retryQueue = new Subject<Observable<any>>();
const isRefreshing = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiRouter = inject(ApiRouter);
  const authService = inject(AuthService);

  const cloneWithToken = (token: string | undefined) => req.clone({
    setHeaders: {Authorization: `Bearer ${token}`},
    withCredentials: true
  });

  return next(cloneWithToken(authService.getAccessToken()))
    .pipe(
      catchError(error => {
        const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;
        const isRefreshCall = error.url?.includes(apiRouter.auth.refresh());

        if (!isUnauthorized || isRefreshCall) {
          return throwError(() => error);
        }

        const retryRequest = () => next(cloneWithToken(authService.getAccessToken()));

        if (isRefreshing.getValue()) {
          return new Observable<HttpEvent<unknown>>(observer => {
            retryQueue.next(retryRequest().pipe(
              tap({
                next: (value) => observer.next(value),
                error: (error) => observer.error(error),
                complete: () => observer.complete()
              })
            ));
          });
        }

        isRefreshing.next(true);
        retryQueue = new Subject();

        return authService.renewAccess().pipe(
          switchMap(response => {
            if (!response) {
              throw new Error('Refresh failed');
            }
            authService.acceptAuthResponse(response);
            retryQueue
              .pipe(
                concatAll(),
                finalize(() => {
                  retryQueue.complete();
                  retryQueue = new Subject();
                })
              )
              .subscribe();
            return retryRequest();
          }),
          catchError(err => {
            retryQueue.error(err);
            retryQueue.complete();
            retryQueue = new Subject();
            return throwError(() => err);
          }),
          finalize(() => isRefreshing.next(false))
        );
      })
    );
};
