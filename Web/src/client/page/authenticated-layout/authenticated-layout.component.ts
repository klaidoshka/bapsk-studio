import {Component, inject} from "@angular/core";
import {RouterModule} from "@angular/router";
import {AuthService} from '../../service/auth.service';
import {InstanceSelectorComponent} from '../../component/instance-selector/instance-selector.component';
import {NgIf} from '@angular/common';
import {ProfileDropdownComponent} from '../../component/profile-dropdown/profile-dropdown.component';
import {ThemeSelectorComponent} from '../../component/theme-selector/theme-selector.component';

@Component({
  selector: "authenticated-layout",
  imports: [RouterModule, InstanceSelectorComponent, NgIf, ProfileDropdownComponent, ThemeSelectorComponent],
  templateUrl: "./authenticated-layout.component.html",
  providers: []
})
export class AuthenticatedLayoutComponent {
  private readonly authService = inject(AuthService);

  isAuthenticated = this.authService.isAuthenticated();
}
