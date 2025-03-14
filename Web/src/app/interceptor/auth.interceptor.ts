import {HttpErrorResponse, HttpInterceptorFn} from "@angular/common/http";
import {inject, signal} from "@angular/core";
import {Router} from "@angular/router";
import {catchError, switchMap, throwError} from "rxjs";
import {ApiRouter} from "../service/api-router.service";
import {AuthService} from "../service/auth.service";

const renewingAccess = signal<boolean>(false);

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
      console.log("Error in authInterceptor", error);

      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        renewingAccess() ||
        error.url?.includes(apiRouter.authRefresh())
      ) {
        return throwError(() => error);
      }

      console.log("Passed the first check. Going for token renewal.");

      renewingAccess.set(true);

      return authService.renewAccess().pipe(
        switchMap((accessToken) => {
          if (accessToken) {
            authService.acceptAuthResponse(accessToken);
            renewingAccess.set(false);

            console.log("Got a new access token. Retrying the original request.");

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

          console.log("No new access token. Throwing an error.");

          // If no new access token, throw an error
          return throwError(() => error);
        }),
        catchError((error) => {
          console.log("Caught an error while renewing the access token.", error);

          // Redirect to the auth-login page if the refresh token fails
          return authService.logout().pipe(
            switchMap(() => {
              console.log("Logged out. Redirecting to the login page.");
              // router.navigate(["/auth/login"]);
              renewingAccess.set(false);
              return throwError(() => error);
            })
          );
        })
      );
    })
  );
};
