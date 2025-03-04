import {inject} from "@angular/core";
import {CanActivateChildFn, CanActivateFn, Router} from "@angular/router";
import {AuthService} from "../service/auth.service";

export const AnonymousOnlyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated()) {
    return true;
  }

  router.navigate(["/"]);

  return false;
};

export const AnonymousOnlyChildGuard: CanActivateChildFn = (route, state) => {
  return AnonymousOnlyGuard(route, state);
};
