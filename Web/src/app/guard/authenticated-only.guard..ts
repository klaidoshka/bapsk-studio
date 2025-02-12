import {inject} from "@angular/core";
import {CanActivateFn, Router} from "@angular/router";
import {map} from "rxjs";
import {AuthService} from "../service/auth.service";

export const AuthenticatedOnlyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigate(["/auth/login"]);
        return false;
      }
    })
  );
};
