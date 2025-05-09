import {Component, input} from '@angular/core';
import {TableModule} from 'primeng/table';
import {ProfileManagementComponent} from '../profile-management/profile-management.component';
import {Badge} from 'primeng/badge';
import {Role, toRoleLabel} from '../../model/role.model';
import {User} from '../../model/user.model';
import {ProfileChangePasswordFormComponent} from '../profile-change-password-form/profile-change-password-form.component';
import {CardComponent} from '../card/card.component';

@Component({
  selector: 'profile-showcase',
  imports: [TableModule, ProfileManagementComponent, Badge, ProfileChangePasswordFormComponent, CardComponent],
  templateUrl: './profile-showcase.component.html',
  styles: ``
})
export class ProfileShowcaseComponent {
  protected readonly Role = Role;
  protected readonly toRoleLabel = toRoleLabel;
  readonly user = input.required<User>();
}
