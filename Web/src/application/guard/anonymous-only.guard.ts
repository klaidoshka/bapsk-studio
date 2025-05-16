import {inject} from "@angular/core";
import {CanActivateChildFn, CanActivateFn, Router} from "@angular/router";
import {AuthService} from "../service/auth.service";
import {map, tap} from 'rxjs';

export const AnonymousOnlyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .isAuthenticated()
    .pipe(
      map((authenticated) => !authenticated),
      tap(unauthenticated => {
        if (!unauthenticated) {
          router.navigate(["/"]);
        }
      })
    );
};

export const AnonymousOnlyChildGuard: CanActivateChildFn = (route, state) => {
  return AnonymousOnlyGuard(route, state);
};
