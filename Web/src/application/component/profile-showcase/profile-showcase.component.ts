import {Component, input} from '@angular/core';
import {TableModule} from 'primeng/table';
import {ProfileManagementComponent} from '../profile-management/profile-management.component';
import {Badge} from 'primeng/badge';
import {Role, toRoleInfo} from '../../model/role.model';
import {User} from '../../model/user.model';
import {ProfileChangePasswordFormComponent} from '../profile-change-password-form/profile-change-password-form.component';
import {CardComponent} from '../card/card.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'profile-showcase',
  imports: [TableModule, ProfileManagementComponent, Badge, ProfileChangePasswordFormComponent, CardComponent, TranslatePipe],
  templateUrl: './profile-showcase.component.html',
  styles: ``
})
export class ProfileShowcaseComponent {
  protected readonly Role = Role;
  protected readonly toRoleInfo = toRoleInfo;
  readonly user = input.required<User>();
}
