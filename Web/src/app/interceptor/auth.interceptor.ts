import {HttpErrorResponse, HttpInterceptorFn} from "@angular/common/http";
import {inject, signal} from "@angular/core";
import {catchError, switchMap, throwError} from "rxjs";
import {ApiRouter} from "../service/api-router.service";
import {AuthService} from "../service/auth.service";

const renewingAccess = signal<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiRouter = inject(ApiRouter);
  const authService = inject(AuthService);
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
        renewingAccess() ||
        error.url?.includes(apiRouter.authRefresh())
      ) {
        return throwError(() => error);
      }

      renewingAccess.set(true);

      return authService.renewAccess().pipe(
        switchMap((response) => {
          if (response) {
            authService.acceptAuthResponse(response);
            renewingAccess.set(false);

            // Retry the original request with the new access token
            return next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`
                },
                withCredentials: true
              })
            );
          }

          // If no new access token, throw an error
          return throwError(() => error);
        })
      );
    })
  );
};
