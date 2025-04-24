import {Component, inject, signal} from "@angular/core";
import {RouterModule} from "@angular/router";
import {AuthService} from '../../service/auth.service';
import {InstanceSelectorComponent} from '../../component/instance-selector/instance-selector.component';
import {NgIf} from '@angular/common';
import {ProfileDropdownComponent} from '../../component/profile-dropdown/profile-dropdown.component';
import {ThemeSelectorComponent} from '../../component/theme-selector/theme-selector.component';
import {rxResource} from '@angular/core/rxjs-interop';
import {Role} from '../../model/role.model';
import {ClickOutsideDirective} from '../../directive/click-outside.directive';

@Component({
  selector: "authenticated-layout",
  imports: [RouterModule, InstanceSelectorComponent, NgIf, ProfileDropdownComponent, ThemeSelectorComponent, ClickOutsideDirective],
  templateUrl: "./authenticated-layout.component.html",
  providers: []
})
export class AuthenticatedLayoutComponent {
  protected readonly Role = Role;
  private readonly authService = inject(AuthService);

  isAuthenticated = rxResource({ loader: () => this.authService.isAuthenticated() });
  isAdminMenuOpen = signal<boolean>(false);
  isWorkspaceMenuOpen = signal<boolean>(false);
  user = rxResource({ loader: () => this.authService.getUser() });
}
