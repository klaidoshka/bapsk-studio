import {Routes} from "@angular/router";
import {LoginComponent} from "./component/login/login.component";
import {RegisterComponent} from "./component/register/register.component";
import {AnonymousOnlyChildGuard, AnonymousOnlyGuard} from "./guard/anonymous-only.guard";
import {AuthenticatedOnlyGuard} from "./guard/authenticated-only.guard.";
import {AuthPageComponent} from "./page/auth-page/auth-page.component";
import {HomePageComponent} from "./page/home-page/home-page.component";
import {NotFoundPageComponent} from "./page/not-found-page/not-found-page.component";

export const routes: Routes = [
  {
    path: "",
    component: HomePageComponent,
    canActivate: [AuthenticatedOnlyGuard],
    pathMatch: "full"
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
    path: "**",
    component: NotFoundPageComponent
  }
];
