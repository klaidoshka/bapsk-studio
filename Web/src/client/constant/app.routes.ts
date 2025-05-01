import {Routes} from "@angular/router";
import {LoginComponent} from "../component/auth-login/login.component";
import {RegisterComponent} from "../component/auth-register/register.component";
import {AnonymousOnlyChildGuard, AnonymousOnlyGuard} from "../guard/anonymous-only.guard";
import {
  AuthenticatedOnlyChildGuard,
  AuthenticatedOnlyGuard
} from "../guard/authenticated-only.guard.";
import {AuthPageComponent} from "../page/auth-page/auth-page.component";
import {
  AuthenticatedLayoutComponent
} from "../page/authenticated-layout/authenticated-layout.component";
import {NotFoundPageComponent} from "../page/not-found-page/not-found-page.component";
import {ProfilePageComponent} from "../page/profile-page/profile-page.component";
import {WorkspacePageComponent} from "../page/workspace-page/workspace-page.component";
import {DataTypePageComponent} from "../page/data-type-page/data-type-page.component";
import {InstancePageComponent} from "../page/instance-page/instance-page.component";
import {UserPageComponent} from "../page/user-page/user-page.component";
import {
  DeclarationPreviewPageComponent
} from "../page/declaration-preview-page/declaration-preview-page.component";
import {
  ImportConfigurationPageComponent
} from '../page/import-configuration-page/import-configuration-page.component';
import {
  ImportConfigurationPreviewPageComponent
} from '../page/import-configuration-preview-page/import-configuration-preview-page.component';
import {
  ImportConfigurationManagementPageComponent
} from '../page/import-configuration-management-page/import-configuration-management-page.component';
import {
  ResetPasswordPageComponent
} from "../page/reset-password-page/reset-password-page.component";
import {
  ReportTemplatePageComponent
} from '../page/report-template-page/report-template-page.component';
import {
  ReportTemplateManagementPageComponent
} from '../page/report-template-management-page/report-template-management-page.component';
import {
  ReportTemplatePreviewPageComponent
} from '../page/report-template-preview-page/report-template-preview-page.component';
import {
  ReportPreviewPageComponent
} from '../page/report-preview-page/report-preview-page.component';
import {MiscLayoutComponent} from '../page/misc-layout/misc-layout.component';
import {
  ReportGeneratePageComponent
} from '../page/report-generate-page/report-generate-page.component';
import {AdminOnlyChildGuard, AdminOnlyGuard} from '../guard/admin-only.guard';
import {
  UserManagementPageComponent
} from '../page/user-management-page/user-management-page.component';
import {UserPreviewPageComponent} from '../page/user-preview-page/user-preview-page.component';
import {
  InstanceManagementPageComponent
} from '../page/instance-management-page/instance-management-page.component';
import {
  InstancePreviewPageComponent
} from '../page/instance-preview-page/instance-preview-page.component';
import {
  DataTypeManagementPageComponent
} from '../page/data-type-management-page/data-type-management-page.component';
import {
  DataTypePreviewPageComponent
} from '../page/data-type-preview-page/data-type-preview-page.component';
import {DataEntryPageComponent} from "../page/data-entry-page/data-entry-page.component";
import {
  DataEntryManagementPageComponent
} from '../page/data-entry-management-page/data-entry-management-page.component';
import {
  DataEntryPreviewPageComponent
} from "../page/data-entry-preview-page/data-entry-preview-page.component";
import {CustomerPageComponent} from '../page/customer-page/customer-page.component';
import {
  CustomerPreviewPageComponent
} from '../page/customer-preview-page/customer-preview-page.component';
import {
  CustomerManagementPageComponent
} from '../page/customer-management-page/customer-management-page.component';
import {SalePreviewPageComponent} from '../page/sale-preview-page/sale-preview-page.component';
import {
  SaleManagementPageComponent
} from '../page/sale-management-page/sale-management-page.component';
import {SalePageComponent} from '../page/sale-page/sale-page.component';
import {SalesmanPageComponent} from '../page/salesman-page/salesman-page.component';
import {
  SalesmanManagementPageComponent
} from '../page/salesman-management-page/salesman-management-page.component';
import {
  SalesmanPreviewPageComponent
} from '../page/salesman-preview-page/salesman-preview-page.component';
import {
  SaleVatReturnDeclarationPageComponent
} from '../page/sale-vat-return-declaration-page/sale-vat-return-declaration-page.component';

