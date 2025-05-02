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
import {AdminPageComponent} from '../page/admin-page/admin-page.component';
import {HomePageComponent} from '../page/home-page/home-page.component';

const authRoutes: Routes = [
  {
    path: "login",
    title: "Bapsk - Login",
    loadComponent: () => LoginComponent
  },
  {
    path: "register",
    title: "Bapsk - Register",
    loadComponent: () => RegisterComponent
  }
];

const adminUserRoutes: Routes = [
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
];

const customerRoutes: Routes = [
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
];

const dataEntryRoutes: Routes = [
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
];

const dataTypeRoutes: Routes = [
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
  },
  {
    path: ":dataTypeId",
    loadChildren: () => [
      {
        path: "import-configuration",
        title: "Bapsk - Import Configuration",
        loadChildren: () => importConfigurationRoutes
      },
      {
        path: "report-template",
        title: "Bapsk - Report Template",
        loadChildren: () => reportTemplateRoutes
      }
    ]
  }
];

const importConfigurationRoutes: Routes = [
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
];

const instanceRoutes: Routes = [
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
];

const miscRoutes: Routes = [
  {
    path: "declaration-preview",
    title: "Bapsk - Declaration Preview",
    loadComponent: () => DeclarationPreviewPageComponent
  },
  {
    path: "report-preview",
    title: "Bapsk - Report Preview",
    loadComponent: () => ReportPreviewPageComponent
  }
];

const reportTemplateRoutes: Routes = [
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
];

const salesmanRoutes: Routes = [
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
];

const saleRoutes: Routes = [
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
];

export const routes: Routes = [
  {
    path: "auth",
    canActivate: [AnonymousOnlyGuard],
    canActivateChild: [AnonymousOnlyChildGuard],
    loadComponent: () => AuthPageComponent,
    loadChildren: () => authRoutes
  },
  {
    path: "home",
    title: "Bapsk - Home",
    canActivate: [AuthenticatedOnlyGuard],
    canActivateChild: [AuthenticatedOnlyChildGuard],
    loadComponent: () => AuthenticatedLayoutComponent,
    loadChildren: () => [
      {
        path: "",
        pathMatch: "full",
        loadComponent: () => HomePageComponent
      },
      {
        path: "admin",
        title: "Bapsk - Admin",
        canActivate: [AdminOnlyGuard],
        canActivateChild: [AdminOnlyChildGuard],
        loadComponent: () => AdminPageComponent,
        loadChildren: () => [
          {
            path: "",
            pathMatch: "full",
            redirectTo: "user"
          },
          {
            path: "user",
            title: "Bapsk - User",
            loadChildren: () => adminUserRoutes
          }
        ]
      },
      {
        path: "instance",
        title: "Bapsk - Instance",
        loadChildren: () => instanceRoutes
      },
      {
        path: "profile",
        title: "Bapsk - Profile",
        loadComponent: () => ProfilePageComponent
      },
      {
        path: "workspace",
        title: "Bapsk - Workspace",
        loadComponent: () => WorkspacePageComponent
      },
      {
        path: "workspace/:instanceId",
        title: "Bapsk - Workspace",
        loadComponent: () => WorkspacePageComponent,
        loadChildren: () => [
          {
            path: "customer",
            title: "Bapsk - Customer",
            loadChildren: () => customerRoutes
          },
          {
            path: "data-entry",
            title: "Bapsk - Data Entry",
            loadChildren: () => dataEntryRoutes
          },
          {
            path: "data-type",
            title: "Bapsk - Data Type",
            loadChildren: () => dataTypeRoutes
          },
          {
            path: "generate-report",
            title: "Bapsk - Generate Report",
            loadComponent: () => ReportGeneratePageComponent
          },
          {
            path: "import-configuration",
            title: "Bapsk - Import Configuration",
            loadChildren: () => importConfigurationRoutes
          },
          {
            path: "report-template",
            title: "Bapsk - Report Template",
            loadChildren: () => reportTemplateRoutes
          },
          {
            path: "sale",
            title: "Bapsk - Sale",
            loadChildren: () => saleRoutes
          },
          {
            path: "salesman",
            title: "Bapsk - Salesman",
            loadChildren: () => salesmanRoutes
          }
        ]
      }
    ]
  },
  {
    path: "misc",
    loadComponent: () => MiscLayoutComponent,
    loadChildren: () => miscRoutes
  },
  {
    path: "auth/reset-password",
    title: "Bapsk - Reset Password",
    loadComponent: () => ResetPasswordPageComponent
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/home"
  },
  {
    path: "**",
    title: "Bapsk - Not Found",
    loadComponent: () => NotFoundPageComponent
  }
];
