import {Routes} from "@angular/router";
import {LoginComponent} from "./component/auth-login/login.component";
import {RegisterComponent} from "./component/auth-register/register.component";
import {AnonymousOnlyChildGuard, AnonymousOnlyGuard} from "./guard/anonymous-only.guard";
import {AuthenticatedOnlyChildGuard, AuthenticatedOnlyGuard} from "./guard/authenticated-only.guard.";
import {AuthPageComponent} from "./page/auth-page/auth-page.component";
import {AuthenticatedLayoutComponent} from "./page/authenticated-layout/authenticated-layout.component";
import {NotFoundPageComponent} from "./page/not-found-page/not-found-page.component";
import {ProfilePageComponent} from './page/profile-page/profile-page.component';
import {WorkspacePageComponent} from './page/workspace-page/workspace-page.component';
import {DataTypePageComponent} from './page/data-type-page/data-type-page.component';
import {InstancePageComponent} from './page/instance-page/instance-page.component';
import {UserPageComponent} from './page/user-page/user-page.component';

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => AuthenticatedLayoutComponent,
    canActivate: [AuthenticatedOnlyGuard],
    canActivateChild: [AuthenticatedOnlyChildGuard],
    children: [
      {
        path: "data",
        children: [
          {
            path: "types",
            loadComponent: () => DataTypePageComponent
          }
        ]
      },
      {
        path: "instances",
        loadComponent: () => InstancePageComponent
      },
      {
        path: "profile",
        loadComponent: () => ProfilePageComponent,
      },
      {
        path: "workspace",
        loadComponent: () => WorkspacePageComponent
      },
      {
        path: "users",
        loadComponent: () => UserPageComponent
      }
    ]
  },
  {
    path: "auth",
    loadComponent: () => AuthPageComponent,
    canActivate: [AnonymousOnlyGuard],
    canActivateChild: [AnonymousOnlyChildGuard],
    children: [
      {
        path: "login",
        loadComponent: () => LoginComponent
      },
      {
        path: "register",
        loadComponent: () => RegisterComponent
      }
    ]
  },
  {
    path: "**",
    loadComponent: () => NotFoundPageComponent
  }
];
