import {inject} from "@angular/core";
import {CanActivateChildFn, CanActivateFn, Router} from "@angular/router";
import {map} from "rxjs";
import {AuthService} from "../service/auth.service";

export const AnonymousOnlyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        return true;
      } else {
        router.navigate(["/"]);
        return false;
      }
    })
  );
};

export const AnonymousOnlyChildGuard: CanActivateChildFn = (route, state) => {
  return AnonymousOnlyGuard(route, state);
};
