import {Component, inject, viewChild} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {toUserFullName} from '../../model/user.model';
import {TableModule} from 'primeng/table';
import {Role} from '../../model/role.model';
import {getUserIsoCountryLabel} from "../../model/iso-country.model";
import {DatePipe} from '@angular/common';
import {Button} from 'primeng/button';
import {UserManagementComponent} from '../user-management/user-management.component';

@Component({
  selector: 'profile-showcase',
  imports: [TableModule, DatePipe, Button, UserManagementComponent],
  templateUrl: './profile-showcase.component.html',
  styles: ``
})
export class ProfileShowcaseComponent {
  private readonly authService = inject(AuthService);

  managementMenu = viewChild.required(UserManagementComponent);
  user = this.authService.getUser();

  protected readonly getUserIsoCountryLabel = getUserIsoCountryLabel;
  protected readonly toUserFullName = toUserFullName;

  showManagement() {
    if (this.user() == null) {
      return;
    }

    this.managementMenu().show(this.user());
  }

  toRoleString(role: Role): string {
    return Role[role];
  }
}
