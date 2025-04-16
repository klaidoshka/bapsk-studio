import {inject} from "@angular/core";
import {CanActivateChildFn, CanActivateFn, Router} from "@angular/router";
import {AuthService} from "../service/auth.service";

export const AuthenticatedOnlyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated()) {
    return true;
  }

  router.navigate(["/auth/login"]);

  return false;
};

export const AuthenticatedOnlyChildGuard: CanActivateChildFn = (route, state) => {
  return AuthenticatedOnlyGuard(route, state);
}
