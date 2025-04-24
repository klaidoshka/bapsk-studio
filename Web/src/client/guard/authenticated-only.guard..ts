import {inject} from "@angular/core";
import {CanActivateChildFn, CanActivateFn, Router} from "@angular/router";
import {AuthService} from "../service/auth.service";
import {tap} from 'rxjs';

export const AuthenticatedOnlyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .isAuthenticated()
    .pipe(
      tap(authenticated => {
        if (!authenticated) {
          router.navigate(["/auth/login"]);
        }
      })
    );
};

export const AuthenticatedOnlyChildGuard: CanActivateChildFn = (route, state) => {
  return AuthenticatedOnlyGuard(route, state);
}
