import {Routes} from "@angular/router";
import {LoginComponent} from "./component/login/login.component";
import {RegisterComponent} from "./component/register/register.component";
import {AnonymousOnlyChildGuard, AnonymousOnlyGuard} from "./guard/anonymous-only.guard";
import {
  AuthenticatedOnlyChildGuard,
  AuthenticatedOnlyGuard
} from "./guard/authenticated-only.guard.";
import {AuthPageComponent} from "./page/auth-page/auth-page.component";
import {HomePageComponent} from "./page/home-page/home-page.component";
import {NotFoundPageComponent} from "./page/not-found-page/not-found-page.component";
import {ProfilePageComponent} from './page/profile-page/profile-page.component';
import {SessionPageComponent} from './page/session-page/session-page.component';
import {DataEntryPageComponent} from './page/data-entry-page/data-entry-page.component';
import {DataTypePageComponent} from './page/data-type-page/data-type-page.component';
import {InstancePageComponent} from './page/instance-page/instance-page.component';

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomePageComponent,
    canActivate: [AuthenticatedOnlyGuard],
  },
  {
    path: "auth",
    component: AuthPageComponent,
    canActivate: [AnonymousOnlyGuard],
    canActivateChild: [AnonymousOnlyChildGuard],
    children: [
      {
        path: "login",
        component: LoginComponent
      },
      {
        path: "register",
        component: RegisterComponent
      }
    ]
  },
  {
    path: "data",
    canActivate: [AuthenticatedOnlyGuard],
    canActivateChild: [AuthenticatedOnlyChildGuard],
    children: [
      {
        path: "types",
        component: DataTypePageComponent
      },
      {
        path: "entries",
        component: DataEntryPageComponent
      }
    ]
  },
  {
    path: "instances",
    canActivate: [AuthenticatedOnlyGuard],
    component: InstancePageComponent
  },
  {
    path: "profile",
    canActivate: [AuthenticatedOnlyGuard],
    canActivateChild: [AuthenticatedOnlyChildGuard],
    children: [
      {
        path: "sessions",
        component: SessionPageComponent
      }
    ],
    component: ProfilePageComponent,
  },
  {
    path: "**",
    component: NotFoundPageComponent
  }
];
