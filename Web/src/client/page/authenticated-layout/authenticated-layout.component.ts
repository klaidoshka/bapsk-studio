import {Component, inject, signal} from "@angular/core";
import {RouterModule} from "@angular/router";
import {AuthService} from '../../service/auth.service';
import {NgIf} from '@angular/common';
import {
  ProfileDropdownComponent
} from '../../component/profile-dropdown/profile-dropdown.component';
import {ThemeSelectorComponent} from '../../component/theme-selector/theme-selector.component';
import {rxResource} from '@angular/core/rxjs-interop';
import {Role} from '../../model/role.model';
import {ClickOutsideDirective} from '../../directive/click-outside.directive';

@Component({
  selector: "authenticated-layout",
  imports: [RouterModule, NgIf, ProfileDropdownComponent, ThemeSelectorComponent, ClickOutsideDirective],
  templateUrl: "./authenticated-layout.component.html",
  providers: []
})
export class AuthenticatedLayoutComponent {
  private readonly authService = inject(AuthService);
  protected readonly Role = Role;
  protected readonly isAdminMenuOpen = signal<boolean>(false);
  protected readonly isAuthenticated = rxResource({loader: () => this.authService.isAuthenticated()});
  protected readonly isMobileNavOpen = signal<boolean>(false);
  protected readonly isWorkspaceMenuOpen = signal<boolean>(false);
  protected readonly user = rxResource({loader: () => this.authService.getUser()});
}
