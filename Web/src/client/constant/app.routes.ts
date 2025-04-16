import {Routes} from "@angular/router";
import {LoginComponent} from "../component/auth-login/login.component";
import {RegisterComponent} from "../component/auth-register/register.component";
import {AnonymousOnlyChildGuard, AnonymousOnlyGuard} from "../guard/anonymous-only.guard";
import {AuthenticatedOnlyChildGuard, AuthenticatedOnlyGuard} from "../guard/authenticated-only.guard.";
import {AuthPageComponent} from "../page/auth-page/auth-page.component";
import {AuthenticatedLayoutComponent} from "../page/authenticated-layout/authenticated-layout.component";
import {NotFoundPageComponent} from "../page/not-found-page/not-found-page.component";
import {ProfilePageComponent} from "../page/profile-page/profile-page.component";
import {WorkspacePageComponent} from "../page/workspace-page/workspace-page.component";
import {DataTypePageComponent} from "../page/data-type-page/data-type-page.component";
import {InstancePageComponent} from "../page/instance-page/instance-page.component";
import {UserPageComponent} from "../page/user-page/user-page.component";
import {DeclarationPreviewPageComponent} from "../page/declaration-preview-page/declaration-preview-page.component";
import {ImportConfigurationPageComponent} from '../page/import-configuration-page/import-configuration-page.component';
import {
  ImportConfigurationPreviewPageComponent
} from '../page/import-configuration-preview-page/import-configuration-preview-page.component';
import {
  ImportConfigurationManagementPageComponent
} from '../page/import-configuration-management-page/import-configuration-management-page.component';

export const routes: Routes = [
  {
    path: "home",
    loadComponent: () => AuthenticatedLayoutComponent,
    canActivate: [AuthenticatedOnlyGuard],
    canActivateChild: [AuthenticatedOnlyChildGuard],
    loadChildren: () => [
      {
        path: "data-type",
        loadComponent: () => DataTypePageComponent
      },
      {
        path: "import-configuration",
        loadChildren: () => [
          {
            path: "",
            pathMatch: "full",
            loadComponent: () => ImportConfigurationPageComponent
          },
          {
            path: "create",
            loadComponent: () => ImportConfigurationManagementPageComponent
          },
          {
            path: ":configurationId/edit",
            loadComponent: () => ImportConfigurationManagementPageComponent
          },
          {
            path: ":configurationId",
            loadComponent: () => ImportConfigurationPreviewPageComponent
          }
        ]
      },
      {
        path: "instance",
        loadComponent: () => InstancePageComponent
      },
      {
        path: "profile",
        loadComponent: () => ProfilePageComponent
      },
      {
        path: "workspace",
        loadComponent: () => WorkspacePageComponent
      },
      {
        path: "user",
        loadComponent: () => UserPageComponent
      }
    ]
  },
  {
    path: "auth",
    loadComponent: () => AuthPageComponent,
    canActivate: [AnonymousOnlyGuard],
    canActivateChild: [AnonymousOnlyChildGuard],
    loadChildren: () => [
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
    path: "declaration",
    loadComponent: () => DeclarationPreviewPageComponent
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/home"
  },
  {
    path: "**",
    loadComponent: () => NotFoundPageComponent
  }
];
