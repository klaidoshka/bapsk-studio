import {CanActivateChildFn, CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {map, tap} from 'rxjs';
import {Role} from '../model/role.model';

export const AdminOnlyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .getUser()
    .pipe(
      map(user => user.role === Role.Admin),
      tap(isAdmin => {
        if (!isAdmin) {
          router.navigate(["/home"]);
        }
      })
    );
};

export const AdminOnlyChildGuard: CanActivateChildFn = (route, state) => {
  return AdminOnlyGuard(route, state);
}
