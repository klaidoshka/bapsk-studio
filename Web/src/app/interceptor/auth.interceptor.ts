import {HttpErrorResponse, HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {catchError, switchMap, throwError} from "rxjs";
import {ApiRouter} from "../service/api-router.service";
import {AuthService} from "../service/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiRouter = inject(ApiRouter);
  const authService = inject(AuthService);
  const router = inject(Router);
  const accessToken = authService.getAccessToken();

  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    },
    withCredentials: true
  });

  return next(req).pipe(
    catchError((error) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        authService.isRefreshingAccess() ||
        error.url?.includes(apiRouter.authRefresh())
      ) {
        return throwError(() => error);
      }

      authService.markAsRefreshingAccess(true);

      return authService.renewAccess().pipe(
        switchMap((accessToken) => {
          if (accessToken) {
            authService.acceptAuthResponse(accessToken);
            authService.markAsRefreshingAccess(false);

            // Retry the original request with the new access token
            return next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${accessToken}`
                },
                withCredentials: true
              })
            );
          }

          // If no new access token, throw an error
          return throwError(() => error);
        }),
        catchError((error) => {
          // Redirect to the auth-login page if the refresh token fails
          return authService.logout().pipe(
            switchMap(() => {
              router.navigate(["/auth/login"]);
              authService.markAsRefreshingAccess(false);
              return throwError(() => error);
            })
          );
        })
      );
    })
  );
};
