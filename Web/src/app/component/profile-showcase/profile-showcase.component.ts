import {Component, Signal, viewChild} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {toUserFullName, User} from '../../model/user.model';
import {TableModule} from 'primeng/table';
import {Role} from '../../model/role.model';
import {getUserIsoCountryLabel} from "../../model/iso-country.model";
import {DatePipe} from '@angular/common';
import {Button} from 'primeng/button';
import {UserManagementComponent} from '../user-management/user-management.component';

@Component({
  selector: 'app-profile-showcase',
  imports: [TableModule, DatePipe, Button, UserManagementComponent],
  templateUrl: './profile-showcase.component.html',
  styles: ``
})
export class ProfileShowcaseComponent {
  protected readonly getUserIsoCountryLabel = getUserIsoCountryLabel;
  protected readonly toUserFullName = toUserFullName;

  managementMenu = viewChild.required(UserManagementComponent);
  user!: Signal<User | undefined>;

  constructor(
    private authService: AuthService
  ) {
    this.user = this.authService.getUser();
  }

  readonly showManagement = () => {
    if (this.user() == null) {
      return;
    }
    
    this.managementMenu().show(this.user());
  }

  readonly toRoleString = (role: Role): string => {
    return Role[role];
  }
}