export const routes: Routes = [
  {
    path: "admin",
    title: "BAPSK | Admin",
    canActivate: [AdminOnlyGuard],
    canActivateChild: [AdminOnlyChildGuard],
    loadComponent: () => AuthenticatedLayoutComponent,
    loadChildren: () => [
      {
        path: "user",
        title: "BAPSK | User",
        loadChildren: () => [
          {
            path: "",
            pathMatch: "full",
            loadComponent: () => UserPageComponent
          },
          {
            path: "create",
            loadComponent: () => UserManagementPageComponent
          },
          {
            path: ":userId/edit",
            loadComponent: () => UserManagementPageComponent
          },
          {
            path: ":userId",
            loadComponent: () => UserPreviewPageComponent
          }
        ]
      }
    ]
  },
  {
    path: "auth",
    canActivate: [AnonymousOnlyGuard],
    canActivateChild: [AnonymousOnlyChildGuard],
    loadComponent: () => AuthPageComponent,
    loadChildren: () => [
      {
        path: "login",
        title: "BAPSK | Login",
        loadComponent: () => LoginComponent
      },
      {
        path: "register",
        title: "BAPSK | Register",
        loadComponent: () => RegisterComponent
      }
    ]
  },
  {
    path: "home",
    title: "BAPSK | Home",
    canActivate: [AuthenticatedOnlyGuard],
    canActivateChild: [AuthenticatedOnlyChildGuard],
    loadComponent: () => AuthenticatedLayoutComponent,
    loadChildren: () => [
      {
        path: "instance",
        title: "BAPSK | Instance",
        loadChildren: () => [
          {
            path: "",
            pathMatch: "full",
            loadComponent: () => InstancePageComponent
          },
          {
            path: "create",
            loadComponent: () => InstanceManagementPageComponent
          },
          {
            path: ":instanceId/edit",
            loadComponent: () => InstanceManagementPageComponent
          },
          {
            path: ":instanceId",
            loadComponent: () => InstancePreviewPageComponent
          }
        ]
      },
      {
        path: "profile",
        title: "BAPSK | Profile",
        loadComponent: () => ProfilePageComponent
      },
      {
        path: "workspace/:instanceId",
        title: "BAPSK | Workspace",
        loadComponent: () => WorkspacePageComponent,
        loadChildren: () => [
          {
            path: "customer",
            title: "BAPSK | Customer",
            loadChildren: () => [
              {
                path: "",
                pathMatch: "full",
                loadComponent: () => CustomerPageComponent
              },
              {
                path: "create",
                loadComponent: () => CustomerManagementPageComponent
              },
              {
                path: ":customerId/edit",
                loadComponent: () => CustomerManagementPageComponent
              },
              {
                path: ":customerId",
                loadComponent: () => CustomerPreviewPageComponent
              }
            ]
          },
          {
            path: "data-entry",
            title: "BAPSK | Data Entry",
            loadChildren: () => [
              {
                path: "",
                pathMatch: "full",
                loadComponent: () => DataEntryPageComponent
              },
              {
                path: "create",
                loadComponent: () => DataEntryManagementPageComponent
              },
              {
                path: ":dataEntryId/edit",
                loadComponent: () => DataEntryManagementPageComponent
              },
              {
                path: ":dataEntryId",
                loadComponent: () => DataEntryPreviewPageComponent
              }
            ]
          },
          {
            path: "data-type",
            title: "BAPSK | Data Type",
            loadChildren: () => [
              {
                path: "",
                pathMatch: "full",
                loadComponent: () => DataTypePageComponent
              },
              {
                path: "create",
                loadComponent: () => DataTypeManagementPageComponent
              },
              {
                path: ":dataTypeId/edit",
                loadComponent: () => DataTypeManagementPageComponent
              },
              {
                path: ":dataTypeId",
                loadComponent: () => DataTypePreviewPageComponent
              }
            ]
          },
          {
            path: "generate-report",
            title: "BAPSK | Generate Report",
            loadComponent: () => ReportGeneratePageComponent
          },
          {
            path: "import-configuration",
            title: "BAPSK | Import Configuration",
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
            path: "report-template",
            title: "BAPSK | Report Template",
            loadChildren: () => [
              {
                path: "",
                pathMatch: "full",
                loadComponent: () => ReportTemplatePageComponent
              },
              {
                path: "create",
                loadComponent: () => ReportTemplateManagementPageComponent
              },
              {
                path: ":templateId/edit",
                loadComponent: () => ReportTemplateManagementPageComponent
              },
              {
                path: ":templateId",
                loadComponent: () => ReportTemplatePreviewPageComponent
              }
            ]
          },
          {
            path: "sale",
            title: "BAPSK | Sale",
            loadChildren: () => [
              {
                path: "",
                pathMatch: "full",
                loadComponent: () => SalePageComponent
              },
              {
                path: "create",
                loadComponent: () => SaleManagementPageComponent
              },
              {
                path: ":saleId/edit",
                loadComponent: () => SaleManagementPageComponent
              },
              {
                path: ":saleId/vat-return-declaration",
                loadComponent: () => SaleVatReturnDeclarationPageComponent
              },
              {
                path: ":saleId",
                loadComponent: () => SalePreviewPageComponent
              }
            ]
          },
          {
            path: "salesman",
            title: "BAPSK | Salesman",
            loadChildren: () => [
              {
                path: "",
                pathMatch: "full",
                loadComponent: () => SalesmanPageComponent
              },
              {
                path: "create",
                loadComponent: () => SalesmanManagementPageComponent
              },
              {
                path: ":salesmanId/edit",
                loadComponent: () => SalesmanManagementPageComponent
              },
              {
                path: ":salesmanId",
                loadComponent: () => SalesmanPreviewPageComponent
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: "misc",
    loadComponent: () => MiscLayoutComponent,
    loadChildren: () => [
      {
        path: "declaration-preview",
        title: "BAPSK | Declaration Preview",
        loadComponent: () => DeclarationPreviewPageComponent
      },
      {
        path: "report-preview",
        title: "BAPSK | Report Preview",
        loadComponent: () => ReportPreviewPageComponent
      }
    ]
  },
  {
    path: "auth/reset-password",
    title: "BAPSK | Reset Password",
    loadComponent: () => ResetPasswordPageComponent
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/home"
  },
  {
    path: "**",
    title: "BAPSK | Not Found",
    loadComponent: () => NotFoundPageComponent
  }
];
